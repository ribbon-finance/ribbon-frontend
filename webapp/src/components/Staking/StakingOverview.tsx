import React, { useMemo } from "react";
import styled from "styled-components";
import moment from "moment";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import {
  BaseLink,
  PrimaryText,
  SecondaryText,
  Subtitle,
  Title,
} from "shared/lib/designSystem";
import { ExternalIcon } from "shared/lib/assets/icons/icons";
import { Waves } from "shared/lib/assets";
import useStakingPool from "../../hooks/useStakingPool";
import {
  VaultLiquidityMiningMap,
  VaultList,
  VaultOptions,
} from "shared/lib/constants/constants";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";
import { BigNumber } from "@ethersproject/bignumber";
import { formatBigNumber } from "shared/lib/utils/math";
import sizes from "shared/lib/designSystem/sizes";
import useRBNToken from "shared/lib/hooks/useRBNToken";

const OverviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 48px;
`;

const OverviewInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: relative;
  padding: 24px;
  background: linear-gradient(
    96.84deg,
    ${colors.green}0A 1.04%,
    ${colors.green}02 98.99%
  );
  border-radius: ${theme.border.radius} ${theme.border.radius} 0 0;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
`;

const OverviewTag = styled.div`
  display: flex;
  background: #ffffff0a;
  padding: 8px;
  border-radius: ${theme.border.radius};
`;

const OverviewDescription = styled(SecondaryText)`
  line-height: 1.5;
`;

const UnderlineLink = styled(BaseLink)`
  text-decoration: underline;
  color: ${colors.primaryText};
  z-index: 1;

  &:hover {
    text-decoration: underline;
    color: ${colors.primaryText};
    opacity: ${theme.hover.opacity};
  }
`;

const OverviewBackgroundContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const StyledWaves = styled(Waves)`
  margin-bottom: -75px;

  path {
    stroke: ${colors.green}3D;
  }
`;

const OverviewKPIContainer = styled.div`
  display: flex;
  width: 100%;

  div {
    border-top: none;

    &:first-child {
      border-right: none;
      border-bottom-left-radius: ${theme.border.radius};
    }

    &:last-child {
      border-left: none;
      border-bottom-right-radius: ${theme.border.radius};
    }

    &:not(:first-child):not(:last-child) {
      border: ${theme.border.width} ${theme.border.style} ${colors.border};
      border-top: none;
    }
  }
`;

const OverviewKPI = styled.div`
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  padding: 16px;
  width: calc(100% / 3);
  display: flex;
  flex-wrap: wrap;

  @media (max-width: ${sizes.sm}px) {
    width: 100%;
  }
`;

const OverviewLabel = styled(SecondaryText)`
  font-size: 12px;
  line-height: 16px;
  width: 100%;
  margin-bottom: 8px;
`;

const LearnMoreText = styled(PrimaryText)`
  font-size: 14px;
`;

const StakingOverview = () => {
  const miningPoolOptionList = useMemo(
    () => Object.keys(VaultLiquidityMiningMap) as VaultOptions[],
    []
  );
  const { stakingPools, loading: stakingLoading } =
    useStakingPool(miningPoolOptionList);
  const { data: tokenData, loading: tokenLoading } = useRBNToken();

  const loadingText = useTextAnimation(stakingLoading || tokenLoading);

  const totalRewardDistributed = useMemo(() => {
    if (stakingLoading) {
      return loadingText;
    }

    let totalDistributed = BigNumber.from(0);

    for (let i = 0; i < VaultList.length; i++) {
      const stakingPool = stakingPools[VaultList[i]];
      if (!stakingPool) {
        continue;
      }
      totalDistributed = totalDistributed.add(stakingPool.totalRewardClaimed);
    }

    return formatBigNumber(totalDistributed, 18);
  }, [stakingLoading, loadingText, stakingPools]);

  const numHolderText = useMemo(() => {
    if (tokenLoading || !tokenData) {
      return loadingText;
    }

    return tokenData.numHolders.toLocaleString();
  }, [loadingText, tokenData, tokenLoading]);

  const timeTillProgramsEnd = useMemo(() => {
    const endStakeReward = moment
      .utc("2021-07-17")
      .set("hour", 10)
      .set("minute", 30);

    if (endStakeReward.diff(moment()) <= 0) {
      return "End of Rewards";
    }

    // Time till next stake reward date
    const startTime = moment.duration(
      endStakeReward.diff(moment()),
      "milliseconds"
    );

    return `${startTime.days()}D ${startTime.hours()}H ${startTime.minutes()}M`;
  }, []);

  return (
    <OverviewContainer>
      <OverviewInfo>
        <OverviewTag>
          <Subtitle>STAKING ON RIBBON</Subtitle>
        </OverviewTag>
        <Title className="mt-3 w-100">Liquidity Mining Program</Title>
        <OverviewDescription className="mt-3 w-100">
          The program aims to grow vault adjusted TVL, expand the voting power
          to those who missed out on the airdrop and to distribute the
          governance token to those who have the most skin in the game. The
          program ends on July 19th, 2021.
        </OverviewDescription>
        <UnderlineLink
          to="https://ribbonfinance.medium.com/rgp-2-liquidity-mining-program-cc81f0b7a270"
          target="_blank"
          rel="noreferrer noopener"
          className="d-flex mt-4"
        >
          <LearnMoreText className="mr-2">
            Learn more about our liquidity mining program
          </LearnMoreText>
          <ExternalIcon color="white" />
        </UnderlineLink>
        <OverviewBackgroundContainer>
          <StyledWaves />
        </OverviewBackgroundContainer>
      </OverviewInfo>
      <OverviewKPIContainer>
        <OverviewKPI>
          <OverviewLabel>$RBN Distributed</OverviewLabel>
          <Title>{totalRewardDistributed}</Title>
        </OverviewKPI>
        <OverviewKPI>
          <OverviewLabel>No. of $RBN Holders</OverviewLabel>
          <Title>{numHolderText}</Title>
        </OverviewKPI>
        <OverviewKPI>
          <OverviewLabel>Time till programs end</OverviewLabel>
          <Title>{timeTillProgramsEnd}</Title>
        </OverviewKPI>
      </OverviewKPIContainer>
    </OverviewContainer>
  );
};

export default StakingOverview;
