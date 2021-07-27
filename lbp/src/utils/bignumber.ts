import { BigNumber } from "ethers";
import BigNumberJS from "bignumber.js";

export const BigNumberJSToBigNumber = (n: BigNumberJS): BigNumber => {
  return BigNumber.from(n.toString());
};

export const BigNumberToBigNumberJS = (n: BigNumber): BigNumberJS => {
  return new BigNumberJS(n.toString());
};
