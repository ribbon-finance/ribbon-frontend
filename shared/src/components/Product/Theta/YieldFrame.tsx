import { formatUnits } from "@ethersproject/units";
import { AnimatePresence, motion } from "framer";
import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { BarChartIcon, GlobeIcon } from "../../../assets/icons/icons";

import { VaultOptions, VaultVersion } from "../../../constants/constants";
import {
  BaseButton,
  SecondaryText,
  Subtitle,
  Title,
} from "../../../designSystem";
import theme from "../../../designSystem/theme";
import useAssetsYield from "../../../hooks/useAssetsYield";
import { useLatestAPY } from "../../../hooks/useLatestOption";
import useTextAnimation from "../../../hooks/useTextAnimation";
import { useV2VaultData, useVaultData } from "../../../hooks/web3DataContext";
import { getAssetLogo } from "../../../utils/asset";
import { formatSignificantDecimals } from "../../../utils/math";
import { getVaultColor } from "../../../utils/vault";
import CapBar from "../../Deposit/CapBar";
import { productCopies } from "../productCopies";
import YieldComparison from "./YieldComparison";

const FrameContainer = styled.div`
  perspective: 2000px;
`;

const Frame = styled(motion.div)<{ color: string }>`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 294px;
  height: 429px;
  position: relative;
  padding: 18px;
  border-radius: ${theme.border.radius};
  background: linear-gradient(
    96.84deg,
    ${(props) => props.color}29 1.04%,
    ${(props) => props.color}0A 98.99%
  );
  transition: 0.25s border-color ease-out, 0.25s box-shadow ease-out;

  &:hover {
    padding: 16px;
    box-shadow: ${(props) => props.color}66 8px 16px 80px;
    border: 2px ${theme.border.style} ${(props) => props.color};
  }
`;

const TagContainer = styled.div`
  z-index: 1;
  margin-right: auto;
`;

const ProductTag = styled(BaseButton)<{ color: string }>`
  background: ${(props) => props.color}29;
  padding: 8px;
  margin-right: 4px;
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

interface YieldFrameProps {
  vault: VaultOptions;
  vaultVersion: VaultVersion;
  onVaultVersionChange: (version: VaultVersion) => void;
  onVaultPress: (vault: VaultOptions, vaultVersion: VaultVersion) => void;
}

const YieldFrame: React.FC<YieldFrameProps> = ({
  vault,
  vaultVersion,
  onVaultVersionChange,
  onVaultPress,
}) => {
  const { status, deposits, vaultLimit, asset, displayAsset, decimals } =
    useVaultData(vault);
  const {
    data: { totalBalance: v2Deposits, cap: v2VaultLimit },
    loading: v2DataLoading,
  } = useV2VaultData(vault);
  const yieldInfos = useAssetsYield(asset);
  const isLoading = useMemo(
    () => status === "loading" || v2DataLoading,
    [status, v2DataLoading]
  );
  const latestAPY = useLatestAPY(vault, vaultVersion);
  const loadingText = useTextAnimation(!latestAPY.fetched);
  const perfStr = latestAPY.fetched
    ? `${latestAPY.res.toFixed(2)}%`
    : loadingText;
  const color = getVaultColor(vault);
  const Logo = getAssetLogo(displayAsset);

  const [mode, setMode] = useState<"info" | "yield">("info");

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

  const onSwapMode = useCallback((e) => {
    e.stopPropagation();
    setMode((prev) => (prev === "info" ? "yield" : "info"));
  }, []);

  const logo = useMemo(() => {
    switch (displayAsset) {
      case "yvUSDC":
        return (
          <Logo
            height="208"
            width="auto"
            markerConfig={{ height: 48, width: 48, right: "16px" }}
          />
        );
      case "AAVE":
        return <Logo height="208" width="auto" showBackground />;
      default:
        return <Logo height="208" width="auto" />;
    }
  }, [displayAsset, Logo]);

  const body = useMemo(() => {
    switch (mode) {
      // @ts-ignore
      case "yield":
        if (yieldInfos) {
          return (
            <YieldComparison
              vault={vault}
              vaultVersion={vaultVersion}
              config={{
                background: `${color}29`,
              }}
              yieldInfos={yieldInfos}
            />
          );
        }
      // eslint-disable-next-line no-fallthrough
      default:
        return (
          <>
            <div className="mt-4 d-flex justify-content-center">{logo}</div>
            <div className="d-flex align-items-center mt-4">
              <SecondaryText fontSize={12} lineHeight={16} className="mr-auto">
                Projected Yield (APY)
              </SecondaryText>
              <Title fontSize={14} lineHeight={20} color={color}>
                {perfStr}
              </Title>
            </div>
            <div className="mt-auto">
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
            </div>
          </>
        );
    }
  }, [
    vault,
    vaultVersion,
    logo,
    asset,
    mode,
    color,
    perfStr,
    isLoading,
    totalDepositStr,
    depositLimitStr,
    yieldInfos,
  ]);

  return (
    <FrameContainer
      role="button"
      onClick={() => onVaultPress(vault, vaultVersion)}
    >
      <AnimatePresence exitBeforeEnter initial={false}>
        <Frame
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
          color={color}
        >
          <div className="d-flex w-100">
            {/* Tags */}
            <TagContainer>
              {productCopies[vault].tags.map((tag) => (
                <ProductTag key={tag} color={color}>
                  <Subtitle>{tag}</Subtitle>
                </ProductTag>
              ))}
            </TagContainer>

            {/* Mode switcher button */}
            {yieldInfos && (
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
          </div>
          {body}
        </Frame>
      </AnimatePresence>
    </FrameContainer>
  );
};

export default YieldFrame;
