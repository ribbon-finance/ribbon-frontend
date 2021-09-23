import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";

import { NFTDropData } from "../models/nft";

const useNFTDropData = () => {
  const { active } = useWeb3React();
  const [nftDropData, setNFTDropData] = useState<NFTDropData>({
    claimed: false,
  });

  useEffect(() => {
    if (!active) {
      setNFTDropData({
        claimed: false,
      });
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

export default useNFTDropData;
