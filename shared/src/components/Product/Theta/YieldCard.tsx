import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { ethers } from "ethers";
import { AnimatePresence, motion } from "framer-motion";

import {
  BaseButton,
  Title,
  Subtitle,
  SecondaryText,
  BaseText,
} from "../../../designSystem";
import colors from "../../../designSystem/colors";
import sizes from "../../../designSystem/sizes";
import theme from "../../../designSystem/theme";
import CapBar from "../../Deposit/CapBar";
import useVaultData from "../../../hooks/useVaultData";
import {
  formatBigNumber,
  formatSignificantDecimals,
} from "../../../utils/math";
import { useLatestAPY } from "../../../hooks/useAirtableData";
import useTextAnimation from "../../../hooks/useTextAnimation";
import { VaultOptions } from "../../../constants/constants";
import { productCopies } from "../productCopies";
import { BarChartIcon, GlobeIcon } from "../../../assets/icons/icons";
import { getAssetDisplay, getAssetLogo } from "../../../utils/asset";
import { getVaultColor } from "../../../utils/vault";
import { Waves } from "../../../assets";
import ModalContentExtra from "../../Common/ModalContentExtra";
import { VaultAccount } from "../../../models/vault";
import YieldComparison from "./YieldComparison";

const { formatUnits } = ethers.utils;

const CardContainer = styled.div`
  perspective: 2000px;
`;

const ProductCard = styled(motion.div)<{ color: string }>`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  background-color: ${colors.background};
  border: 2px ${theme.border.style} ${colors.border};
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

const TopContainer = styled.div`
  display: flex;
  position: relative;
  justify-content: space-between;
  width: calc(100% + 32px);
  height: 120px;
  margin: -16px;
  padding: 16px;
  margin-bottom: 0;
`;

const TagContainer = styled.div`
  z-index: 1;
`;

const ProductTag = styled(BaseButton)<{ color: string }>`
  background: ${(props) => props.color}29;
  padding: 8px;
  margin-right: 4px;
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
  background-color: ${colors.background};
  border: 2px ${theme.border.style} ${colors.background};
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

const ProductTitle = styled(Title)`
  font-size: 32px;
  line-height: 40px;
  margin: 8px 0px;
  width: 100%;
`;

const ProductDescription = styled(SecondaryText)`
  line-height: 1.5;
  margin-bottom: auto;
`;

const ExpectedYieldTitle = styled(BaseText)`
  color: ${colors.primaryText}A3;
  width: 100%;
  font-size: 12px;
`;

const YieldText = styled(Title)`
  font-size: 24px;
  width: 100%;
  margin-top: 4px;
  margin-bottom: 24px;
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

const TopBackgroundContianer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 1px;
  border-radius: ${theme.border.radius};
  overflow: hidden;
`;

const StyledWaves = styled(Waves)<{ color: string }>`
  path {
    stroke: ${(props) => props.color}14;
  }
`;

const PositionLabel = styled(SecondaryText)`
  font-size: 12px;
`;

const PositionStats = styled(Title)`
  font-size: 14px;
`;

interface YieldCardProps {
  vault: VaultOptions;
  onClick: () => void;
  vaultAccount?: VaultAccount;
}

const YieldCard: React.FC<YieldCardProps> = ({
  vault,
  onClick,
  vaultAccount,
}) => {
  const {
    status,
    deposits,
    vaultLimit,
    asset,
    displayAsset,
    decimals,
  } = useVaultData(vault);
  const isLoading = useMemo(() => status === "loading", [status]);
  const [mode, setMode] = useState<"info" | "yield">("info");
  const color = getVaultColor(vault);

  const totalDepositStr = isLoading
    ? 0
    : parseFloat(formatSignificantDecimals(formatUnits(deposits, decimals), 2));
  const depositLimitStr = isLoading
    ? 1
    : parseFloat(formatSignificantDecimals(formatUnits(vaultLimit, decimals)));

  const latestAPY = useLatestAPY(vault);

  const loadingText = useTextAnimation(
    ["Loading", "Loading .", "Loading ..", "Loading ..."],
    250,
    !latestAPY.fetched
  );
  const perfStr = latestAPY.fetched
    ? `${latestAPY.res.toFixed(2)}%`
    : loadingText;

  const onSwapMode = useCallback((e) => {
    e.stopPropagation();
    setMode((prev) => (prev === "info" ? "yield" : "info"));
  }, []);

  const ProductInfoContent = () => {
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
        <ProductTitle color={color}>{productCopies[vault].title}</ProductTitle>
        <ProductDescription>
          {productCopies[vault].description}
        </ProductDescription>
        <ExpectedYieldTitle>Current Projected Yield (APY)</ExpectedYieldTitle>
        <YieldText>{perfStr}</YieldText>
        <CapBar
          loading={isLoading}
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
  };

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
          onClick={onClick}
          role="button"
          color={color}
        >
          <TopContainer>
            {/* Tags */}
            <TagContainer>
              {productCopies[vault].tags.map((tag) => (
                <ProductTag key={tag} color={color}>
                  <Subtitle>{tag}</Subtitle>
                </ProductTag>
              ))}
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

            {/* Top container background */}
            <TopBackgroundContianer>
              <div>
                <StyledWaves height="136px" width="834px" color={color} />
              </div>
            </TopBackgroundContianer>
          </TopContainer>
          <ProductInfo>
            {mode === "info" ? (
              <ProductInfoContent />
            ) : (
              <YieldComparison vault={vault} />
            )}
          </ProductInfo>
          <ModalContentExtra style={{ paddingTop: 14 + 16, paddingBottom: 14 }}>
            <div className="d-flex align-items-center w-100">
              <PositionLabel className="mr-auto">Your Position</PositionLabel>
              <PositionStats>
                {vaultAccount
                  ? `${formatBigNumber(
                      vaultAccount.totalBalance,
                      6,
                      decimals
                    )} ${getAssetDisplay(asset)}`
                  : "---"}
              </PositionStats>
            </div>
          </ModalContentExtra>
        </ProductCard>
      </AnimatePresence>
    </CardContainer>
  );
};

export default YieldCard;
