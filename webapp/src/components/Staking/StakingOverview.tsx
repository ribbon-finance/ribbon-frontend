import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import moment from "moment";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import {
  BaseLink,
  PrimaryText,
  SecondaryText,
  Title,
} from "shared/lib/designSystem";
import { ExternalIcon } from "shared/lib/assets/icons/icons";
import {
  LiquidityMiningVersion,
  LiquidityMiningVersionList,
  VaultLiquidityMiningMap,
  VaultList,
  VaultOptions,
} from "shared/lib/constants/constants";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";
import { BigNumber } from "@ethersproject/bignumber";
import { formatBigNumber } from "shared/lib/utils/math";
import sizes from "shared/lib/designSystem/sizes";
import { useRBNToken } from "shared/lib/hooks/useRBNTokenSubgraph";
import FilterDropdown from "shared/lib/components/Common/FilterDropdown";
import useLiquidityMiningPools from "shared/lib/hooks/useLiquidityMiningPools";
import { useLiquidityGaugeV5PoolData } from "shared/lib/hooks/web3DataContext";

const OverviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 48px;
  background: ${colors.background.two};
  border-radius: ${theme.border.radius};
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

const OverviewKPIContainer = styled.div`
  display: flex;
  width: 100%;
`;

const OverviewKPI = styled.div`
  padding: 16px;
  width: calc(100% / 3);
  display: flex;
  flex-wrap: wrap;
  border-top: ${theme.border.width} ${theme.border.style} ${colors.border};

  @media (max-width: ${sizes.sm}px) {
    width: 100%;
  }

  &:not(:last-child) {
    border-right: ${theme.border.width} ${theme.border.style} ${colors.border};
  }
`;

const OverviewLabel = styled(SecondaryText)`
  font-size: 12px;
  line-height: 16px;
  width: 100%;
  margin-bottom: 8px;
`;

interface StakingOverviewProps {
  lmVersion: LiquidityMiningVersion;
  setLmVersion: React.Dispatch<React.SetStateAction<LiquidityMiningVersion>>;
}

const StakingOverview: React.FC<StakingOverviewProps> = ({
  lmVersion,
  setLmVersion,
}) => {
  const { stakingPools, loading: stakingLoading } = useLiquidityMiningPools();
  const { data: tokenData, loading: tokenLoading } = useRBNToken();
  const { data: lg5Data, loading: lg5DataLoading } =
    useLiquidityGaugeV5PoolData(
      Object.keys(VaultLiquidityMiningMap.lg5)[0] as VaultOptions
    );

  const loadingText = useTextAnimation(
    stakingLoading || tokenLoading || lg5DataLoading
  );

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

  /**
   * TODO: Add duration for lg5
   */
  const timeTillProgramsEnd = useMemo(() => {
    if (lg5DataLoading) {
      return loadingText;
    }

    if (!lg5Data) {
      return "---";
    }

    const endStakeReward = moment.unix(lg5Data.periodEndTime);

    if (endStakeReward.diff(moment()) <= 0) {
      return "Program Ended";
    }

    // Time till next stake reward date
    const startTime = moment.duration(
      endStakeReward.diff(moment()),
      "milliseconds"
    );

    return `${startTime.days()}D ${startTime.hours()}H ${startTime.minutes()}M`;
  }, [lg5Data, lg5DataLoading, loadingText]);

  const getLMName = useCallback((_lmVersion: LiquidityMiningVersion) => {
    switch (_lmVersion) {
      case "lm":
        return "LM1 - JUL 2021";
      case "lg5":
        return "LM2 - Present";
    }
  }, []);

  const getLMTitle = useCallback((_lmVersion: LiquidityMiningVersion) => {
    switch (_lmVersion) {
      case "lm":
        return "Liquidity Mining Program";
      case "lg5":
        return "Liquidity Mining Program #2";
    }
  }, []);

  const getLMDescription = useCallback((_lmVersion: LiquidityMiningVersion) => {
    switch (_lmVersion) {
      case "lm":
        return `The program aims to grow vault adjusted TVL, expand the voting power
          to those who missed out on the airdrop and to distribute the
          governance token to those who have the most skin in the game. The
          program ended on July 19th, 2021.`;
      case "lg5":
        return `Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel fringilla est`;
    }
  }, []);

  return (
    <OverviewContainer>
      <OverviewInfo>
        <FilterDropdown
          options={LiquidityMiningVersionList.map((_version) => ({
            value: _version,
            display: getLMName(_version),
          }))}
          value={getLMName(lmVersion)}
          onSelect={(option) => setLmVersion(option as LiquidityMiningVersion)}
          dropdownMenuConfig={{ horizontalOrientation: "left", topBuffer: 8 }}
          buttonConfig={{
            background: `${colors.green}1F`,
            activeBackground: `${colors.green}2E`,
            color: colors.green,
          }}
        />

        <Title className="mt-3 w-100">{getLMTitle(lmVersion)}</Title>
        <OverviewDescription className="mt-3 w-100">
          {getLMDescription(lmVersion)}
        </OverviewDescription>
        <UnderlineLink
          to="https://ribbonfinance.medium.com/rgp-2-liquidity-mining-program-cc81f0b7a270"
          target="_blank"
          rel="noreferrer noopener"
          className="d-flex mt-4"
        >
          <PrimaryText fontSize={14} className="mr-2">
            Learn more about our liquidity mining program
          </PrimaryText>
          <ExternalIcon color="white" />
        </UnderlineLink>
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
