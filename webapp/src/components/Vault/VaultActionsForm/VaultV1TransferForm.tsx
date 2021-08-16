import React from "react";
import styled from "styled-components";
import { BigNumber } from "ethers";

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
import { formatBigNumber } from "shared/lib/utils/math";
import HelpInfo from "../../Common/HelpInfo";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import { VaultActionFormTransferData } from "../../../hooks/useVaultActionForm";

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
  receiveVault: VaultOptions;
  transferVaultData: {
    vaultBalanceInAsset: BigNumber;
    maxWithdrawAmount: BigNumber;
    vaultMaxWithdrawAmount: BigNumber;
  };
  transferData: VaultActionFormTransferData;
  inputAmount: string;
  handleInputChange: (input: React.ChangeEvent<HTMLInputElement>) => void;
  handleMaxClick: () => void;
  actionButton: JSX.Element;
}

const VaultV1TransferForm: React.FC<VaultV1TransferFormProps> = ({
  vaultOption,
  receiveVault,
  transferVaultData,
  transferData,
  inputAmount,
  handleInputChange,
  handleMaxClick,
  actionButton,
}) => {
  const AssetLogo = getAssetLogo(getAssets(receiveVault));
  const asset = getAssets(vaultOption);
  const decimals = getAssetDecimals(asset);
  const assetDisplay = getAssetDisplay(asset);

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
                Object.values(VaultNameOptionMap).indexOf(receiveVault)
              ]
            }
          </TransferToVaultTitle>
          <SecondaryText>
            Available Capacity ({assetDisplay}):{" "}
            {transferData
              ? formatBigNumber(transferData.availableCapacity, 2, decimals)
              : "---"}
          </SecondaryText>
        </div>
      </TransferToVault>

      {/* Amount Input */}
      <BaseInputLabel className="mt-4">AMOUNT ({assetDisplay})</BaseInputLabel>
      <BaseInputContainer className="position-relative">
        <BaseInput
          type="number"
          className="form-control"
          aria-label="ETH"
          placeholder="0"
          value={inputAmount}
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
        <InfoData>
          {transferData
            ? formatBigNumber(transferData.availableLimit, 2, decimals)
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
            2,
            decimals
          )} ${assetDisplay} before the vault hits its weekly transfer and withdrawal limit (10% of the funds in the vault).`}
          renderContent={({ ref, ...triggerHandler }) => (
            <HelpInfo containerRef={ref} {...triggerHandler}>
              i
            </HelpInfo>
          )}
        />
        <InfoData>
          {formatBigNumber(
            transferVaultData.vaultMaxWithdrawAmount,
            2,
            decimals
          )}{" "}
          {assetDisplay}
        </InfoData>
      </div>

      {/* Button */}
      {actionButton}
    </>
  );
};

export default VaultV1TransferForm;
