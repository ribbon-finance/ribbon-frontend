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
  dataset: number[];
  labels: Date[];
  lineDecayAfterIndex?: number;
  // When called with undefined, means the hover ended.
  onHoverDataIndex: (votingPower?: number) => void;
}

const StakingSummaryChart: React.FC<StakingSummaryChartProps> = ({
  dataset,
  labels,
  lineDecayAfterIndex,
  onHoverDataIndex,
}) => {
  const onHover = useCallback(
    (hoverInfo: HoverInfo) => {
      if (hoverInfo.focused) {
        onHoverDataIndex(hoverInfo.index);
      } else {
        onHoverDataIndex(undefined);
      }
    },
    [onHoverDataIndex]
  );

  return (
    <ChartContainer>
      <Chart
        lineDecayAfterPointIndex={lineDecayAfterIndex}
        dataset={dataset}
        labels={labels}
        onHover={onHover}
        gradientStartColor="transparent"
        gradientStopColor="transparent"
        maxGridLines={4}
      />
    </ChartContainer>
  );
};

export default StakingSummaryChart;
