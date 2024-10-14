import { assetChainTestnet } from 'viem/chains';
import SafeLaunchAbi from './abi/SafeLaunch.json';
import SafeLaunchERC20Abi from './abi/SafeLaunchERC20.json';
import { AbiEvent, Hex, createPublicClient, createWalletClient, formatEther, formatUnits, http } from "viem";
// import Setting from 'App/models/Setting';
import { privateKeyToAccount } from 'viem/accounts';


export const RPC_URL = 'https://enugu-rpc.assetchain.org';

export const publicClient = createPublicClient({
  chain: assetChainTestnet,
  transport: http(RPC_URL)
})

export async function initWalletClient() {
  if (!process.env.OWNER_PRV_KEY)
    throw new Error('Private key is not defined.');

  const ACCOUNT = privateKeyToAccount(`0x${process.env.OWNER_PRV_KEY}` as Hex);

  const walletClient = createWalletClient({
    account: ACCOUNT,
    chain: assetChainTestnet,
    transport: http(RPC_URL),
  });
  return walletClient;
}

export async function getMarketCap(exchangeAddress: string) {
  const marketCap = await publicClient.readContract({
    address: exchangeAddress as Hex,
    abi: SafeLaunchAbi,
    functionName: 'marketCap',
  })

  return marketCap;   // mcap in usd
}

export async function getMarketCapThreshold(exchangeAddress: string) {
  const target = await publicClient.readContract({
    address: exchangeAddress as Hex,
    abi: SafeLaunchAbi,
    functionName: 'marketCapThreshold',
  })

  return target;   // mcap in usd
}

export async function getTokenPriceinRWA(exchangeAddress: string) {
  const priceInRwa = await publicClient.readContract({
    address: exchangeAddress as Hex,
    abi: SafeLaunchAbi,
    functionName: 'getTokenPriceinRWA',
  })
  console.log({ priceInRwa })
  return priceInRwa as unknown as bigint;   // price in rwa
}


export async function getTokenSupplyInExchange(tokenAddress: string, exchangeAddress: string) {
  const balance = await publicClient.readContract({
    address: tokenAddress as Hex,
    abi: SafeLaunchERC20Abi,
    functionName: 'balanceOf',
    args: [exchangeAddress]
  })

  // console.log({ balance: formatUnits(BigInt(Number(balance)), 18) })
  return formatUnits(BigInt(Number(balance)), 18);
}


export async function getRWASupplyInExchange(exchangeAddress: string) {
  const balance = await publicClient.getBalance({ address: exchangeAddress as Hex });
  // Format the balance from Wei to Ether
  const balanceInEther = formatEther(balance);
  return balanceInEther;
}

// export async function convertRwaToUsd(amountInRwa: number) {
//   let setting = await Setting.query()
//   let amountInUsd = (amountInRwa * Number(setting[0].usdPricePerRwa)) / 1;
//   return amountInUsd;
// }

export const TokenDeployedAbi: AbiEvent = {
  "anonymous": false,
  "inputs": [
    {
      "indexed": false,
      "internalType": "address",
      "name": "tokenAddress",
      "type": "address"
    },
    {
      "indexed": false,
      "internalType": "address",
      "name": "safeLaunchAddress",
      "type": "address"
    },
    {
      "indexed": false,
      "internalType": "address",
      "name": "creator",
      "type": "address"
    }
  ],
  "name": "TokenDeployed",
  "type": "event"
}
