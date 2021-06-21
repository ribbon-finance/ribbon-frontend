import React, { useCallback, useMemo, useState } from "react";
import styled, { keyframes } from "styled-components";
import { ethers } from "ethers";
import { AnimatePresence, motion } from "framer-motion";

import {
  WETHLogo,
  WBTCLogo,
  USDCLogo,
} from "../../../assets/icons/erc20Assets";
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
import { formatSignificantDecimals } from "../../../utils/math";
import { useLatestAPY } from "../../../hooks/useAirtableData";
import useTextAnimation from "../../../hooks/useTextAnimation";
import { VaultOptions } from "../../../constants/constants";
import { productCopies } from "../productCopies";
import { BarChartIcon, GlobeIcon } from "../../../assets/icons/icons";
import Logo from "../../../assets/icons/logo";
import useAssetsYield from "../../../hooks/useAssetsYield";
import { DefiScoreProtocol } from "../../../models/defiScore";
import {
  AAVEIcon,
  CompoundIcon,
  DDEXIcon,
  DYDXIcon,
  OasisIcon,
} from "../../../assets/icons/defiApp";
import { getAssetDisplay } from "../../../utils/asset";
import { getVaultColor } from "../../../utils/vault";
import { shimmerKeyframe } from "../../../designSystem/keyframes";

const { formatUnits } = ethers.utils;

const ProductCard = styled.div<{ color: string }>`
  display: flex;
  background-color: ${colors.background};
  border: 2px ${theme.border.style} ${colors.border};
  border-radius: ${theme.border.radius};
  padding: 16px 24px 24px 16px;
  margin: 0 80px;
  transition: 0.25s box-shadow ease-out;
  max-width: 343px;
  min-height: 411px;
  position: relative;
  height: 100%;
  perspective: 2000px;

  transition: 0.2s;
  animation: ${(props) => shimmerKeyframe(props.color)} 3s infinite;

  &:hover {
    transition: 0.2s;
    animation: none;
    box-shadow: ${(props) => props.color}66 8px 16px 80px;
    border: 2px ${theme.border.style} ${(props) => props.color};
  }

  @media (max-width: ${sizes.md}px) {
    min-width: 280px;
    margin: 0 12px;
  }
`;

const ProductContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  flex-wrap: wrap;
  z-index: 1;
`;

const ProductTopContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
`;

const ProductInfo = styled(motion.div)<{ mode: "info" | "yield" }>`
  display: flex;
  flex-wrap: wrap;
  ${(props) => {
    if (props.mode === "info") {
      return `
        flex: 1;
      `;
    }

    return null;
  }}
`;

const ProductTag = styled(BaseButton)`
  background: ${colors.pillBackground};
  padding: 8px;
  margin-right: 4px;
`;

const ProductTitle = styled(Title)<{ color: string }>`
  color: ${(props) => props.color};
  font-size: 36px;
  margin-bottom: 8px;
`;

const ProductDescription = styled(SecondaryText)`
  line-height: 1.5;
  margin-bottom: 24px;
`;

const ExpectedYieldTitle = styled(BaseText)`
  color: ${colors.primaryText}A3;
  width: 100%;
  font-size: 12px;
`;

const YieldText = styled(Title)`
  font-size: 32px;
  width: 100%;
  margin-bottom: 24px;
`;

const TopContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const BackgroundContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0;
`;

const StyledWBTCLogo = styled(WBTCLogo)`
  && * {
    fill: white;
  }
`;

const StyledUSDCLogo = styled(USDCLogo)`
  .background {
    fill: #ffffff52;
  }
`;

const ModeSwitcherContainer = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 100px;
  background: ${(props) => props.color}14;
`;

const YieldComparisonCard = styled.div`
  display: flex;
  width: 100%;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: ${theme.border.radius};
  background-color: #252322;
  padding: 8px;
  margin-top: 8px;
`;

const YieldComparisonTitle = styled(ExpectedYieldTitle)`
  margin-top: 24px;

  &:first-child {
    margin-top: 14px;
  }
`;

const YieldComparisonText = styled(Title)`
  font-size: 14px;
  line-height: 24px;
  margin-left: 8px;
`;

const YieldComparisonAPR = styled(YieldComparisonText)`
  margin-left: auto;
`;

interface YieldCardProps {
  vault: VaultOptions;
  onClick: () => void;
}

const YieldCard: React.FC<YieldCardProps> = ({ vault, onClick }) => {
  const { status, deposits, vaultLimit, asset, decimals } = useVaultData(vault);
  const isLoading = status === "loading";
  const [mode, setMode] = useState<"info" | "yield">("info");
  const yieldInfos = useAssetsYield(asset);
  const color = getVaultColor(vault);

  const totalDepositStr = isLoading
    ? 0
    : parseFloat(formatSignificantDecimals(formatUnits(deposits, decimals), 2));
  const depositLimitStr = isLoading
    ? 1
    : parseFloat(formatSignificantDecimals(formatUnits(vaultLimit, decimals)));

  const renderTag = (name: string) => (
    <ProductTag key={name}>
      <Subtitle>{name}</Subtitle>
    </ProductTag>
  );

  const latestAPY = useLatestAPY(vault);

  const loadingText = useTextAnimation(
    ["Loading", "Loading .", "Loading ..", "Loading ..."],
    250,
    !latestAPY.fetched
  );
  const perfStr = latestAPY.res ? `${latestAPY.res.toFixed(2)}%` : loadingText;

  const onSwapMode = useCallback((e) => {
    e.stopPropagation();
    setMode((prev) => (prev === "info" ? "yield" : "info"));
  }, []);

  const backgroundLogo = useMemo(() => {
    switch (vault) {
      case "rETH-THETA":
        return <WETHLogo width="40%" opacity="0.1" />;
      case "rBTC-THETA":
        return <StyledWBTCLogo width="50%" opacity="0.04" />;
      case "rUSDC-ETH-P-THETA":
      case "rUSDC-BTC-P-THETA":
        return <StyledUSDCLogo width="50%" opacity="0.04" />;
      default:
        return <></>;
    }
  }, [vault]);

  const ProductInfoContent = () => (
    <>
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
          fontSize: 12,
        }}
        asset={asset}
      />
    </>
  );

  const renderProtocolLogo = useCallback((protocol: DefiScoreProtocol) => {
    switch (protocol) {
      case "aave":
        return <AAVEIcon height="24" width="24" />;
      case "compound":
        return <CompoundIcon height="24" width="24" />;
      case "ddex":
        return <DDEXIcon height="24" width="24" />;
      case "dydx":
        return (
          <DYDXIcon height="24" width="24" style={{ borderRadius: "100px" }} />
        );
      case "mcd":
        return <OasisIcon height="24" width="24" />;
    }
  }, []);

  const ProductYieldComparison = () => (
    <>
      <YieldComparisonTitle>Current Projected Yield (APY)</YieldComparisonTitle>
      <YieldComparisonCard>
        <Logo height="24" width="24" />
        <YieldComparisonText>{productCopies[vault].title}</YieldComparisonText>
        <YieldComparisonAPR>{perfStr}</YieldComparisonAPR>
      </YieldComparisonCard>
      <YieldComparisonTitle>
        Market {getAssetDisplay(asset)} Yields (APY)
      </YieldComparisonTitle>
      {yieldInfos
        .slice(0, 3)
        .map(
          ({ protocol, apr }: { protocol: DefiScoreProtocol; apr: number }) => {
            if (apr < 0.01) {
              return <></>;
            }

            return (
              <YieldComparisonCard key={protocol}>
                {renderProtocolLogo(protocol)}
                <YieldComparisonText>{protocol}</YieldComparisonText>
                <YieldComparisonAPR>{`${apr.toFixed(2)}%`}</YieldComparisonAPR>
              </YieldComparisonCard>
            );
          }
        )}
    </>
  );

  return (
    <ProductCard onClick={onClick} role="button" color={color}>
      <ProductContent>
        <TopContainer>
          <ProductTopContainer>
            {productCopies[vault].tags.map((tag) => renderTag(tag))}
          </ProductTopContainer>
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
        <AnimatePresence exitBeforeEnter initial={false}>
          <ProductInfo
            key={mode}
            mode={mode}
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
          >
            {mode === "info" ? (
              <ProductInfoContent />
            ) : (
              <ProductYieldComparison />
            )}
          </ProductInfo>
        </AnimatePresence>
      </ProductContent>
      <BackgroundContainer>{backgroundLogo}</BackgroundContainer>
    </ProductCard>
  );
};

export default YieldCard;
