import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import moment from "moment";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import {
  BaseButton,
  BaseLink,
  PrimaryText,
  SecondaryText,
  Subtitle,
  Title,
} from "shared/lib/designSystem";
import { ExternalIcon } from "shared/lib/assets/icons/icons";
import {
  LiquidityMiningVersion,
  OngoingLMVersion,
  VaultLiquidityMiningMap,
  VaultList,
  StakingVaultOptions,
} from "shared/lib/constants/constants";
import useLoadingText from "shared/lib/hooks/useLoadingText";
import { BigNumber } from "@ethersproject/bignumber";
import { formatBigNumber } from "shared/lib/utils/math";
import sizes from "shared/lib/designSystem/sizes";
import {
  useRBNToken,
  useRbnTokenDistributed,
} from "shared/lib/hooks/useRBNTokenSubgraph";
import FilterDropdown from "shared/lib/components/Common/FilterDropdown";
import useLiquidityMiningPools from "shared/lib/hooks/useLiquidityMiningPools";
import { useLiquidityGaugeV5PoolData } from "shared/lib/hooks/web3DataContext";
import RewardsCalculatorModal from "./RewardsCalculatorModal/RewardsCalculatorModal";

const OverviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 48px;
  background: ${colors.background.two};
  border-radius: ${theme.border.radius};
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
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

const RewardsCalculatorButon = styled(BaseButton)`
  width: 100%;
  padding: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  background-color: ${colors.green}1F;
  &:hover {
    background-color: ${colors.green}2E;
  }
`;

interface StakingOverviewProps {
  lmVersion: LiquidityMiningVersion;
  setLmVersion: React.Dispatch<React.SetStateAction<LiquidityMiningVersion>>;
}

interface LMInfo {
  title: string;
  description: string;
  link: string;
  countdownTitle: string;
}

const StakingOverview: React.FC<StakingOverviewProps> = ({
  lmVersion,
  setLmVersion,
}) => {
  const { stakingPools, loading: stakingLoading } = useLiquidityMiningPools();
  const { data: tokenData, loading: tokenLoading } = useRBNToken();
  const { data: rbnTokenDistributedLg5, loading: rbnTokenDistributedLoading } =
    useRbnTokenDistributed();
  const { data: lg5Data, loading: lg5DataLoading } =
    useLiquidityGaugeV5PoolData(
      Object.keys(VaultLiquidityMiningMap.lg5)[0] as StakingVaultOptions
    );
  const [showRewardsCalculator, setShowRewardsCalculator] = useState(false);

  const loadingText = useLoadingText();

  const totalRewardDistributed = useMemo(() => {
    if (lmVersion === "lm") {
      if (stakingLoading || rbnTokenDistributedLoading) {
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
    } else if (lmVersion === "lg5") {
      return formatBigNumber(rbnTokenDistributedLg5, 18);
    }
    return BigNumber.from(0);
  }, [
    stakingLoading,
    loadingText,
    stakingPools,
    lmVersion,
    rbnTokenDistributedLg5,
    rbnTokenDistributedLoading,
  ]);

  const numHolderText = useMemo(() => {
    if (tokenLoading || !tokenData) {
      return loadingText;
    }

    return tokenData.numHolders.toLocaleString();
  }, [loadingText, tokenData, tokenLoading]);

  const countdownText = useMemo(() => {
    switch (lmVersion) {
      case "lm":
        // LM already ended since
        // const endStakeReward = moment
        // .utc("2021-07-17")
        // .set("hour", 10)
        // .set("minute", 30);
        return "Program Ended";
      case "lg5":
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
    }
  }, [lg5Data, lg5DataLoading, loadingText, lmVersion]);

  const getLMName = useCallback((_lmVersion: LiquidityMiningVersion) => {
    switch (_lmVersion) {
      case "lm":
        return "LM1 - JUL 2021";
      case "lg5":
        return "LM2 - Present";
    }
  }, []);

  const lmInfo: LMInfo = useMemo(() => {
    switch (lmVersion) {
      case "lm":
        return {
          title: "Liquidity Mining Program",
          description: `The program aims to grow vault adjusted TVL, expand the voting power
          to those who missed out on the airdrop and to distribute the
          governance token to those who have the most skin in the game. The
          program ended on July 19th, 2021.`,
          link: "https://ribbonfinance.medium.com/rgp-2-liquidity-mining-program-cc81f0b7a270",
          countdownTitle: "Time till programs end",
        };
      case "lg5":
        return {
          title: "Liquidity Mining Program #2",
          description: `The program aims to (i) grow Ribbon TVL and (ii) align incentives between vault depositors and owners of the RBN governance token by distributing 6.5m RBN governance tokens to vault depositors over the course of 6 months.`,
          link: "https://gov.ribbon.finance/t/rgp-9-ribbonomics/486",
          countdownTitle: "Time till next reward",
        };
    }
  }, [lmVersion]);

  return (
    <div>
      <OverviewContainer>
        <OverviewInfo>
          <FilterDropdown
            options={OngoingLMVersion.map((_version) => ({
              value: _version,
              display: getLMName(_version),
            }))}
            value={getLMName(lmVersion)}
            onSelect={(option) =>
              setLmVersion(option as LiquidityMiningVersion)
            }
            dropdownMenuConfig={{ horizontalOrientation: "left", topBuffer: 8 }}
            buttonConfig={{
              background: `${colors.green}1F`,
              activeBackground: `${colors.green}2E`,
              color: colors.green,
            }}
          />

          <Title className="mt-3 w-100">{lmInfo.title}</Title>
          <OverviewDescription className="mt-3 w-100">
            {lmInfo.description}
          </OverviewDescription>
          <UnderlineLink
            to={lmInfo.link}
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
            <OverviewLabel>{lmInfo.countdownTitle}</OverviewLabel>
            <Title>{countdownText}</Title>
          </OverviewKPI>
        </OverviewKPIContainer>
      </OverviewContainer>
      {
        // Rewards calculator is only applicable for LM2 (liquidity gauge v5 [lg5]), for now
        lmVersion === "lg5" && (
          <RewardsCalculatorButon
            role="button"
            className="d-flex justify-content-center"
            onClick={() => setShowRewardsCalculator(true)}
          >
            <Subtitle color={colors.buttons.secondaryText} fontSize={14}>
              OPEN REWARDS CALCULATOR
            </Subtitle>
          </RewardsCalculatorButon>
        )
      }
      <RewardsCalculatorModal
        show={showRewardsCalculator}
        onClose={() => setShowRewardsCalculator(false)}
      />
    </div>
  );
};

export default StakingOverview;
