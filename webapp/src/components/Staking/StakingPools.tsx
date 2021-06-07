import React, { useCallback, useMemo, useState } from "react";
import styled, { keyframes } from "styled-components";
import { formatUnits } from "@ethersproject/units";
import { useWeb3React } from "@web3-react/core";

import { SecondaryText, Subtitle, Title } from "shared/lib/designSystem";
import {
  getAssets,
  VaultLiquidityMiningMap,
  LiquidityMiningPoolOrder,
  VaultOptions,
} from "shared/lib/constants/constants";
import theme from "shared/lib/designSystem/theme";
import colors from "shared/lib/designSystem/colors";
import {
  USDCLogo,
  WBTCLogo,
  WETHLogo,
} from "shared/lib/assets/icons/erc20Assets";
import CapBar from "shared/lib/components/Deposit/CapBar";
import useConnectWalletModal from "../../hooks/useConnectWalletModal";
import useStakingPool from "../../hooks/useStakingPool";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";
import { getAssetDecimals } from "shared/lib/utils/asset";
import { formatBigNumber } from "shared/lib/utils/math";
import useTokenAllowance from "../../hooks/useTokenAllowance";
import StakingApprovalModal from "./Modal/StakingApprovalModal";
import usePendingTransactions from "../../hooks/usePendingTransactions";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import { productCopies } from "shared/lib/components/Product/productCopies";
import StakingActionModal from "./Modal/StakingActionModal";
import sizes from "shared/lib/designSystem/sizes";
import StakingClaimModal from "./Modal/StakingClaimModal";
import HelpInfo from "../Common/HelpInfo";

const StakingPoolsContainer = styled.div`
  margin-top: 48px;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;

const SectionHeader = styled(Title)`
  font-size: 18px;
  line-height: 24px;
`;

const shimmerKeyframe = keyframes`
    0% {
      box-shadow: ${colors.red}66 8px 16px 80px;
    }
    50% {
      box-shadow: ${colors.red}29 8px 16px 80px;
    }
    100% {
      box-shadow: ${colors.red}66 8px 16px 80px;
    }
`;

const StakingPoolCard = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: ${theme.border.radius};
  margin-bottom: 48px;
  box-shadow: ${colors.red}29 8px 16px 80px;

  &:hover {
    animation: ${shimmerKeyframe} 3s infinite;
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

const ClaimableTokenPill = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border: ${theme.border.width} ${theme.border.style} ${colors.red};
  background: ${colors.red}14;
  border-radius: 100px;
`;

const ClaimableTokenIndicator = styled.div`
  height: 8px;
  width: 8px;
  background: ${colors.red};
  margin-right: 8px;
  border-radius: 4px;
`;

const ClaimableTokenAmount = styled(Subtitle)`
  color: ${colors.red};
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
  background: ${colors.red}29;
`;

const RedWBTCLogo = styled(WBTCLogo)`
  && * {
    fill: ${colors.red};
  }
`;

const RedUSDCLogo = styled(USDCLogo)`
  .content {
    fill: ${colors.red};
  }

  .background {
    fill: none;
  }
`;

const RedWETHLogo = styled(WETHLogo)`
  .cls-1,
  .cls-5 {
    fill: ${colors.red}66;
  }

  .cls-2,
  .cls-6 {
    fill: ${colors.red}CC;
  }

  .cls-3,
  .cls-4 {
    fill: ${colors.red};
  }
`;

const ExpectedYieldData = styled(Title)`
  font-size: 14px;
  line-height: 20px;
`;

const StakingPoolCardFooter = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  border-top: ${theme.border.width} ${theme.border.style} ${colors.border};
`;

const StakingPoolCardFooterButton = styled(Title)<{ active: boolean }>`
  flex: 1;
  font-size: 14px;
  line-height: 20px;
  padding: 14px 0;
  text-align: center;

  color: ${(props) => (props.active ? colors.green : colors.primaryText)};

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

interface StakingPoolProps {
  vaultOption: VaultOptions;
}

const StakingPool: React.FC<StakingPoolProps> = ({ vaultOption }) => {
  const { active } = useWeb3React();
  const [, setShowConnectWalletModal] = useConnectWalletModal();
  const { data: stakingPoolData } = useStakingPool(vaultOption);
  const decimals = getAssetDecimals(getAssets(vaultOption));
  const tokenAllowance = useTokenAllowance(
    vaultOption,
    VaultLiquidityMiningMap[vaultOption]
  );
  const [pendingTransactions] = usePendingTransactions();

  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [isStakeAction, setIsStakeAction] = useState(true);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);

  const ongoingTransaction:
    | "approval"
    | "stake"
    | "unstake"
    | "rewardClaim"
    | undefined = useMemo(() => {
    for (let i = 0; i < pendingTransactions.length; i++) {
      const currentTx = pendingTransactions[i];

      // @ts-ignore
      if (currentTx.stakeAsset === vaultOption) {
        /** Pending transaction with stake asset can only be this 3 state */
        return currentTx.type as
          | "approval"
          | "stake"
          | "unstake"
          | "rewardClaim";
      }
    }

    return undefined;
  }, [pendingTransactions, vaultOption]);

  const hasAllowance = useMemo(() => {
    if (!tokenAllowance || tokenAllowance.isZero()) {
      return false;
    }

    setShowApprovalModal(false);

    return true;
  }, [tokenAllowance]);

  const actionLoadingTextBase = useMemo(() => {
    switch (ongoingTransaction) {
      case "stake":
        return "Staking";
      case "approval":
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
    [
      actionLoadingTextBase,
      `${actionLoadingTextBase} .`,
      `${actionLoadingTextBase} ..`,
      `${actionLoadingTextBase} ...`,
    ],
    250,
    Boolean(ongoingTransaction)
  );

  const logo = useMemo(() => {
    switch (vaultOption) {
      case "rBTC-THETA":
        return <RedWBTCLogo />;
      case "rETH-THETA":
        return <RedWETHLogo height="70%" />;
      case "rUSDC-BTC-P-THETA":
      case "rUSDC-ETH-P-THETA":
        return <RedUSDCLogo />;
    }
  }, [vaultOption]);

  const renderUnstakeBalance = useCallback(() => {
    if (!active) {
      return "---";
    }

    return formatBigNumber(stakingPoolData.unstakedBalance, 6, decimals);
  }, [active, stakingPoolData, decimals]);

  const showStakeModal = useMemo(() => {
    if (ongoingTransaction === "stake") {
      /** Always show staking modal when there is ongoing transaction */
      return true;
    } else if (ongoingTransaction === "unstake") {
      /** Likewise with unstaking transaction */
      return false;
    }

    return isStakeAction;
  }, [isStakeAction, ongoingTransaction]);

  return (
    <>
      <StakingApprovalModal
        show={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        vaultOption={vaultOption}
      />
      <StakingActionModal
        stake={showStakeModal}
        show={showActionModal}
        onClose={() => setShowActionModal(false)}
        vaultOption={vaultOption}
        logo={logo}
        stakingPoolData={stakingPoolData}
      />
      <StakingClaimModal
        show={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        vaultOption={vaultOption}
        logo={logo}
        stakingPoolData={stakingPoolData}
      />
      <StakingPoolCard>
        <div className="d-flex flex-wrap w-100 p-3">
          {/* Card Title */}
          <div className="d-flex align-items-center">
            <LogoContainer>{logo}</LogoContainer>
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
                  learnMoreURL="https://ribbon.finance/faq"
                />
              </div>
              <StakingPoolSubtitle>
                Your Unstaked Balance: {renderUnstakeBalance()}
              </StakingPoolSubtitle>
            </div>
          </div>

          {/* Claimable Pill */}
          <ClaimableTokenPillContainer>
            <ClaimableTokenPill>
              <ClaimableTokenIndicator />
              <Subtitle className="mr-2">CLAIMABLE $RBN</Subtitle>
              <ClaimableTokenAmount>
                {active
                  ? formatBigNumber(stakingPoolData.claimableRbn, 2, 18)
                  : "---"}
              </ClaimableTokenAmount>
            </ClaimableTokenPill>
          </ClaimableTokenPillContainer>

          {/* Capbar */}
          <div className="w-100 mt-4">
            <CapBar
              loading={false}
              current={parseFloat(
                formatUnits(stakingPoolData.currentStake, decimals)
              )}
              cap={parseFloat(formatUnits(stakingPoolData.poolSize, decimals))}
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
              }}
            />
          </div>

          {/* Expected Yield */}
          <div className="d-flex align-items-center mt-4 w-100">
            <div className="d-flex align-items-center">
              <SecondaryText>Expected Yield (APY)</SecondaryText>
              <TooltipExplanation
                title="EXPECTED YIELD (APY)"
                explanation={`By staking your ${vaultOption} tokens in the pool, you earn weekly $RBN rewards.`}
                renderContent={({ ref, ...triggerHandler }) => (
                  <HelpInfo containerRef={ref} {...triggerHandler}>
                    i
                  </HelpInfo>
                )}
                learnMoreURL="https://ribbon.finance/faq"
              />
            </div>
            <ExpectedYieldData className="ml-auto">
              {stakingPoolData.expectedYield.toFixed(2)}%
            </ExpectedYieldData>
          </div>
        </div>
        <StakingPoolCardFooter>
          {active ? (
            <>
              <StakingPoolCardFooterButton
                role="button"
                onClick={() => {
                  if (hasAllowance) {
                    setShowActionModal(true);
                    setIsStakeAction(true);
                    return;
                  }
                  setShowApprovalModal(true);
                }}
                active={
                  hasAllowance ||
                  ongoingTransaction === "approval" ||
                  ongoingTransaction === "stake"
                }
              >
                {ongoingTransaction === "approval" ||
                ongoingTransaction === "stake"
                  ? primaryActionLoadingText
                  : "Stake"}
              </StakingPoolCardFooterButton>
              <StakingPoolCardFooterButton
                role="button"
                onClick={() => {
                  setShowActionModal(true);
                  setIsStakeAction(false);
                }}
                active={ongoingTransaction === "unstake"}
              >
                {ongoingTransaction === "unstake"
                  ? primaryActionLoadingText
                  : "Unstake"}
              </StakingPoolCardFooterButton>
              <StakingPoolCardFooterButton
                role="button"
                onClick={() => setShowClaimModal(true)}
                active={ongoingTransaction === "rewardClaim"}
              >
                {ongoingTransaction === "rewardClaim"
                  ? primaryActionLoadingText
                  : "Claim $RBN"}
              </StakingPoolCardFooterButton>
            </>
          ) : (
            <StakingPoolCardFooterButton
              role="button"
              onClick={() => {
                setShowConnectWalletModal(true);
              }}
              active={true}
            >
              CONNECT WALLET
            </StakingPoolCardFooterButton>
          )}
        </StakingPoolCardFooter>
      </StakingPoolCard>
    </>
  );
};

const StakingPools = () => {
  return (
    <StakingPoolsContainer>
      <SectionHeader className="mb-4 w-100">STAKING POOLS</SectionHeader>
      {LiquidityMiningPoolOrder.map((option) => (
        <StakingPool key={option} vaultOption={option} />
      ))}
    </StakingPoolsContainer>
  );
};

export default StakingPools;
