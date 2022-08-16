import React, { useCallback, useMemo, useState, useEffect } from "react";
import styled, { css } from "styled-components";
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
  isDisabledVault,
  VaultAddressMap,
} from "../../../constants/constants";
import { BoostIcon } from "../../../assets/icons/icons";
import { getAssetDisplay, getAssetLogo } from "../../../utils/asset";
import { getVaultColor } from "../../../utils/vault";
import ModalContentExtra from "../../Common/ModalContentExtra";
import { VaultAccount } from "../../../models/vault";
import {
  useLiquidityGaugeV5PoolData,
  useV2VaultData,
  useVaultData,
} from "../../../hooks/web3DataContext";
import useLatestAPY from "../../../hooks/useLatestAPY";
import useStrikePrice from "../../../hooks/useStrikePrice";
import { animatedGradientKeyframe } from "../../../designSystem/keyframes";
import { ETHMonoLogo } from "../../../assets/icons/vaultMonoLogos";
import { AVAXMonoLogo } from "../../../assets/icons/vaultMonoLogos";
import { SOLMonoLogo } from "../../../assets/icons/vaultMonoLogos";
import useWeb3Wallet from "../../../hooks/useWeb3Wallet";
import TooltipExplanation from "../../Common/TooltipExplanation";
import HelpInfo from "../../Common/HelpInfo";
import { calculateBaseRewards } from "../../../utils/governanceMath";
import { useAssetsPrice } from "../../../hooks/useAssetPrice";
import { RibbonVaultPauser } from "../../../codegen";
import useVaultPauser from "../../../hooks/useV2VaultPauserContract";
import { BigNumber } from "ethers";
import EarnCard from "../../Common/EarnCard";

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

const ProductInfoEarn = styled.div<{ connected: boolean }>`
  display: flex;
  flex-direction: column;
  height: ${(props) => `${props.connected ? `504px` : `447px`}`};
  border-radius: ${theme.border.radius};
  justify-content: center;
  align-items: center;
  padding: -16px;
  margin: -16px;
  background: #030309;
  box-shadow: inset 0px 0px 24px rgba(255, 255, 255, 0.12);
  overflow: hidden;
`;

const StrikeContainer = styled.div`
  display: flex;

  > div {
    width: 50%;

    &:not(:first-child) {
      padding-left: 8px;
    }
  }
`;

const StrikePrice = styled.div<{ color: string }>`
  color: ${(props) => props.color};
  font-family: VCR;
  font-size: 14px;
`;

const StrikeTitle = styled.div`
  font-size: 12px;
  color: ${colors.tertiaryText};
`;

const RangeContainer = styled.div`
  width: 100%;
  height: 4px;
  background: ${colors.background.four};
  position: relative;
  margin-bottom: 24px;
  border-radius: 10px;
`;

const RangeCenter = styled.div`
  width: 1px;
  height: 8px;
  background: white;
  position: absolute;
  top: -2px;
  left: 50%;
  z-index: 100;
`;

const TotalYieldTitle = styled.div`
  display: flex;
  font-size: 12px;
  width: 100%;
  color: ${colors.tertiaryText};
  margin-top: 8px;

  > * {
    margin: auto 0;
    margin-left: 8px;
  }
`;

const YieldExplainerTitle = styled.div<{ color: string }>`
  color: ${(props) => props.color};
  fontsize: 14px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;

  > span {
    &:last-child {
      font-family: VCR;
    }
  }
`;

const YieldExplainerStat = styled.div`
  fontsize: 14px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  margin-left: 8px;

  > span {
    &:first-child {
      margin-left: 8px;
    }

    &:last-child {
      font-family: VCR;
    }
  }
`;

const BoostWrapper = styled(Title)`
  font-size: 24px;
  width: 100%;
  margin-top: 4px;
  margin-bottom: 16px;
  display: flex;

  > * {
    margin: auto 0;
  }

  svg {
    margin-left: 12px;
  }
`;

const StrikeBarContainer = styled.div`
  width: 100%;
  position: absolute;
  display: flex;
`;

const StrikeBar = styled.div`
  flex: 1;
  height: 4px;
`;

const StrikeBarBG = styled.div<{
  width: string;
  // Color in hex
  color: string;
  isLeft?: boolean;
}>`
  position: relative;
  width: ${(props) => props.width};
  height: 100%;
  background-color: ${(props) => `${props.color}30`};
  ${(props) =>
    props.isLeft
      ? css`
          margin-left: auto;
        `
      : css`
          margin-right: auto;
        `}
`;

const StrikeDot = styled.div<{
  color: string;
  hide: boolean;
  isLeft?: boolean;
}>`
  position: absolute;
  height: 4px;
  width: ${(props) => (props.hide ? 0 : "4px")};
  border-radius: 2px;
  margin-left: -2px;
  background-color ${(props) => props.color};
  ${(props) =>
    props.isLeft
      ? css`
          left: 0px;
        `
      : css`
          right: 0px;
        `}
`;

const ParagraphText = styled(SecondaryText)`
  color: ${colors.secondaryText};
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  margin-top: 24px;
  margin-left: 32px;
  margin-right: 32px;
  text-align: center;
`;

const HighlightedText = styled.span`
  color: ${colors.primaryText};
  cursor: help;

  poin &:hover {
    color: ${colors.primaryText}CC;
  }
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
  const isLoading = useMemo(() => status === "loading", [status]);
  const color = getVaultColor(vault);
  const {
    strikePrice,
    currentPrice,
    isLoading: priceLoading,
  } = useStrikePrice(vault, vaultVersion);
  const latestAPY = useLatestAPY(vault, vaultVersion);
  const { data: lg5Data, loading: lg5DataLoading } =
    useLiquidityGaugeV5PoolData(vault);
  const {
    data: { pricePerShare },
  } = useV2VaultData(vault);
  const { prices } = useAssetsPrice();
  const { account } = useWeb3Wallet();
  const loadingText = useLoadingText();

  const baseAPY = useMemo(() => {
    if (!lg5Data) {
      return 0;
    }
    const rewards = calculateBaseRewards({
      poolSize: lg5Data.poolSize,
      poolReward: lg5Data.poolRewardForDuration,
      pricePerShare,
      decimals,
      assetPrice: prices[asset],
      rbnPrice: prices["RBN"],
    });

    return rewards;
  }, [asset, decimals, lg5Data, pricePerShare, prices]);

  const isActiveVault = vaultVersion === "v2" && !isDisabledVault(vault);

  const totalProjectedYield =
    latestAPY.fetched && !lg5DataLoading
      ? isActiveVault
        ? `${(latestAPY.res + baseAPY).toFixed(2)}%`
        : "0%"
      : loadingText;
  const vaultYield = latestAPY.fetched
    ? isActiveVault
      ? `${latestAPY.res.toFixed(2)}%`
      : "0%"
    : loadingText;
  const baseStakingYield = !lg5DataLoading
    ? isActiveVault
      ? `${baseAPY.toFixed(2)}%`
      : "0%"
    : loadingText;

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

  const displayRange = useCallback(
    (isLeft: boolean = true, strike: number, current: number) => {
      const OTM = isPutVault(vault) ? strike < current : current > strike;

      if (priceLoading) return false;

      if (vaultVersion === "v1") return false;

      if (strike === current) return false;

      if (isLeft && !OTM) {
        return true;
      } else if (isLeft && OTM) {
        return false;
      } else if (!isLeft && OTM) {
        return true;
      } else if (!isLeft && !OTM) {
        return false;
      }
    },
    [priceLoading, vault, vaultVersion]
  );

  const Range = useCallback(
    ({ vault }) => {
      const strike = strikePrice(false) as number;
      const current = currentPrice(false) as number;

      const strikePriceWithExtraMargin = strike * 1.2;
      const diff = strikePriceWithExtraMargin - strike;
      // Range is the width of the bar.
      // Calculate by taking the difference between current price and strike price,
      // divided by the total number of units of the bar on one side.
      const range = Math.min(
        (Math.abs(current - strike) / diff) * 100,
        // Maximum is 100%
        100
      );

      const leftBarColor = isPutVault(vault) ? colors.red : colors.green;
      const rightBarColor = isPutVault(vault) ? colors.green : colors.red;

      return (
        <StrikeBarContainer>
          <StrikeBar>
            <StrikeBarBG
              isLeft
              width={displayRange(true, strike, current) ? `${range}%` : "0"}
              color={leftBarColor}
            >
              <StrikeDot
                isLeft
                hide={displayRange(true, strike, current) ? false : true}
                color={leftBarColor}
              />
            </StrikeBarBG>
          </StrikeBar>
          <StrikeBar>
            <StrikeBarBG
              width={displayRange(false, strike, current) ? `${range}%` : "0"}
              color={rightBarColor}
            >
              <StrikeDot
                hide={displayRange(false, strike, current) ? false : true}
                color={rightBarColor}
              />
            </StrikeBarBG>
          </StrikeBar>
        </StrikeBarContainer>
      );
    },
    [displayRange, currentPrice, strikePrice]
  );

  const strikePriceColor = useMemo(() => {
    const strike = strikePrice(false);
    const current = currentPrice(false);

    if (strike === current || priceLoading) {
      return colors.primaryText;
    } else {
      if (isPutVault(vault)) {
        return current > strike ? colors.green : colors.red;
      } else {
        return current < strike ? colors.green : colors.red;
      }
    }
  }, [strikePrice, currentPrice, priceLoading, vault]);

  const StrikeWidget = useCallback(() => {
    return (
      <>
        <StrikeContainer>
          <div>
            <StrikeTitle>{t("shared:YieldCard:weeklyStrikePrice")}</StrikeTitle>
            <StrikePrice color={colors.primaryText}>
              {isActiveVault ? strikePrice() : "N/A"}
            </StrikePrice>
          </div>
          <div>
            <StrikeTitle>{t("shared:YieldCard:currentPrice")}</StrikeTitle>
            <StrikePrice
              color={
                vaultVersion === "v2" ? strikePriceColor : colors.primaryText
              }
            >
              {currentPrice()}
            </StrikePrice>
          </div>
        </StrikeContainer>
        <RangeContainer>
          <Range vault={vault} />
          <RangeCenter />
        </RangeContainer>
      </>
    );
  }, [
    t,
    vaultVersion,
    strikePrice,
    strikePriceColor,
    isActiveVault,
    currentPrice,
    Range,
    vault,
  ]);

  const EarnContent = useCallback(() => {
    return (
      <>
        <Title fontSize={28} lineHeight={40}>
          {t(`shared:ProductCopies:${vault}:title`)}
        </Title>

        <EarnCard
          color={color}
          height={account === null || account === undefined ? 447 : 504}
        />
        <ParagraphText>
          Earn up to <HighlightedText>15% APY</HighlightedText> with a{" "}
          <HighlightedText>fully principal protected</HighlightedText> vault
          strategy
        </ParagraphText>
      </>
    );
  }, [color, t, vault, account]);

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
        <TotalYieldTitle>
          {t("shared:YieldCard:totalProjectedYield")}
          <TooltipExplanation
            explanation={
              <>
                <YieldExplainerTitle color={color}>
                  <span>{t("shared:YieldCard:totalProjectedYield")}</span>
                  <span>{totalProjectedYield}</span>
                </YieldExplainerTitle>
                <YieldExplainerStat>
                  <span>{t("shared:YieldCard:vaultYield")}</span>
                  <span>{vaultYield}</span>
                </YieldExplainerStat>
                <YieldExplainerStat>
                  <span>{t("shared:YieldCard:baseStakingYield")}</span>
                  <span>{baseStakingYield}</span>
                </YieldExplainerStat>
                <br />
                <p>{t("shared:YieldCard:yieldExplainerDesc")}</p>
              </>
            }
            renderContent={({ ref, ...triggerHandler }) => (
              <HelpInfo containerRef={ref} {...triggerHandler}>
                i
              </HelpInfo>
            )}
          />
        </TotalYieldTitle>
        <BoostWrapper>
          {totalProjectedYield}{" "}
          {baseAPY > 0 && vaultVersion === "v2" && (
            <BoostIcon color={color} backgroundColor={`${color}25`} />
          )}
        </BoostWrapper>
        <StrikeWidget />
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
    displayAsset,
    color,
    t,
    vault,
    totalProjectedYield,
    vaultYield,
    baseStakingYield,
    baseAPY,
    vaultVersion,
    StrikeWidget,
    isLoading,
    v2DataLoading,
    totalDepositStr,
    depositLimitStr,
    asset,
  ]);

  const contract = useVaultPauser(chainId || 1) as RibbonVaultPauser;
  const vaultAddress = VaultAddressMap[vault][vaultVersion];
  const [pausedAmount, setPausedAmount] = useState(BigNumber.from(0));
  const [positionState, setPositionState] = useState<
    "position" | "paused" | "partiallyPaused"
  >("position");

  // temporary: set the paused amount and canResume bool;
  // to be replaced with subgraph data
  useEffect(() => {
    if (contract && vaultAddress && account && !isSolanaVault(vault)) {
      contract
        .getPausePosition(vaultAddress, account)
        .then(([, pauseAmount]) => {
          setPausedAmount(pauseAmount);
        });
    }
  }, [contract, vaultAddress, account, decimals, vault]);

  // set state of user's position
  useMemo(() => {
    if (!vaultAccount) {
      return;
    }
    const isPaused = !isPracticallyZero(pausedAmount, decimals);
    const hasBalanceAfterPause = !isPracticallyZero(
      vaultAccount.totalBalance,
      decimals
    );
    if (isPaused && !hasBalanceAfterPause) {
      setPositionState("paused");
    }
    if (!isPaused && hasBalanceAfterPause) {
      setPositionState("position");
    }
    if (isPaused && hasBalanceAfterPause) {
      setPositionState("partiallyPaused");
    }
  }, [vaultAccount, decimals, pausedAmount]);

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
            <SecondaryText
              color={positionState === "position" ? undefined : color}
              fontSize={12}
              className="mr-auto"
            >
              {positionState === "position" &&
                t("shared:YieldCard:yourPosition")}
              {positionState === "paused" && "Position Paused"}
              {positionState === "partiallyPaused" && "Partially Paused"}
            </SecondaryText>
            <Title fontSize={14}>
              {vaultAccount
                ? `${formatBigNumber(
                    vaultAccount.totalBalance.add(pausedAmount),
                    decimals
                  )} ${getAssetDisplay(asset)}`
                : "---"}
            </Title>
          </div>
        </ModalContentExtra>
      );
    }
  }, [
    vaultVersion,
    vaultBalanceInAsset,
    decimals,
    chainId,
    t,
    positionState,
    color,
    vaultAccount,
    pausedAmount,
    asset,
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
    } else {
      return null;
    }
  }, [vault, color]);

  return (
    <CardContainer>
      <AnimatePresence exitBeforeEnter initial={false}>
        <ProductCard
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
          {vault === "rEARN" ? (
            <>
              <ProductInfoEarn
                connected={
                  account === null || account === undefined ? false : true
                }
              >
                <EarnContent />
              </ProductInfoEarn>
            </>
          ) : (
            <>
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
                      hasVaultVersion(vault, version) ? (
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
              </TopContainer>
              <ProductInfo>
                <ProductInfoContent />
              </ProductInfo>
              {modalContentExtra}
            </>
          )}
        </ProductCard>
      </AnimatePresence>
    </CardContainer>
  );
};

export default YieldCard;
