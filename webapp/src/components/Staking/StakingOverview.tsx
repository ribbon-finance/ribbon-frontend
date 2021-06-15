import React, { useMemo } from "react";
import styled from "styled-components";

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
import { VaultList } from "shared/lib/constants/constants";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";
import { BigNumber } from "@ethersproject/bignumber";
import { formatBigNumber } from "shared/lib/utils/math";
import useRBNToken from "../../hooks/useRBNToken";
import sizes from "shared/lib/designSystem/sizes";

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

const OverviewKPI = styled.div`
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  padding: 16px;
  width: 50%;
  display: flex;
  flex-wrap: wrap;

  &:nth-child(odd) {
    border-left: none;
  }

  @media (max-width: ${sizes.sm}px) {
    width: 100%;
    border-top: none;

    &:nth-child(odd) {
      border-left: ${theme.border.width} ${theme.border.style} ${colors.border};
    }
  }
`;

const OverviewLabel = styled(SecondaryText)`
  font-size: 12px;
  line-height: 16px;
  width: 100%;
  margin-bottom: 8px;
`;

const StakingOverview = () => {
  const { stakingPools, loading: stakingLoading } = useStakingPool(VaultList);
  const { data: tokenData, loading: tokenLoading } = useRBNToken();
  const loadingText = useTextAnimation(
    ["Loading", "Loading .", "Loading ..", "Loading ..."],
    250,
    stakingLoading || tokenLoading
  );

  const totalRewardDistributed = useMemo(() => {
    if (stakingLoading) {
      return loadingText;
    }

    let totalDistributed = BigNumber.from(0);

    for (let i = 0; i < VaultList.length; i++) {
      const stakingPool = stakingPools[VaultList[i]];
      if (!stakingPool) {
        break;
      }
      totalDistributed = totalDistributed.add(stakingPool.totalRewardClaimed);
    }

    return formatBigNumber(totalDistributed, 2, 18);
  }, [stakingLoading, loadingText, stakingPools]);

  const numHolderText = useMemo(() => {
    if (tokenLoading || !tokenData) {
      return loadingText;
    }

    return tokenData.numHolders.toLocaleString();
  }, [loadingText, tokenData, tokenLoading]);

  return (
    <OverviewContainer>
      <OverviewInfo>
        <OverviewTag>
          <Subtitle>Liquidity Mining</Subtitle>
        </OverviewTag>
        <Title className="mt-3 w-100">Staking On Ribbon</Title>
        <OverviewDescription className="mt-3 w-100">
          By staking your vault share tokens, you are able to earn RBN token
          rewards. RBN rewards are released on a weekly basis. Any unstaking
          before July 16 forfeits accrued rewards.
        </OverviewDescription>
        <UnderlineLink
          to="https://ribbon.finance/faq"
          target="_blank"
          rel="noreferrer noopener"
          className="d-flex mt-4"
        >
          <PrimaryText className="mr-2">
            Learn more about our liquidity mining program
          </PrimaryText>
          <ExternalIcon color="white" />
        </UnderlineLink>
        <OverviewBackgroundContainer>
          <StyledWaves />
        </OverviewBackgroundContainer>
      </OverviewInfo>
      <OverviewKPI>
        <OverviewLabel>$RBN Distributed</OverviewLabel>
        <Title>{totalRewardDistributed}</Title>
      </OverviewKPI>
      <OverviewKPI>
        <OverviewLabel>No. of $RBN Holders</OverviewLabel>
        <Title>{numHolderText}</Title>
      </OverviewKPI>
    </OverviewContainer>
  );
};

export default StakingOverview;
