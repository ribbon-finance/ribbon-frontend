import moment from "moment";
import React, {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Queue from "smart-request-balancer";
import {
  getStrikePricesForOption,
  getDeribitInstrumentDetails,
  Option,
  getInstrumentName,
} from "shared/lib/utils/derebit";
import { getNextFridayTimestamp } from "shared/lib/utils/derebitMath";
import { Asset } from "shared/lib/utils/derebit";
import useAssetPrice from "shared/lib/hooks/useAssetPrice";

const LISTED_ON_DERIBIT: Asset[] = ["SOL"];
const queue = new Queue({
  rules: {
    deribit: {
      rate: 8, // 8 message
      limit: 10, // per 10 seconds
      priority: 1,
    },
  },
});

export type AssetOptions = Record<Asset, Record<number, Option>>;

interface DeribitContextType {
  options: AssetOptions;

  setOption: (asset: Asset, option: Option) => void;
  mergeOptions: (options: AssetOptions) => void;
  refreshOptions: () => Promise<void>;
}

const DeribitContext = React.createContext<DeribitContextType>({
  options: Object.fromEntries(LISTED_ON_DERIBIT.map((a) => [a, {}])),
  setOption: (_asset, _option) => {},
  mergeOptions: (_options: AssetOptions) => {},
  refreshOptions: async () => {},
});

export const useDeribitContext = () => {
  return useContext(DeribitContext);
};

export const DeribitContextProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => {
  const [options, setOptions] = useState<AssetOptions>(
    Object.fromEntries(LISTED_ON_DERIBIT.map((a) => [a, {}]))
  );
  const { price: spotPrice } = useAssetPrice({
    asset: "SOL",
  });

  const intervalRef = useRef<number>();

  const setOption = useCallback(
    (asset: Asset, option: Option) => {
      setOptions({
        ...options,
        [asset]: {
          ...options[asset],
          [option.strikePrice]: option,
        },
      });
    },
    [options]
  );

  const mergeOptions = useCallback(
    (newOptions: AssetOptions) => {
      const merged = Object.fromEntries(
        Object.keys(newOptions).map((asset) => [
          asset,
          { ...options[asset], ...newOptions[asset] },
        ])
      );
      setOptions(merged);
    },
    [options]
  );

  const spotPricesExist = useMemo(() => {
    return Object.values(spotPrice).every(Boolean);
  }, [spotPrice]);

  const refreshOptions = useCallback(async () => {
    if (spotPricesExist) {
      await fetchAllOptionData(spotPrice, mergeOptions);
    }
  }, [spotPrice, spotPricesExist, mergeOptions]);

  useEffect(() => {
    refreshOptions();

    if (spotPricesExist) {
      const intervalId: unknown = setInterval(() => {
        refreshOptions();
      }, 10000);
      intervalRef.current = intervalId as number;
    }

    return () => clearInterval(intervalRef.current);
  }, [spotPricesExist, mergeOptions, refreshOptions]);

  return (
    <DeribitContext.Provider
      value={{
        options,
        setOption,
        mergeOptions,
        refreshOptions,
      }}
    >
      {children}
    </DeribitContext.Provider>
  );
};

const fetchAllOptionData = async (
  spotPrice: number,
  mergeOptions: (options: AssetOptions) => void
) => {
  const expiryDateTime = moment.unix(getNextFridayTimestamp());

  const strikePriceResponses = await Promise.all(
    LISTED_ON_DERIBIT.map((a) =>
      getStrikePricesForOption(a, expiryDateTime, false)
    )
  );

  const assetStrikes = strikePriceResponses.map((s, idx) => {
    return s.filter((strike) => {
      const hasPut = 0;
      const strikeOffset = 0.4;
      const spot = spotPrice;
      return (
        strike >= spot - spot * strikeOffset * hasPut &&
        strike <= spot + spot * strikeOffset
      );
    });
  });

  interface AssetOption {
    asset: string;
    isPut: boolean;
    strikePrice: number;
  }

  const assetOptions: AssetOption[][] = assetStrikes.map((s, idx) => {
    const asset = LISTED_ON_DERIBIT[idx];
    const spot = spotPrice!;
    return s.map((strike) => ({
      asset,
      isPut: strike < spot,
      strikePrice: strike,
    }));
  });

  const concatAssetOptions = assetOptions.reduce((acc, a) => {
    return acc.concat(a);
  }, []);

  const instrumentNames = concatAssetOptions.map(
    ({ asset, isPut, strikePrice }) =>
      getInstrumentName(asset, expiryDateTime, strikePrice, isPut)
  );

  const requests = instrumentNames.map((i) => {
    return new Promise(async (resolve, reject) => {
      let counter = 0;

      return queue.request(
        async (retry) => {
          counter += 1;
          try {
            return resolve(await getDeribitInstrumentDetails(i));
          } catch (e: any) {
            if (counter >= 10 || e.response.status === 429) {
              reject(e);
            }
            return retry(1000);
          }
        },
        i,
        "deribit"
      );
    });
  });

  const responses = (await Promise.all(requests)) as Option[];

  const newOptions = Object.fromEntries(
    LISTED_ON_DERIBIT.map((asset) => {
      const assetResponses = responses.filter((res) => res.asset === asset);
      const options = Object.fromEntries(
        assetResponses.map((option) => [option.strikePrice, option])
      );
      return [asset, options];
    })
  );
  mergeOptions(newOptions);
};
