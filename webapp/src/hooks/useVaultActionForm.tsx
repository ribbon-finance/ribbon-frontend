import { useCallback, useEffect, useMemo } from "react";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";

import {
  GAS_LIMITS,
  VaultMaxDeposit,
  VaultOptions,
  VaultVersion,
  VaultVersionList,
} from "shared/lib/constants/constants";
import {
  ACTIONS,
  ActionType,
  V2WithdrawOption,
  V2WithdrawOptionList,
} from "../components/Vault/VaultActionsForm/Modal/types";
import { initialVaultActionForm, useWebappGlobalState } from "../store/store";
import useGasPrice from "shared/lib/hooks/useGasPrice";
import useVaultData from "shared/lib/hooks/useVaultData";
import { isETHVault } from "shared/lib/utils/vault";
import useV2VaultData from "shared/lib/hooks/useV2VaultData";

export type VaultActionFormTransferData =
  | {
      availableCapacity: BigNumber;
      availableTransferAmount: BigNumber;
    }
  | undefined;

const useVaultActionForm = (vaultOption: VaultOptions) => {
  const [vaultActionForm, setVaultActionForm] =
    useWebappGlobalState("vaultActionForm");
  const gasPrice = useGasPrice();
  /**
   * V1 vault data
   */
  const { deposits, vaultLimit, vaultBalanceInAsset, maxWithdrawAmount } =
    useVaultData(vaultOption);
  /**
   * V2 vault data
   */
  const {
    data: {
      cap: v2Cap,
      decimals,
      depositBalanceInAsset: v2DepositBalanceInAsset,
      lockedBalanceInAsset: v2LockedBalanceInAsset,
      totalBalance: v2TotalBalance,
      userAssetBalance,
    },
  } = useV2VaultData(vaultOption);
  const v2VaultBalanceInAsset = v2DepositBalanceInAsset.add(
    v2LockedBalanceInAsset
  );
  const vaultMaxDepositAmount = VaultMaxDeposit[vaultOption];
  const receiveVaultData = useVaultData(
    vaultActionForm.receiveVault || vaultOption
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
    if (vaultActionForm.vaultOption !== vaultOption) {
      setVaultActionForm({
        ...initialVaultActionForm,
        vaultOption,
      });
    }
  }, [vaultActionForm.vaultOption, setVaultActionForm, vaultOption]);

  const canTransfer = useMemo(() => {
    switch (vaultOption) {
      case "rUSDC-ETH-P-THETA":
        return true;
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

  /**
   * Handle user changing action type
   * Action type: deposit, withdraw
   */
  const handleActionTypeChange = useCallback(
    (
      actionType: ActionType,
      vaultVersion: VaultVersion = VaultVersionList[0],
      {
        withdrawOption,
      }: {
        withdrawOption?: V2WithdrawOption;
      } = {}
    ) => {
      // Do nothing if changing to the same action type
      setVaultActionForm((actionForm) => {
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
          // @ts-ignore
          case ACTIONS.withdraw:
            /**
             * Only catch v2 vault and set default withdraw option if not provided
             */
            if (vaultVersion === "v2") {
              return {
                ...actionForm,
                vaultVersion,
                inputAmount: "",
                actionType,
                withdrawOption: withdrawOption || V2WithdrawOptionList[0],
              };
            }
          // eslint-disable-next-line no-fallthrough
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
    [setVaultActionForm, vaultOption]
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
              const gasLimit = GAS_LIMITS[vaultOption].v1.deposit;
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
              const total = BigNumber.from(userAssetBalance);
              // TODO: Optimize the code to request gas fees only when needed
              const maxAmount = isETHVault(vaultOption)
                ? total.sub(gasFee)
                : total;
              const allowedMaxAmount = maxAmount.lte(
                vaultMaxDepositAmount.sub(v2VaultBalanceInAsset)
              )
                ? maxAmount
                : vaultMaxDepositAmount.sub(v2VaultBalanceInAsset);
              const userMaxAmount = allowedMaxAmount.isNegative()
                ? BigNumber.from("0")
                : allowedMaxAmount;

              // Fringe case: if amt of deposit greater than vault limit, return 0
              const vaultAvailableBalance = v2TotalBalance.gt(v2Cap)
                ? BigNumber.from("0")
                : v2Cap.sub(v2TotalBalance);

              // Check if max is vault availableBalance
              const finalMaxAmount = userMaxAmount.gt(vaultAvailableBalance)
                ? vaultAvailableBalance
                : userMaxAmount;
              return {
                ...actionForm,
                inputAmount: formatUnits(finalMaxAmount, decimals),
              };
            case ACTIONS.withdraw:
              switch (actionForm.withdrawOption) {
                case "instant":
                  return {
                    ...actionForm,
                    inputAmount: formatUnits(v2DepositBalanceInAsset, decimals),
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
    decimals,
    deposits,
    gasPrice,
    maxWithdrawAmount,
    setVaultActionForm,
    transferData,
    userAssetBalance,
    v2Cap,
    v2DepositBalanceInAsset,
    v2LockedBalanceInAsset,
    v2TotalBalance,
    v2VaultBalanceInAsset,
    vaultBalanceInAsset,
    vaultLimit,
    vaultMaxDepositAmount,
    vaultOption,
  ]);

  return {
    canTransfer,
    handleActionTypeChange,
    handleInputChange,
    handleMaxClick,
    resetActionForm,
    transferData,
    vaultActionForm,
  };
};

export default useVaultActionForm;
