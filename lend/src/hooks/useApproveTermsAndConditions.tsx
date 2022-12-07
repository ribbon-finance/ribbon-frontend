import { useCallback } from "react";
import { useWeb3Wallet } from "./useWeb3Wallet";
import { getPoolTermsAndConditions } from "../constants/termsAndConditions";
import { PoolOptions } from "shared/lib/constants/lendConstants";

const useApproveTermsAndConditions = () => {
  const { ethereumProvider, account } = useWeb3Wallet();

  const showApproveTermsAndConditionsSignature = useCallback(
    async (pool: PoolOptions) => {
      // For now we won't display T&C for wintermute or folkvang
      // If enabling for wintermute or folkvang, ensure termsAndConditions.tsx is updated with relevant info
      if (pool === "wintermute" || pool === "folkvang") {
        return undefined;
      }

      if (!account || !ethereumProvider) {
        return undefined;
      }

      const termsAndConditionsVal = getPoolTermsAndConditions(pool);

      const approveTermsAndConditionsSignature = await ethereumProvider
        .getSigner()
        .signMessage(termsAndConditionsVal);

      if (approveTermsAndConditionsSignature) {
        return approveTermsAndConditionsSignature;
      }
      return undefined;
    },
    [account, ethereumProvider]
  );

  return {
    showApproveTermsAndConditionsSignature:
      showApproveTermsAndConditionsSignature,
  };
};

export default useApproveTermsAndConditions;
