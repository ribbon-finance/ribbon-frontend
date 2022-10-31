import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { PoolList, URLS } from "../constants/constants";
import { isPracticallyZero } from "../utils/math";
import { getLendContract } from "./getLendContract";
import useWeb3Wallet from "./useWeb3Wallet";
import { useWeb3Context } from "./web3Context";

export const useLendLink = () => {
  const [hasLendPosition, setHasLendPosition] = useState(false);
  const { account } = useWeb3Wallet();
  const { active, library } = useWeb3React();
  const { provider } = useWeb3Context();

  useEffect(() => {
    if (!account) {
      setHasLendPosition(false);
    }
    PoolList.forEach((pool) => {
      const poolContract = getLendContract(library || provider, pool, active);
      if (poolContract && account) {
        poolContract.balanceOf(account).then((balance: BigNumber) => {
          if (!isPracticallyZero(balance, 6)) {
            setHasLendPosition(true);
          }
        });
      }
    });
  }, [account, active, library, provider]);

  return hasLendPosition ? URLS.lendApp : URLS.lend;
};
