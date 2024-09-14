import { AbiEvent, Hex, PublicClient, formatEther, formatUnits, getContract } from 'viem';
import UniswapV3FactoryAbi from './abi/UniswapV3Factory.json';
import UniswapV3PoolAbi from './abi/UniswapV3Pool.json';
import TokenAbi from './abi/Token.json';

export const FACTORY_ADDRESS = '0xf509c3FbbBa099cD5D949C6621C218B3E52670F8';
export const WRWA_ADDRESS = '0x0FA7527F1050bb9F9736828B689c652AB2c483ef';
export const POOL_FEE = '500';

export const PRICING_CURVE_TARGET = 200; // 200 RWA
export const SAFE_LAUNCH_ADDRESS = '0x2B7C1342Cc64add10B2a79C8f9767d2667DE64B2';
export const RPC_URL = 'https://enugu-rpc.assetchain.org';
export const AddLiquidityAbi: AbiEvent = {
  anonymous: false,
  inputs: [
    { indexed: true, internalType: 'address', name: 'token', type: 'address' },
    { indexed: false, internalType: 'uint256', name: 'poolFee', type: 'uint256' },
    { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    { indexed: false, internalType: 'address', name: 'user', type: 'address' }
  ],
  name: 'AddLiquidity',
  type: 'event'
};

export async function getPoolAddress(
  publicClient: PublicClient,
  tokenAddress: string
): Promise<string> {
  const [tokenA, tokenB] =
    WRWA_ADDRESS.toLowerCase() < tokenAddress.toLowerCase()
      ? [WRWA_ADDRESS, tokenAddress]
      : [tokenAddress, WRWA_ADDRESS];

  const pool = await publicClient.readContract({
    address: FACTORY_ADDRESS,
    abi: UniswapV3FactoryAbi,
    functionName: 'getPool',
    args: [tokenA, tokenB, POOL_FEE]
  });
  return String(pool);
}

export async function getCurrentPrice(publicClient: PublicClient, tokenAddress: string) {
  let poolAddress = await getPoolAddress(publicClient, tokenAddress);

  const slot0 = (await publicClient.readContract({
    address: poolAddress as Hex,
    abi: UniswapV3PoolAbi,
    functionName: 'slot0'
  })) as Array<number>;

  const sqrtPriceX96 = slot0[0];
  const price = (Number(sqrtPriceX96) / 2 ** 96) ** 2; // price of tokenB per tokenA
  return price;
}

export async function getTokenSupplyInPool(publicClient: PublicClient, tokenAddress: string) {
  let poolAddress = await getPoolAddress(publicClient, tokenAddress);

  const balance = await publicClient.readContract({
    address: tokenAddress as Hex,
    abi: TokenAbi,
    functionName: 'balanceOf',
    args: [poolAddress]
  });

  // console.log({ balance: formatUnits(BigInt(Number(balance)), 18) })
  return formatUnits(BigInt(Number(balance)), 18);
}

export async function getWRWASupplyInPool(publicClient: PublicClient, tokenAddress: string) {
  let poolAddress = await getPoolAddress(publicClient, tokenAddress);

  const balance = await publicClient.readContract({
    address: WRWA_ADDRESS as Hex,
    abi: TokenAbi,
    functionName: 'balanceOf',
    args: [poolAddress]
  });

  // console.log({ balance: formatUnits(BigInt(Number(balance)), 18) })
  return formatUnits(BigInt(Number(balance)), 18);
}
