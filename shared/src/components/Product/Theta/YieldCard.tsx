import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { ethers } from "ethers";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import {
  BaseButton,
  Title,
  Subtitle,
  SecondaryText,
} from "../../../designSystem";
import colors from "../../../designSystem/colors";
import sizes from "../../../designSystem/sizes";
import theme from "../../../designSystem/theme";
import CapBar from "../../Deposit/CapBar";
import {
  formatBigNumber,
  formatSignificantDecimals,
  isPracticallyZero,
} from "../../../utils/math";
import useLoadingText from "../../../hooks/useLoadingText";
import {
  hasVaultVersion,
  VaultOptions,
  VaultVersion,
  VaultVersionList,
  isPutVault,
  isEthVault,
  isAvaxVault,
  isSolanaVault,
} from "../../../constants/constants";
import { BarChartIcon, GlobeIcon } from "../../../assets/icons/icons";
import { getAssetDisplay, getAssetLogo } from "../../../utils/asset";
import { getVaultColor } from "../../../utils/vault";
import ModalContentExtra from "../../Common/ModalContentExtra";
import { VaultAccount } from "../../../models/vault";
import YieldComparison from "./YieldComparison";
import { useV2VaultData, useVaultData } from "../../../hooks/web3DataContext";
import useAssetsYield from "../../../hooks/useAssetsYield";
import useLatestAPY from "../../../hooks/useLatestAPY";
import { animatedGradientKeyframe } from "../../../designSystem/keyframes";
import { ETHMonoLogo } from "../../../assets/icons/vaultMonoLogos";
import { AVAXMonoLogo } from "../../../assets/icons/vaultMonoLogos";
import { SOLMonoLogo } from "../../../assets/icons/vaultMonoLogos";
import useWeb3Wallet from "../../../hooks/useWeb3Wallet";

const { formatUnits } = ethers.utils;

const CardContainer = styled.div`
  perspective: 2000px;
`;

const ProductAssetLogoContainer = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  width: 56px;
  margin-top: calc(-56px / 2);
  background-color: ${colors.background.one};
  border-radius: 50%;
  position: relative;
  box-shadow: 0px 0px 0px 2px ${colors.background.two};

  &:before {
    display: block;
    position: absolute;
    height: 100%;
    width: 100%;
    content: " ";
    background: ${(props) => props.color}29;
    border-radius: 50%;
  }
`;

const TopContainer = styled.div<{ color: string }>`
  display: flex;
  position: relative;
  justify-content: space-between;
  width: calc(100% + 32px);
  height: 120px;
  margin: -16px;
  padding: 16px;
  margin-bottom: 0;
  border-radius: ${theme.border.radius} ${theme.border.radius} 0px 0px;

  background: linear-gradient(
    90deg,
    ${(props) => props.color}05 1.04%,
    ${(props) => props.color}30 98.99%
  );

  background-size: 200% 200%;

  -webkit-animation: ${animatedGradientKeyframe} 5s ease infinite;
  -moz-animation: ${animatedGradientKeyframe} 5s ease infinite;
  animation: ${animatedGradientKeyframe} 5s ease infinite;
`;

const ProductCard = styled(motion.div)<{ color: string; vault: VaultOptions }>`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  background-color: ${colors.background.two};
  border: 2px ${theme.border.style} ${colors.background.two};
  border-radius: ${theme.border.radius};
  transition: 0.25s box-shadow ease-out, 0.25s border ease-out;
  width: 290px;
  position: relative;
  height: 100%;
  padding: 16px;

  @media (max-width: ${sizes.md}px) {
    width: 343px;
  }

  &:hover {
    box-shadow: ${(props) => props.color}66 0px 0px 70px;
    border: 2px ${theme.border.style} ${(props) => props.color};

    ${TopContainer} {
      background: linear-gradient(
        90deg,
        ${(props) => props.color}15 1.04%,
        ${(props) => props.color}45 98.99%
      );

      background-size: 200% 200%;

      -webkit-animation: ${animatedGradientKeyframe} 5s ease infinite;
      -moz-animation: ${animatedGradientKeyframe} 5s ease infinite;
      animation: ${animatedGradientKeyframe} 5s ease infinite;
    }
  }
`;

const TagContainer = styled.div`
  z-index: 1;
  flex: 1;
  display: flex;
  align-self: baseline;
`;

const ProductTag = styled(BaseButton)<{ color: string }>`
  background: ${(props) => props.color}29;
  padding: 8px;
  margin-right: 4px;
  border-radius: ${theme.border.radiusSmall};
`;

const ProductVersionTag = styled(ProductTag)<{ active: boolean }>`
  margin-right: 0px;
  border: ${theme.border.width} ${theme.border.style}
    ${(props) => `${props.color}${props.active ? "" : "00"}`};
  border-radius: 0px;

  &:first-child {
    border-top-left-radius: ${theme.border.radiusSmall};
    border-bottom-left-radius: ${theme.border.radiusSmall};
  }

  &:last-child {
    border-top-right-radius: ${theme.border.radiusSmall};
    border-bottom-right-radius: ${theme.border.radiusSmall};
  }
`;

const ProductInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  flex: 1;
`;

const ProductDescription = styled(SecondaryText)`
  line-height: 1.5;
  margin-bottom: auto;
  min-height: 70px;
`;

const ModeSwitcherContainer = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 100px;
  background: ${(props) => props.color}14;
  z-index: 1;
`;

interface YieldCardProps {
  vault: VaultOptions;
  vaultVersion: VaultVersion;
  onVaultVersionChange: (version: VaultVersion) => void;
  onVaultPress: (vault: VaultOptions, vaultVersion: VaultVersion) => void;
  vaultAccount?: VaultAccount;
}

const YieldCard: React.FC<YieldCardProps> = ({
  vault,
  vaultVersion,
  onVaultVersionChange,
  onVaultPress,
  vaultAccount,
}) => {
  const {
    status,
    deposits,
    vaultLimit,
    asset,
    displayAsset,
    decimals,
    vaultBalanceInAsset,
  } = useVaultData(vault);
  const {
    data: { totalBalance: v2Deposits, cap: v2VaultLimit },
    loading: v2DataLoading,
  } = useV2VaultData(vault);
  const { chainId } = useWeb3Wallet();
  const { t } = useTranslation();
  const yieldInfos = useAssetsYield(asset);
  const isLoading = useMemo(() => status === "loading", [status]);
  const [mode, setMode] = useState<"info" | "yield">("info");
  const color = getVaultColor(vault);

  const [totalDepositStr, depositLimitStr] = useMemo(() => {
    switch (vaultVersion) {
      case "v1":
        return [
          parseFloat(
            formatSignificantDecimals(formatUnits(deposits, decimals), 2)
          ),
          parseFloat(
            formatSignificantDecimals(formatUnits(vaultLimit, decimals))
          ),
        ];
      case "v2":
        return [
          parseFloat(
            formatSignificantDecimals(formatUnits(v2Deposits, decimals), 2)
          ),
          parseFloat(
            formatSignificantDecimals(formatUnits(v2VaultLimit, decimals))
          ),
        ];
    }
  }, [decimals, deposits, v2Deposits, v2VaultLimit, vaultLimit, vaultVersion]);

  const latestAPY = useLatestAPY(vault, vaultVersion);

  const loadingText = useLoadingText();
  const perfStr = latestAPY.fetched
    ? `${latestAPY.res.toFixed(2)}%`
    : loadingText;

  const onSwapMode = useCallback((e) => {
    e.stopPropagation();
    setMode((prev) => (prev === "info" ? "yield" : "info"));
  }, []);

  const ProductInfoContent = useCallback(() => {
    const Logo = getAssetLogo(displayAsset);

    let logo = <Logo height="100%" />;

    switch (displayAsset) {
      case "yvUSDC":
        logo = <Logo markerConfig={{ height: 24, width: 24 }} />;
        break;
      case "SOL":
        logo = <Logo style={{ padding: 0 }} />;
        break;
    }

    return (
      <>
        <ProductAssetLogoContainer color={color}>
          {logo}
        </ProductAssetLogoContainer>
        <Title fontSize={28} lineHeight={40} className="w-100 my-2">
          {t(`shared:ProductCopies:${vault}:title`)}
        </Title>
        <ProductDescription>
          {isPutVault(vault)
            ? t("shared:ProductCopies:Put:description", { asset: displayAsset })
            : t("shared:ProductCopies:Call:description", {
                asset: displayAsset,
              })}
        </ProductDescription>
        <Title
          color={`${colors.primaryText}A3`}
          fontSize={12}
          className="w-100"
        >
          {t("shared:YieldCard:currentProjectedYield")}
        </Title>
        <Title fontSize={24} className="w-100 mt-1 mb-4">
          {perfStr}
        </Title>
        <CapBar
          loading={vaultVersion === "v1" ? isLoading : v2DataLoading}
          current={totalDepositStr}
          cap={depositLimitStr}
          copies={{
            current: "Current Deposits",
            cap: "Max Capacity",
          }}
          labelConfig={{
            fontSize: 12,
          }}
          statsConfig={{
            fontSize: 14,
          }}
          barConfig={{ height: 4, extraClassNames: "my-2", radius: 2 }}
          asset={asset}
        />
      </>
    );
  }, [
    asset,
    color,
    depositLimitStr,
    displayAsset,
    isLoading,
    perfStr,
    totalDepositStr,
    v2DataLoading,
    vault,
    vaultVersion,
    t,
  ]);

  const modalContentExtra = useMemo(() => {
    if (
      vaultVersion === "v2" &&
      !isPracticallyZero(vaultBalanceInAsset, decimals)
    ) {
      return (
        <ModalContentExtra style={{ paddingTop: 14 + 16, paddingBottom: 14 }}>
          <div className="d-flex w-100 justify-content-center">
            <SecondaryText fontSize={12} color={colors.primaryText}>
              {t("shared:YieldCard:fundsReadyForMigration")}
            </SecondaryText>
          </div>
        </ModalContentExtra>
      );
    }

    if (chainId) {
      return (
        <ModalContentExtra style={{ paddingTop: 14 + 16, paddingBottom: 14 }}>
          <div className="d-flex align-items-center w-100">
            <SecondaryText fontSize={12} className="mr-auto">
              {t("shared:YieldCard:yourPosition")}
            </SecondaryText>
            <Title fontSize={14}>
              {vaultAccount
                ? `${formatBigNumber(
                    vaultAccount.totalBalance,
                    decimals
                  )} ${getAssetDisplay(asset)}`
                : "---"}
            </Title>
          </div>
        </ModalContentExtra>
      );
    }
  }, [
    chainId,
    asset,
    decimals,
    vaultAccount,
    vaultBalanceInAsset,
    vaultVersion,
  ]);

  const vaultLogo = useMemo(() => {
    let logo;

    if (isEthVault(vault)) logo = <ETHMonoLogo />;
    else if (isAvaxVault(vault)) logo = <AVAXMonoLogo />;
    else if (isSolanaVault(vault)) logo = <SOLMonoLogo />;

    if (logo) {
      return (
        <ProductTag className="p-1" color={color}>
          <Subtitle>{logo}</Subtitle>
        </ProductTag>
      );
    }
  }, [vault]);

  return (
    <CardContainer>
      <AnimatePresence exitBeforeEnter initial={false}>
        <ProductCard
          key={mode}
          transition={{
            duration: 0.1,
            type: "keyframes",
            ease: "linear",
          }}
          initial={{
            transform: "rotateY(90deg)",
          }}
          animate={{
            transform: "rotateY(0deg)",
          }}
          exit={{
            transform: "rotateY(-90deg)",
          }}
          onClick={() => onVaultPress(vault, vaultVersion)}
          role="button"
          color={color}
          vault={vault}
        >
          <TopContainer color={color}>
            {/* Tags */}
            <TagContainer>
              {/* Product tags */}
              <ProductTag color={color}>
                <Subtitle>
                  {isPutVault(vault) ? "PUT-SELLING" : "COVERED CALL"}
                </Subtitle>
              </ProductTag>
              {vaultLogo}
              <div className="d-flex">
                {/* Version tags */}
                {VaultVersionList.map((version) =>
                  chainId && hasVaultVersion(vault, version, chainId) ? (
                    <ProductVersionTag
                      key={version}
                      color={color}
                      active={vaultVersion === version}
                      onClick={(e) => {
                        e.stopPropagation();
                        onVaultVersionChange(version);
                      }}
                    >
                      <Subtitle>{version}</Subtitle>
                    </ProductVersionTag>
                  ) : null
                )}
              </div>
            </TagContainer>

            {/* Mode switcher button */}
            {Boolean(yieldInfos && yieldInfos.length) && (
              <ModeSwitcherContainer
                role="button"
                onClick={onSwapMode}
                color={color}
              >
                {mode === "info" ? (
                  <GlobeIcon color={color} />
                ) : (
                  <BarChartIcon color={color} />
                )}
              </ModeSwitcherContainer>
            )}
          </TopContainer>
          <ProductInfo>
            {mode === "yield" && yieldInfos ? (
              <YieldComparison
                vault={vault}
                vaultVersion={vaultVersion}
                yieldInfos={yieldInfos}
              />
            ) : (
              <ProductInfoContent />
            )}
          </ProductInfo>
          {modalContentExtra}
        </ProductCard>
      </AnimatePresence>
    </CardContainer>
  );
};

export default YieldCard;
