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
import useAssetPrice from "shared/lib/hooks/useAssetPrice";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";
import { CurrencyType } from "../../pages/Portfolio/types";
import {
  assetToUSD,
  formatBigNumber,
  isPracticallyZero,
} from "shared/lib/utils/math";
import sizes from "shared/lib/designSystem/sizes";
import {
  getAssets,
  getDisplayAssets,
  VaultList,
  VaultNameOptionMap,
} from "shared/lib/constants/constants";
import { productCopies } from "shared/lib/components/Product/productCopies";
import useVaultAccounts from "shared/lib/hooks/useVaultAccounts";
import { VaultAccount } from "shared/lib/models/vault";
import {
  getAssetDecimals,
  getAssetDisplay,
  getAssetLogo,
} from "shared/lib/utils/asset";
import { getVaultColor } from "shared/lib/utils/vault";

const PortfolioPositionsContainer = styled.div`
  margin-top: 64px;
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
  margin-top: 24px;
`;

const PositionContainer = styled.div<{ color: string }>`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  border-radius: ${theme.border.radius};
  border: 2px ${theme.border.style} #00000000;
  transition: 0.25s box-shadow ease-out, 0.25s border ease-out;

  &:hover {
    transition: 0.2s;
    box-shadow: ${(props) => props.color}3D 8px 16px 80px;
    border: 2px ${theme.border.style} ${(props) => props.color};
  }
`;

const PositionMainContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 16px;
  background: ${colors.background};
  border-radius: ${theme.border.radius};
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  z-index: 2;
`;

const PositionStakedContainer = styled(PositionMainContainer)`
  margin-top: -16px;
  padding-top: calc(16px + 16px);
  background: ${colors.backgroundLighter};
  border-radius: ${theme.border.radius};
  z-index: 1;
`;

const LogoContainer = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  width: 40px;
  height: 40px;
  border-radius: 100px;
  background: ${(props) => props.color}29;
`;

const PositionInfo = styled.div`
  display: flex;
  flex: 1;
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

const StyledTitle = styled(Title)`
  text-transform: none;
`;

const PositionInfoText = styled(SecondaryText)`
  color: ${colors.primaryText}A3;
  font-size: 12px;
  line-height: 16px;
  font-weight: 400;
`;

const PositionSecondaryInfoText = styled(Subtitle)`
  letter-spacing: unset;
  line-height: 16px;
  color: ${colors.primaryText}A3;
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

const KPIRoi = styled(Title)<{ variant: "red" | "green" }>`
  ${(props) => {
    switch (props.variant) {
      case "green":
        return `color: ${colors.green};`;
      case "red":
        return `color: ${colors.red};`;
    }
  }}
`;

interface PortfolioPositionProps {
  vaultAccount: VaultAccount;
}

const PortfolioPosition: React.FC<PortfolioPositionProps> = ({
  vaultAccount,
}) => {
  const asset = getAssets(vaultAccount.vault.symbol);
  const decimals = getAssetDecimals(asset);
  const color = getVaultColor(vaultAccount.vault.symbol);
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

    return !isPracticallyZero(vaultAccount.totalBalance, decimals)
      ? (parseFloat(ethers.utils.formatUnits(netProfit, decimals)) /
          parseFloat(
            ethers.utils.formatUnits(vaultAccount.totalDeposits, decimals)
          )) *
          100
      : 0;
  }, [vaultAccount, decimals]);

  const logo = useMemo(() => {
    const displayAsset = getDisplayAssets(vaultAccount.vault.symbol);
    const Logo = getAssetLogo(displayAsset);

    switch (displayAsset) {
      case "WETH":
        return <Logo height="70%" />;
      case "yvUSDC":
        return <Logo markerConfig={{ height: 16, width: 16 }} />;
      default:
        return <Logo />;
    }
  }, [vaultAccount]);

  return (
    <PositionLink to={`/theta-vault/${vaultName}`}>
      <PositionContainer color={color}>
        <PositionMainContainer>
          <LogoContainer color={color}>{logo}</LogoContainer>
          <PositionInfo>
            <PositionInfoRow>
              {/* Title */}
              <StyledTitle className="flex-grow-1">{vaultName}</StyledTitle>

              {/* Amount in Vault Token */}
              <Title>
                {renderAmountText(vaultAccount.totalBalance, "eth")}
              </Title>
            </PositionInfoRow>
            <PositionInfoRow>
              {/* Subtitle */}
              <PositionInfoText className="flex-grow-1">
                {productCopies[vaultAccount.vault.symbol].subtitle}
              </PositionInfoText>

              {/* Amount in Fiat */}
              <PositionSecondaryInfoText>
                {renderAmountText(vaultAccount.totalBalance, "usd")}
              </PositionSecondaryInfoText>
            </PositionInfoRow>
            <KPIContainer>
              <KPIDatas>
                <KPIRoi variant={calculatedROI >= 0 ? "green" : "red"}>
                  {calculatedROI >= 0 ? "+" : ""}
                  {calculatedROI.toFixed(2)}%
                </KPIRoi>
              </KPIDatas>
            </KPIContainer>
          </PositionInfo>
        </PositionMainContainer>

        <PositionStakedContainer>
          <PositionInfoRow>
            <PositionInfoText className="flex-grow-1">
              Staked Amount
            </PositionInfoText>
            <PositionSecondaryInfoText>
              {renderAmountText(vaultAccount.totalStakedBalance, "eth")}
            </PositionSecondaryInfoText>
          </PositionInfoRow>
        </PositionStakedContainer>
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
