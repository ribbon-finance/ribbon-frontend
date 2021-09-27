import { useCallback, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";

import { impersonateAddress } from "shared/lib/utils/development";
import { getColorwayFromTokenID } from "../constants/constants";
import { defaultNFTDropData, NFTDropData } from "../models/nft";
import useRibbonOG from "./useRibbonOG";

const merkle = require("../data/merkle.json");

const useFetchNFTDropData = () => {
  const { active, account: web3Account } = useWeb3React();
  const [nftDropData, setNFTDropData] =
    useState<NFTDropData>(defaultNFTDropData);
  const account = impersonateAddress ? impersonateAddress : web3Account;
  const contract = useRibbonOG();

  const fetchNFTDropData = useCallback(async () => {
    if (!active || !account) {
      setNFTDropData(defaultNFTDropData);
      return;
    }

    const merkleObj = merkle.claims[account];

    if (!merkleObj) {
      setNFTDropData(defaultNFTDropData);
      return;
    }

    const tokenId = parseFloat(BigNumber.from(merkleObj.amount).toString());
    const tokenIdOwner = await contract.ownerOf(tokenId).catch(() => undefined);

    setNFTDropData({
      colorway: getColorwayFromTokenID(tokenId),
      claimed: Boolean(tokenIdOwner),
      tokenId: tokenId,
      proof: merkleObj.proof,
    });
  }, [account, active, contract]);

  useEffect(() => {
    fetchNFTDropData();
  }, [fetchNFTDropData]);

  return nftDropData;
};

export default useFetchNFTDropData;
