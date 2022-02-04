import { useCallback, useEffect, useMemo } from "react";
import { BigNumber } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";

import {
  GAS_LIMITS,
  VaultMaxDeposit,
  VaultOptions,
  VaultVersion,
  VaultAllowedDepositAssets,
  isNativeToken,
} from "shared/lib/constants/constants";
import {
  ACTIONS,
  ActionType,
  V2WithdrawOption,
  V2WithdrawOptionList,
} from "../components/Vault/VaultActionsForm/Modal/types";
import { initialVaultActionForm, useWebappGlobalState } from "../store/store";
import useGasPrice from "shared/lib/hooks/useGasPrice";
import {
  useVaultData,
  useV2VaultData,
  useAssetsBalance,
} from "shared/lib/hooks/web3DataContext";
import { isETHVault } from "shared/lib/utils/vault";
import { Assets } from "shared/lib/store/types";
import useVaultPriceHistory from "shared/lib/hooks/useVaultPerformanceUpdate";

export type VaultActionFormTransferData =
  | {
      availableCapacity: BigNumber;
      availableTransferAmount: BigNumber;
    }
  | undefined;

export type WithdrawMetadata = {
  allowStandardWithdraw?: boolean;
  instantWithdrawBalance?: BigNumber;
};

const useVaultActionForm = (vaultOption: VaultOptions) => {
  const [vaultActionForm, setVaultActionForm] =
    useWebappGlobalState("vaultActionForm");
  const gasPrice = useGasPrice();
  /**
   * V1 vault data
   */
  const {
    decimals,
    deposits,
    maxWithdrawAmount,
    vaultLimit,
    vaultBalanceInAsset,
    userAssetBalance,
  } = useVaultData(vaultOption);
  /**
   * V2 vault data
   */
  const {
    data: {
      depositBalanceInAsset: v2DepositBalanceInAsset,
      lockedBalanceInAsset: v2LockedBalanceInAsset,
      withdrawals: v2Withdrawals,
    },
  } = useV2VaultData(vaultOption);
  const { data: assetsBalance } = useAssetsBalance();
  const vaultMaxDepositAmount = VaultMaxDeposit[vaultOption];
  const receiveVaultData = useVaultData(
    vaultActionForm.receiveVault || vaultOption
  );
  const { priceHistory } = useVaultPriceHistory(
    vaultOption,
    vaultActionForm.vaultVersion
  );

  /**
   * Utility for reset action form
   */
  const resetActionForm = useCallback(() => {
    setVaultActionForm((actionForm) => ({
      ...actionForm,
      inputAmount: "",
    }));
  }, [setVaultActionForm]);

  /**
   * Reset form when vault option changes
   */
  useEffect(() => {
    setVaultActionForm((prevVaultActionForm) => {
      if (prevVaultActionForm.vaultOption !== vaultOption) {
        return {
          ...initialVaultActionForm,
          vaultOption,
        };
      }

      return prevVaultActionForm;
    });
  }, [setVaultActionForm, vaultOption]);

  const canTransfer = useMemo(() => {
    switch (vaultOption) {
      default:
        return false;
    }
  }, [vaultOption]);

  const transferData = useMemo((): VaultActionFormTransferData => {
    if (!canTransfer || vaultActionForm.actionType !== ACTIONS.transfer) {
      return undefined;
    }

    let availableCapacity = receiveVaultData.vaultLimit.sub(
      receiveVaultData.deposits
    );
    availableCapacity = availableCapacity.gte(BigNumber.from(0))
      ? availableCapacity
      : BigNumber.from(0);

    return {
      availableCapacity,
      availableTransferAmount: maxWithdrawAmount.lte(availableCapacity)
        ? maxWithdrawAmount
        : availableCapacity,
    };
  }, [
    canTransfer,
    maxWithdrawAmount,
    receiveVaultData,
    vaultActionForm.actionType,
  ]);

  const withdrawMetadata = useMemo((): WithdrawMetadata => {
    switch (vaultActionForm.vaultVersion) {
      case "v2":
        return {
          allowStandardWithdraw:
            !v2LockedBalanceInAsset.isZero() || !v2Withdrawals.shares.isZero(),
          instantWithdrawBalance: v2DepositBalanceInAsset,
        };
    }

    return {};
  }, [
    v2DepositBalanceInAsset,
    v2LockedBalanceInAsset,
    v2Withdrawals.shares,
    vaultActionForm.vaultVersion,
  ]);

  /**
   * Handle user changing action type
   * Action type: deposit, withdraw
   */
  const handleActionTypeChange = useCallback(
    (
      actionType: ActionType,
      vaultVersion: VaultVersion,
      {
        withdrawOption,
        migrateSourceVault,
      }: {
        withdrawOption?: V2WithdrawOption;
        migrateSourceVault?: VaultOptions;
      } = {}
    ) => {
      setVaultActionForm((actionForm) => {
        // Do nothing if changing to the same action type
        if (
          actionType === actionForm.actionType &&
          vaultVersion === actionForm.vaultVersion &&
          withdrawOption === actionForm.withdrawOption
        ) {
          return actionForm;
        }

        switch (actionType) {
          case ACTIONS.transfer:
            switch (vaultOption) {
              case "rUSDC-ETH-P-THETA":
                return {
                  ...actionForm,
                  vaultVersion,
                  inputAmount: "",
                  actionType: ACTIONS.transfer,
                  receiveVault: "ryvUSDC-ETH-P-THETA",
                };
            }
            break;
          case ACTIONS.withdraw:
            /**
             * Only catch v2 vault and set default withdraw option if not provided
             */
            if (vaultVersion === "v2") {
              withdrawOption = withdrawOption || V2WithdrawOptionList[0];
              return {
                ...actionForm,
                vaultVersion,
                inputAmount: "",
                actionType,
                withdrawOption:
                  !withdrawMetadata.allowStandardWithdraw &&
                  withdrawOption === "standard"
                    ? "instant"
                    : withdrawOption,
              };
            }
            return {
              ...actionForm,
              vaultVersion,
              inputAmount: "",
              actionType,
            };
          case ACTIONS.deposit:
            return {
              ...actionForm,
              depositAsset: VaultAllowedDepositAssets[vaultOption][0],
              vaultVersion,
              inputAmount: "",
              actionType,
            };
          case ACTIONS.migrate:
            return {
              ...actionForm,
              migrateSourceVault: migrateSourceVault || vaultOption,
              vaultVersion,
              inputAmount: "",
              actionType,
            };
          default:
            return {
              ...actionForm,
              vaultVersion,
              inputAmount: "",
              actionType,
            };
        }

        return actionForm;
      });
    },
    [setVaultActionForm, vaultOption, withdrawMetadata]
  );

  /**
   * Handle deposit asset change
   */
  const handleDepositAssetChange = useCallback(
    (depositAsset: Assets) =>
      setVaultActionForm((actionForm) => {
        if (
          !actionForm.vaultOption ||
          actionForm.actionType !== ACTIONS.deposit
        ) {
          return actionForm;
        }

        return {
          ...actionForm,
          depositAsset: VaultAllowedDepositAssets[
            actionForm.vaultOption
          ].includes(depositAsset)
            ? depositAsset
            : actionForm.depositAsset,
        };
      }),
    [setVaultActionForm]
  );

  /**
   * Handle input amount changed
   */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawInput = e.target.value;

      setVaultActionForm((actionForm) => ({
        ...actionForm,
        inputAmount: rawInput && parseFloat(rawInput) < 0 ? "" : rawInput,
      }));
    },
    [setVaultActionForm]
  );

  /**
   * Handle max press from user
   */
  const handleMaxClick = useCallback(() => {
    setVaultActionForm((actionForm) => {
      switch (actionForm.vaultVersion) {
        /**
         * V1 handle max click
         */
        case "v1":
          switch (actionForm.actionType) {
            case ACTIONS.deposit:
              const gasLimit = GAS_LIMITS[vaultOption].v1!.deposit;
              const gasFee = BigNumber.from(gasLimit.toString()).mul(
                BigNumber.from(gasPrice || "0")
              );
              const total = BigNumber.from(userAssetBalance);
              // TODO: Optimize the code to request gas fees only when needed
              const maxAmount = isETHVault(vaultOption)
                ? total.sub(gasFee)
                : total;
              const allowedMaxAmount = maxAmount.lte(
                vaultMaxDepositAmount.sub(vaultBalanceInAsset)
              )
                ? maxAmount
                : vaultMaxDepositAmount.sub(vaultBalanceInAsset);
              const userMaxAmount = allowedMaxAmount.isNegative()
                ? BigNumber.from("0")
                : allowedMaxAmount;

              // Fringe case: if amt of deposit greater than vault limit, return 0
              const vaultAvailableBalance = deposits.gt(vaultLimit)
                ? BigNumber.from("0")
                : vaultLimit.sub(deposits);

              // Check if max is vault availableBalance
              const finalMaxAmount = userMaxAmount.gt(vaultAvailableBalance)
                ? vaultAvailableBalance
                : userMaxAmount;
              return {
                ...actionForm,
                inputAmount: formatUnits(finalMaxAmount, decimals),
              };
            case ACTIONS.withdraw:
              return {
                ...actionForm,
                inputAmount: formatUnits(maxWithdrawAmount, decimals),
              };
            case ACTIONS.transfer:
              return {
                ...actionForm,
                inputAmount: transferData
                  ? formatUnits(transferData.availableTransferAmount, decimals)
                  : "",
              };
            case ACTIONS.migrate:
              return {
                ...actionForm,
                inputAmount: formatUnits(vaultBalanceInAsset, decimals),
              };
          }
          break;

        /**
         * V2 handle max click
         */
        case "v2":
          switch (actionForm.actionType) {
            case ACTIONS.deposit:
              const gasLimit = GAS_LIMITS[vaultOption].v2!.deposit;
              const gasFee = BigNumber.from(gasLimit.toString()).mul(
                BigNumber.from(gasPrice || "0")
              );
              const walletBalance = assetsBalance[actionForm.depositAsset!];

              // TODO: Optimize the code to request gas fees only when needed
              const walletMaxAmount = isNativeToken(
                actionForm.depositAsset || ""
              )
                ? walletBalance.sub(gasFee)
                : walletBalance;

              /**
               * We change the behavior to populate with user wallet balance and show error so user adjust the amount manually
               */
              return {
                ...actionForm,
                inputAmount: formatUnits(walletMaxAmount, decimals),
              };
            case ACTIONS.withdraw:
              switch (actionForm.withdrawOption) {
                case "instant":
                  return {
                    ...actionForm,
                    inputAmount: formatUnits(v2DepositBalanceInAsset, decimals),
                  };
                case "complete":
                  return {
                    ...actionForm,
                    inputAmount: formatUnits(
                      v2Withdrawals.shares
                        .mul(
                          priceHistory.find(
                            (history) => history.round === v2Withdrawals.round
                          )?.pricePerShare || BigNumber.from(0)
                        )
                        .div(parseUnits("1", decimals)),
                      decimals
                    ),
                  };
                case "standard":
                default:
                  return {
                    ...actionForm,
                    inputAmount: formatUnits(v2LockedBalanceInAsset, decimals),
                  };
              }
          }
      }
      return actionForm;
    });
  }, [
    assetsBalance,
    decimals,
    deposits,
    gasPrice,
    maxWithdrawAmount,
    priceHistory,
    setVaultActionForm,
    transferData,
    userAssetBalance,
    v2DepositBalanceInAsset,
    v2LockedBalanceInAsset,
    v2Withdrawals,
    vaultBalanceInAsset,
    vaultLimit,
    vaultMaxDepositAmount,
    vaultOption,
  ]);

  return {
    canTransfer,
    handleActionTypeChange,
    handleDepositAssetChange,
    handleInputChange,
    handleMaxClick,
    resetActionForm,
    transferData,
    vaultActionForm,
    withdrawMetadata,
  };
};

export default useVaultActionForm;
