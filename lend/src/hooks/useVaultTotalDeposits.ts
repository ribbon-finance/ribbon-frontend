import { useEffect, useState } from "react";
import { VaultList } from "../constants/constants";
import { BigNumber } from "ethers";
import useVaultAccounts from "./useVaultAccounts";

export const useVaultTotalDeposits = () => {
  const [totalDeposits, setTotalDeposits] = useState<BigNumber>(
    BigNumber.from(0.0)
  );

  const { loading, vaultAccounts } = useVaultAccounts("lend");

  useEffect(() => {
    if (!loading) {
      try {
        let deposits = BigNumber.from(0.0);
        VaultList.forEach((pool) => {
          const poolAccount = vaultAccounts[pool];
          if (poolAccount) {
            deposits = deposits.add(poolAccount.totalDeposits);
          }
        });
        setTotalDeposits(deposits);
      } catch (error) {
        console.log("error", error);
      }
    }
  }, [loading, vaultAccounts]);

  return totalDeposits;
};
