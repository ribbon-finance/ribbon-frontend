/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
import { BigNumber, ethers } from "ethers";
import { useContext, useEffect } from "react";
import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { useWeb3Wallet } from "shared/lib/hooks/useWeb3Wallet";
import { AnimatePresence, motion } from "framer";

import {
  getAssets,
  isNativeToken,
  VaultAddressMap,
  VaultAllowedDepositAssets,
  VaultOptions,
  VaultVersion,
} from "shared/lib/constants/constants";
import { useWeb3Context } from "shared/lib/hooks/web3Context";
import { getVaultColor } from "shared/lib/utils/vault";
import useERC20Token, { getERC20Token } from "shared/lib/hooks/useERC20Token";
import { ERC20Token } from "shared/lib/models/eth";
import useLoadingText from "shared/lib/hooks/useLoadingText";
import {
  BaseLink,
  PrimaryText,
  SecondaryText,
  Title,
} from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import { usePendingTransactions } from "shared/lib/hooks/pendingTransactionsContext";
import { ActionButton } from "shared/lib/components/Common/buttons";
import {
  getAssetColor,
  getAssetDisplay,
  getAssetLogo,
} from "shared/lib/utils/asset";
import useVaultActionForm from "../../../../hooks/useVaultActionForm";
import ButtonArrow from "shared/lib/components/Common/ButtonArrow";
import theme from "shared/lib/designSystem/theme";
import { ISignature, splitSignature } from "./signing";
import { setTokenSourceMapRange } from "typescript";

const EIP2612_TYPE = [
  { name: "owner", type: "address" },
  { name: "spender", type: "address" },
  { name: "value", type: "uint256" },
  { name: "nonce", type: "uint256" },
  { name: "deadline", type: "uint256" },
];

const USDCSign = () => {
  const depositAsset = getAssets("rEARN");

  const { chainId, ethereumProvider, account } = useWeb3Wallet();
  const decimals = 6;

  const tokenContract = useMemo(() => {
    if (!chainId) {
      return;
    }

    return getERC20Token(
      ethereumProvider,
      depositAsset.toLowerCase() as ERC20Token,
      chainId
    );
  }, [chainId, depositAsset, ethereumProvider]);

  const showApproveUSDCSignature = useCallback(
    async (
      spender: string,
      // Amount of USDC
      amountUSDC: string,
      deadline: number
    ) => {
      if (!account || !tokenContract || !ethereumProvider) {
        return undefined;
      }

      const domain = {
        name: "USD Coin",
        version: "2",
        verifyingContract: tokenContract.address,
        chainId,
      };

      const approveMessage = {
        owner: account,
        spender,
        value: BigNumber.from(amountUSDC),
        nonce: (await tokenContract.nonces(account)).toNumber(),
        deadline,
      };

      const approveUSDCSignature = await ethereumProvider
        .getSigner()
        ._signTypedData(domain, { Permit: EIP2612_TYPE }, approveMessage);

      if (approveUSDCSignature) {
        const splitted = splitSignature(approveUSDCSignature);
        return splitted;
      }
      return undefined;
    },
    [account, chainId, tokenContract, ethereumProvider]
  );

  return {
    showApproveAssetSignature: showApproveUSDCSignature,
  };
};

export default USDCSign;
