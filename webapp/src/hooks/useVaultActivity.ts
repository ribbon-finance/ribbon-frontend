import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { BigNumber } from "ethers";

import {
  getSubgraphURIForVersion,
  VaultAddressMap,
  VaultOptions,
  VaultVersion,
  VaultVersionList,
} from "shared/lib/constants/constants";
import { VaultActivity } from "shared/lib/models/vault";

const useVaultActivity = (
  vault: VaultOptions,
  vaultVersion: VaultVersion = VaultVersionList[0]
) => {
  // TODO: Global state
  const [activities, setActivities] = useState<VaultActivity[]>([]);
  const [loading, setLoading] = useState(false);

  const loadActivity = useCallback(
    async (_vault: VaultOptions, _vaultVersion: VaultVersion) => {
      setLoading(true);
      setActivities(await fetchVaultAvtivity(_vault, _vaultVersion));
      setLoading(false);
    },
    []
  );

  useEffect(() => {
    loadActivity(vault, vaultVersion);
  }, [vault, vaultVersion, loadActivity]);

  return { activities, loading };
};

const fetchVaultAvtivity = async (
  vault: VaultOptions,
  vaultVersion: VaultVersion
): Promise<VaultActivity[]> => {
  const vaultAddress = VaultAddressMap[vault][vaultVersion]?.toLowerCase();

  if (!vaultAddress) {
    return [];
  }

  const response = await axios.post(getSubgraphURIForVersion(vaultVersion), {
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
