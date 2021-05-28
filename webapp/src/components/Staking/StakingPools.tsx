import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled, { keyframes } from "styled-components";
import { BigNumber } from "@ethersproject/bignumber";
import { formatUnits } from "@ethersproject/units";
import { useWeb3React } from "@web3-react/core";

import { SecondaryText, Subtitle, Title } from "shared/lib/designSystem";
import {
  getAssets,
  VaultList,
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
import useERC20Token from "shared/lib/hooks/useERC20Token";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";
import { getAssetDecimals } from "shared/lib/utils/asset";
import { formatSignificantDecimals } from "shared/lib/utils/math";
import useTokenAllowance from "../../hooks/useTokenAllowance";
import StakingApprovalModal from "./Modal/StakingApprovalModal";

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
  const { active, account } = useWeb3React();
  const [, setShowConnectWalletModal] = useConnectWalletModal();
  const { data: stakingPoolData, loading: stakingPoolLoading } = useStakingPool(
    vaultOption
  );
  const tokenContract = useERC20Token(vaultOption);
  const [tokenBalance, setTokenBalance] = useState(BigNumber.from(0));
  const decimals = getAssetDecimals(getAssets(vaultOption));
  // Replace spender address
  const tokenAllowance = useTokenAllowance(
    vaultOption,
    "0x76e7Caa7131581eE6f4c562b7Ca5379AB9024083"
  );

  const [loading, setLoading] = useState(false);
  const isLoading = loading || stakingPoolLoading;
  const loadingText = useTextAnimation(
    ["Loading", "Loading .", "Loading ..", "Loading ..."],
    250,
    isLoading
  );

  const [showApprovalModal, setShowApprovalModal] = useState(false);

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

  useEffect(() => {
    if (!tokenContract || !account) {
      setTokenBalance(BigNumber.from(0));
      return;
    }

    // Get balance
    (async () => {
      setLoading(true);
      const balance = await tokenContract.balanceOf(account);
      setTokenBalance(balance);
      setLoading(false);
    })();
  }, [tokenContract, account]);

  const hasAllowance = useMemo(() => {
    if (!tokenAllowance || tokenAllowance.isZero()) {
      return false;
    }

    return true;
  }, [tokenAllowance]);

  const renderUnstakeBalance = useCallback(() => {
    if (!active) {
      return "---";
    }

    if (isLoading) {
      return loadingText;
    }

    return formatSignificantDecimals(formatUnits(tokenBalance, decimals));
  }, [active, isLoading, loadingText, tokenBalance, decimals]);

  return (
    <>
      <StakingApprovalModal
        show={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        vaultOption={vaultOption}
      />
      <StakingPoolCard role="button">
        <div className="d-flex flex-wrap w-100 p-3">
          {/* Card Title */}
          <div className="d-flex align-items-center">
            <LogoContainer>{logo}</LogoContainer>
            <div className="d-flex flex-wrap">
              <StakingPoolTitle className="w-100">
                {vaultOption}
              </StakingPoolTitle>
              <StakingPoolSubtitle>
                Your Unstaked Balance: {renderUnstakeBalance()}
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
                  if (!hasAllowance) {
                    setShowApprovalModal(true);
                  }
                }}
                active={hasAllowance}
              >
                Stake
              </StakingPoolCardFooterButton>
              <StakingPoolCardFooterButton
                role="button"
                onClick={() => {}}
                active={false}
              >
                Unstake
              </StakingPoolCardFooterButton>
              <StakingPoolCardFooterButton
                role="button"
                onClick={() => {}}
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
    </>
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
