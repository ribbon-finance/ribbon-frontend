import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, ethers } from "ethers";
import styled from "styled-components";
import { Frame } from "framer";

import { SecondaryText, Subtitle, Title } from "../../designSystem";
import colors from "../../designSystem/colors";
import theme from "../../designSystem/theme";
import useAssetPrice from "../../hooks/useAssetPrice";
import useTextAnimation from "../../hooks/useTextAnimation";
import { currencies, CurrencyType } from "../../pages/Portfolio/types";
import { assetToUSD, formatSignificantDecimals } from "../../utils/math";
import { ProductType } from "../Product/types";
import sizes from "../../designSystem/sizes";
import {
  getAssets,
  VaultList,
  VaultNameOptionMap,
} from "../../constants/constants";
import { productCopies } from "../Product/Product/productCopies";
import useVaultAccounts from "../../hooks/useVaultAccounts";
import { VaultAccount } from "../../models/vault";
import { getAssetDecimals, getAssetDisplay } from "../../utils/asset";

const PortfolioPositionsContainer = styled.div`
  margin-top: 48px;
  display: flex;
  flex-wrap: wrap;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const SectionTitle = styled(Title)`
  font-size: 18px;
  line-height: 24px;
  margin-right: 16px;
`;

const CurrencySwitch = styled.div`
  border-radius: ${theme.border.radius};
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  background-color: rgba(255, 255, 255, 0.04);
  display: flex;
  position: relative;
`;

const CurrencyButton = styled.div`
  padding: 8px 13px;
  z-index: 1;
`;

const ActiveCurrencyButton = styled(Frame)`
  border-radius: ${theme.border.radius} !important;
  background-color: ${colors.pillBackground} !important;
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
  margin-top: 16px;
  padding: 16px;
  display: flex;
  flex-wrap: wrap;
  position: relative;

  &:first-child {
    margin-top: 24px;
  }
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

  const renderAmountText = useCallback(
    (amount: BigNumber, currency: CurrencyType) => {
      switch (currency) {
        case "usd":
          return assetPriceLoading
            ? animatedLoadingText
            : `${assetToUSD(amount, assetPrice, decimals)}`;
        case "eth":
          return `${formatSignificantDecimals(
            ethers.utils.formatUnits(amount, decimals)
          )} ${getAssetDisplay(asset)}`;
      }
    },
    [asset, assetPrice, animatedLoadingText, assetPriceLoading, decimals]
  );

  const calculatedROI = useMemo(
    () =>
      (parseFloat(
        ethers.utils.formatUnits(vaultAccount.totalYieldEarned, decimals)
      ) /
        parseFloat(
          ethers.utils.formatUnits(vaultAccount.totalDeposits, decimals)
        )) *
      100,
    [vaultAccount, decimals]
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
  updateCurrency: (current: CurrencyType) => void;
}

const PortfolioPositions: React.FC<PortfolioPositionsProps> = ({
  currency,
  updateCurrency,
}) => {
  const { active } = useWeb3React();
  const currencyRefs = currencies.reduce<any>((acc, curr) => {
    acc[curr] = React.createRef();
    return acc;
  }, {});
  const [currencyButtonAnimation, setCurrencyButtonAnimation] = useState<
    object | boolean
  >(false);
  const { vaultAccounts, loading } = useVaultAccounts(VaultList);
  const animatedLoadingText = useTextAnimation(
    ["Loading", "Loading .", "Loading ..", "Loading ..."],
    250,
    loading
  );

  useEffect(() => {
    const currentCurrency = currencyRefs[currency].current;

    if (!currentCurrency) {
      return;
    }

    setCurrencyButtonAnimation({
      left: currentCurrency.offsetLeft,
      top: currentCurrency.offsetTop,
      height: currentCurrency.clientHeight,
      width: currentCurrency.clientWidth,
    });
  }, [currency, currencyRefs]);

  const filteredVaultAccounts = useMemo(() => {
    return Object.fromEntries(
      Object.keys(vaultAccounts)
        .map((key) => [key, vaultAccounts[key]])
        .filter((item) => item[1])
    );
  }, [vaultAccounts]);

  const toggleCurrency = useCallback(() => {
    updateCurrency(currencies.find((c) => c !== currency) as CurrencyType);
  }, [updateCurrency, currency]);

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
      <PortfolioPosition
        key={key}
        currency={currency}
        vaultAccount={filteredVaultAccounts[key]}
      />
    ));
  }, [active, animatedLoadingText, currency, filteredVaultAccounts, loading]);

  const renderCurrencyButton = useCallback(
    (currency: CurrencyType) => (
      <CurrencyButton ref={currencyRefs[currency]} key={currency}>
        <Subtitle>{currency.toUpperCase()}</Subtitle>
      </CurrencyButton>
    ),
    // currencyRefs are being changed from this block, having dependencies will causes max depth reach
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currency]
  );

  return (
    <PortfolioPositionsContainer>
      <HeaderContainer>
        <SectionTitle>Positions</SectionTitle>
        <CurrencySwitch role="button" onClick={toggleCurrency}>
          <ActiveCurrencyButton
            transition={{
              type: "keyframes",
              ease: "easeOut",
            }}
            height={0}
            width={0}
            animate={currencyButtonAnimation}
          />
          {currencies.map((currency) => renderCurrencyButton(currency))}
        </CurrencySwitch>
      </HeaderContainer>
      {positionContent}
    </PortfolioPositionsContainer>
  );
};

export default PortfolioPositions;
