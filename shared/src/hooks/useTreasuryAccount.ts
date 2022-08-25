import { useMemo } from "react";

import { useAssetsPrice } from "./useAssetPrice";
import { useTreasuryBalance } from "./web3DataContext";
import { Assets } from "../store/types";
import { assetToFiat } from "../utils/math";
import { getAssetDecimals } from "../utils/asset";

const useTreasuryAccount = () => {
  const { data: balances, loading: balanceLoading } = useTreasuryBalance();
  const { prices } = useAssetsPrice();

  const accounts = useMemo(() => {
    const accounts = (Object.keys(balances) as Assets[]).map((asset) => {
      return {
        asset,
        balance: balances[asset],
        value: parseFloat(
          assetToFiat(
            balances[asset],
            prices[asset].price,
            getAssetDecimals(asset)
          )
        ),
        loading: balanceLoading || prices[asset].loading,
      };
    });

    accounts.sort((a, b) => (a.value < b.value ? 1 : -1));

    return accounts;
  }, [balanceLoading, balances, prices]);

  return {
    accounts,
    total: accounts.reduce((acc, curr) => acc + curr.value, 0),
  };
};

export default useTreasuryAccount;
