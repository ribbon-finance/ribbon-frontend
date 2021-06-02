import React, { useCallback, useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, ethers } from "ethers";
import styled from "styled-components";

import {
  BaseLink,
  SecondaryText,
  Subtitle,
  Title,
} from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import useAssetPrice from "../../hooks/useAssetPrice";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";
import { CurrencyType } from "../../pages/Portfolio/types";
import { assetToUSD, formatBigNumber } from "shared/lib/utils/math";
import { ProductType } from "shared/lib/components/Product/types";
import sizes from "shared/lib/designSystem/sizes";
import {
  getAssets,
  VaultList,
  VaultNameOptionMap,
} from "shared/lib/constants/constants";
import { productCopies } from "shared/lib/components/Product/productCopies";
import useVaultAccounts from "../../hooks/useVaultAccounts";
import { VaultAccount } from "shared/lib/models/vault";
import { getAssetDecimals, getAssetDisplay } from "shared/lib/utils/asset";

const PortfolioPositionsContainer = styled.div`
  margin-top: 48px;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;

const SectionTitle = styled(Title)`
  font-size: 18px;
  line-height: 24px;
  margin-right: 16px;
  width: 100%;
`;

const SectionPlaceholderText = styled(SecondaryText)`
  font-size: 16px;
  line-height: 24px;
  margin-top: 24px;
`;

const PositionLink = styled(BaseLink)`
  width: 100%;
  margin-top: 16px;

  &:first-child {
    margin-top: 24px;
  }
`;

const PositionContainer = styled.div`
  width: 100%;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: ${theme.border.radius};
  padding: 16px;
  display: flex;
  flex-wrap: wrap;
  position: relative;
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

const PositionSecondaryInfoText = styled(Subtitle)<{
  variant?: "green" | "red";
}>`
  letter-spacing: unset;
  line-height: 16px;
  ${(props) => {
    switch (props.variant) {
      case "green":
        return `color: ${colors.green};`;
      case "red":
        return `color: ${colors.red};`;
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
  vaultAccount: VaultAccount;
}

const PortfolioPosition: React.FC<PortfolioPositionProps> = ({
  vaultAccount,
}) => {
  const asset = getAssets(vaultAccount.vault.symbol);
  const decimals = getAssetDecimals(asset);
  const { price: assetPrice, loading: assetPriceLoading } = useAssetPrice({
    asset: asset,
  });
  const animatedLoadingText = useTextAnimation(
    ["Loading", "Loading .", "Loading ..", "Loading ..."],
    250,
    assetPriceLoading
  );
  const vaultName =
    Object.keys(VaultNameOptionMap)[
      Object.values(VaultNameOptionMap).indexOf(vaultAccount.vault.symbol)
    ];
  const vaultNetProfit = vaultAccount.totalBalance.sub(
    vaultAccount.totalDeposits
  );

  const renderAmountText = useCallback(
    (amount: BigNumber, currency: CurrencyType) => {
      switch (currency) {
        case "usd":
          return assetPriceLoading
            ? animatedLoadingText
            : `${assetToUSD(amount, assetPrice, decimals)}`;
        case "eth":
          return `${formatBigNumber(amount, 6, decimals)} ${getAssetDisplay(
            asset
          )}`;
      }
    },
    [asset, assetPrice, animatedLoadingText, assetPriceLoading, decimals]
  );

  const calculatedROI = useMemo(() => {
    const netProfit = vaultAccount.totalBalance.sub(vaultAccount.totalDeposits);

    return !vaultAccount.totalBalance.isZero()
      ? (parseFloat(ethers.utils.formatUnits(netProfit, decimals)) /
          parseFloat(
            ethers.utils.formatUnits(vaultAccount.totalDeposits, decimals)
          )) *
          100
      : 0;
  }, [vaultAccount, decimals]);

  return (
    <PositionLink to={`/theta-vault/${vaultName}`}>
      <PositionContainer>
        <PositionInfoRow>
          <PositionSymbolTitle product="yield" className="flex-grow-1">
            {vaultName}
          </PositionSymbolTitle>
          <Title>{renderAmountText(vaultAccount.totalBalance, "eth")}</Title>
        </PositionInfoRow>
        <PositionInfoRow>
          <PositionInfoText className="flex-grow-1">
            {productCopies[vaultAccount.vault.symbol].subtitle}
          </PositionInfoText>
          <PositionSecondaryInfoText>
            {renderAmountText(vaultAccount.totalBalance, "usd")}
          </PositionSecondaryInfoText>
        </PositionInfoRow>
        <KPIContainer>
          <KPIDatas>
            <Title>
              {vaultNetProfit.isNegative() ? "" : "+"}
              {renderAmountText(vaultNetProfit, "usd")}
            </Title>
            <PositionSecondaryInfoText
              variant={calculatedROI >= 0 ? "green" : "red"}
            >
              {calculatedROI >= 0 ? "+" : ""}
              {calculatedROI.toFixed(2)}%
            </PositionSecondaryInfoText>
          </KPIDatas>
        </KPIContainer>
      </PositionContainer>
    </PositionLink>
  );
};

const PortfolioPositions = () => {
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
        .filter(
          (item) => item[1] && !(item[1] as VaultAccount).totalDeposits.isZero()
        )
    );
  }, [vaultAccounts]);

  const positionContent = useMemo(() => {
    if (!active) {
      return <SectionPlaceholderText>---</SectionPlaceholderText>;
    }
    if (loading) {
      return (
        <SectionPlaceholderText>{animatedLoadingText}</SectionPlaceholderText>
      );
    }

    if (Object.keys(filteredVaultAccounts).length <= 0) {
      return (
        <SectionPlaceholderText>
          You have no outstanding positions
        </SectionPlaceholderText>
      );
    }

    return Object.keys(filteredVaultAccounts).map((key) => (
      <PortfolioPosition key={key} vaultAccount={filteredVaultAccounts[key]} />
    ));
  }, [active, animatedLoadingText, filteredVaultAccounts, loading]);

  return (
    <PortfolioPositionsContainer>
      <SectionTitle>Positions</SectionTitle>
      {positionContent}
    </PortfolioPositionsContainer>
  );
};

export default PortfolioPositions;
