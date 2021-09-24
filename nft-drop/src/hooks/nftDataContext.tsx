import React, { ReactElement, useContext } from "react";

import { defaultNFTDropData, NFTDropData } from "../models/nft";
import useFetchNFTDropData from "./useFetchNFTDropData";

export const NFTDataContext =
  React.createContext<NFTDropData>(defaultNFTDropData);

export const useNFTDropData = () => useContext(NFTDataContext);

export const NFTDataContextProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => {
  const nftData = useFetchNFTDropData();

  return (
    <NFTDataContext.Provider value={nftData}>
      {children}
    </NFTDataContext.Provider>
  );
};
