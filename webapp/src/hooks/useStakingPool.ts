import { BigNumber } from "@ethersproject/bignumber";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";

import {
  VaultLiquidityMiningMap,
  VaultOptions,
} from "shared/lib/constants/constants";
import useERC20Token from "shared/lib/hooks/useERC20Token";
import { StakingPoolData } from "../models/staking";
import useStakingReward from "./useStakingReward";

const initialData: StakingPoolData = {
  currentStake: BigNumber.from(0),
  poolSize: BigNumber.from(0),
  expectedYield: 0,
  claimableRbn: BigNumber.from(0),
};

const useStakingPool = (option: VaultOptions) => {
  const [data, setData] = useState<StakingPoolData>(initialData);
  const [loading, setLoading] = useState(false);
  const contract = useStakingReward(option);
  const { active, account } = useWeb3React();
  const tokenContract = useERC20Token(option);

  useEffect(() => {
    if (!contract) {
      return;
    }

    (async () => {
      setLoading(true);
      /**
       * 1. Pool size
       * 2. TODO: Expected yield
       */
      const unconnectedPromises = [
        tokenContract.balanceOf(VaultLiquidityMiningMap[option]),
        (async () => 24.1)(),
      ];

      /**
       * 1. Current stake
       * 2. Claimable rbn
       */
      const promises = unconnectedPromises.concat(
        active
          ? [contract.balanceOf(account), contract.earned(account)]
          : [
              /** User had not connected their wallet, default to 0 */
              (async () => BigNumber.from(0))(),
              (async () => BigNumber.from(0))(),
            ]
      );

      const [
        poolSize,
        expectedYield,
        currentStake,
        claimableRbn,
      ] = await Promise.all(promises);

      setData({
        poolSize,
        expectedYield,
        currentStake,
        claimableRbn,
      });
      setLoading(false);
    })();
  }, [account, active, contract, option, tokenContract]);

  return { data, loading };
};

export default useStakingPool;
