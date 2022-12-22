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

const usePermit = (asset: Assets) => {
  const { chainId, ethereumProvider, account } = useWeb3Wallet();

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
    return asset === "USDC" ? "USD Coin" : "Dai Stablecoin";
  }, [asset]);

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
        name: domainName,
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
    [account, tokenContract, ethereumProvider, domainName, chainId]
  );

  if (!permitAssets.includes(asset)) {
    return;
  }

  return {
    showApproveAssetSignature: showApproveUSDCSignature,
  };
};

export default usePermit;
