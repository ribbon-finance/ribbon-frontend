import { formatUnits } from "@ethersproject/units";
import { AnimatePresence, motion } from "framer";
import React, { useMemo } from "react";
import styled from "styled-components";

import {
  isPutVault,
  VaultOptions,
  VaultVersion,
} from "../../../constants/constants";
import {
  BaseButton,
  SecondaryText,
  Subtitle,
  Title,
} from "../../../designSystem";
import theme from "../../../designSystem/theme";
import useLatestAPY from "../../../hooks/useLatestAPY";
import useLoadingText from "../../../hooks/useLoadingText";
import { useV2VaultData, useVaultData } from "../../../hooks/web3DataContext";
import { getAssetLogo } from "../../../utils/asset";
import {
  formatAmount,
  formatSignificantDecimals,
  isPracticallyZero,
} from "../../../utils/math";
import { getVaultColor } from "../../../utils/vault";
import CapBar from "../../Deposit/CapBar";
import EarnCard from "../../Common/EarnCard";
import colors from "../../../designSystem/colors";

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
    box-shadow: ${(props) => props.color}66 0px 0px 70px;
    border: 2px ${theme.border.style} ${(props) => props.color};
  }
`;

const ProductCard = styled(motion.div)<{ color: string; vault: VaultOptions }>`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  border-radius: 10px;
  border: 2px ${theme.border.style} ${colors.background.two};
  transition: 0.25s box-shadow ease-out, 0.25s border ease-out;
  width: 290px;
  position: relative;
  height: 100%;
  padding: 16px;

  &:hover {
    box-shadow: ${(props) => props.color}66 0px 0px 70px;
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

const ProductInfoEarn = styled.div`
  display: flex;
  flex-direction: column;
  height: 429px;
  border-radius: ${theme.border.radius};
  justify-content: center;
  align-items: center;
  padding: -16px;
  margin: -16px;
  background: #030309;
  box-shadow: inset 0px 0px 24px rgba(255, 255, 255, 0.12);
  overflow: hidden;
`;

const EarnCapacityText = styled(Title)`
  color: ${colors.tertiaryText};
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  height: 20px;
  margin-bottom: 24px;
`;

const VaultFullText = styled(SecondaryText)`
  color: ${colors.red};
  text-transform: none;
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
    data: { totalBalance: v2Deposits, cap: v2VaultLimit, decimals: v2Decimals },
    loading: v2DataLoading,
  } = useV2VaultData(vault);

  const isLoading = useMemo(
    () => status === "loading" || v2DataLoading,
    [status, v2DataLoading]
  );
  const latestAPY = useLatestAPY(vault, vaultVersion);
  const loadingText = useLoadingText();
  const perfStr = latestAPY.fetched
    ? `${latestAPY.res.toFixed(2)}%`
    : loadingText;
  const color = getVaultColor(vault);
  const Logo = getAssetLogo(displayAsset);

  const isVaultMaxCapacity = useMemo(() => {
    if (v2DataLoading) {
      return undefined;
    }
    return isPracticallyZero(v2VaultLimit.sub(v2Deposits), v2Decimals);
  }, [v2DataLoading, v2Decimals, v2Deposits, v2VaultLimit]);

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
      case "earn":
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
  }, [
    logo,
    asset,
    color,
    perfStr,
    isLoading,
    totalDepositStr,
    depositLimitStr,
  ]);

  return (
    <FrameContainer
      role="button"
      onClick={() => onVaultPress(vault, vaultVersion)}
    >
      {vault === "rEARN" ? (
        <ProductCard color={color} vault={vault}>
          <ProductInfoEarn>
            <EarnCapacityText>
              {v2DataLoading || isVaultMaxCapacity === undefined ? (
                loadingText
              ) : isVaultMaxCapacity ? (
                <VaultFullText>Vault is currently full</VaultFullText>
              ) : (
                formatAmount(totalDepositStr) +
                " USDC / " +
                formatAmount(depositLimitStr) +
                " USDC"
              )}
            </EarnCapacityText>
            <EarnCard color={color} height={429} />
          </ProductInfoEarn>
        </ProductCard>
      ) : (
        <AnimatePresence exitBeforeEnter initial={false}>
          <Frame
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
                <ProductTag color={color}>
                  <Subtitle>
                    {isPutVault(vault) ? "PUT-SELLING" : "COVERED CALL"}
                  </Subtitle>
                </ProductTag>
              </TagContainer>
            </div>
            {body}
          </Frame>
        </AnimatePresence>
      )}
    </FrameContainer>
  );
};

export default YieldFrame;
