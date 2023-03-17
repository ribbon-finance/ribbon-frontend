import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { useWeb3Context } from "shared/lib/hooks/web3Context";
import { getCurveFeeDistribution } from "./useCurveFeeDistribution";
import { impersonateAddress } from "shared/lib/utils/development";
export const useAccountRebateAmount = () => {
  const { library, active: web3Active, account: web3Account } = useWeb3React();
  const { provider } = useWeb3Context();

  const account = impersonateAddress ? impersonateAddress : web3Account;

  const [rbnRebateAmount, setRbnRebateAmount] = useState<BigNumber>(
    BigNumber.from("0")
  );

  const [loading, setLoading] = useState<boolean>(true);
  const getData = useCallback(async () => {
    const contract = getCurveFeeDistribution(library || provider, web3Active);

    if (!contract || !account) {
      return;
    }

    const penaltyRebateOf = web3Active
      ? await contract.penalty_rebate_of(account!)
      : BigNumber.from(0);

    setRbnRebateAmount(penaltyRebateOf);

    setLoading(false);
  }, [account, library, provider, web3Active]);

  useEffect(() => {
    getData();
  }, [getData]);

  return {
    loading,
    rbnRebateAmount,
  };
};

export default useAccountRebateAmount;
