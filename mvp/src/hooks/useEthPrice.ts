import { useCallback, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { ChainlinkAggregatorFactory } from "../codegen/ChainlinkAggregatorFactory";
import { toFiat } from "../utils/math";
import externalAddresses from "../constants/externalAddresses.json";
import { BigNumber } from "ethers";

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

export const useETHPrice = () => {
  const { chainId, library } = useWeb3React();
  const [price, setPrice] = useState(BigNumber.from("0"));

  const fetchPrice = useCallback(async () => {
    const signer = library.getSigner();
    const chainlinkAggregator = ChainlinkAggregatorFactory.connect(
      chainIdToFeed(chainId, "eth/usd"),
      signer
    );

    const ethPriceRaw = await chainlinkAggregator.latestAnswer();
    setPrice(ethPriceRaw);
  }, [library, chainId]);

  useEffect(() => {
    if (library) {
      fetchPrice();
    }
  }, [fetchPrice, library]);

  return price;
};
