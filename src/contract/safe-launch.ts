import SafeLaunchAbi from './abi/SafeLaunch.json';
import SafeLaunchFactoryAbi from './abi/SafeLaunchFactory.json';
import SafeLaunchERC20Abi from './abi/SafeLaunchERC20.json';
import { AbiEvent, Hex, WalletClient, createPublicClient, formatEther, getContract, http, parseUnits } from "viem";
import { assetChainTestnet } from "viem/chains";
import { TokenDeployedAbi, getMarketCap, getMarketCapThreshold, getRWASupplyInExchange, getTokenPriceinRWA, getTokenSupplyInExchange } from './utils';

const SAFE_LAUNCH_FACTORY_ADDRESS = '0x6e8C7D0059Bb9846C1cCC6700EA4F75335b8B90D';
const RPC_URL = 'https://enugu-rpc.assetchain.org';



export default class SafeLaunch {
  factoryContract;
  walletClient;
  publicClient;
  fromAddress: string;

  constructor(_walletClient: WalletClient, _fromAddress: any) {
    this.fromAddress = _fromAddress;
    this.walletClient = _walletClient;

    this.publicClient = createPublicClient({
      chain: assetChainTestnet,
      transport: http(RPC_URL)
    })
    this.factoryContract = getContract({
      address: SAFE_LAUNCH_FACTORY_ADDRESS,
      abi: SafeLaunchFactoryAbi,
      client: { public: this.publicClient, wallet: _walletClient },
    })
  }



  /**
   * This function deploys a new token and a presale contract for it.
   * @param name
   * @param symbol
   * @param amount
   * @returns
   */
  async createToken(name: string, symbol: string, amount?: string) {
    try {
      const hash = await this.factoryContract.write.deployToken([name, symbol],
        { value: parseUnits(amount ?? '0', 18) })

      const receipt = await this.publicClient.waitForTransactionReceipt({ hash });
      const logs = await this.publicClient.getLogs({
        address: SAFE_LAUNCH_FACTORY_ADDRESS,
        event: TokenDeployedAbi,
        fromBlock: receipt.blockNumber,
        toBlock: receipt.blockNumber
      });
      let data = { hash, log: logs[0] }

      return { ok: true, data };
    } catch (error: any) {
      return { ok: false, data: error };
    }
  }



  /**
    * This function buys tokens from the SafeLaunch contract
    * @param amount
    * @param exchangeAddress
    * @returns
    */
  async buyToken(amount: string, exchangeAddress: string) {
    try {
      const safeLaunchContract = getContract({
        address: exchangeAddress as Hex,
        abi: SafeLaunchAbi,
        client: { public: this.publicClient, wallet: this.walletClient },
      })
      // @ts-ignore
      const hash = await safeLaunchContract.write.buyTokens([],
        { value: parseUnits(amount, 18) })
      const receipt = await this.publicClient.waitForTransactionReceipt({ hash });

      return { ok: true, receipt };
    } catch (error: any) {
      return { ok: false, data: error };
    }
  }



  /**
   * This function sells tokens to the SafeLaunch contract
   * @param amount
   * @param exchangeAddress
   * @returns
   */
  async sellToken(amount: string, exchangeAddress: string) {
    try {
      const tokenAddress = await this.publicClient.readContract({
        address: exchangeAddress as Hex,
        abi: SafeLaunchAbi,
        functionName: 'token',
      })

      const safeLaunchContract = getContract({
        address: exchangeAddress as Hex,
        abi: SafeLaunchAbi,
        client: { public: this.publicClient, wallet: this.walletClient },
      })
      // @ts-ignore
      const approveHash = await this.walletClient.writeContract({
        address: tokenAddress as Hex,
        abi: SafeLaunchERC20Abi,
        functionName: 'approve',
        args: [exchangeAddress, parseUnits(amount, 18)],
      })

      const approveReceipt = await this.publicClient.waitForTransactionReceipt({ hash: approveHash });
      console.log({ approveReceipt })

      // @ts-ignore
      const hash = await safeLaunchContract.write.sellTokens([parseUnits(amount, 18)])
      const receipt = await this.publicClient.waitForTransactionReceipt({ hash });

      return { ok: true, receipt };
    } catch (error: any) {
      return { ok: false, data: error };
    }
  }



  // /**
  //  * Fetch stats for token.
  //  * @param tokenAddress
  //  * @returns price, marketcap, liquidity(RWA), circulatingSupply(TOKEN)
  //  */
  // async getExchangeMarketStats(tokenAddress: string, exchangeAddress: string) {
  //   const price = await getTokenPriceinRWA(exchangeAddress);      //  convert to usd
  //   const circulatingSupply = await getTokenSupplyInExchange(tokenAddress, exchangeAddress)
  //   const marketcap = await getMarketCap(exchangeAddress);    // Market Cap(usd) = Price(usd) × Circulating Supply(token)
  //   const liquidity = await getRWASupplyInExchange(exchangeAddress)

  //   return {
  //     priceInUsd: formatEther(await convertRwaToUsd(Number(price)) as unknown as bigint),
  //     circulatingSupplyInToken: circulatingSupply,
  //     marketcapInUsd: formatEther(marketcap as unknown as bigint),
  //     liquidityInUsd: await convertRwaToUsd(Number(liquidity))
  //   };
  // }



  // /**
  //  * Fetch status of liquidity raised to reach target curve.
  //  * @param tokenAddress
  //  * @returns targetLiquidity, currentLiquidity
  //  */
  // async getTokenCurveStats(exchangeAddress: string) {
  //   const liquidity = await getRWASupplyInExchange(exchangeAddress)  // convert to usd
  //   const curveTarget = await getMarketCapThreshold(exchangeAddress);

  //   return {
  //     targetLiquidity: Number(curveTarget) / 10 ** 18,    // usd
  //     currentLiquidity: await convertRwaToUsd(Number(liquidity))
  //   }
  // }

}








// if (!process.env.PRIVATE_KEY)
//   throw new Error('Private key is not defined.');

// const ACCOUNT = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}` as Hex);
// const walletClient = createWalletClient({
//   account: ACCOUNT,
//   chain: assetChainTestnet,
//   transport: http(RPC_URL),
// });
//   import { useWalletClient } from 'wagmi'
//   const { data: walletClient, isError, isLoading } = useWalletClient()
// https://1.x.wagmi.sh/react/hooks/useWalletClient#onsuccess-optional



// let safeLaunch = new SafeLaunch(walletClient, ACCOUNT)

// safeLaunch.createToken('JUMPMAN', 'JUMPMAN', '5').then(console.log)

// safeLaunch.getExchangeMarketStats('0x35D22170A741A955DAEE2Bb2311fb070f971f89b', '0xf9a071B5276e2F1f6EFA14DFa8C4A3a13b47cfab').then(console.log)
/*
    price: 4.950088500000000000, RWA
    circulatingSupply: '989990345.999999956364034048', TOKEN
    marketcap: 0.214948617680530213, USD
    liquidity: '4.95' RWA
*/

// safeLaunch.getTokenCurveStats('0xf9a071B5276e2F1f6EFA14DFa8C4A3a13b47cfab').then(console.log)

// safeLaunch.buyToken('2.5', '0xf9a071B5276e2F1f6EFA14DFa8C4A3a13b47cfab').then(console.log)

// safeLaunch.sellToken('2.5', '0xf9a071B5276e2F1f6EFA14DFa8C4A3a13b47cfab').then(console.log)
