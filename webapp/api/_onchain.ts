import { ethers } from "ethers";
import axios from "axios";
import ORACLE_ABI from "./abis/oracle.json";
import wstETH_ABI from "./abis/wstETH.json";
import rETH_ABI from "./abis/rETH.json";
import sAVAX_ABI from "./abis/sAVAX.json";

const CHAIN_IDS: {
  [chainName: string]: number;
} = {
  ETH_MAINNET: 1,
  AVAX_MAINNET: 43114,
};

const ORACLES: {
  [chainId: number]: string;
} = {
  1: "0x789cD7AB3742e23Ce0952F6Bc3Eb3A73A0E08833",
  777: "0xb5711dAeC960c9487d95bA327c570a7cCE4982c0",
  43114: "0x108abfBa5AD61bd61A930BFe73394558d60f0b10",
};

const ASSETS: {
  [chainId: number]: { [asset: string]: string };
} = {
  1: {
    USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    WBTC: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    wstETH: "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
    rETH: "0xae78736Cd615f374D3085123A210448E74Fc6393",
    AAVE: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
    UNI: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    SPELL: "0x090185f2135308BaD17527004364eBcC2D37e5F6",
    BADGER: "0x3472A5A71965499acd81997a54BBA8D852C6E53d",
    BAL: "0xba100000625a3754423978a60c9317c58a424e3D",
    PERP: "0xbC396689893D065F41bc2C6EcbeE5e0085233447",
  },
  777: {
    sAMB: "0x683aae5cD37AC94943D05C19E9109D5876113562",
  },
  43114: {
    WAVAX: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
    sAVAX: "0x2b2C81e08f1Af8835a78Bb2A90AE924ACE0eA4bE",
  },
};

const PROVIDERS: { [chainId: number]: ethers.providers.StaticJsonRpcProvider } =
  {
    1: new ethers.providers.StaticJsonRpcProvider(
      process.env.REACT_APP_MAINNET_URI
    ),
    43114: new ethers.providers.StaticJsonRpcProvider(
      process.env.REACT_APP_AVAX_URI
    ),
    777: new ethers.providers.StaticJsonRpcProvider(
      process.env.REACT_APP_MAINNET_URI
    ),
  };

/**
 * 1. Get contract settlement state
 * 2. Use the pyth price for the listed majors
 */

type OracleResponse = [ethers.BigNumber, boolean];

export interface PriceResponse {
  asset: string;
  expiryPrice: string;
  finalized: boolean;
}

async function getExpiryPricesForChainId(
  chainid: number,
  expiryTimestamp: number
) {
  let prices: PriceResponse[] = [];
  const provider = PROVIDERS[chainid];
  const oracle = new ethers.Contract(ORACLES[chainid], ORACLE_ABI, provider);
  const assets = ASSETS[chainid];

  let promises: Promise<OracleResponse>[] = [];

  const assetKeys = Object.keys(assets);

  for (const asset of assetKeys) {
    const assetAddress = assets[asset];
    const promise = oracle.getExpiryPrice(assetAddress, expiryTimestamp);
    promises.push(promise);
  }
  const responses = await Promise.all(promises);

  for (let i = 0; i < assetKeys.length; i++) {
    const asset = assetKeys[i];
    const [expiryPrice, finalized] = responses[i];
    prices.push({
      asset,
      finalized,
      expiryPrice: ethers.utils.formatUnits(expiryPrice, 8),
    });
  }

  return prices;
}
export async function getExpiryPrices(
  expiryTimestamp: number
): Promise<PriceResponse[]> {
  const chainIds = Object.keys(PROVIDERS).map(Number); // Parse the chain IDs as numbers

  const unmergedPromises = chainIds.map((chainId) =>
    getExpiryPricesForChainId(chainId, expiryTimestamp)
  );

  const unmerged = await Promise.all(unmergedPromises);
  const prices = unmerged.flat();

  return prices;
}

export async function getwstETHRatio(blockNumber: number): Promise<number> {
  const provider = PROVIDERS[CHAIN_IDS["ETH_MAINNET"]];
  const contract = new ethers.Contract(
    ASSETS[CHAIN_IDS["ETH_MAINNET"]]["wstETH"],
    wstETH_ABI,
    provider
  );
  const result: string = await contract.callStatic.stEthPerToken({
    blockTag: blockNumber,
  });
  return parseFloat(ethers.utils.formatEther(result));
}

export async function getrETHRatio(blockNumber: number): Promise<number> {
  const provider = PROVIDERS[CHAIN_IDS["ETH_MAINNET"]];
  const contract = new ethers.Contract(
    ASSETS[CHAIN_IDS["ETH_MAINNET"]]["rETH"],
    rETH_ABI,
    provider
  );
  const result: string = await contract.callStatic.getExchangeRate({
    blockTag: blockNumber,
  });
  return parseFloat(ethers.utils.formatEther(result));
}

export async function getsAVAXRatio(blockNumber: number): Promise<number> {
  const provider = PROVIDERS[CHAIN_IDS["AVAX_MAINNET"]];
  const contract = new ethers.Contract(
    ASSETS[CHAIN_IDS["AVAX_MAINNET"]]["sAVAX"],
    sAVAX_ABI,
    provider
  );
  const result: string = await contract.callStatic.getPooledAvaxByShares(
    ethers.utils.parseEther("1"),
    {
      blockTag: blockNumber,
    }
  );
  return parseFloat(ethers.utils.formatEther(result));
}

export async function getClosestBlock(
  timestamp: number,
  chainName: string
): Promise<number> {
  const url = `https://coins.llama.fi/block/${chainName}/${timestamp.toString()}`;
  try {
    const response = await axios.get(url);

    const { data } = response;
    if (data.timestamp >= timestamp) {
      return data.height;
    } else {
      return data.height + 1;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
