import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import useVaultData from "../../hooks/useVaultData";
import { ProductType } from "../Product/types";
import useBalances from "../../hooks/useBalances";
import sizes from "../../designSystem/sizes";
import {
  VaultList,
  VaultNameOptionMap,
  VaultOptions,
} from "../../constants/constants";
import { productCopies } from "../Product/Product/productCopies";

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
`;

interface PortfolioPositionProps {
  currency: CurrencyType;
  vaultOption: VaultOptions;
  updateLoading: (vaultOption: VaultOptions, loading: boolean) => void;
  updateEmpty: (vaultOption: VaultOptions, empty: boolean) => void;
}

const PortfolioPosition: React.FC<PortfolioPositionProps> = ({
  currency,
  vaultOption,
  updateLoading,
  updateEmpty,
}) => {
  const { status, vaultBalanceInAsset } = useVaultData(vaultOption);
  const { balances, loading: balancesLoading } = useBalances();
  const isLoading = status === "loading" || balancesLoading;
  const { price: ethPrice, loading: ethPriceLoading } = useAssetPrice({});
  const animatedLoadingText = useTextAnimation(
    ["Loading", "Loading .", "Loading ..", "Loading ..."],
    250,
    isLoading || ethPriceLoading
  );

  useEffect(() => {
    updateLoading(vaultOption, isLoading);
  }, [isLoading, vaultOption, updateLoading]);

  useEffect(() => {
    updateEmpty(vaultOption, vaultBalanceInAsset.isZero());
  }, [vaultOption, updateEmpty, vaultBalanceInAsset]);

  const calculatedKPI = useMemo(() => {
    if (balances.length <= 0) {
      return {
        yield: BigNumber.from(0),
        roi: 0,
      };
    }

    let totalInvestment = BigNumber.from(0);
    let yieldEarned = BigNumber.from(0);
    let lastBalance = BigNumber.from(0);

    for (let i = 0; i < balances.length; i++) {
      const currentBalanceObj = balances[i];
      totalInvestment = totalInvestment.add(
        currentBalanceObj.balance
          .sub(lastBalance)
          .sub(currentBalanceObj.yieldEarned)
      );
      yieldEarned = yieldEarned.add(currentBalanceObj.yieldEarned);
      lastBalance = currentBalanceObj.balance;
    }

    if (totalInvestment.lte(0)) {
      return {
        yield: BigNumber.from(0),
        roi: 0,
      };
    }

    return {
      yield: yieldEarned,
      roi:
        (parseFloat(ethers.utils.formatEther(yieldEarned)) /
          parseFloat(ethers.utils.formatEther(totalInvestment))) *
        100,
    };
  }, [balances]);

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

  const positions = useMemo(() => {
    if (isLoading) {
      return null;
    }

    if (vaultBalanceInAsset.isZero()) {
      return null;
    }

    return (
      <PositionContainer>
        <PositionInfoRow>
          <PositionSymbolTitle product="yield" className="flex-grow-1">
            {
              Object.keys(VaultNameOptionMap)[
                Object.values(VaultNameOptionMap).indexOf(vaultOption)
              ]
            }
          </PositionSymbolTitle>
          <Title>{renderAmountText(vaultBalanceInAsset, currency)}</Title>
        </PositionInfoRow>
        <PositionInfoRow>
          <PositionInfoText className="flex-grow-1">
            {productCopies[vaultOption].subtitle}
          </PositionInfoText>
          <PositionSecondaryInfoText>
            {renderAmountText(
              vaultBalanceInAsset,
              currency === "eth" ? "usd" : "eth"
            )}
          </PositionSecondaryInfoText>
        </PositionInfoRow>
        <KPIContainer>
          <KPIDatas>
            <Title>+{renderAmountText(calculatedKPI.yield, currency)}</Title>
            <PositionSecondaryInfoText variant="green">
              +{calculatedKPI.roi.toFixed(2)}%
            </PositionSecondaryInfoText>
          </KPIDatas>
        </KPIContainer>
      </PositionContainer>
    );
  }, [
    vaultOption,
    isLoading,
    vaultBalanceInAsset,
    renderAmountText,
    calculatedKPI,
    currency,
  ]);

  return positions;
};

interface PortfolioPositionsProps {
  currency: CurrencyType;
}

const PortfolioPositions: React.FC<PortfolioPositionsProps> = ({
  currency,
}) => {
  const { active } = useWeb3React();
  const [loading, setLoading] = useState<string[]>([]);
  const [empty, setEmpty] = useState<string[]>([]);
  const animatedLoadingText = useTextAnimation(
    ["Loading", "Loading .", "Loading ..", "Loading ..."],
    250,
    loading.length > 0
  );

  const updateLoading = useCallback(
    (vaultOption: VaultOptions, isLoading: boolean) => {
      isLoading
        ? setLoading((curr) => curr.concat(vaultOption))
        : setLoading((curr) =>
            curr.filter((optionName) => optionName !== vaultOption)
          );
    },
    []
  );

  const updateEmpty = useCallback(
    (vaultOption: VaultOptions, isEmpty: boolean) => {
      isEmpty
        ? setEmpty((curr) => curr.concat(vaultOption))
        : setEmpty((curr) =>
            curr.filter((optionName) => optionName !== vaultOption)
          );
    },
    []
  );

  return (
    <PortfolioPositionsContainer>
      <SectionTitle>Positions</SectionTitle>
      {active ? (
        <>
          {loading.length > 0 && (
            <SectionPlaceholderText>
              {animatedLoadingText}
            </SectionPlaceholderText>
          )}
          {VaultList.map((vaultOption) => (
            <PortfolioPosition
              key={vaultOption}
              currency={currency}
              vaultOption={vaultOption}
              updateLoading={updateLoading}
              updateEmpty={updateEmpty}
            />
          ))}
          {loading.length === 0 && empty.length > 0 && (
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
