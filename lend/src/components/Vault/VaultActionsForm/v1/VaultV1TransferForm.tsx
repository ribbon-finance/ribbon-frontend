import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { useWeb3Wallet } from "shared/lib/hooks/useWeb3Wallet";

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
import HelpInfo from "shared/lib/components/Common/HelpInfo";
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
    vaultBalanceInAsset: BigNumber;
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
  const { active } = useWeb3Wallet();
  const [, setShowConnectModal] = useConnectWalletModal();

  const isInputNonZero = parseFloat(vaultActionForm.inputAmount) > 0;
  const AssetLogo = getAssetLogo(getAssets(vaultActionForm.receiveVault!));

  const error = useMemo(() => {
    if (!active || !isInputNonZero || !transferData) {
      return undefined;
    }

    const inputBigNumber = parseUnits(vaultActionForm.inputAmount, decimals);

    /** Check bigger than available limit */
    if (inputBigNumber.gt(transferVaultData.vaultBalanceInAsset)) {
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
    active,
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
    return (
      active &&
      isPracticallyZero(transferVaultData.vaultBalanceInAsset, decimals)
    );
  }, [active, decimals, transferVaultData]);

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
          <SecondaryText
            fontSize={12}
            color={
              active && (isZeroCapacity || error === "insufficientCapacity")
                ? colors.red
                : undefined
            }
          >
            Available Capacity ({assetDisplay}):{" "}
            {transferData
              ? formatBigNumber(transferData.availableCapacity, decimals)
              : "---"}
          </SecondaryText>
        </div>
      </TransferToVault>

      {/* Amount Input */}
      <BaseInputLabel className="mt-4">AMOUNT ({assetDisplay})</BaseInputLabel>
      <BaseInputContainer error={Boolean(error)}>
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
          {active
            ? formatBigNumber(transferVaultData.vaultBalanceInAsset, decimals)
            : "---"}{" "}
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
        vaultAccount &&
        !isPracticallyZero(vaultAccount.totalStakedBalance, decimals) && (
          <SecondaryText className="d-flex mt-3 text-center" color={colors.red}>
            You have staked all your {vaultOption} tokens. You must unstake your
            {vaultOption} tokens before you can withdraw from the vault
          </SecondaryText>
        )}
    </>
  );
};

export default VaultV1TransferForm;
