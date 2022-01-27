import React, { useCallback, useMemo, useState } from "react";
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
import { shimmerKeyframe } from "shared/lib/designSystem/keyframes";
import sizes from "shared/lib/designSystem/sizes";
import {
  getAssets,
  getDisplayAssets,
  VaultLiquidityMiningMap,
  VaultOptions,
} from "shared/lib/constants/constants";
import useWeb3Wallet from "../../hooks/useWeb3Wallet";
import useConnectWalletModal from "shared/lib/hooks/useConnectWalletModal";
import { getAssetDecimals, getAssetLogo } from "shared/lib/utils/asset";
import { usePendingTransactions } from "shared/lib/hooks/pendingTransactionsContext";
import { getVaultColor } from "shared/lib/utils/vault";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import HelpInfo from "shared/lib/components/Common/HelpInfo";
import { productCopies } from "shared/lib/components/Product/productCopies";
import CapBar from "shared/lib/components/Deposit/CapBar";
import { useLiquidityGaugeV5PoolData } from "shared/lib/hooks/web3DataContext";
import { formatBigNumber } from "shared/lib/utils/math";
import UnstakingActionModal from "./LiquidityGaugeModal/UnstakingActionModal";
import ClaimActionModal from "./LiquidityGaugeModal/ClaimActionModal";

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

const StakingPoolTitle = styled(Title)`
  text-transform: none;
`;

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
  padding: 8px 12px;
  border: ${theme.border.width} ${theme.border.style} ${(props) => props.color};
  background: ${(props) => props.color}14;
  border-radius: 100px;
`;

const ClaimableTokenAmount = styled(Subtitle)<{ color: string }>`
  color: ${(props) => props.color};
  margin-left: auto;
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

// const PoolRewardData = styled(Title)`
//   font-size: 14px;
//   line-height: 20px;
//   color: ${(props) => props.color};
// `;

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
}

const LiquidityGaugeV5Pool: React.FC<LiquidityGaugeV5PoolProps> = ({
  vaultOption,
}) => {
  const { active } = useWeb3Wallet();
  const [, setShowConnectWalletModal] = useConnectWalletModal();
  const { pendingTransactions } = usePendingTransactions();
  const { data: lg5Data, loading: lg5DataLoading } =
    useLiquidityGaugeV5PoolData(vaultOption);

  const decimals = getAssetDecimals(getAssets(vaultOption));
  const color = getVaultColor(vaultOption);
  const ongoingTransaction:
    | "stakingApproval"
    | "stake"
    | "unstake"
    | "rewardClaim"
    | undefined = useMemo(() => {
    const ongoingPendingTx = pendingTransactions.find(
      (currentTx) =>
        ["stakingApproval", "stake", "unstake", "rewardClaim"].includes(
          currentTx.type
        ) &&
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
      | "rewardClaim";
  }, [pendingTransactions, vaultOption]);

  const [showUnstakeModal, setShowUnstakeModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);

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
      default:
        return "Loading";
    }
  }, [ongoingTransaction]);

  const primaryActionLoadingText = useTextAnimation(
    Boolean(ongoingTransaction),
    {
      texts: [
        actionLoadingTextBase,
        `${actionLoadingTextBase} .`,
        `${actionLoadingTextBase} ..`,
        `${actionLoadingTextBase} ...`,
      ],
      interval: 250,
    }
  );

  const logo = useMemo(() => {
    const asset = getDisplayAssets(vaultOption);
    const Logo = getAssetLogo(asset);

    switch (asset) {
      case "WETH":
        return <Logo height="70%" />;
      default:
        return <Logo />;
    }
  }, [vaultOption]);

  const renderUnstakeBalance = useCallback(() => {
    if (!active) {
      return "---";
    }

    return lg5Data ? formatBigNumber(lg5Data.unstakedBalance, decimals) : 0;
  }, [active, decimals, lg5Data]);

  // const showStakeModal = useMemo(() => {
  //   if (ongoingTransaction === "stake") {
  //     /** Always show staking modal when there is ongoing transaction */
  //     return true;
  //   } else if (ongoingTransaction === "unstake") {
  //     /** Likewise with unstaking transaction */
  //     return false;
  //   }

  //   return isStakeAction;
  // }, [isStakeAction, ongoingTransaction]);

  const rbnPill = useMemo(() => {
    /**
     * TODO: Below if should represent when earned amount is 0 and there is claimed amount
     */
    if (!lg5Data || lg5Data.claimableRbn.isZero()) {
      return (
        <ClaimableTokenPillContainer>
          <ClaimableTokenPill color={color}>
            <BaseIndicator size={8} color={color} className="mr-2" />
            <Subtitle className="mr-2">AMOUNT CLAIMED</Subtitle>
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
            /** TODO:  */
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
      </>
    );
  }, [
    active,
    color,
    ongoingTransaction,
    primaryActionLoadingText,
    setShowConnectWalletModal,
  ]);

  return (
    <>
      <UnstakingActionModal
        show={showUnstakeModal}
        onClose={() => setShowUnstakeModal(false)}
        vaultOption={vaultOption}
        logo={logo}
        stakingPoolData={lg5Data}
      />
      <ClaimActionModal
        show={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        logo={logo}
        vaultOption={vaultOption}
        stakingPoolData={lg5Data}
      />
      <StakingPoolCard color={color}>
        <div className="d-flex flex-wrap w-100 p-3">
          {/* Card Title */}
          <div className="d-flex align-items-center">
            <LogoContainer color={color}>{logo}</LogoContainer>
            <div className="d-flex flex-column">
              <div className="d-flex align-items-center">
                <StakingPoolTitle>{vaultOption}</StakingPoolTitle>
                <TooltipExplanation
                  title={vaultOption}
                  explanation={
                    productCopies[vaultOption].liquidityMining.explanation
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
                cap: "Pool Size",
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

          {/* Estimated pool rewards */}
          {/* <div className="d-flex align-items-center mt-4 w-100">
            <div className="d-flex align-items-center">
              <SecondaryText>Your estimated rewards </SecondaryText>
            </div>
            <PoolRewardData className="ml-auto" color={color}>
              {renderEstimatedRewards()} RBN
            </PoolRewardData>
          </div> */}

          {/* Pool reward of duration */}
          {/* <div className="d-flex align-items-center mt-4 w-100">
            <div className="d-flex align-items-center">
              <SecondaryText>Pool rewards </SecondaryText>
            </div>
            <PoolRewardData className="ml-auto">10000 RBN</PoolRewardData>
          </div> */}
        </div>
        <StakingPoolCardFooter>{stakingPoolButtons}</StakingPoolCardFooter>
      </StakingPoolCard>
    </>
  );
};

const LiquidityGaugeV5Pools = () => {
  return (
    <StakingPoolsContainer>
      <Title fontSize={18} lineHeight={24} className="mb-4 w-100">
        STAKING POOLS
      </Title>
      {Object.keys(VaultLiquidityMiningMap.lg5).map((option) => (
        <LiquidityGaugeV5Pool
          key={option}
          vaultOption={option as VaultOptions}
        />
      ))}
    </StakingPoolsContainer>
  );
};

export default LiquidityGaugeV5Pools;
