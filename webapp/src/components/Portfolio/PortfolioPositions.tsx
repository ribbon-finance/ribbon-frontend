import React, { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";
import styled from "styled-components";

import { SecondaryText, Subtitle, Title } from "../../designSystem";
import colors from "../../designSystem/colors";
import theme from "../../designSystem/theme";
import useAssetPrice from "../../hooks/useAssetPrice";
import useTextAnimation from "../../hooks/useTextAnimation";
import { CurrencyType } from "../../pages/Portfolio/types";
import { ethToUSD, toETH } from "../../utils/math";
import useVaultData from "../../hooks/useVaultData";
import { ProductType } from "../Product/types";

const PortfolioPositionsContainer = styled.div`
  margin-top: 48px;
  display: flex;
  flex-wrap: wrap;
`;

const SectionTitle = styled(Title)`
  width: 100%;
  font-size: 18px;
  line-height: 24px;
  margin-bottom: 24px;
`;

const SectionPlaceholderText = styled(SecondaryText)`
  font-size: 16px;
  line-height: 24px;
`;

const PositionContainer = styled.div`
  width: 100%;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: ${theme.border.radius};
  margin-bottom: 18px;
  padding: 16px;
  display: flex;
  flex-wrap: wrap;
`;

const PositionInfoRow = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 4px;

  &:last-child {
    margin-bottom: 0px;
  }
`;

const PositionSymbolTitle = styled(Title)<{ product: ProductType }>`
  color: ${(props) => colors.products[props.product]};
`;

const PositionInfoText = styled(SecondaryText)`
  color: ${colors.primaryText}A3;
  font-size: 12px;
  line-height: 16px;
  font-weight: 400;
`;

const PositionSecondaryInfoText = styled(Subtitle)`
  color: ${colors.primaryText}A3;
  letter-spacing: unset;
  line-height: 16px;
`;

const PortfolioPositions = () => {
  const { active } = useWeb3React();
  const { status, vaultBalanceInAsset } = useVaultData();
  const isLoading = status === "loading";
  const animatedLoadingText = useTextAnimation(
    ["Loading", "Loading .", "Loading ..", "Loading ..."],
    250,
    isLoading
  );
  const ethPrice = useAssetPrice({});

  const renderAmountText = useCallback(
    (amount: BigNumber, currency: CurrencyType) => {
      switch (currency) {
        case "usd":
          return `${ethToUSD(amount, ethPrice)}`;
        case "eth":
          return `${toETH(amount)} ETH`;
      }
    },
    [ethPrice]
  );

  const renderPositions = useCallback(() => {
    if (!active) {
      return <SectionPlaceholderText>---</SectionPlaceholderText>;
    }

    if (isLoading) {
      return (
        <SectionPlaceholderText>{animatedLoadingText}</SectionPlaceholderText>
      );
    }

    if (vaultBalanceInAsset.isZero()) {
      return (
        <SectionPlaceholderText>
          You have no outstanding positions
        </SectionPlaceholderText>
      );
    }

    return (
      <PositionContainer>
        <PositionInfoRow>
          <PositionSymbolTitle product="yield" className="flex-grow-1">
            T-100-E
          </PositionSymbolTitle>
          <Title>{renderAmountText(vaultBalanceInAsset, "eth")}</Title>
        </PositionInfoRow>
        <PositionInfoRow>
          <PositionInfoText className="flex-grow-1">
            Theta Vault - ETH
          </PositionInfoText>
          <PositionSecondaryInfoText>
            {renderAmountText(vaultBalanceInAsset, "usd")}
          </PositionSecondaryInfoText>
        </PositionInfoRow>
      </PositionContainer>
    );
  }, [
    active,
    isLoading,
    animatedLoadingText,
    vaultBalanceInAsset,
    renderAmountText,
  ]);

  return (
    <PortfolioPositionsContainer>
      <SectionTitle>Positions</SectionTitle>
      {renderPositions()}
    </PortfolioPositionsContainer>
  );
};

export default PortfolioPositions;
