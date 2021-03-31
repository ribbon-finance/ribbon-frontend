import {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ChainlinkAggregatorFactory } from "../codegen/ChainlinkAggregatorFactory";
import { toFiat } from "../utils/math";
import externalAddresses from "../constants/externalAddresses.json";
import { BigNumber } from "ethers";
import { useWeb3Context } from "./web3Context";
import React from "react";

export const ETHPriceContext = React.createContext<BigNumber>(
  BigNumber.from("0")
);

function chainIdToFeed(chainId: number | undefined, feed: string): string {
  let feeds: any;
  switch (chainId) {
    case 1: {
      feeds = externalAddresses.mainnet.feeds;
      break;
    }
    case 42: {
      feeds = externalAddresses.kovan.feeds;
      break;
    }
  }
  return feeds[feed];
}

export const useETHPriceInUSD = () => {
  return toFiat(useETHPrice());
};

export const ETHPriceProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => {
  const [price, setPrice] = useState<BigNumber>(BigNumber.from("0"));
  const ethPrice = useETHPrice();

  useEffect(() => {
    if (ethPrice.isZero()) {
      setPrice(ethPrice);
    }
  }, [setPrice, ethPrice]);

  return (
    <ETHPriceContext.Provider value={price}>
      {children}
    </ETHPriceContext.Provider>
  );
};

export const useETHPrice = () => {
  const cachedPrice = useContext(ETHPriceContext);
  const { provider } = useWeb3Context();
  const [price, setPrice] = useState(BigNumber.from("0"));

  const fetchPrice = useCallback(async () => {
    if (provider) {
      const { chainId } = await provider.getNetwork();

      const chainlinkAggregator = ChainlinkAggregatorFactory.connect(
        chainIdToFeed(chainId, "eth/usd"),
        provider
      );

      const ethPriceRaw = await chainlinkAggregator.latestAnswer();
      setPrice(ethPriceRaw);
    }
  }, [provider]);

  useEffect(() => {
    if (cachedPrice.isZero() && provider) {
      fetchPrice();
    } else {
      console.log("returned cache");
      setPrice(cachedPrice);
    }
  }, [cachedPrice, fetchPrice, provider]);

  return price;
};
