/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
import { BigNumber } from "ethers";
import { useCallback, useMemo } from "react";
import { useWeb3Wallet } from "./useWeb3Wallet";
import { getERC20Token } from "shared/lib/hooks/useERC20Token";
import { ERC20Token } from "shared/lib/models/eth";
import { splitSignature } from "shared/lib/utils/signing";
import { Assets } from "../store/types";
import { permitAssets } from "../constants/constants";

export interface DepositSignature {
  deadline: number;
  nonce: number;
  v: number;
  r: string;
  s: string;
}

const EIP2612_TYPE = [
  { name: "owner", type: "address" },
  { name: "spender", type: "address" },
  { name: "value", type: "uint256" },
  { name: "nonce", type: "uint256" },
  { name: "deadline", type: "uint256" },
];

const PERMIT_ALLOWED_TYPE = [
  { name: "holder", type: "address" },
  { name: "spender", type: "address" },
  { name: "nonce", type: "uint256" },
  { name: "expiry", type: "uint256" },
  { name: "allowed", type: "bool" },
];

const usePermit = (asset: Assets) => {
  const { chainId, ethereumProvider, account } = useWeb3Wallet();

  const isUSDC = asset === "USDC";

  const tokenContract = useMemo(() => {
    if (!chainId) {
      return;
    }

    return getERC20Token(
      ethereumProvider,
      asset.toLowerCase() as ERC20Token,
      chainId
    );
  }, [chainId, asset, ethereumProvider]);

  const domainName = useMemo(() => {
    return isUSDC ? "USD Coin" : "Dai Stablecoin";
  }, [isUSDC]);

  const showapproveAssetSignature = useCallback(
    async (
      spender: string,
      // Amount of USDC
      amountUSDC: string,
      deadline: number
    ) => {
      if (!account || !tokenContract || !ethereumProvider) {
        return undefined;
      }

      const nonce = (await tokenContract.nonces(account)).toNumber();

      const version = isUSDC ? "2" : "1";

      const domain = {
        name: domainName,
        version,
        verifyingContract: tokenContract.address,
        chainId,
      };

      const approveMessage = isUSDC
        ? {
            owner: account,
            spender,
            value: BigNumber.from(amountUSDC),
            nonce,
            deadline,
          }
        : {
            holder: account,
            spender,
            nonce,
            expiry: deadline,
            allowed: true,
          };

      const approveAssetSignature = await ethereumProvider
        .getSigner()
        ._signTypedData(
          domain,
          { Permit: isUSDC ? EIP2612_TYPE : PERMIT_ALLOWED_TYPE },
          approveMessage
        );

      if (approveAssetSignature) {
        const splitted = splitSignature(approveAssetSignature);
        return { splitted, nonce };
      }
      return undefined;
    },
    [account, tokenContract, ethereumProvider, isUSDC, domainName, chainId]
  );

  if (!permitAssets.includes(asset)) {
    return;
  }

  return {
    showApproveAssetSignature: showapproveAssetSignature,
  };
};

export default usePermit;
