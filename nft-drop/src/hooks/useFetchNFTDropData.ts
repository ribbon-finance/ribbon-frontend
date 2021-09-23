import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";

import { defaultNFTDropData, NFTDropData } from "../models/nft";

const useFetchNFTDropData = () => {
  const { active } = useWeb3React();
  const [nftDropData, setNFTDropData] =
    useState<NFTDropData>(defaultNFTDropData);

  useEffect(() => {
    if (!active) {
      setNFTDropData(defaultNFTDropData);
      return;
    }

    const randNum = Math.floor(Math.random() * 6);
    setNFTDropData((prev) => ({
      ...prev,
      colorway: randNum === 5 ? undefined : randNum,
    }));
  }, [active]);

  return nftDropData;
};

export default useFetchNFTDropData;
