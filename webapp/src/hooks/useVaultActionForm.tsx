import { useCallback, useEffect, useMemo } from "react";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";

import {
  GAS_LIMITS,
  VaultMaxDeposit,
  VaultOptions,
} from "shared/lib/constants/constants";
import {
  ACTIONS,
  ActionType,
} from "../components/Vault/VaultActionsForm/Modal/types";
import { initialVaultActionForm, useWebappGlobalState } from "../store/store";
import useGasPrice from "shared/lib/hooks/useGasPrice";
import useVaultData from "shared/lib/hooks/useVaultData";
import { isETHVault } from "shared/lib/utils/vault";

export type VaultActionFormTransferData =
  | {
      availableCapacity: BigNumber;
      availableLimit: BigNumber;
    }
  | undefined;

const useVaultActionForm = (vaultOption: VaultOptions) => {
  const [vaultActionForm, setVaultActionForm] =
    useWebappGlobalState("vaultActionForm");
  const gasPrice = useGasPrice();
  const {
    userAssetBalance,
    deposits,
    vaultLimit,
    vaultBalanceInAsset,
    maxWithdrawAmount,
    decimals,
    vaultMaxWithdrawAmount,
  } = useVaultData(vaultOption);
  const vaultMaxDepositAmount = VaultMaxDeposit[vaultOption];
  const receiveVaultData = useVaultData(
    vaultActionForm.vaultOption || vaultOption
  );

  /**
   * Utility for reset action form
   */
  const resetActionForm = useCallback(() => {
    setVaultActionForm({
      ...initialVaultActionForm,
      vaultOption,
    });
  }, [vaultOption, setVaultActionForm]);

  /**
   * Reset form when vault option changes
   */
  useEffect(() => {
    resetActionForm();
  }, [vaultOption, resetActionForm]);

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

    const availableCapacity = receiveVaultData.vaultLimit.sub(
      receiveVaultData.deposits
    );

    return {
      availableCapacity,
      availableLimit: vaultMaxWithdrawAmount.lte(availableCapacity)
        ? vaultMaxWithdrawAmount
        : availableCapacity,
    };
  }, [
    canTransfer,
    receiveVaultData,
    vaultActionForm.actionType,
    vaultMaxWithdrawAmount,
  ]);

  /**
   * Handle user changing action type
   * Action type: deposit, withdraw
   */
  const handleActionTypeChange = useCallback(
    (actionType: ActionType) => {
      // Do nothing if changing to the same action type
      if (actionType === vaultActionForm.actionType) {
        return;
      }

      switch (actionType) {
        case ACTIONS.transfer:
          switch (vaultOption) {
            case "rUSDC-ETH-P-THETA":
              setVaultActionForm((vaultActionForm) => ({
                ...vaultActionForm,
                actionType: ACTIONS.transfer,
                receiveVault: "ryvUSDC-ETH-P-THETA",
              }));
          }
          break;
        default:
          setVaultActionForm({
            inputAmount: "",
            actionType,
          });
      }
    },
    [setVaultActionForm, vaultActionForm.actionType, vaultOption]
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
    switch (vaultActionForm.actionType) {
      case ACTIONS.deposit:
        const gasLimit = GAS_LIMITS[vaultOption].deposit;
        const gasFee = BigNumber.from(gasLimit.toString()).mul(
          BigNumber.from(gasPrice || "0")
        );
        const total = BigNumber.from(userAssetBalance);
        // TODO: Optimize the code to request gas fees only when needed
        const maxAmount = isETHVault(vaultOption) ? total.sub(gasFee) : total;
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
        setVaultActionForm((actionForm) => ({
          ...actionForm,
          inputAmount: formatUnits(finalMaxAmount, decimals),
        }));
        break;
      case ACTIONS.withdraw:
        setVaultActionForm((actionForm) => ({
          ...actionForm,
          inputAmount: formatUnits(maxWithdrawAmount, decimals),
        }));
        break;
      case ACTIONS.transfer:
        setVaultActionForm((actionForm) => ({
          ...actionForm,
          inputAmount: transferData
            ? maxWithdrawAmount.lte(transferData.availableLimit)
              ? formatUnits(maxWithdrawAmount, decimals)
              : formatUnits(transferData.availableLimit, decimals)
            : "",
        }));
        break;
    }
  }, [
    decimals,
    deposits,
    gasPrice,
    maxWithdrawAmount,
    setVaultActionForm,
    transferData,
    userAssetBalance,
    vaultActionForm,
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
