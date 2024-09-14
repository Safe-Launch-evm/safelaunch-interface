import SafeLaunchAbi from './abi/SafeLaunch.json';
import TokenAbi from './abi/Token.json';
import {
  AbiEvent,
  Hex,
  WalletClient,
  createPublicClient,
  createWalletClient,
  getContract,
  http,
  parseUnits,
  zeroAddress
} from 'viem';
import { assetChainTestnet } from 'viem/chains';
import {
  AddLiquidityAbi,
  PRICING_CURVE_TARGET,
  RPC_URL,
  SAFE_LAUNCH_ADDRESS,
  getCurrentPrice,
  getTokenSupplyInPool,
  getWRWASupplyInPool
} from './utils';
import { privateKeyToAccount } from 'viem/accounts';
// import dotenv from 'dotenv';
// dotenv.config()

export default class SafeLaunch {
  contract;
  walletClient;
  publicClient;
  fromAddress: string;

  constructor(_walletClient: WalletClient, _fromAddress: any) {
    this.fromAddress = _fromAddress;
    this.walletClient = _walletClient;

    this.publicClient = createPublicClient({
      chain: assetChainTestnet,
      transport: http(RPC_URL)
    });

    this.contract = getContract({
      address: SAFE_LAUNCH_ADDRESS,
      abi: SafeLaunchAbi,
      client: { public: this.publicClient, wallet: _walletClient }
    });
  }

  async createToken(name: string, symbol: string, amount: string) {
    try {
      const args = [name, symbol, parseUnits(amount, 18), true];

      const estimatedGas = await this.contract.estimateGas.createToken(args, {
        value: parseUnits(amount, 18)
      });
      const gasLimit = BigInt(Math.floor(Number(estimatedGas) * 1.1)); // Add 10%

      const hash = await this.contract.write.createToken(args, {
        value: parseUnits(amount, 18),
        gas: gasLimit
      });

      const receipt = await this.publicClient.waitForTransactionReceipt({ hash });
      const logs = await this.publicClient.getLogs({
        address: SAFE_LAUNCH_ADDRESS,
        event: AddLiquidityAbi,
        fromBlock: receipt.blockNumber,
        toBlock: receipt.blockNumber
      });
      let data = { hash, log: logs[0] };

      return { ok: true, data };
    } catch (error: any) {
      return { ok: false, data: error };
    }
  }

  async buyToken(tokenAddress: string, amount: string) {
    try {
      const args = [zeroAddress, tokenAddress, parseUnits(amount, 18), 0];

      const estimatedGas = await this.contract.estimateGas.swap(args, {
        value: parseUnits(amount, 18)
      });
      const gasLimit = BigInt(Math.floor(Number(estimatedGas) * 1.1)); // Add 10%

      const hash = await this.contract.write.swap(args, {
        value: parseUnits(amount, 18),
        gas: gasLimit
      });
      const receipt = await this.publicClient.waitForTransactionReceipt({ hash });

      return { ok: true, receipt };
    } catch (error: any) {
      return { ok: false, data: error };
    }
  }

  async sellToken(tokenAddress: Hex, amount: string) {
    try {
      const args = [SAFE_LAUNCH_ADDRESS, parseUnits(amount, 18)];

      const tokenContract = getContract({
        address: tokenAddress,
        abi: TokenAbi,
        client: { public: this.publicClient, wallet: this.walletClient }
      });
      // @ts-ignore
      const estimatedGas = await tokenContract.estimateGas.approve(args);
      const gasLimit = BigInt(Math.floor(Number(estimatedGas) * 1.1));

      // @ts-ignore
      const approveHash = await this.walletClient.writeContract({
        address: tokenAddress,
        abi: TokenAbi,
        functionName: 'approve',
        args,
        gas: gasLimit
      });
      // console.log('dl',approveHash);return;

      const approveReceipt = await this.publicClient.waitForTransactionReceipt({
        hash: approveHash
      });
      // console.log({ approveReceipt });return;

      const _args = [tokenAddress, zeroAddress, parseUnits(amount, 18), 0];
      const _estimatedGas = await this.contract.estimateGas.swap(_args, {});
      const _gasLimit = BigInt(Math.floor(Number(_estimatedGas) * 1.1));

      const hash = await this.contract.write.swap(_args, {
        gas: _gasLimit
      });
      const receipt = await this.publicClient.waitForTransactionReceipt({ hash });

      return { ok: true, receipt };
    } catch (error: any) {
      return { ok: false, data: error };
    }
  }

  /**
   * Fetch stats for token.
   * @param tokenAddress
   * @returns price, marketcap, liquidity(RWA), circulatingSupply(TOKEN)
   */
  async getTokenMarketStats(tokenAddress: string) {
    const price = await getCurrentPrice(this.publicClient, tokenAddress);
    const circulatingSupply = await getTokenSupplyInPool(this.publicClient, tokenAddress);
    const marketcap = price * Number(circulatingSupply); // Market Cap = Price × Circulating Supply
    const liquidity = await getWRWASupplyInPool(this.publicClient, tokenAddress);

    return {
      price,
      circulatingSupply,
      marketcap,
      liquidity
    };
  }

  /**
   * Fetch status of liquidity raised to reach target curve.
   * @param tokenAddress
   * @returns targetLiquidity, currentLiquidity
   */
  async getTokenCurveStats(tokenAddress: string) {
    const liquidity = await getWRWASupplyInPool(this.publicClient, tokenAddress);

    return {
      targetLiquidity: PRICING_CURVE_TARGET,
      currentLiquidity: liquidity
    };
  }
}

/* 
if (!process.env.PRIVATE_KEY)
    throw new Error('Private key is not defined.');

const ACCOUNT = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}` as Hex);
const walletClient = createWalletClient({
    account: ACCOUNT,
    chain: assetChainTestnet,
    transport: http(RPC_URL),
});
//   import { useWalletClient } from 'wagmi'
//   const { data: walletClient, isError, isLoading } = useWalletClient()
// https://1.x.wagmi.sh/react/hooks/useWalletClient#onsuccess-optional



let safeLaunch = new SafeLaunch(walletClient, ACCOUNT)

// safeLaunch.createToken('JUMPMAN', 'JUMPMAN', '20').then(console.log)

safeLaunch.getTokenMarketStats('0xbfa136b967074e7eb358121ec76ed2d3d7dee847').then(console.log)


// safeLaunch.buyToken('0xbfa136b967074e7eb358121ec76ed2d3d7dee847','2.5').then(console.log) */
