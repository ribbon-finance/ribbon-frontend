import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { PrimaryText, SecondaryText, Title } from "shared/lib/designSystem";
import theme from "shared/lib/designSystem/theme";
import colors from "shared/lib/designSystem/colors";
import { calculateInitialveRBNAmount } from "shared/lib/utils/governanceMath";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import HelpInfo from "shared/lib/components/Common/HelpInfo";
import { useRBNTokenAccount } from "shared/lib/hooks/useRBNTokenSubgraph";
import { formatBigNumber } from "shared/lib/utils/math";
import moment from "moment";
import { formatUnits } from "ethers/lib/utils";
import useLoadingText from "shared/lib/hooks/useLoadingText";
import {
  Chart,
  HoverInfo,
} from "shared/lib/components/Common/PerformanceChart";
import { useWeb3React } from "@web3-react/core";
import sizes from "shared/lib/designSystem/sizes";

const SummaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: ${colors.background.two};
  width: 100%;
  border-radius: ${theme.border.radius};
  margin-top: 24px;
`;

const AmountExpiryContainer = styled.div`
  display: flex;
  margin-top: 8px;
  align-items: center;

  @media (max-width: ${sizes.md}px) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }
`;

const LockupExpiryContainer = styled.div`
  display: flex;
  padding: 8px 16px;
  background: ${colors.green}1F;
  border-radius: ${theme.border.radiusSmall};
  margin-left: auto;

  @media (max-width: ${sizes.md}px) {
    margin-left: 0;
    margin-top: 16px;
  }
`;

const LockupContainer = styled.div`
  display: flex;
  flex-direction: row;

  @media (max-width: ${sizes.md}px) {
    flex-direction: column;
  }
`;

const LockupData = styled.div`
  flex: 1;
  padding: 16px 24px;
  border-top: ${theme.border.width} ${theme.border.style} ${colors.border};

  &:nth-child(odd) {
    border-right: ${theme.border.width} ${theme.border.style} ${colors.border};
  }
`;

const ChartContainer = styled.div`
  height: 225px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StakingSummary = () => {
  const { active } = useWeb3React();
  const { data: rbnTokenAccount, loading: rbnTokenAccountLoading } =
    useRBNTokenAccount();
  const [hoveredDatapointIndex, setHoveredDatapointIndex] = useState<number>();
  const [hoveredDateStr, setHoveredDateStr] = useState<string>("");
  const [hoveredDatePosition, setHoveredDatePosition] = useState(0);

  const loadingText = useLoadingText();

  const chartDatapoints:
    | {
        // array of veRBN, in number (already divided by 18 decimals)
        dataset: number[];
        labels: Date[];

        // The index of dataset + labels that is the voting power of the current timestamp
        currentVeRbnIndex?: number;
      }
    | undefined = useMemo(() => {
    if (
      !rbnTokenAccount ||
      !rbnTokenAccount.lockStartTimestamp ||
      !rbnTokenAccount.lockEndTimestamp
    ) {
      return {
        dataset: [],
        labels: [
          new Date(),
          moment().add(1, "month").toDate(),
          moment().add(2, "month").toDate(),
        ],
      };
    }

    // Generate a fixed set of 100 datapoints from start and end duration
    const totalDatapoints = 100;
    let dataset: number[] = [];
    let labels: Date[] = [];
    const totalDurationMillis =
      (rbnTokenAccount.lockEndTimestamp - rbnTokenAccount.lockStartTimestamp) *
      1000;
    for (let i = 0; i <= totalDatapoints; i++) {
      // Split total duration into chunks of totalDatapoints
      const incrementDurationMillis =
        (totalDurationMillis / totalDatapoints) * i;

      // New start timestamp and duration
      const startTimestampMillis =
        rbnTokenAccount.lockStartTimestamp * 1000 + incrementDurationMillis;
      const duration =
        rbnTokenAccount.lockEndTimestamp * 1000 - startTimestampMillis;
      const veRbnAmount = calculateInitialveRBNAmount(
        rbnTokenAccount.lockedBalance,
        moment.duration(duration)
      );
      dataset.push(parseFloat(formatUnits(veRbnAmount, 18)));
      labels.push(new Date(startTimestampMillis));
    }

    // Push the current index
    const now = new Date();
    const currentRemainingDuration =
      rbnTokenAccount.lockEndTimestamp * 1000 - now.getTime();
    const currentVeRbnAmount = calculateInitialveRBNAmount(
      rbnTokenAccount.lockedBalance,
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
  }, [rbnTokenAccount]);

  const displayVeRbnAmount = useMemo(() => {
    if (!active) {
      return "---";
    } else if (chartDatapoints) {
      return hoveredDatapointIndex === undefined
        ? chartDatapoints.currentVeRbnIndex
          ? chartDatapoints.dataset[chartDatapoints.currentVeRbnIndex].toFixed(
              2
            )
          : "0.00"
        : chartDatapoints.dataset[hoveredDatapointIndex].toFixed(2);
    }
    return "0.00";
  }, [chartDatapoints, hoveredDatapointIndex, active]);

  const displayLockedRbn = useMemo(() => {
    if (!active) {
      return "---";
    } else if (rbnTokenAccountLoading) {
      return loadingText;
    }
    return rbnTokenAccount
      ? formatBigNumber(rbnTokenAccount.lockedBalance)
      : "0.00";
  }, [active, rbnTokenAccount, rbnTokenAccountLoading, loadingText]);

  const displayUnstakedRbn = useMemo(() => {
    if (!active) {
      return "---";
    } else if (rbnTokenAccountLoading) {
      return loadingText;
    }
    return rbnTokenAccount
      ? formatBigNumber(rbnTokenAccount.walletBalance)
      : "0.00";
  }, [active, rbnTokenAccount, rbnTokenAccountLoading, loadingText]);

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

  const onHoverChart = useCallback((hoverInfo?: HoverInfo) => {
    if (hoverInfo?.focused) {
      setHoveredDateStr(moment(hoverInfo.xData).format("ddd, MMMM Do"));
      setHoveredDatePosition(hoverInfo.xPosition);
      setHoveredDatapointIndex(hoverInfo.index);
    } else {
      setHoveredDateStr("");
      setHoveredDatePosition(0);
      setHoveredDatapointIndex(undefined);
    }
  }, []);

  const dateTooltipPosition = useMemo(() => {
    let _dateTooltipPosition = hoveredDatePosition - 15;
    if (hoveredDatapointIndex === 0) {
      _dateTooltipPosition = hoveredDatePosition;
    } else if (
      hoveredDatapointIndex &&
      chartDatapoints &&
      hoveredDatapointIndex + 1 >
        chartDatapoints.dataset.length - chartDatapoints.dataset.length * 0.15
    ) {
      _dateTooltipPosition =
        hoveredDatePosition -
        110 *
          (1 -
            (chartDatapoints.dataset.length - (hoveredDatapointIndex + 1)) /
              (chartDatapoints.dataset.length * 0.15));
    }

    return _dateTooltipPosition;
  }, [chartDatapoints, hoveredDatapointIndex, hoveredDatePosition]);

  return (
    <div className="d-flex flex-column w-100 mt-5 mb-3">
      <Title normalCased fontSize={18} lineHeight={24}>
        veRBN SUMMARY
      </Title>
      <SummaryContainer>
        {/* Header Info */}
        <div className="pt-4 pl-4 pr-4 pb-2">
          {/* Voting Power Title */}
          <div className="d-flex align-items-center mt-1">
            <PrimaryText fontSize={12} lineHeight={20} color={colors.red}>
              Your Voting Power
            </PrimaryText>
            {renderDataTooltip(
              "Your Voting Power",
              "Your veRBN balance represents your voting power. The longer you lock your RBN the more veRBN you receive. Your voting power decreases linearly as the remaining time until the RBN lockup expiry decreases."
            )}
          </div>

          {/* veRBN amount and Expiry */}
          <AmountExpiryContainer>
            {/* veRBN Amount */}
            <div className="d-flex align-items-center">
              <Title fontSize={32} lineHeight={40}>
                {rbnTokenAccountLoading ? loadingText : displayVeRbnAmount}
              </Title>
              {!rbnTokenAccountLoading && (
                <Title
                  fontSize={12}
                  lineHeight={16}
                  color={colors.text}
                  className="ml-2"
                >
                  veRBN
                </Title>
              )}
            </div>

            {/* Expiry Container */}
            {rbnTokenAccount?.lockEndTimestamp && (
              <LockupExpiryContainer>
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
                  {moment(rbnTokenAccount.lockEndTimestamp * 1000).format(
                    "MMMM Do, YYYY"
                  )}
                </PrimaryText>
              </LockupExpiryContainer>
            )}
          </AmountExpiryContainer>
        </div>

        {/* Graph */}
        <div className="position-relative pb-4">
          <ChartContainer>
            <Chart
              lineDecayAfterPointIndex={chartDatapoints?.currentVeRbnIndex}
              dataset={chartDatapoints?.dataset || []}
              labels={chartDatapoints?.labels || []}
              onHover={onHoverChart}
              gradientStartColor="transparent"
              gradientStopColor="transparent"
              maxGridLines={0}
            />
          </ChartContainer>
          {hoveredDatapointIndex ? (
            <SecondaryText
              fontSize={12}
              lineHeight={16}
              className="position-absolute"
              style={{
                whiteSpace: "nowrap",
                left: dateTooltipPosition,
              }}
            >
              {hoveredDateStr}
            </SecondaryText>
          ) : undefined}
        </div>

        {/* Stats */}
        <LockupContainer>
          <LockupData>
            <div className="d-flex align-items-center">
              <SecondaryText fontSize={12}>Locked RBN</SecondaryText>
              {renderDataTooltip(
                "Locked RBN",
                "The amount of RBN locked up in the governance contract. The longer you lock up RBN the more veRBN (voting power) you receive."
              )}
            </div>
            <Title fontSize={16} className="mt-1">
              {displayLockedRbn}
            </Title>
          </LockupData>

          <LockupData>
            <div className="d-flex align-items-center">
              <SecondaryText fontSize={12}>Unlocked RBN Balance</SecondaryText>
              {renderDataTooltip(
                "Unlocked RBN Balance",
                "The amount of RBN that has not been locked in the governance contract."
              )}
            </div>
            <Title fontSize={16} className="mt-1">
              {displayUnstakedRbn}
            </Title>
          </LockupData>
        </LockupContainer>
      </SummaryContainer>
    </div>
  );
};

export default StakingSummary;
