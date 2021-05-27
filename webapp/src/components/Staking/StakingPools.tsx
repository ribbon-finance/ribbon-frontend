import React, { useMemo } from "react";
import styled, { keyframes } from "styled-components";

import { SecondaryText, Subtitle, Title } from "shared/lib/designSystem";
import { VaultList, VaultOptions } from "shared/lib/constants/constants";
import theme from "shared/lib/designSystem/theme";
import colors from "shared/lib/designSystem/colors";
import {
  USDCLogo,
  WBTCLogo,
  WETHLogo,
} from "shared/lib/assets/icons/erc20Assets";
import CapBar from "shared/lib/components/Deposit/CapBar";
import useConnectWalletModal from "../../hooks/useConnectWalletModal";
import { useWeb3React } from "@web3-react/core";
import useStakingPool from "../../hooks/useStakingPool";

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
  animation: ${shimmerKeyframe} 3s infinite;

  &:hover {
    box-shadow: ${colors.red}66 8px 16px 80px !important;
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
`;

interface StakingPoolProps {
  vaultOption: VaultOptions;
}

const StakingPool: React.FC<StakingPoolProps> = ({ vaultOption }) => {
  const { active } = useWeb3React();
  const [, setShowConnectWalletModal] = useConnectWalletModal();
  const { data: stakingPoolData, loading } = useStakingPool(vaultOption);

  const logo = useMemo(() => {
    switch (vaultOption) {
      case "rBTC-THETA":
        return <RedWBTCLogo />;
      case "rETH-THETA":
        return <RedWETHLogo height="32px" />;
      case "rUSDC-BTC-P-THETA":
      case "rUSDC-ETH-P-THETA":
        return <RedUSDCLogo />;
    }
  }, [vaultOption]);

  return (
    <StakingPoolCard role="button">
      <div className="d-flex flex-wrap w-100 p-3">
        {/* Card Title */}
        <div className="d-flex align-items-center">
          <LogoContainer>{logo}</LogoContainer>
          <div className="d-flex flex-wrap">
            <StakingPoolTitle className="w-100">{vaultOption}</StakingPoolTitle>
            <StakingPoolSubtitle>
              Your Unstaked Balance: {/* TODO: Balance */}
              {active ? stakingPoolData.claimableRbn : "---"}
            </StakingPoolSubtitle>
          </div>
        </div>

        {/* Claimable Pill */}
        <div className="ml-auto">
          <ClaimableTokenPill>
            <ClaimableTokenIndicator />
            <Subtitle className="mr-2">CLAIMABLE $RBN</Subtitle>
            <ClaimableTokenAmount>
              {active ? stakingPoolData.claimableRbn : "---"}
            </ClaimableTokenAmount>
          </ClaimableTokenPill>
        </div>

        {/* Capbar */}
        <div className="w-100 mt-4">
          <CapBar
            loading={false}
            current={stakingPoolData.currentStake}
            cap={stakingPoolData.poolSize}
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
          <SecondaryText>Expected Yield (APY)</SecondaryText>
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
                setShowConnectWalletModal(true);
              }}
              active={false}
            >
              Stake
            </StakingPoolCardFooterButton>
            <StakingPoolCardFooterButton
              role="button"
              onClick={() => {
                setShowConnectWalletModal(true);
              }}
              active={false}
            >
              Unstake
            </StakingPoolCardFooterButton>
            <StakingPoolCardFooterButton
              role="button"
              onClick={() => {
                setShowConnectWalletModal(true);
              }}
              active={false}
            >
              Claim $RBN
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
  );
};

const StakingPools = () => {
  return (
    <StakingPoolsContainer>
      <SectionHeader className="mb-4 w-100">STAKING POOLS</SectionHeader>
      {VaultList.map((option) => (
        <StakingPool key={option} vaultOption={option} />
      ))}
    </StakingPoolsContainer>
  );
};

export default StakingPools;
