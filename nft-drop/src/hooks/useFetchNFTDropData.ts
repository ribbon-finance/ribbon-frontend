import { useCallback, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";

import { impersonateAddress } from "shared/lib/utils/development";
import { getColorwayFromTokenID } from "../constants/constants";
import { defaultNFTDropData, NFTDropData } from "../models/nft";
import useRibbonOG from "./useRibbonOG";

const merkle = require("../data/merkle.json");

const useFetchNFTDropData = (
  {
    poll,
    pollingFrequency,
  }: {
    poll: boolean;
    pollingFrequency: number;
  } = { poll: true, pollingFrequency: 10000 }
) => {
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

    const tokenId = parseFloat(
      BigNumber.from(merkleObj.amount.slice(2)).toString()
    );
    const tokenIdOwner = await contract.ownerOf(tokenId).catch(() => undefined);

    setNFTDropData({
      colorway: getColorwayFromTokenID(tokenId),
      claimed: Boolean(tokenIdOwner),
      tokenId: tokenId,
      proof: merkleObj.proof,
    });
  }, [account, active, contract]);

  useEffect(() => {
    // eslint-disable-next-line no-undef
    let pollInterval: NodeJS.Timeout | null = null;
    if (poll) {
      fetchNFTDropData();
      pollInterval = setInterval(fetchNFTDropData, pollingFrequency);
    } else {
      fetchNFTDropData();
    }

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [fetchNFTDropData, poll, pollingFrequency]);

  return nftDropData;
};

export default useFetchNFTDropData;
