import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { formatUnits } from "@ethersproject/units";

import {
  BaseIndicator,
  SecondaryText,
  Subtitle,
  Title,
} from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import { VotingEscrow } from "shared/lib/codegen";
import { shimmerKeyframe } from "shared/lib/designSystem/keyframes";
import sizes from "shared/lib/designSystem/sizes";
import {
  getDisplayAssets,
  getOptionAssets,
  isPutVault,
  VaultLiquidityMiningMap,
  VaultOptions,
} from "shared/lib/constants/constants";
import useWeb3Wallet from "shared/lib/hooks/useWeb3Wallet";
import useConnectWalletModal from "shared/lib/hooks/useConnectWalletModal";
import { getAssetDisplay, getAssetLogo } from "shared/lib/utils/asset";
import { usePendingTransactions } from "shared/lib/hooks/pendingTransactionsContext";
import { getVaultColor } from "shared/lib/utils/vault";
import useLoadingText from "shared/lib/hooks/useLoadingText";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import HelpInfo from "shared/lib/components/Common/HelpInfo";
import CapBar from "shared/lib/components/Deposit/CapBar";
import {
  useAssetBalance,
  useLiquidityGaugeV5PoolData,
  useV2VaultData,
} from "shared/lib/hooks/web3DataContext";
import { formatBigNumber } from "shared/lib/utils/math";
import UnstakingActionModal from "./LiquidityGaugeModal/UnstakingActionModal";
import ClaimActionModal from "./LiquidityGaugeModal/ClaimActionModal";
import { useAssetsPrice } from "shared/lib/hooks/useAssetPrice";
import StakingActionModal from "./LiquidityGaugeModal/StakingActionModal";
import {
  calculateBaseRewards,
  calculateBoostedRewards,
  calculateBoostMultiplier,
} from "shared/lib/utils/governanceMath";
import { BigNumber } from "ethers";
import useVotingEscrow from "shared/lib/hooks/useVotingEscrow";
import ApplyBoostModal from "./LiquidityGaugeModal/ApplyBoostModal";
import APYTable from "./APYTable";

const StakingPoolsContainer = styled.div`
  margin-top: 48px;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;

const StakingPoolCard = styled.div<{ color: string }>`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  background: ${colors.background.two};
  border: 2px ${theme.border.style} ${(props) => props.color}00;
  border-radius: ${theme.border.radius};
  margin-bottom: 48px;
  transition: 0.25s border-color ease-out;

  &:hover {
    animation: ${(props) => shimmerKeyframe(props.color)} 3s infinite;
    border: 2px ${theme.border.style} ${(props) => props.color};
  }
`;

const StakingPoolDataRow = styled.div.attrs({
  className: "d-flex align-items-center mt-4 w-100",
})``;

const StakingPoolSubtitle = styled(SecondaryText)`
  font-size: 12px;
  line-height: 16px;
  margin-top: 4px;
  color: ${colors.primaryText}52;
`;

const ClaimableTokenPillContainer = styled.div`
  margin-left: auto;

  @media (max-width: ${sizes.sm}px) {
    order: 4;
    width: 100%;
    margin: 24px 0px 8px 0px;
  }
`;

const ClaimableTokenPill = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  padding: 6px 12px;
  background: ${(props) => props.color}1F;
  border-radius: 8px;
`;

const ClaimableTokenAmount = styled(Subtitle)<{ color: string }>`
  color: ${(props) => props.color};
  margin-left: auto;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  width: 40px;
  height: 40px;
  border-radius: 100px;
`;

const PoolRewardData = styled(Title)`
  font-size: 14px;
  line-height: 20px;
  color: ${(props) => props.color};
`;

const StakingPoolCardFooter = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  border-top: ${theme.border.width} ${theme.border.style} ${colors.border};
`;

const StakingPoolCardFooterButton = styled(Title)<{
  active: boolean;
  color: string;
}>`
  flex: 1;
  font-size: 14px;
  line-height: 20px;
  padding: 14px 0;
  text-align: center;
  opacity: ${theme.hover.opacity};

  color: ${(props) => (props.active ? props.color : colors.primaryText)};

  &:hover {
    opacity: 1;
  }

  &:not(:first-child) {
    border-left: ${theme.border.width} ${theme.border.style} ${colors.border};
  }

  @media (max-width: ${sizes.sm}px) {
    flex: unset;
    width: 100%;

    &:not(:first-child) {
      border-left: unset;
      border-top: ${theme.border.width} ${theme.border.style} ${colors.border};
    }
  }
`;

interface LiquidityGaugeV5PoolProps {
  vaultOption: VaultOptions;
  totalVeRBN?: BigNumber;
  latestRBNLockedBlockTimestamp?: number;
}

const LiquidityGaugeV5Pool: React.FC<LiquidityGaugeV5PoolProps> = ({
  vaultOption,
  totalVeRBN,
  latestRBNLockedBlockTimestamp: latestRBNLockedBlockNumber,
}) => {
  const { t } = useTranslation();
  const { active } = useWeb3Wallet();
  const [, setShowConnectWalletModal] = useConnectWalletModal();
  const { pendingTransactions } = usePendingTransactions();
  const { data: lg5Data, loading: lg5DataLoading } =
    useLiquidityGaugeV5PoolData(vaultOption);

  const { prices, loading: assetPricesLoading } = useAssetsPrice();
  const {
    data: { asset, decimals, pricePerShare },
    loading: vaultDataLoading,
  } = useV2VaultData(vaultOption);
  const { balance: votingPower, loading: votingPowerLoading } =
    useAssetBalance("veRBN");

  const isAllLoading =
    lg5DataLoading ||
    assetPricesLoading ||
    vaultDataLoading ||
    votingPowerLoading;
  const loadingText = useLoadingText();

  // MODALS
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [showUnstakeModal, setShowUnstakeModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showApplyBoost, setShowApplyBoost] = useState(false);

  const color = getVaultColor(vaultOption);
  const ongoingTransaction:
    | "stakingApproval"
    | "stake"
    | "unstake"
    | "userCheckpoint"
    | "rewardClaim"
    | undefined = useMemo(() => {
    const ongoingPendingTx = pendingTransactions.find(
      (currentTx) =>
        [
          "stakingApproval",
          "stake",
          "unstake",
          "userCheckpoint",
          "rewardClaim",
        ].includes(currentTx.type) &&
        // @ts-ignore
        currentTx.stakeAsset === vaultOption &&
        !currentTx.status
    );

    if (!ongoingPendingTx) {
      return undefined;
    }

    return ongoingPendingTx.type as
      | "stakingApproval"
      | "stake"
      | "unstake"
      | "userCheckpoint"
      | "rewardClaim";
  }, [pendingTransactions, vaultOption]);

  const actionLoadingTextBase = useMemo(() => {
    switch (ongoingTransaction) {
      case "stake":
        return "Staking";
      case "stakingApproval":
        return "Approving";
      case "unstake":
        return "Unstaking";
      case "rewardClaim":
        return "Claiming";
      case "userCheckpoint":
        return "Applying Boost";
      default:
        return "Loading";
    }
  }, [ongoingTransaction]);

  const primaryActionLoadingText = useLoadingText(actionLoadingTextBase);

  const logo = useMemo(() => {
    const asset = getDisplayAssets(vaultOption);
    const Logo = getAssetLogo(asset);
    return <Logo />;
  }, [vaultOption]);

  // Check the block number difference between
  // latest rToken stake - latest lock veRBN
  // If the difference is positive, means user staked AFTER locking RBN (No need apply boost)
  // If negative, means user staked BEFORE locking RBN (Need apply boost)
  const canApplyBoost = useMemo(() => {
    if (
      lg5Data &&
      lg5Data.currentStake.gt(0) &&
      lg5Data.integrateCheckpointOf.gt(0) &&
      latestRBNLockedBlockNumber
    ) {
      return (
        lg5Data.integrateCheckpointOf.toNumber() - latestRBNLockedBlockNumber <
        0
      );
    }
    return false;
  }, [lg5Data, latestRBNLockedBlockNumber]);

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

  // Calculated boosted multiplier
  const calculateBoostedMultipler = useCallback(
    (stakedBalance: BigNumber) => {
      if (!lg5Data) {
        return 0;
      }
      const boostedMultiplier = calculateBoostMultiplier({
        workingBalance: lg5Data.workingBalances,
        workingSupply: lg5Data.workingSupply,
        gaugeBalance: stakedBalance,
        poolLiquidity: lg5Data.poolSize,
        veRBNAmount: votingPower,
        totalVeRBN: totalVeRBN || BigNumber.from("0"),
      });
      return boostedMultiplier;
    },
    [lg5Data, totalVeRBN, votingPower]
  );

  // Multiplier and percentage
  const boostInfo = useMemo(() => {
    if (!lg5Data) {
      return {
        multiplier: 0,
        percent: 0,
      };
    }
    const multiplier = calculateBoostedMultipler(lg5Data.currentStake);
    const percent = calculateBoostedRewards(baseAPY, multiplier);
    return {
      multiplier: multiplier || 0,
      percent: percent || 0,
    };
  }, [lg5Data, calculateBoostedMultipler, baseAPY]);

  // UI Display
  const boostDisplayInfo = useMemo(() => {
    if (!active) {
      return {
        multiplier: "",
        percent: "---",
        totalAPY: "---",
      };
    }
    if (isAllLoading) {
      return {
        multiplier: "",
        percent: loadingText,
        totalAPY: loadingText,
      };
    }

    const totalAPY = boostInfo.percent + baseAPY;
    return {
      multiplier: boostInfo.multiplier
        ? `(${boostInfo.multiplier.toFixed(2)}X)`
        : "",
      percent: boostInfo.percent ? `${boostInfo.percent.toFixed(2)}%` : "0.00%",
      totalAPY: totalAPY ? `${totalAPY.toFixed(2)}%` : "0.00%",
    };
  }, [active, isAllLoading, loadingText, boostInfo, baseAPY]);

  const renderUnstakeBalance = useCallback(() => {
    if (!active) {
      return "---";
    }

    return lg5Data ? formatBigNumber(lg5Data.unstakedBalance, decimals) : 0;
  }, [active, decimals, lg5Data]);

  const renderPoolReward = useCallback(() => {
    if (lg5DataLoading) {
      return loadingText;
    }

    return `${
      lg5Data ? formatBigNumber(lg5Data.poolRewardForDuration) : 0
    } RBN`;
  }, [lg5Data, lg5DataLoading, loadingText]);

  const rbnPill = useMemo(() => {
    if (!lg5Data || lg5Data.claimableRbn.isZero()) {
      return (
        <ClaimableTokenPillContainer>
          <ClaimableTokenPill color={color}>
            <BaseIndicator size={8} color={color} className="mr-2" />
            <Subtitle className="mr-2">RBN CLAIMED</Subtitle>
            <ClaimableTokenAmount color={color}>
              {active && lg5Data ? formatBigNumber(lg5Data.claimedRbn) : "---"}
            </ClaimableTokenAmount>
          </ClaimableTokenPill>
        </ClaimableTokenPillContainer>
      );
    }

    return (
      <ClaimableTokenPillContainer>
        <ClaimableTokenPill color={color}>
          <BaseIndicator size={8} color={color} className="mr-2" />
          <Subtitle className="mr-2">EARNED $RBN</Subtitle>
          <ClaimableTokenAmount color={color}>
            {active ? formatBigNumber(lg5Data.claimableRbn) : "---"}
          </ClaimableTokenAmount>
        </ClaimableTokenPill>
      </ClaimableTokenPillContainer>
    );
  }, [active, color, lg5Data]);

  const stakingPoolButtons = useMemo(() => {
    if (!active) {
      return (
        <StakingPoolCardFooterButton
          role="button"
          color={colors.green}
          onClick={() => {
            setShowConnectWalletModal(true);
          }}
          active={false}
        >
          CONNECT WALLET
        </StakingPoolCardFooterButton>
      );
    }

    return (
      <>
        <StakingPoolCardFooterButton
          role="button"
          color={color}
          onClick={() => {
            setShowStakeModal(true);
          }}
          active={ongoingTransaction === "stake"}
        >
          {ongoingTransaction === "stake" ? primaryActionLoadingText : "Stake"}
        </StakingPoolCardFooterButton>
        <StakingPoolCardFooterButton
          role="button"
          color={color}
          onClick={() => {
            setShowUnstakeModal(true);
          }}
          active={ongoingTransaction === "unstake"}
        >
          {ongoingTransaction === "unstake"
            ? primaryActionLoadingText
            : "Unstake"}
        </StakingPoolCardFooterButton>
        <StakingPoolCardFooterButton
          role="button"
          color={color}
          onClick={() => {
            setShowClaimModal(true);
          }}
          active={ongoingTransaction === "rewardClaim"}
        >
          {ongoingTransaction === "rewardClaim"
            ? primaryActionLoadingText
            : "Claim"}
        </StakingPoolCardFooterButton>
        {canApplyBoost && (
          <StakingPoolCardFooterButton
            role="button"
            color={color}
            onClick={() => setShowApplyBoost(true)}
            active
          >
            {ongoingTransaction === "userCheckpoint"
              ? primaryActionLoadingText
              : "Apply Boost"}
          </StakingPoolCardFooterButton>
        )}
      </>
    );
  }, [
    active,
    color,
    ongoingTransaction,
    primaryActionLoadingText,
    setShowConnectWalletModal,
    canApplyBoost,
  ]);

  return (
    <>
      <StakingActionModal
        show={showStakeModal}
        onClose={() => setShowStakeModal(false)}
        vaultOption={vaultOption}
        logo={logo}
        stakingPoolData={lg5Data}
        apysLoading={isAllLoading}
        baseAPY={baseAPY}
        calculateBoostedMultipler={calculateBoostedMultipler}
      />
      <UnstakingActionModal
        show={showUnstakeModal}
        onClose={() => setShowUnstakeModal(false)}
        vaultOption={vaultOption}
        logo={logo}
        stakingPoolData={lg5Data}
      />
      <ApplyBoostModal
        show={showApplyBoost}
        onClose={() => setShowApplyBoost(false)}
        vaultOption={vaultOption}
      />
      <ClaimActionModal
        show={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        logo={logo}
        vaultOption={vaultOption}
        stakingPoolData={lg5Data}
        apysLoading={isAllLoading}
        baseAPY={baseAPY}
        boostInfo={boostInfo}
      />
      <StakingPoolCard color={color}>
        <div className="d-flex flex-wrap w-100 p-3">
          {/* Card Title */}
          <div className="d-flex align-items-center">
            <LogoContainer>{logo}</LogoContainer>
            <div className="d-flex flex-column">
              <div className="d-flex align-items-center">
                <Title normalCased>{vaultOption}</Title>
                <TooltipExplanation
                  title={vaultOption}
                  explanation={
                    <>
                      {t("shared:TooltipExplanations:rToken", {
                        rTokenSymbol: vaultOption,
                        depositAsset: getAssetDisplay(asset),
                        vaultType: `${getAssetDisplay(
                          getOptionAssets(vaultOption)
                        )} ${isPutVault(vaultOption) ? "Put" : ""} Theta Vault`,
                        tokenTitle: t(
                          `shared:ProductCopies:${vaultOption}:title`
                        ),
                      })}
                      <br />
                      <br />
                      {t("webapp:LiquidityPool:rTokenCTA", {
                        rToken: vaultOption,
                      })}
                    </>
                  }
                  renderContent={({ ref, ...triggerHandler }) => (
                    <HelpInfo containerRef={ref} {...triggerHandler}>
                      i
                    </HelpInfo>
                  )}
                  learnMoreURL="https://gov.ribbon.finance/t/rgp-2-ribbon-liquidity-mining-program/90"
                />
              </div>
              <StakingPoolSubtitle>
                Your Unstaked Balance: {renderUnstakeBalance()}
              </StakingPoolSubtitle>
            </div>
          </div>

          {/* Claimable Pill */}
          {rbnPill}

          {/* Capbar */}
          <div className="w-100 mt-4">
            <CapBar
              loading={lg5DataLoading}
              current={
                lg5Data
                  ? parseFloat(formatUnits(lg5Data.currentStake, decimals))
                  : 0
              }
              cap={
                lg5Data
                  ? parseFloat(formatUnits(lg5Data.poolSize, decimals))
                  : 0
              }
              copies={{
                current: "Your Current Stake",
                cap: "Total Staked",
              }}
              labelConfig={{
                fontSize: 14,
              }}
              statsConfig={{
                fontSize: 14,
              }}
              barConfig={{
                height: 8,
                extraClassNames: "my-2",
                radius: 2,
              }}
            />
          </div>

          {/* Pool rewards */}
          <StakingPoolDataRow>
            <div className="d-flex align-items-center">
              <SecondaryText>
                {t("webapp:TooltipExplanations:poolRewards:title")}
              </SecondaryText>
              <TooltipExplanation
                title={t("webapp:TooltipExplanations:poolRewards:title")}
                explanation={t(
                  "webapp:TooltipExplanations:poolRewards:description"
                )}
                renderContent={({ ref, ...triggerHandler }) => (
                  <HelpInfo containerRef={ref} {...triggerHandler}>
                    i
                  </HelpInfo>
                )}
              />
            </div>
            <PoolRewardData className="ml-auto">
              {renderPoolReward()}
            </PoolRewardData>
          </StakingPoolDataRow>

          <StakingPoolDataRow>
            <APYTable
              color={color}
              overallAPY={{
                title: "APY",
                value: boostDisplayInfo.totalAPY,
              }}
              baseAPY={{
                title: t("webapp:TooltipExplanations:baseAPY:title"),
                value: isAllLoading ? loadingText : `${baseAPY.toFixed(2)}%`,
                tooltip: {
                  title: t("webapp:TooltipExplanations:baseAPY:title"),
                  explanation: t(
                    "webapp:TooltipExplanations:baseAPY:description"
                  ),
                },
              }}
              boostedAPY={{
                title: `${t(
                  "webapp:TooltipExplanations:boostedRewards:title"
                )} ${boostDisplayInfo.multiplier}`,
                value: boostDisplayInfo.percent,
                tooltip: {
                  title: t("webapp:TooltipExplanations:boostedRewards:title"),
                  explanation: t(
                    "webapp:TooltipExplanations:boostedRewards:description"
                  ),
                },
              }}
            />
          </StakingPoolDataRow>
        </div>
        <StakingPoolCardFooter>{stakingPoolButtons}</StakingPoolCardFooter>
      </StakingPoolCard>
    </>
  );
};

const LiquidityGaugeV5Pools = () => {
  const { account } = useWeb3Wallet();
  const votingEscrowContract: VotingEscrow = useVotingEscrow();
  const [totalVeRBN, setTotalVeRBN] = useState<BigNumber>();

  // The latest block number that user has locked, increase lock amt, or increase lock duration
  const [latestRBNLockedBlockTimestamp, setLatestRBNLockedBlockTimestamp] =
    useState<number>();

  // Fetch totalverbn
  useEffect(() => {
    if (votingEscrowContract && !totalVeRBN) {
      votingEscrowContract["totalSupply()"]().then((totalSupply: BigNumber) => {
        setTotalVeRBN(totalSupply);
      });
    }
  }, [votingEscrowContract, totalVeRBN]);

  // Fetch the latest `Deposit` event emitted by voting escrow contract
  useEffect(() => {
    if (
      account &&
      votingEscrowContract &&
      latestRBNLockedBlockTimestamp === undefined
    ) {
      const depositFilter = votingEscrowContract.filters.Deposit(account);
      votingEscrowContract
        .queryFilter(depositFilter)
        .then(async (depositEvents: any[]) => {
          const latestDeposit = depositEvents[depositEvents.length - 1];
          if (latestDeposit) {
            const block = await latestDeposit.getBlock();
            setLatestRBNLockedBlockTimestamp(block.timestamp);
          } else {
            setLatestRBNLockedBlockTimestamp(0);
          }
        });
    }
  }, [account, votingEscrowContract, latestRBNLockedBlockTimestamp]);

  return (
    <StakingPoolsContainer>
      <Title fontSize={18} lineHeight={24} className="mb-4 w-100">
        VAULT GAUGES
      </Title>
      {Object.keys(VaultLiquidityMiningMap.lg5).map((option) => (
        <LiquidityGaugeV5Pool
          key={option}
          vaultOption={option as VaultOptions}
          totalVeRBN={totalVeRBN}
          latestRBNLockedBlockTimestamp={latestRBNLockedBlockTimestamp}
        />
      ))}
    </StakingPoolsContainer>
  );
};

export default LiquidityGaugeV5Pools;
