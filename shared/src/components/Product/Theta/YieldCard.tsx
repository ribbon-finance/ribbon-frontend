import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { ethers } from "ethers";
import { AnimatePresence, motion } from "framer-motion";

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
import { useLatestAPY } from "../../../hooks/useAirtableData";
import useTextAnimation from "../../../hooks/useTextAnimation";
import {
  hasVaultVersion,
  VaultOptions,
  VaultVersion,
  VaultVersionList,
} from "../../../constants/constants";
import { productCopies } from "../productCopies";
import { BarChartIcon, GlobeIcon } from "../../../assets/icons/icons";
import { getAssetDisplay, getAssetLogo } from "../../../utils/asset";
import { getVaultColor } from "../../../utils/vault";
import ModalContentExtra from "../../Common/ModalContentExtra";
import { VaultAccount } from "../../../models/vault";
import YieldComparison from "./YieldComparison";
import { useV2VaultData, useVaultData } from "../../../hooks/web3DataContext";

const { formatUnits } = ethers.utils;

const CardContainer = styled.div`
  perspective: 2000px;
`;

const ProductCard = styled(motion.div)<{ color: string }>`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  background-color: ${colors.background.two};
  border: 2px ${theme.border.style} ${(props) => props.color}00;
  border-radius: ${theme.border.radius};
  transition: 0.25s box-shadow ease-out, 0.25s border ease-out;
  width: 290px;
  min-height: 492px;
  position: relative;
  height: 100%;
  padding: 16px;

  @media (max-width: ${sizes.md}px) {
    width: 343px;
  }

  &:hover {
    box-shadow: ${(props) => props.color}66 8px 16px 80px;
    border: 2px ${theme.border.style} ${(props) => props.color};
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
    96.84deg,
    ${(props) => props.color}29 1.04%,
    ${(props) => props.color}14 98.99%
  );
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

const ProductAssetLogoContainer = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  width: 56px;
  margin-top: calc(-56px / 2);
  background-color: ${colors.background.one};
  border: 2px ${theme.border.style} ${colors.background.one};
  border-radius: 100px;
  position: relative;

  &:before {
    display: block;
    position: absolute;
    height: 100%;
    width: 100%;
    content: " ";
    background: ${(props) => props.color}29;
    border-radius: 100px;
  }
`;

const ProductDescription = styled(SecondaryText)`
  line-height: 1.5;
  margin-bottom: auto;
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
  onVaultPress: (vault: VaultOptions, vaultVersion: VaultVersion) => void;
  vaultAccount?: VaultAccount;
}

const YieldCard: React.FC<YieldCardProps> = ({
  vault,
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
  const isLoading = useMemo(() => status === "loading", [status]);
  const [mode, setMode] = useState<"info" | "yield">("info");
  const color = getVaultColor(vault);
  const [userSelectedVaultVersion, setUserSelectedVaultVersion] =
    useState<VaultVersion>();

  const defaultVaultVersion = useMemo(() => {
    if (VaultVersionList[0] === "v1") {
      if (!isLoading && vaultLimit.isZero()) {
        return "v2";
      }

      return "v1";
    }

    return VaultVersionList[0];
  }, [isLoading, vaultLimit]);

  const vaultVersion = userSelectedVaultVersion || defaultVaultVersion;

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

  const latestAPY = useLatestAPY(vault);

  const loadingText = useTextAnimation(!latestAPY.fetched);
  const perfStr = latestAPY.fetched
    ? `${latestAPY.res.toFixed(2)}%`
    : loadingText;

  const onSwapMode = useCallback((e) => {
    e.stopPropagation();
    setMode((prev) => (prev === "info" ? "yield" : "info"));
  }, []);

  const ProductInfoContent = useCallback(() => {
    const Logo = getAssetLogo(displayAsset);

    let logo = <Logo />;

    switch (displayAsset) {
      case "WETH":
        logo = <Logo height="70%" />;
        break;
      case "yvUSDC":
        logo = <Logo markerConfig={{ height: 24, width: 24 }} />;
    }

    return (
      <>
        <ProductAssetLogoContainer color={color}>
          {logo}
        </ProductAssetLogoContainer>
        <Title
          fontSize={28}
          lineHeight={40}
          color={color}
          className="w-100 my-2"
        >
          {productCopies[vault].title}
        </Title>
        <ProductDescription>
          {productCopies[vault].description}
        </ProductDescription>
        <Title
          color={`${colors.primaryText}A3`}
          fontSize={12}
          className="w-100"
        >
          Current Projected Yield (APY)
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
  ]);

  const modalContentExtra = useMemo(() => {
    if (
      vaultVersion === "v2" &&
      !isPracticallyZero(vaultBalanceInAsset, decimals)
    ) {
      return (
        <div className="d-flex w-100 justify-content-center">
          <SecondaryText fontSize={12} color={colors.primaryText}>
            Funds ready for migration to V2
          </SecondaryText>
        </div>
      );
    }

    return (
      <div className="d-flex align-items-center w-100">
        <SecondaryText fontSize={12} className="mr-auto">
          Your Position
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
    );
  }, [asset, decimals, vaultAccount, vaultBalanceInAsset, vaultVersion]);

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
        >
          <TopContainer color={color}>
            {/* Tags */}
            <TagContainer>
              {/* Product tags */}
              {productCopies[vault].tags.map((tag) => (
                <ProductTag key={tag} color={color}>
                  <Subtitle>{tag}</Subtitle>
                </ProductTag>
              ))}
              <div className="d-flex">
                {/* Version tags */}
                {VaultVersionList.map((version) =>
                  hasVaultVersion(vault, version) ? (
                    <ProductVersionTag
                      key={version}
                      color={color}
                      active={vaultVersion === version}
                      onClick={(e) => {
                        e.stopPropagation();
                        setUserSelectedVaultVersion(version);
                      }}
                    >
                      <Subtitle>{version}</Subtitle>
                    </ProductVersionTag>
                  ) : null
                )}
              </div>
            </TagContainer>

            {/* Mode switcher button */}
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
          </TopContainer>
          <ProductInfo>
            {mode === "info" ? (
              <ProductInfoContent />
            ) : (
              <YieldComparison vault={vault} />
            )}
          </ProductInfo>
          <ModalContentExtra style={{ paddingTop: 14 + 16, paddingBottom: 14 }}>
            {modalContentExtra}
          </ModalContentExtra>
        </ProductCard>
      </AnimatePresence>
    </CardContainer>
  );
};

export default YieldCard;
