import { useContext } from "react";
import { BigNumber } from "ethers";

import {
  Chains,
  CHAINS_TO_ID,
  isSolanaVault,
  VaultAddressMap,
  VaultList,
  VaultOptions,
  VaultVersion,
  VaultVersionList,
} from "../constants/constants";
import { VaultActivitiesData } from "../models/vault";
import { SubgraphDataContext } from "./subgraphDataContext";
import { isEVMChain, isSolanaChain } from "../utils/chains";

const getVaultActivityKey = (
  vault: VaultOptions,
  type:
    | "shortPositions"
    | "optionTrades"
    | "vaultOpenLoans"
    | "vaultCloseLoans"
    | "vaultOptionSolds"
    | "vaultOptionYields"
) => `vaultActivity_${type}_${vault.replace(/-/g, "")}`;

export const vaultActivitiesGraphql = (version: VaultVersion, chain: Chains) =>
  VaultList.reduce((acc, vault) => {
    let vaultAddress = VaultAddressMap[vault][version];

    if (
      !isSolanaVault(vault) &&
      (!vaultAddress || VaultAddressMap[vault].chainId !== CHAINS_TO_ID[chain])
    ) {
      return acc;
    }

    if (isEVMChain(chain)) {
      vaultAddress = vaultAddress?.toLowerCase();
    }

    if (version === "earn") {
      return (
        acc +
        `
            ${getVaultActivityKey(vault, "vaultOpenLoans")}:
            vaultOpenLoans
            {
              id
              loanAmount
              borrower
              loanTermLength
              openedAt
              openTxhash
              expiry
            }
            ${getVaultActivityKey(vault, "vaultCloseLoans")}:
            vaultCloseLoans
            {
              id
              paidAmount
              borrower
              _yield
              loanAmount
              closedAt
              closeTxhash
            }
            ${getVaultActivityKey(vault, "vaultOptionSolds")}:
            vaultOptionSolds
            {
              id
              premium
              optionAllocation
              optionSeller
              soldAt
              txhash
            }
            ${getVaultActivityKey(vault, "vaultOptionYields")}:
            vaultOptionYields
            {
              id
              _yield
              netYield
              optionAllocation
              optionSeller
              paidAt
              txhash
            }
          `
      );
    }
    return (
      acc +
      `
          ${getVaultActivityKey(vault, "shortPositions")}:
          vaultShortPositions
          ${
            isSolanaChain(chain)
              ? `(where: { vaultId: {_in: ["${vaultAddress}"] }})`
              : `(where: { vault_in: ["${vaultAddress}"] })`
          }
          {
            id
            depositAmount
            mintAmount
            strikePrice
            openedAt
            openTxhash
            expiry
          }

          ${getVaultActivityKey(vault, "optionTrades")}:
          vaultOptionTrades ${
            isSolanaChain(chain)
              ? `(where: { vaultId: {_in: ["${vaultAddress}"] }})`
              : `(where: { vault_in: ["${vaultAddress}"] })`
          }
          {
            vaultShortPosition {
              id
              strikePrice
              expiry
            }
            sellAmount
            premium
            timestamp
            txhash
          }
        `
    );
  }, "");

export const resolveVaultActivitiesSubgraphResponse = (responses: {
  [version in VaultVersion]: any | undefined;
}): VaultActivitiesData =>
  Object.fromEntries(
    VaultVersionList.map((version) => [
      version,
      Object.fromEntries(
        VaultList.map((vault) => {
          const shortPositionsData = responses[version]
            ? responses[version][
                getVaultActivityKey(vault, "shortPositions")
              ] || []
            : [];
          const optionTradesData = responses[version]
            ? responses[version][getVaultActivityKey(vault, "optionTrades")] ||
              []
            : [];
          const openLoansData = responses[version]
            ? responses[version][
                getVaultActivityKey(vault, "vaultOpenLoans")
              ] || []
            : [];
          const closeLoansData = responses[version]
            ? responses[version][
                getVaultActivityKey(vault, "vaultCloseLoans")
              ] || []
            : [];
          const soldOptionsData = responses[version]
            ? responses[version][
                getVaultActivityKey(vault, "vaultOptionSolds")
              ] || []
            : [];
          const paidOptionsData = responses[version]
            ? responses[version][
                getVaultActivityKey(vault, "vaultOptionYields")
              ] || []
            : [];
          return [
            vault,
            [
              ...shortPositionsData.map((item: any) => ({
                ...item,
                depositAmount: BigNumber.from(item.depositAmount),
                mintAmount: BigNumber.from(item.mintAmount),
                strikePrice: BigNumber.from(item.strikePrice),
                date: new Date(item.openedAt * 1000),
                type: "minting",
              })),
              ...optionTradesData.map((item: any) => ({
                ...item,
                vaultShortPosition: {
                  ...item.vaultShortPosition,
                  strikePrice: BigNumber.from(
                    item.vaultShortPosition.strikePrice
                  ),
                },
                sellAmount: BigNumber.from(item.sellAmount),
                premium: BigNumber.from(item.premium),
                date: new Date(item.timestamp * 1000),
                type: "sales",
              })),
              ...openLoansData.map((item: any) => ({
                ...item,
                loanAmount: BigNumber.from(item.loanAmount),
                date: new Date(item.openedAt * 1000),
                type: "openLoan",
              })),
              ...closeLoansData.map((item: any) => ({
                ...item,
                loanAmount: BigNumber.from(item.loanAmount),
                paidAmount: BigNumber.from(item.paidAmount),
                date: new Date(item.closedAt * 1000),
                type: "closeLoan",
              })),
              ...soldOptionsData.map((item: any) => ({
                ...item,
                premium: BigNumber.from(item.premium),
                date: new Date(item.soldAt * 1000),
                type: "optionSold",
              })),
              ...paidOptionsData.map((item: any) => ({
                ...item,
                yield: BigNumber.from(item._yield),
                netYield: BigNumber.from(item.netYield),
                date: new Date(item.paidAt * 1000),
                type: "optionYield",
              })),
            ],
          ];
        })
      ),
    ])
  ) as VaultActivitiesData;

export const useAllVaultActivities = () => {
  const contextData = useContext(SubgraphDataContext);

  return {
    activities: contextData.vaultSubgraphData.vaultActivities,
    loading: contextData.vaultSubgraphData.loading,
  };
};

const useVaultActivity = (
  vault: VaultOptions,
  vaultVersion: VaultVersion = "v1"
) => {
  const contextData = useContext(SubgraphDataContext);

  return {
    activities:
      contextData.vaultSubgraphData.vaultActivities[vaultVersion][vault],
    loading: contextData.vaultSubgraphData.loading,
  };
};

export default useVaultActivity;
