import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { URLS } from "../constants/constants";
import { isPracticallyZero } from "../utils/math";
import { getLendContract } from "./getLendContract";
import useWeb3Wallet from "./useWeb3Wallet";
import { useWeb3Context } from "./web3Context";
import { PoolAddressMap, PoolList } from "../constants/lendConstants";

export const useLendLink = () => {
  const [hasLendPosition, setHasLendPosition] = useState(false);
  const { account } = useWeb3Wallet();
  const { provider } = useWeb3React();
  const { active } = useWeb3Wallet();
  const { provider: defaultProvider } = useWeb3Context();

  useEffect(() => {
    if (!account) {
      setHasLendPosition(false);
    }
    PoolList.forEach((pool) => {
      const poolContract = getLendContract(
        provider || defaultProvider,
        PoolAddressMap[pool].lend,
        active
      );
      if (poolContract && account) {
        poolContract.balanceOf(account).then((balance: BigNumber) => {
          if (!isPracticallyZero(balance, 6)) {
            setHasLendPosition(true);
          }
        });
      }
    });
  }, [account, active, defaultProvider, provider]);

  return hasLendPosition ? URLS.lendApp : URLS.lend;
};
