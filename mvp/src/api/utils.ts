import { BigNumber } from "ethers";
import { ContractOptionTerms } from "./types";
import instrumentAddresses from "../constants/instruments.json";

const ETH_ADDRESS = "0x0000000000000000000000000000000000000000";
const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
export const PUT_OPTION = 1;
export const CALL_OPTION = 2;
export const HEGIC_PROTOCOL = "HEGIC";
export const GAMMA_PROTOCOL = "OPYN_GAMMA";

// 2^256-1
export const MAX_UINT256 = BigNumber.from("2")
  .pow(BigNumber.from("256"))
  .sub(BigNumber.from("1"));

export function getOptionTerms(instrumentAddress: string): ContractOptionTerms {
  const instrumentDetails = instrumentAddresses.mainnet.find(
    (i) => i.address === instrumentAddress
  );
  if (!instrumentDetails) {
    throw new Error(`Instrument with address ${instrumentAddress} not found`);
  }
  return {
    underlying: ETH_ADDRESS,
    collateralAsset: ETH_ADDRESS,
    strikeAsset: USDC_ADDRESS,
    expiry: BigNumber.from(instrumentDetails.expiry),
  };
}
