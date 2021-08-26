import React, { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";

import {
  BaseInput,
  BaseInputButton,
  BaseInputContainer,
  BaseInputLabel,
} from "shared/lib/designSystem";
import {
  ActionButton,
  ConnectWalletButton,
} from "shared/lib/components/Common/buttons";
import { getAssetDisplay } from "shared/lib/utils/asset";
import useVaultActionForm from "../../../../hooks/useVaultActionForm";
import { getAssets, VaultOptions } from "shared/lib/constants/constants";
import { ACTIONS } from "../Modal/types";
import { getVaultColor } from "shared/lib/utils/vault";
import useConnectWalletModal from "shared/lib/hooks/useConnectWalletModal";

interface VaultBasicAmountFormProps {
  vaultOption: VaultOptions;
  error: boolean;
  onFormSubmit: () => void;
  actionButtonText: string;
}

const VaultBasicAmountForm: React.FC<VaultBasicAmountFormProps> = ({
  vaultOption,
  error,
  onFormSubmit,
  actionButtonText,
}) => {
  const asset = getAssets(vaultOption);
  const color = getVaultColor(vaultOption);

  const { handleInputChange, handleMaxClick, vaultActionForm } =
    useVaultActionForm(vaultOption);
  const { active } = useWeb3React();
  const [, setShowConnectModal] = useConnectWalletModal();

  const isInputNonZero = parseFloat(vaultActionForm.inputAmount) > 0;

  const renderButton = useCallback(() => {
    if (active) {
      return (
        <ActionButton
          disabled={error || !isInputNonZero}
          onClick={onFormSubmit}
          className={`py-3 ${
            vaultActionForm.actionType !== ACTIONS.transfer ? "mb-4" : ""
          }`}
          color={color}
        >
          {actionButtonText}
        </ActionButton>
      );
    }

    return (
      <ConnectWalletButton
        onClick={() => setShowConnectModal(true)}
        type="button"
        className="btn py-3 mb-4"
      >
        Connect Wallet
      </ConnectWalletButton>
    );
  }, [
    active,
    actionButtonText,
    color,
    error,
    isInputNonZero,
    onFormSubmit,
    setShowConnectModal,
    vaultActionForm,
  ]);

  return (
    <>
      <BaseInputLabel>AMOUNT ({getAssetDisplay(asset)})</BaseInputLabel>
      <BaseInputContainer className="position-relative mb-5">
        <BaseInput
          type="number"
          className="form-control"
          aria-label="ETH"
          placeholder="0"
          value={vaultActionForm.inputAmount}
          onChange={handleInputChange}
        />
        {active && (
          <BaseInputButton onClick={handleMaxClick}>MAX</BaseInputButton>
        )}
      </BaseInputContainer>
      {renderButton()}
    </>
  );
};

export default VaultBasicAmountForm;
