import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { useWeb3React } from "@web3-react/core";

import {
  getAssetDecimals,
  getAssetDisplay,
  getAssetLogo,
} from "shared/lib/utils/asset";
import {
  BaseInput,
  BaseInputButton,
  BaseInputContainer,
  BaseInputLabel,
  SecondaryText,
  Title,
} from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import {
  getAssets,
  VaultNameOptionMap,
  VaultOptions,
} from "shared/lib/constants/constants";
import { formatBigNumber, isPracticallyZero } from "shared/lib/utils/math";
import HelpInfo from "../../../Common/HelpInfo";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import useVaultActionForm from "../../../../hooks/useVaultActionForm";
import { VaultAccount } from "shared/lib/models/vault";
import {
  ActionButton,
  ConnectWalletButton,
} from "shared/lib/components/Common/buttons";
import useConnectWalletModal from "shared/lib/hooks/useConnectWalletModal";
import { getVaultColor } from "shared/lib/utils/vault";

const TransferToVault = styled.div`
  display: flex;
  background: ${colors.primaryText}0a;
  border-radius: ${theme.border.radiusSmall};
  padding: 8px;
`;

const TransferToVaultTitle = styled(Title)`
  text-transform: none;
`;

const TransferToVaultCapacity = styled(SecondaryText)`
  font-size: 12px;
`;

const TransferToVaultLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
`;

const InfoData = styled(Title)`
  font-size: 14px;
  line-height: 24px;
  margin-left: auto;
`;

interface VaultV1TransferFormProps {
  vaultOption: VaultOptions;
  vaultAccount?: VaultAccount;
  transferVaultData: {
    maxWithdrawAmount: BigNumber;
    vaultMaxWithdrawAmount: BigNumber;
  };
  actionButtonText: string;
  onFormSubmit: () => void;
}

const VaultV1TransferForm: React.FC<VaultV1TransferFormProps> = ({
  vaultOption,
  vaultAccount,
  transferVaultData,
  actionButtonText,
  onFormSubmit,
}) => {
  const asset = getAssets(vaultOption);
  const decimals = getAssetDecimals(asset);
  const assetDisplay = getAssetDisplay(asset);
  const color = getVaultColor(vaultOption);

  const { handleInputChange, handleMaxClick, vaultActionForm, transferData } =
    useVaultActionForm(vaultOption);
  const { active } = useWeb3React();
  const [, setShowConnectModal] = useConnectWalletModal();

  const isInputNonZero = parseFloat(vaultActionForm.inputAmount) > 0;
  const AssetLogo = getAssetLogo(getAssets(vaultActionForm.receiveVault!));

  const availableLimit = useMemo(() => {
    return vaultAccount
      ? vaultAccount.totalBalance.sub(vaultAccount.totalStakedBalance)
      : BigNumber.from(0);
  }, [vaultAccount]);

  const error = useMemo(() => {
    if (!isInputNonZero || !transferData) {
      return undefined;
    }

    const inputBigNumber = parseUnits(vaultActionForm.inputAmount, decimals);

    /** Check bigger than available limit */
    if (inputBigNumber.gt(availableLimit)) {
      return "insufficientLimit";
    }

    /** Check target vault capacity */
    if (inputBigNumber.gt(transferData.availableCapacity)) {
      return "insufficientCapacity";
    }

    /**
     * Check if exceed weekly transfer limit
     */
    if (inputBigNumber.gt(transferVaultData.vaultMaxWithdrawAmount)) {
      return "insufficientWeeklyLimit";
    }

    return undefined;
  }, [
    availableLimit,
    decimals,
    isInputNonZero,
    transferData,
    transferVaultData,
    vaultActionForm,
  ]);

  const isZeroCapacity = useMemo(() => {
    return (
      transferData &&
      isPracticallyZero(transferData.availableCapacity, decimals)
    );
  }, [decimals, transferData]);

  const isZeroAvailableLimit = useMemo(() => {
    return vaultAccount && isPracticallyZero(availableLimit, decimals);
  }, [availableLimit, decimals, vaultAccount]);

  const renderActionButton = useCallback(
    (error: string | undefined) => {
      if (active) {
        return (
          <ActionButton
            disabled={Boolean(error) || !isInputNonZero}
            onClick={onFormSubmit}
            className="py-3"
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
    },
    [
      active,
      actionButtonText,
      color,
      isInputNonZero,
      onFormSubmit,
      setShowConnectModal,
    ]
  );

  return (
    <>
      {/* To vault */}
      <BaseInputLabel>TRANSFER TO</BaseInputLabel>
      <TransferToVault className="mt-2">
        <TransferToVaultLogo>
          <AssetLogo />
        </TransferToVaultLogo>
        <div className="d-flex flex-column justify-content-center ml-2">
          <TransferToVaultTitle>
            {
              Object.keys(VaultNameOptionMap)[
                Object.values(VaultNameOptionMap).indexOf(
                  vaultActionForm.receiveVault!
                )
              ]
            }
          </TransferToVaultTitle>
          <TransferToVaultCapacity
            color={
              isZeroCapacity || error === "insufficientCapacity"
                ? colors.red
                : undefined
            }
          >
            Available Capacity ({assetDisplay}):{" "}
            {transferData
              ? formatBigNumber(transferData.availableCapacity, decimals)
              : "---"}
          </TransferToVaultCapacity>
        </div>
      </TransferToVault>

      {/* Amount Input */}
      <BaseInputLabel className="mt-4">AMOUNT ({assetDisplay})</BaseInputLabel>
      <BaseInputContainer className="position-relative" error={Boolean(error)}>
        <BaseInput
          type="number"
          className="form-control"
          aria-label="ETH"
          placeholder="0"
          value={vaultActionForm.inputAmount}
          onChange={handleInputChange}
        />
        <BaseInputButton onClick={handleMaxClick}>MAX</BaseInputButton>
      </BaseInputContainer>

      {/* Extra information */}
      <div className="d-flex align-items-center mt-4">
        <SecondaryText>Available Limit</SecondaryText>
        <TooltipExplanation
          title="AVAILABLE LIMIT"
          explanation={`This is equal to the value of your deposits minus the funds you have staked in the ${vaultOption} staking pool.`}
          renderContent={({ ref, ...triggerHandler }) => (
            <HelpInfo containerRef={ref} {...triggerHandler}>
              i
            </HelpInfo>
          )}
        />
        <InfoData
          color={
            isZeroAvailableLimit || error === "insufficientLimit"
              ? colors.red
              : undefined
          }
        >
          {vaultAccount ? formatBigNumber(availableLimit, decimals) : "---"}{" "}
          {assetDisplay}
        </InfoData>
      </div>
      <div className="d-flex align-items-center mt-3 mb-4">
        <SecondaryText>Weekly Transfer Limit</SecondaryText>
        <TooltipExplanation
          title="AVAILABLE LIMIT"
          explanation={`You can withdraw up to ${formatBigNumber(
            transferVaultData.vaultMaxWithdrawAmount,
            decimals
          )} ${assetDisplay} before the vault hits its weekly transfer and withdrawal limit (10% of the funds in the vault).`}
          renderContent={({ ref, ...triggerHandler }) => (
            <HelpInfo containerRef={ref} {...triggerHandler}>
              i
            </HelpInfo>
          )}
        />
        <InfoData
          color={error === "insufficientWeeklyLimit" ? colors.red : undefined}
        >
          {formatBigNumber(transferVaultData.vaultMaxWithdrawAmount, decimals)}{" "}
          {assetDisplay}
        </InfoData>
      </div>

      {/* Button */}
      {renderActionButton(error)}

      {/* Error message */}
      {isZeroAvailableLimit &&
        !isPracticallyZero(vaultAccount!.totalBalance, decimals) && (
          <SecondaryText className="d-flex mt-3 text-center" color={colors.red}>
            You have staked all your {vaultOption} tokens. You must unstake your
            {vaultOption} tokens before you can withdraw from the vault
          </SecondaryText>
        )}
    </>
  );
};

export default VaultV1TransferForm;
