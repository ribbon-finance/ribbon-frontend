import React, { useCallback, useMemo } from "react";
import { useWeb3Wallet } from "shared/lib/hooks/useWeb3Wallet";
import { BigNumber } from "ethers";
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
  TreasuryVaultList,
  VaultNameOptionMap,
  VaultOptions,
  VaultVersion,
  VaultVersionList,
} from "shared/lib/constants/constants";
import { productCopies } from "shared/lib/components/Product/productCopies";
import { useAllVaultAccounts } from "shared/lib/hooks/useVaultAccounts";
import { VaultAccount } from "shared/lib/models/vault";
import {
  getAssetDecimals,
  getAssetDisplay,
  getAssetLogo,
} from "shared/lib/utils/asset";
import { getVaultColor } from "shared/lib/utils/vault";
import { getVaultURI } from "../../constants/constants";

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
  border: 2px ${theme.border.style} ${(props) => props.color}00;
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
  background: ${colors.background.two};
  border-radius: ${theme.border.radius};
  z-index: 2;
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

const VaultVersionBadge = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 85px;
  height: 24px;
  border-radius: ${theme.border.radiusSmall};
  background: ${(props) => props.color}3D;
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

interface PortfolioPositionProps {
  vaultAccount: VaultAccount;
  vaultVersion: VaultVersion;
}

const PortfolioPosition: React.FC<PortfolioPositionProps> = ({
  vaultAccount,
  vaultVersion,
}) => {
  const asset = getAssets(vaultAccount.vault.symbol);
  const decimals = getAssetDecimals(asset);
  const color = getVaultColor(vaultAccount.vault.symbol);
  const { price: assetPrice, loading: assetPriceLoading } = useAssetPrice({
    asset: asset,
  });
  const animatedLoadingText = useTextAnimation(assetPriceLoading);
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
          return `${formatBigNumber(amount, decimals)} ${getAssetDisplay(
            asset
          )}`;
      }
    },
    [asset, assetPrice, animatedLoadingText, assetPriceLoading, decimals]
  );

  const logo = useMemo(() => {
    const displayAsset = getDisplayAssets(vaultAccount.vault.symbol);
    const Logo = getAssetLogo(displayAsset);

    switch (displayAsset) {
      case "WETH":
        return <Logo height="70%" />;
      default:
        return <Logo />;
    }
  }, [vaultAccount]);

  const vaultBadge = useMemo(() => {
    switch (vaultVersion) {
      case "v2":
        return (
          <VaultVersionBadge color={color} className="ml-2">
            <Subtitle>TREASURY</Subtitle>
          </VaultVersionBadge>
        );
    }

    return <></>;
  }, [color, vaultVersion]);

  return (
    <PositionLink to={getVaultURI(vaultAccount.vault.symbol, vaultVersion)}>
      <PositionContainer color={color}>
        <PositionMainContainer>
          <LogoContainer color={color}>{logo}</LogoContainer>
          <PositionInfo>
            <PositionInfoRow>
              {/* Title */}
              <StyledTitle>{vaultName}</StyledTitle>
              {vaultBadge}

              {/* Amount in Vault Token */}
              <Title className="ml-auto">
                {renderAmountText(vaultAccount.totalBalance, "eth")}
              </Title>
            </PositionInfoRow>
            <PositionInfoRow>
              {/* Subtitle */}
              <PositionInfoText>
                {productCopies[vaultAccount.vault.symbol].subtitle}
              </PositionInfoText>

              {/* Amount in Fiat */}
              <PositionSecondaryInfoText className="ml-auto">
                {renderAmountText(vaultAccount.totalBalance, "usd")}
              </PositionSecondaryInfoText>
            </PositionInfoRow>
            <KPIContainer>
              <KPIDatas></KPIDatas>
            </KPIContainer>
          </PositionInfo>
        </PositionMainContainer>
      </PositionContainer>
    </PositionLink>
  );
};

const PortfolioPositions = () => {
  const { active } = useWeb3Wallet();
  const {
    data: { v1: v1VaultAccounts, v2: v2VaultAccounts },
    loading,
  } = useAllVaultAccounts();
  const animatedLoadingText = useTextAnimation(loading);

  const filteredVaultAccounts = useMemo(() => {
    return Object.fromEntries(
      TreasuryVaultList.map((vaultOption) => [
        vaultOption,
        Object.fromEntries(
          VaultVersionList.map((vaultVersion) => {
            switch (vaultVersion) {
              case "v1":
                return [vaultVersion, v1VaultAccounts[vaultOption]];
              case "v2":
              default:
                return [vaultVersion, v2VaultAccounts[vaultOption]];
            }
          }).filter((item) => {
            const account = item[1] as VaultAccount | undefined;

            return (
              account &&
              !isPracticallyZero(
                account.totalBalance,
                getAssetDecimals(getAssets(account.vault.symbol))
              )
            );
          })
        ),
      ]).filter((item) => Object.keys(item[1]).length > 0)
    ) as Partial<{
      [vault in VaultOptions]: Partial<{
        [version in VaultVersion]: VaultAccount;
      }>;
    }>;
  }, [v1VaultAccounts, v2VaultAccounts]);

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

    return Object.keys(filteredVaultAccounts).map((vaultOption) =>
      Object.keys(filteredVaultAccounts[vaultOption as VaultOptions]!).map(
        (vaultVersion) => (
          <PortfolioPosition
            key={`${vaultOption}${vaultVersion}`}
            vaultAccount={
              filteredVaultAccounts[vaultOption as VaultOptions]![
                vaultVersion as VaultVersion
              ]!
            }
            vaultVersion={vaultVersion as VaultVersion}
          />
        )
      )
    );
  }, [active, animatedLoadingText, filteredVaultAccounts, loading]);

  return (
    <PortfolioPositionsContainer>
      <SectionTitle>Positions</SectionTitle>
      {positionContent}
    </PortfolioPositionsContainer>
  );
};

export default PortfolioPositions;
