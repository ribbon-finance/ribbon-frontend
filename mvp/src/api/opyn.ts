import axios from "axios";
import { Agent as HttpsAgent } from "https";
import { BigNumber, ethers } from "ethers";
import { wmul } from "../utils/math";
import { CallPutPriceQuotes, ZeroExApiResponse } from "./types";
import externalAddresses from "../constants/externalAddresses.json";
import { GAMMA_PROTOCOL, getOptionTerms, MAX_UINT256 } from "./utils";

const GAMMA_MIN_STRIKE = ethers.utils.parseEther("0.65");
const GAMMA_MAX_STRIKE = ethers.utils.parseEther("1.05");
const ZERO_EX_API_URI = "https://api.0x.org/swap/v1/quote";

const abiCoder = new ethers.utils.AbiCoder();
const httpsAgent = new HttpsAgent({ keepAlive: true });

type OtokenDetails = {
  address: string;
  strikePrice: BigNumber;
  expiry: number;
  isPut: boolean;
};
type OtokenMatch = { address: string; strikePrice: BigNumber };
type OtokenMatches = { call: OtokenMatch | null; put: OtokenMatch | null };

export async function get0xPrices(
  instrumentAddress: string,
  spotPrice: BigNumber,
  buyAmount: BigNumber
): Promise<CallPutPriceQuotes> {
  const optionTerms = getOptionTerms(instrumentAddress);

  const otokenMatches = getNearestOtoken(
    optionTerms.expiry.toNumber(),
    spotPrice
  );
  const zero = BigNumber.from("0");

  const emptyPriceQuote = {
    strikePrice: zero,
    premium: zero,
    data: "0x",
    gasPrice: BigNumber.from("0"),
    exists: false,
    venueName: GAMMA_PROTOCOL,
  };

  const callResponse =
    otokenMatches.call &&
    (await get0xQuote(otokenMatches.call.address, buyAmount, null));

  const putResponse =
    otokenMatches.put &&
    (await get0xQuote(
      otokenMatches.put.address,
      buyAmount,
      callResponse !== null && !callResponse.error
        ? parseInt(callResponse.apiResponse.gasPrice)
        : null
    ));

  let callPriceQuote = emptyPriceQuote;
  let putPriceQuote = emptyPriceQuote;

  if (otokenMatches.call !== null && callResponse !== null) {
    switch (callResponse.error) {
      case true:
        break;
      case false:
        callPriceQuote = {
          strikePrice: otokenMatches.call.strikePrice,
          premium: callResponse ? callResponse.premium : zero,
          data: callResponse
            ? serializeZeroExOrder(callResponse.apiResponse)
            : "0x",
          gasPrice: callResponse
            ? BigNumber.from(callResponse.apiResponse.gasPrice)
            : zero,
          exists: Boolean(otokenMatches.call),
          venueName: GAMMA_PROTOCOL,
        };
        break;
      default:
        break;
    }
  }
  if (otokenMatches.put !== null && putResponse !== null) {
    switch (putResponse.error) {
      case true:
        break;
      case false:
        putPriceQuote = {
          strikePrice: otokenMatches.put.strikePrice,
          premium: putResponse ? putResponse.premium : zero,
          data: putResponse
            ? serializeZeroExOrder(putResponse.apiResponse)
            : "0x",
          gasPrice: putResponse
            ? BigNumber.from(putResponse.apiResponse.gasPrice)
            : zero,
          exists: Boolean(otokenMatches.put),
          venueName: GAMMA_PROTOCOL,
        };
        break;
      default:
        break;
    }
  }

  return {
    call: callPriceQuote,
    put: putPriceQuote,
  };
}

function getNearestOtoken(expiry: number, spotPrice: BigNumber): OtokenMatches {
  const scalingFactor = BigNumber.from("10").pow(BigNumber.from("10"));

  // return {
  //   call: {
  //     address: "0x78a36417c9f3814ae1b4367d03bff6ac6fd631fb",
  //     strikePrice: BigNumber.from("96000000000").mul(scalingFactor),
  //   },
  //   put: {
  //     address: "0x77d7e314f82e49a4faff5cc1d2ed0bc7a7c1b1f0",
  //     strikePrice: BigNumber.from("80000000000").mul(scalingFactor),
  //   },
  // };

  let otokens = externalAddresses.mainnet.otokens.map((otoken) => ({
    ...otoken,
    expiry: parseInt(otoken.expiry),
    strikePrice: BigNumber.from(otoken.strikePrice).mul(scalingFactor),
  }));

  // filter just in case
  otokens = otokens.filter((otoken) => otoken.expiry === expiry);

  // min-max bounds are 10% from the spot price
  const minStrikePrice = wmul(spotPrice, GAMMA_MIN_STRIKE);
  const maxStrikePrice = wmul(spotPrice, GAMMA_MAX_STRIKE);

  const callOtokens = otokens.filter(
    (otoken) =>
      !otoken.isPut &&
      otoken.strikePrice.gt(spotPrice) &&
      otoken.strikePrice.lt(maxStrikePrice)
  );
  const putOtokens = otokens.filter(
    (otoken) =>
      otoken.isPut &&
      otoken.strikePrice.lt(spotPrice) &&
      otoken.strikePrice.gt(minStrikePrice)
  );

  let addresses: OtokenMatches = {
    call: null,
    put: null,
  };

  const minDiffOtoken = (otokens: OtokenDetails[]) => {
    const strikePrices = otokens.map((otoken) => otoken.strikePrice);
    const priceDiff = strikePrices.map((p) => spotPrice.sub(p).abs());

    let minPrice = MAX_UINT256;
    let minIndex = 0;

    priceDiff.forEach((diff: BigNumber, index: number) => {
      if (diff.lt(minPrice)) {
        minPrice = diff;
        minIndex = index;
      }
    });
    return {
      address: ethers.utils.getAddress(otokens[minIndex].address),
      strikePrice: otokens[minIndex].strikePrice,
    };
  };

  if (callOtokens.length) {
    addresses.call = minDiffOtoken(callOtokens);
  }
  if (putOtokens.length) {
    addresses.put = minDiffOtoken(putOtokens);
  }

  return addresses;
}

async function get0xQuote(
  otokenAddress: string,
  buyAmount: BigNumber,
  gasPrice: number | null
): Promise<
  | { premium: BigNumber; apiResponse: ZeroExApiResponse; error: false }
  | { error: true }
> {
  const scalingFactor = BigNumber.from("10").pow(BigNumber.from("10"));
  buyAmount = buyAmount.div(scalingFactor);

  const data: Record<string, string> = {
    buyToken: otokenAddress,
    sellToken: "USDC",
    buyAmount: buyAmount.toString(),
    gas: "800000",
    ...(gasPrice !== null ? { gasPrice: gasPrice.toString() } : {}),
  };

  const query = new URLSearchParams(data).toString();
  const url = `${ZERO_EX_API_URI}?${query}`;

  try {
    const response = await axios.get(url, { httpsAgent });
    return {
      premium: calculateZeroExOrderCost(response.data),
      apiResponse: response.data,
      error: false,
    };
  } catch (e) {
    console.error(e.response.data);
    return { error: true };
  }
}

function serializeZeroExOrder(apiResponse: ZeroExApiResponse) {
  const types = [
    "(address,address,address,address,uint256,uint256,uint256,bytes)",
  ];
  const args = [
    [
      apiResponse.to,
      apiResponse.buyTokenAddress,
      apiResponse.sellTokenAddress,
      "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
      apiResponse.value,
      apiResponse.buyAmount,
      apiResponse.sellAmount,
      apiResponse.data,
    ],
  ];
  const data = abiCoder.encode(types, args);
  return data;
}

function calculateZeroExOrderCost(apiResponse: ZeroExApiResponse) {
  const decimals = 6; // just scale decimals for USDC amounts for now, because USDC is the purchase token

  const scaledSellAmount = parseInt(apiResponse.sellAmount) / 10 ** decimals;
  const totalETH =
    scaledSellAmount / parseFloat(apiResponse.sellTokenToEthRate);

  return ethers.utils
    .parseUnits(totalETH.toFixed(6), "ether")
    .add(BigNumber.from(apiResponse.value));
}
