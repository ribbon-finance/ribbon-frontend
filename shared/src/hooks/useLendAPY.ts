import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { URLS } from "../constants/constants";
import { isPracticallyZero } from "../utils/math";
import { getLendContract } from "./getLendContract";
import useWeb3Wallet from "./useWeb3Wallet";
import { useWeb3Context } from "./web3Context";

const poolAddresses = [
  "0x0Aea75705Be8281f4c24c3E954D1F8b1D0f8044C",
  "0x3cd0ecf1552d135b8da61c7f44cefe93485c616d",
];

export const useLendAPY = () => {
  // const [lendAPY, setLendAPY] = useState(false);
  // const { library } = useWeb3React();
  // const { provider } = useWeb3Context();

  // useEffect(() => {
  //   poolAddresses.forEach((pool) => {
  //     const poolContract = getLendContract(library || provider, pool, false);
  //     if (poolContract && account) {
  //       poolContract.balanceOf(account).then((balance: BigNumber) => {
  //         if (!isPracticallyZero(balance, 6)) {
  //           setHasLendPosition(true);
  //         }
  //       });
  //     }
  //   });
  // }, [account, active, library, provider]);

  // return hasLendPosition ? URLS.lendApp : URLS.lend;
};
