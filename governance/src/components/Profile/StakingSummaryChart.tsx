import React, { useCallback } from "react";
import {
  Chart,
  HoverInfo,
} from "shared/lib/components/Common/PerformanceChart";
import styled from "styled-components";

const ChartContainer = styled.div`
  height: 225px;
  position: relative;
`;

interface StakingSummaryChartProps {
  // When called with undefined, means the hover ended.
  onHoverVotingPower: (votingPower?: number) => void;
}

const StakingSummaryChart: React.FC<StakingSummaryChartProps> = ({
  onHoverVotingPower,
}) => {
  const dates = [
    new Date(100000000),
    new Date(200000000),
    new Date(300000000),
    new Date(400000000),
    new Date(500000000),
    new Date(600000000),
    new Date(700000000),
    new Date(800000000),
    new Date(900000000),
    new Date(1000000000),
  ];
  const votingPowerRbn = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

  const onHover = useCallback(
    (hoverInfo: HoverInfo) => {
      if (hoverInfo.focused) {
        onHoverVotingPower(hoverInfo.yData);
      } else {
        onHoverVotingPower(undefined);
      }
    },
    [onHoverVotingPower]
  );

  return (
    <ChartContainer>
      <Chart
        lineDecayAfterPointIndex={1}
        dataset={votingPowerRbn}
        labels={dates}
        onHover={onHover}
        gradientStartColor="transparent"
        gradientStopColor="transparent"
        maxGridLines={4}
      />
    </ChartContainer>
  );
};

export default StakingSummaryChart;
