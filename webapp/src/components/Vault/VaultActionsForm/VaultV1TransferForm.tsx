import React from "react";
import styled from "styled-components";

import { getAssetDisplay, getAssetLogo } from "shared/lib/utils/asset";
import {
  BaseInput,
  BaseInputButton,
  BaseInputContianer,
  BaseInputLabel,
  SecondaryText,
  Title,
} from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import { useMemo } from "react";
import { getAssets, VaultOptions } from "shared/lib/constants/constants";
import useVaultData from "shared/lib/hooks/useVaultData";
import { formatBigNumber } from "shared/lib/utils/math";
import { BigNumber } from "ethers";

const TransferToVault = styled.div`
  display: flex;
  background: ${colors.primaryText}0a;
  border-radius: ${theme.border.radiusSmall};
  padding: 8px;
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
  transferVaultData: {
    vaultBalanceInAsset: BigNumber;
    maxWithdrawAmount: BigNumber;
    vaultMaxWithdrawAmount: BigNumber;
  };
  inputAmount: string;
  handleInputChange: (input: React.ChangeEvent<HTMLInputElement>) => void;
  handleMaxClick: () => void;
  actionButton: JSX.Element;
}

const VaultV1TransferForm: React.FC<VaultV1TransferFormProps> = ({
  transferVaultData,
  inputAmount,
  handleInputChange,
  handleMaxClick,
  actionButton,
}) => {
  /**
   * We return yvUSDC as we assume the transfer is always done from USDC vault
   */
  const transferVault = useMemo((): VaultOptions => {
    return "ryvUSDC-ETH-P-THETA";
  }, []);

  const AssetLogo = getAssetLogo(getAssets(transferVault));
  const { deposits, vaultLimit, asset, decimals } = useVaultData(transferVault);

  /**
   * Calculate available limit to transfer for user
   */
  const availableLimit = useMemo(() => {
    return vaultLimit.sub(deposits);
  }, [deposits, vaultLimit]);

  return (
    <>
      {/* To vault */}
      <BaseInputLabel>TRANSFER TO</BaseInputLabel>
      <TransferToVault className="mt-2">
        <TransferToVaultLogo>
          <AssetLogo />
        </TransferToVaultLogo>
        <div className="d-flex flex-column justify-content-center ml-2">
          <Title>T-yvUSDC-P-ETH</Title>
          <SecondaryText>
            Available Capacity ({getAssetDisplay(asset)}):{" "}
            {formatBigNumber(vaultLimit.sub(deposits), 2, decimals)}
          </SecondaryText>
        </div>
      </TransferToVault>

      {/* Amount Input */}
      <BaseInputLabel className="mt-4">
        AMOUNT ({getAssetDisplay(asset)})
      </BaseInputLabel>
      <BaseInputContianer className="position-relative">
        <BaseInput
          type="number"
          className="form-control"
          aria-label="ETH"
          placeholder="0"
          value={inputAmount}
          onChange={handleInputChange}
        />
        <BaseInputButton onClick={handleMaxClick}>MAX</BaseInputButton>
      </BaseInputContianer>

      {/* Extra information */}
      <div className="d-flex align-items-center mt-4">
        <SecondaryText>Available Limit</SecondaryText>
        <InfoData>
          {formatBigNumber(availableLimit, 2, decimals)}{" "}
          {getAssetDisplay(asset)}
        </InfoData>
      </div>
      <div className="d-flex align-items-center mt-3 mb-4">
        <SecondaryText>Weekly Transfer Limit</SecondaryText>
        <InfoData>
          {formatBigNumber(
            transferVaultData.vaultMaxWithdrawAmount,
            2,
            decimals
          )}{" "}
          {getAssetDisplay(asset)}
        </InfoData>
      </div>

      {/* Button */}
      {actionButton}
    </>
  );
};

export default VaultV1TransferForm;
