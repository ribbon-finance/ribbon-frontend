import { useCallback, useEffect } from "react";
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
  } = useVaultData(vaultOption);
  const vaultMaxDepositAmount = VaultMaxDeposit[vaultOption];

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

      setVaultActionForm({
        inputAmount: "",
        actionType,
      });
    },
    [setVaultActionForm, vaultActionForm.actionType]
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
    }
  }, [
    decimals,
    deposits,
    gasPrice,
    maxWithdrawAmount,
    setVaultActionForm,
    userAssetBalance,
    vaultActionForm,
    vaultBalanceInAsset,
    vaultLimit,
    vaultMaxDepositAmount,
    vaultOption,
  ]);

  return {
    handleActionTypeChange,
    handleInputChange,
    handleMaxClick,
    vaultActionForm,
    resetActionForm,
  };
};

export default useVaultActionForm;
