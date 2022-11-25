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
} from "shared/lib/utils/deribit";
import {
  LISTED_ON_DERIBIT,
  Asset,
} from "shared/lib/constants/deribitConstants";
import { getNextFridayTimestamp } from "shared/lib/utils/math";
import { AssetOptions } from "shared/lib/utils/deribit";
import { useAssetsPrice } from "shared/lib/hooks/useAssetPrice";
import {
  DERIBIT_STRIKE_OFFSETS,
  HAS_PUT_PRODUCTS,
} from "shared/lib/constants/deribitConstants";

const queue = new Queue({
  rules: {
    deribit: {
      rate: 1, // 1 message
      limit: 1, // per second
      priority: 1,
    },
  },
});

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

export const assetToName = (asset: string) => {
  if (asset === "BTC") {
    return "WBTC";
  }
  if (asset === "ETH") {
    return "WETH";
  }
  return asset;
};

export const DeribitContextProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => {
  const [options, setOptions] = useState<AssetOptions>(
    Object.fromEntries(LISTED_ON_DERIBIT.map((a) => [a, {}]))
  );

  const { prices: spotPrices } = useAssetsPrice();

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
    return Object.values(spotPrices).every(Boolean);
  }, [spotPrices]);

  const refreshOptions = useCallback(async () => {
    if (spotPricesExist) {
      await fetchAllOptionData(spotPrices, mergeOptions);
    }
  }, [spotPrices, spotPricesExist, mergeOptions]);

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
  spotPrices: any,
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
      const asset = LISTED_ON_DERIBIT[idx];
      const assetName = assetToName(asset);
      const hasPut = HAS_PUT_PRODUCTS[asset] ? 1 : 0;
      const strikeOffset = DERIBIT_STRIKE_OFFSETS[asset];
      const spot = spotPrices[assetName].price;
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
    const assetName = assetToName(asset);
    const spot = spotPrices[assetName].price;
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
            return retry(100);
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
