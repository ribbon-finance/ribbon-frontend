import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { BigNumber } from "ethers";

import { VaultAddressMap, VaultOptions } from "shared/lib/constants/constants";
import { VaultActivity } from "shared/lib/models/vault";
import { getSubgraphqlURI } from "shared/lib/utils/env";

const useVaultActivity = (vault: VaultOptions) => {
  const [activities, setActivities] = useState<VaultActivity[]>([]);
  const [loading, setLoading] = useState(false);

  const loadActivity = useCallback(async (vault: VaultOptions) => {
    setLoading(true);
    setActivities(await fetchVaultAvtivity(vault));
    setLoading(false);
  }, []);

  useEffect(() => {
    loadActivity(vault);
  }, [vault, loadActivity]);

  return { activities, loading };
};

const fetchVaultAvtivity = async (
  vault: VaultOptions
): Promise<VaultActivity[]> => {
  const vaultAddress = VaultAddressMap[vault]().toLowerCase();

  const response = await axios.post(getSubgraphqlURI(), {
    query: `
        {
          vaultShortPositions (where: { vault_in: ["${vaultAddress}"] }){
            id
            depositAmount
            mintAmount
            strikePrice
            openedAt
            openTxhash
            expiry
          }
          vaultOptionTrades (where: { vault_in: ["${vaultAddress}"] }) {
            vaultShortPosition {
              id
              strikePrice
              expiry
            }
            sellAmount
            premium
            timestamp
            txhash
          }
        }
        `,
  });

  return [
    ...response.data.data.vaultShortPositions.map((item: any) => ({
      ...item,
      depositAmount: BigNumber.from(item.depositAmount),
      mintAmount: BigNumber.from(item.mintAmount),
      strikePrice: BigNumber.from(item.strikePrice),
      date: new Date(item.openedAt * 1000),
      type: "minting",
    })),
    ...response.data.data.vaultOptionTrades.map((item: any) => ({
      ...item,
      vaultShortPosition: {
        ...item.vaultShortPosition,
        strikePrice: BigNumber.from(item.vaultShortPosition.strikePrice),
      },
      sellAmount: BigNumber.from(item.sellAmount),
      premium: BigNumber.from(item.premium),
      date: new Date(item.timestamp * 1000),
      type: "sales",
    })),
  ];
};

export default useVaultActivity;
