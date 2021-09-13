import { BigNumber } from "ethers";
import moment, { Moment } from "moment";
import { useCallback, useEffect, useState } from "react";

import { VaultOptions } from "shared/lib/constants/constants";
import useV2Vault from "shared/lib/hooks/useV2Vault";

const useV2VaultPriceHistory = (vaultOption: VaultOptions) => {
  const [priceHistory, setPriceHistory] = useState<
    Array<{ timestamp: Moment; price: BigNumber }>
  >([]);
  const [loading, setLoading] = useState(false);
  const contract = useV2Vault(vaultOption);

  const fetchData = useCallback(async () => {
    if (!contract) {
      return;
    }

    setLoading(true);

    const vaultState = await contract.vaultState();
    const promises = Array.from({ length: vaultState.round - 1 }, (x, i) =>
      contract.roundPricePerShare(i + 1)
    );

    const result = await Promise.all(
      promises.map((p) => p.catch(() => BigNumber.from(0)))
    );

    const comingFriday = moment()
      .isoWeekday("friday")
      .utc()
      .set("hour", 10)
      .set("minute", 0)
      .set("second", 0)
      .set("millisecond", 0);

    if (comingFriday.isBefore(moment())) {
      comingFriday.add(1, "week");
    }

    setPriceHistory(
      result.map((price, i) => ({
        price,
        timestamp: comingFriday.clone().subtract(result.length - i, "week"),
      }))
    );
    setLoading(false);
  }, [contract]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { priceHistory, loading };
};

export default useV2VaultPriceHistory;
