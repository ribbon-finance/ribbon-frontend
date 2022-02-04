import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";

import {
  PrimaryText,
  SecondaryText,
  Subtitle,
  Title,
} from "shared/lib/designSystem";
import theme from "shared/lib/designSystem/theme";
import colors from "shared/lib/designSystem/colors";
import StakingSummaryChart from "./StakingSummaryChart";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import HelpInfo from "shared/lib/components/Common/HelpInfo";
import { useRBNTokenAccount } from "shared/lib/hooks/useRBNTokenSubgraph";
import { formatBigNumber } from "shared/lib/utils/math";
import moment from "moment";
import { calculateInitialveRBNAmount } from "../../utils/math";
import { formatUnits } from "ethers/lib/utils";

const SummaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: ${colors.background.two};
  width: 100%;
  border-radius: ${theme.border.radius};
  margin-top: 24px;
`;

const LockupExpiryContainer = styled.div`
  display: flex;
  padding: 8px 16px;
  background: ${colors.green}1F;
  border-radius: ${theme.border.radiusSmall};
`;

const LockupData = styled.div`
  width: 50%;
  padding: 16px 24px;
  border-top: ${theme.border.width} ${theme.border.style} ${colors.border};

  &:nth-child(odd) {
    border-right: ${theme.border.width} ${theme.border.style} ${colors.border};
  }
`;

const StakingSummary = () => {
  const { data } = useRBNTokenAccount();
  const [hoveredDatapointIndex, setHoveredDatapointIndex] = useState<number>();

  const chartDatapoints:
    | {
        // array of veRBN, in number (already divided by 18 decimals)
        dataset: number[];
        labels: Date[];

        // The index of dataset + labels that is the voting power of the current timestamp
        currentVeRbnIndex?: number;
      }
    | undefined = useMemo(() => {
    if (!data || !data.lockStartTimestamp || !data.lockEndTimestamp) {
      return undefined;
    }

    // Generate a fixed set of 100 datapoints from start and end duration
    const totalDatapoints = 100;
    let dataset: number[] = [];
    let labels: Date[] = [];
    for (let i = 0; i < totalDatapoints; i++) {
      const totalDurationMillis =
        (data.lockEndTimestamp - data.lockStartTimestamp) * 1000;
      // Split total duration into chunks of totalDatapoints
      const incrementDurationMillis =
        (totalDurationMillis / totalDatapoints) * i;

      // New start timestamp and duration
      const startTimestampMillis =
        data.lockStartTimestamp * 1000 + incrementDurationMillis;
      const duration = data.lockEndTimestamp * 1000 - startTimestampMillis;
      const veRbnAmount = calculateInitialveRBNAmount(
        data.lockedBalance,
        moment.duration(duration)
      );
      dataset.push(parseFloat(formatUnits(veRbnAmount, 18)));
      labels.push(new Date(startTimestampMillis));
    }

    // Push the current index
    const now = new Date();
    const currentRemainingDuration =
      data.lockEndTimestamp * 1000 - now.getTime();
    const currentVeRbnAmount = calculateInitialveRBNAmount(
      data.lockedBalance,
      moment.duration(currentRemainingDuration)
    );
    dataset.push(parseFloat(formatUnits(currentVeRbnAmount, 18)));
    labels.push(now);

    // Sort dataset and labels
    dataset = dataset.sort((a, b) => b - a);
    labels = labels.sort((a, b) => a.getTime() - b.getTime());

    // Get index of the current point
    const currentVeRbnIndex = labels.findIndex(
      (label) => label.getTime() === now.getTime()
    );
    return {
      dataset,
      labels,
      currentVeRbnIndex:
        currentVeRbnIndex === -1 ? undefined : currentVeRbnIndex,
    };
  }, [data]);

  const displayVeRbnAmount = useMemo(() => {
    if (chartDatapoints) {
      return hoveredDatapointIndex === undefined
        ? chartDatapoints.currentVeRbnIndex
          ? chartDatapoints.dataset[chartDatapoints.currentVeRbnIndex].toFixed(
              2
            )
          : 0
        : chartDatapoints.dataset[hoveredDatapointIndex].toFixed(2);
    }
    return 0;
  }, [chartDatapoints, hoveredDatapointIndex]);

  const renderDataTooltip = useCallback(
    (title: string, explanation: string, learnMoreURL?: string) => (
      <TooltipExplanation
        title={title}
        explanation={explanation}
        renderContent={({ ref, ...triggerHandler }) => (
          <HelpInfo containerRef={ref} {...triggerHandler}>
            i
          </HelpInfo>
        )}
        learnMoreURL={learnMoreURL}
      />
    ),
    []
  );

  const onHoverDataIndex = useCallback((index?: number) => {
    setHoveredDatapointIndex(index);
  }, []);

  return (
    <div className="d-flex flex-column w-100 mt-5 mb-3">
      <Title fontSize={18} lineHeight={24}>
        STAKING SUMMARY
      </Title>
      <SummaryContainer>
        {/* Header Info */}
        <div className="pt-4 pl-4 pr-4 pb-2">
          {/* Voting Power Title */}
          <Subtitle fontSize={12} lineHeight={20} color={colors.red}>
            VOTING POWER
          </Subtitle>

          {/* veRBN amount and Expiry */}
          <div className="d-flex align-items-center mt-1">
            {/* veRBN Amount */}
            <div className="d-flex align-items-center">
              <Title fontSize={32} lineHeight={40}>
                {displayVeRbnAmount}
              </Title>
              <Title
                fontSize={12}
                lineHeight={16}
                color={colors.text}
                className="ml-2"
              >
                veRBN
              </Title>
            </div>

            {/* Expiry Container */}
            <LockupExpiryContainer className="ml-auto">
              <PrimaryText
                fontSize={12}
                lineHeight={16}
                color={`${colors.green}A3`}
              >
                Lockup ends on
              </PrimaryText>
              <PrimaryText
                fontSize={12}
                lineHeight={16}
                color={colors.green}
                className="ml-1"
              >
                {data?.lockEndTimestamp
                  ? moment(data.lockEndTimestamp * 1000).format("MMMM Do, YYYY")
                  : "-"}
              </PrimaryText>
            </LockupExpiryContainer>
          </div>
        </div>

        {/* Graph */}
        <StakingSummaryChart
          dataset={chartDatapoints?.dataset || []}
          labels={chartDatapoints?.labels || []}
          lineDecayAfterIndex={chartDatapoints?.currentVeRbnIndex}
          onHoverDataIndex={onHoverDataIndex}
        />

        {/* Stats */}
        <div className="d-flex flex-wrap">
          <LockupData>
            <div className="d-flex align-items-center">
              <SecondaryText>Locked RBN</SecondaryText>
              {renderDataTooltip(
                "Locked RBN",
                "Locked RBN is the total amount of RBN locked in the staking contract."
              )}
            </div>
            <Title className="mt-1">
              {data ? formatBigNumber(data.lockedBalance) : "-"}
            </Title>
          </LockupData>

          <LockupData>
            <div className="d-flex align-items-center">
              <SecondaryText>Unstaked RBN</SecondaryText>
              {renderDataTooltip(
                "Locked RBN",
                "Locked RBN is the total amount of RBN locked in the staking contract."
              )}
            </div>
            <Title className="mt-1">
              {/* 5,000.00 */}
              {data ? formatBigNumber(data.walletBalance) : "-"}
            </Title>
          </LockupData>

          <LockupData>
            <div className="d-flex align-items-center">
              <SecondaryText>RBN Staking Rewards</SecondaryText>
              {renderDataTooltip(
                "Locked RBN",
                "Locked RBN is the total amount of RBN locked in the staking contract."
              )}
            </div>
            <Title className="mt-1" color={colors.green}>
              1,273.14
            </Title>
          </LockupData>

          <LockupData>
            <div className="d-flex align-items-center">
              <SecondaryText>Rewards Booster</SecondaryText>
              {renderDataTooltip(
                "Locked RBN",
                "Locked RBN is the total amount of RBN locked in the staking contract."
              )}
            </div>
            <Title className="mt-1">5.23x</Title>
          </LockupData>
        </div>
      </SummaryContainer>
    </div>
  );
};

export default StakingSummary;
