import React, { useCallback } from "react";
import { BigNumber } from "ethers";
import styled from "styled-components";
import currency from "currency.js";

import {
  BaseInputContainer,
  BaseInputLabel,
  BaseModalContentColumn,
  SecondaryText,
  Title,
} from "shared/lib/designSystem";
import { ActionButton } from "shared/lib/components/Common/buttons";
import colors from "shared/lib/designSystem/colors";
import { useLBPGlobalState } from "../../store/store";
import Logo from "shared/lib/assets/icons/logo";
import { USDCLogo } from "shared/lib/assets/icons/erc20Assets";
import {
  ERC20Token,
  getERC20TokenDecimals,
  getERC20TokenDisplay,
} from "shared/lib/models/eth";
import { formatBigNumber } from "shared/lib/utils/math";
import useLBPPoolData from "../../hooks/useLBPPoolData";
import { useMemo } from "react";
import { formatEther, formatUnits } from "ethers/lib/utils";

const PrimaryInputLabel = styled(BaseInputLabel)`
  font-family: VCR;
  letter-spacing: 1px;
`;

const UnitText = styled(Title)`
  color: ${colors.text};
`;

const InfoColumn = styled(BaseModalContentColumn)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

interface TokenSwapPreviewProps {
  swapAmount: BigNumber;
  receiveAmount: BigNumber;
  handleSwap: () => void;
}

const TokenSwapPreview: React.FC<TokenSwapPreviewProps> = ({
  swapAmount,
  receiveAmount,
  handleSwap,
}) => {
  const [swapModal] = useLBPGlobalState("swapModal");
  const { data: poolData } = useLBPPoolData();

  const [rbnPrice, totalSwapFees] = useMemo(() => {
    const swapNumber = parseFloat(
      formatUnits(swapAmount, getERC20TokenDecimals(swapModal.offerToken))
    );
    const receiveNumber = parseFloat(
      formatUnits(receiveAmount, getERC20TokenDecimals(swapModal.receiveToken))
    );

    let rbnPrice = 0;
    let swapFees = undefined;

    /** Calculate rbn price */
    switch (swapModal.offerToken) {
      case "usdc":
        rbnPrice = swapNumber / receiveNumber;
        break;
      default:
        rbnPrice = receiveNumber / swapNumber;
    }

    /** Calculate swap fees */
    if (poolData) {
      const feesPercentage = parseFloat(formatEther(poolData.swapFees));
      switch (swapModal.offerToken) {
        case "usdc":
          swapFees = swapNumber * feesPercentage;
          break;
        default:
          swapFees = receiveNumber * feesPercentage;
      }
    }

    return [rbnPrice, swapFees];
  }, [
    poolData,
    receiveAmount,
    swapAmount,
    swapModal.offerToken,
    swapModal.receiveToken,
  ]);

  const renderAssetLogo = useCallback((asset: ERC20Token) => {
    switch (asset) {
      case "rbn":
        return <Logo height={40} width={40} />;
      case "usdc":
        return <USDCLogo height={40} width={40} />;
      default:
        return <></>;
    }
  }, []);

  const renderAmount = useCallback((amount: BigNumber, asset: ERC20Token) => {
    switch (asset) {
      case "usdc":
        return formatBigNumber(amount, 2, getERC20TokenDecimals(asset));
      default:
        return formatBigNumber(amount, 6, getERC20TokenDecimals(asset));
    }
  }, []);

  return (
    <>
      {/* Title */}
      <BaseModalContentColumn marginTop={8}>
        <Title>SWAP PREVIEW</Title>
      </BaseModalContentColumn>

      {/* Pay preview */}
      <BaseModalContentColumn marginTop={24 + 16}>
        <div className="d-flex w-100 flex-wrap">
          <PrimaryInputLabel>YOU PAY</PrimaryInputLabel>
          <BaseInputContainer>
            <div className="d-flex w-100 h-100 align-items-center pl-2">
              {renderAssetLogo(swapModal.offerToken)}
              <Title className="px-2">
                {renderAmount(swapAmount, swapModal.offerToken)}
              </Title>
              <UnitText>{getERC20TokenDisplay(swapModal.offerToken)}</UnitText>
            </div>
          </BaseInputContainer>
        </div>
      </BaseModalContentColumn>

      {/* Receive preview */}
      <BaseModalContentColumn>
        <div className="d-flex w-100 flex-wrap">
          <PrimaryInputLabel>YOU RECEIVE</PrimaryInputLabel>
          <BaseInputContainer>
            <div className="d-flex w-100 h-100 align-items-center pl-2">
              {renderAssetLogo(swapModal.receiveToken)}
              <Title className="px-2">
                {renderAmount(receiveAmount, swapModal.receiveToken)}
              </Title>
              <UnitText>
                {getERC20TokenDisplay(swapModal.receiveToken)}
              </UnitText>
            </div>
          </BaseInputContainer>
        </div>
      </BaseModalContentColumn>

      {/* Swap Info */}
      <InfoColumn>
        <SecondaryText>RBN Price</SecondaryText>
        <Title>{currency(rbnPrice).format()}</Title>
      </InfoColumn>
      <InfoColumn>
        <SecondaryText>
          Swap Fee{" "}
          {poolData
            ? `(${parseFloat(formatEther(poolData.swapFees)) * 100}%)`
            : ``}
        </SecondaryText>
        <Title>
          {totalSwapFees ? currency(totalSwapFees).format() : `---`}
        </Title>
      </InfoColumn>

      {/* Button */}
      <BaseModalContentColumn marginTop="auto" className="pb-2">
        <ActionButton
          className="py-3"
          color={colors.products.yield}
          onClick={handleSwap}
        >
          SWAP TOKENS
        </ActionButton>
      </BaseModalContentColumn>
    </>
  );
};

export default TokenSwapPreview;
