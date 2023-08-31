import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { useWeb3Context } from "shared/lib/hooks/web3Context";
import { getCurveFeeDistribution } from "./useCurveFeeDistribution";
import { impersonateAddress } from "shared/lib/utils/development";
import useWeb3Wallet from "shared/lib/hooks/useWeb3Wallet";
export const useAccountRebateAmount = () => {
  const { provider, account: web3Account } = useWeb3React();
  const { active: web3Active } = useWeb3Wallet();
  const { provider: defaultProvider } = useWeb3Context();

  const account = impersonateAddress ? impersonateAddress : web3Account;

  const [rbnRebateAmount, setRbnRebateAmount] = useState<BigNumber>(
    BigNumber.from("0")
  );

  const [loading, setLoading] = useState<boolean>(true);
  const getData = useCallback(async () => {
    const contract = getCurveFeeDistribution(
      provider || defaultProvider,
      web3Active
    );

    if (!contract || !account) {
      return;
    }

    const penaltyRebateOf = web3Active
      ? await contract.penalty_rebate_of(account!)
      : BigNumber.from(0);

    setRbnRebateAmount(penaltyRebateOf);

    setLoading(false);
  }, [account, defaultProvider, provider, web3Active]);

  useEffect(() => {
    getData();
  }, [getData]);

  return {
    loading,
    rbnRebateAmount,
  };
};

export default useAccountRebateAmount;
