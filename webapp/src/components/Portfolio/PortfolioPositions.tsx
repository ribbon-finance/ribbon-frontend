import React, { useCallback, useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, ethers } from "ethers";
import styled from "styled-components";

import { SecondaryText, Subtitle, Title } from "../../designSystem";
import colors from "../../designSystem/colors";
import theme from "../../designSystem/theme";
import useAssetPrice from "../../hooks/useAssetPrice";
import useTextAnimation from "../../hooks/useTextAnimation";
import { CurrencyType } from "../../pages/Portfolio/types";
import { ethToUSD, formatSignificantDecimals } from "../../utils/math";
import { ProductType } from "../Product/types";
import sizes from "../../designSystem/sizes";
import {
  VaultList,
  VaultNameOptionMap,
  VaultOptions,
} from "../../constants/constants";
import { productCopies } from "../Product/Product/productCopies";
import useVaultAccounts from "../../hooks/useVaultAccounts";
import { VaultAccount } from "../../models/vault";

const PortfolioPositionsContainer = styled.div`
  margin-top: 48px;
  display: flex;
  flex-wrap: wrap;
`;

const SectionTitle = styled(Title)`
  width: 100%;
  font-size: 18px;
  line-height: 24px;
`;

const SectionPlaceholderText = styled(SecondaryText)`
  font-size: 16px;
  line-height: 24px;
  margin-top: 24px;
`;

const PositionContainer = styled.div`
  width: 100%;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: ${theme.border.radius};
  margin-bottom: 18px;
  padding: 16px;
  display: flex;
  flex-wrap: wrap;
  position: relative;
  margin-top: 24px;
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

const PositionSecondaryInfoText = styled(Subtitle)<{ variant?: "green" }>`
  letter-spacing: unset;
  line-height: 16px;
  ${(props) => {
    switch (props.variant) {
      case "green":
        return `color: ${colors.green}`;
      default:
        return `color: ${colors.primaryText}A3;`;
    }
  }}
`;

const KPIContainer = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 16px;

  @media (max-width: ${sizes.sm}px) {
    display: none;
  }
`;

const KPIDatas = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
`;

interface PortfolioPositionProps {
  currency: CurrencyType;
  vaultAccount: VaultAccount;
}

const PortfolioPosition: React.FC<PortfolioPositionProps> = ({
  currency,
  vaultAccount,
}) => {
  const { price: ethPrice, loading: ethPriceLoading } = useAssetPrice({});
  const animatedLoadingText = useTextAnimation(
    ["Loading", "Loading .", "Loading ..", "Loading ..."],
    250,
    ethPriceLoading
  );

  const renderAmountText = useCallback(
    (amount: BigNumber, currency: CurrencyType) => {
      switch (currency) {
        case "usd":
          return ethPriceLoading
            ? animatedLoadingText
            : `${ethToUSD(amount, ethPrice)}`;
        case "eth":
          return `${formatSignificantDecimals(
            ethers.utils.formatEther(amount)
          )} ETH`;
      }
    },
    [ethPrice, animatedLoadingText, ethPriceLoading]
  );

  const calculatedROI = useMemo(
    () =>
      (parseFloat(ethers.utils.formatEther(vaultAccount.totalYieldEarned)) /
        parseFloat(ethers.utils.formatEther(vaultAccount.totalDeposits))) *
      100,
    [vaultAccount]
  );

  return (
    <PositionContainer>
      <PositionInfoRow>
        <PositionSymbolTitle product="yield" className="flex-grow-1">
          {
            Object.keys(VaultNameOptionMap)[
              Object.values(VaultNameOptionMap).indexOf(
                vaultAccount.vault.symbol
              )
            ]
          }
        </PositionSymbolTitle>
        <Title>
          {renderAmountText(
            vaultAccount.totalDeposits.add(vaultAccount.totalYieldEarned),
            currency
          )}
        </Title>
      </PositionInfoRow>
      <PositionInfoRow>
        <PositionInfoText className="flex-grow-1">
          {productCopies[vaultAccount.vault.symbol].subtitle}
        </PositionInfoText>
        <PositionSecondaryInfoText>
          {renderAmountText(
            vaultAccount.totalDeposits.add(vaultAccount.totalYieldEarned),
            currency === "eth" ? "usd" : "eth"
          )}
        </PositionSecondaryInfoText>
      </PositionInfoRow>
      <KPIContainer>
        <KPIDatas>
          <Title>
            +{renderAmountText(vaultAccount.totalYieldEarned, currency)}
          </Title>
          <PositionSecondaryInfoText variant="green">
            +{calculatedROI.toFixed(2)}%
          </PositionSecondaryInfoText>
        </KPIDatas>
      </KPIContainer>
    </PositionContainer>
  );
};

interface PortfolioPositionsProps {
  currency: CurrencyType;
}

const PortfolioPositions: React.FC<PortfolioPositionsProps> = ({
  currency,
}) => {
  const { active } = useWeb3React();
  const { vaultAccounts, loading } = useVaultAccounts(VaultList);
  const animatedLoadingText = useTextAnimation(
    ["Loading", "Loading .", "Loading ..", "Loading ..."],
    250,
    loading
  );

  const filteredVaultAccounts = useMemo(() => {
    return Object.fromEntries(
      Object.keys(vaultAccounts)
        .map((key) => [key, vaultAccounts[key]])
        .filter((item) => item[1])
    );
  }, [vaultAccounts]);

  return (
    <PortfolioPositionsContainer>
      <SectionTitle>Positions</SectionTitle>
      {active ? (
        <>
          {loading && (
            <SectionPlaceholderText>
              {animatedLoadingText}
            </SectionPlaceholderText>
          )}
          {Object.keys(filteredVaultAccounts).map((key) => (
            <PortfolioPosition
              key={key}
              currency={currency}
              vaultAccount={filteredVaultAccounts[key]}
            />
          ))}
          {!loading && Object.keys(filteredVaultAccounts).length <= 0 && (
            <SectionPlaceholderText>
              You have no outstanding positions
            </SectionPlaceholderText>
          )}
          {}
        </>
      ) : (
        <SectionPlaceholderText>---</SectionPlaceholderText>
      )}
    </PortfolioPositionsContainer>
  );
};

export default PortfolioPositions;
