import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import moment from "moment";

import { SecondaryText, Title } from "../../designSystem";
import colors from "../../designSystem/colors";
import PerformanceChart from "../../components/PerformanceChart/PerformanceChart";
import { HoverInfo } from "../../components/PerformanceChart/types";

const VaultPerformacneChartContainer = styled.div`
  border: 1px solid ${colors.border};
  border-radius: 4px;
`;

const APYLabel = styled(SecondaryText)`
  font-size: 12px;
`;

const APYNumber = styled(Title)`
  font-size: 28px;
  line-height: 36px;
`;

interface DateFilterProps {
  active: boolean;
}

const DateFilter = styled(Title)<DateFilterProps>`
  font-size: 12px;
  letter-spacing: 1.5px;
  cursor: pointer;
  color: ${(props) => (props.active ? "#FFFFFF" : "rgba(255, 255, 255, 0.4)")};
`;

const VaultPerformanceChart: React.FC = () => {
  // mocked data for now
  const originalDataset = useMemo(
    () => [3, 5, 2, 3, 5, 4, 3, 1, 4, 5, 7, 8.5, 8, 7.5],
    []
  );
  const originalLabels = useMemo(() => {
    const now = moment(new Date());
    return originalDataset
      .map((_, index) =>
        now
          .subtract(index * 7, "days")
          .utc()
          .toDate()
      )
      .reverse();
  }, [originalDataset]);

  // states
  const [monthFilter, setMonthFilter] = useState(true);
  const [performance, setPerformance] = useState<number>(
    originalDataset[originalDataset.length - 1]
  );

  const aMonthFromNow = moment(new Date()).subtract(1, "months");
  const dataset = monthFilter
    ? originalDataset.filter((_, index) => {
        return moment(originalLabels[index]).isAfter(aMonthFromNow);
      })
    : originalDataset;

  const labels = monthFilter
    ? originalLabels.filter((date) => {
        return moment(date).isAfter(aMonthFromNow);
      })
    : originalLabels;

  // formatted data
  const perfStr = `${performance.toFixed(2)}%`;

  const handleChartHover = useCallback(
    (hoverInfo: HoverInfo) => {
      if (hoverInfo.focused) {
        setPerformance(hoverInfo.yData);
      } else {
        setPerformance(originalDataset[originalDataset.length - 1]);
      }
    },
    [originalDataset]
  );

  return (
    <VaultPerformacneChartContainer
      className="pt-4"
      style={{ paddingBottom: 40 }}
    >
      <PerformanceChart
        dataset={dataset}
        labels={labels}
        onChartHover={handleChartHover}
        extras={
          <div className="d-flex align-items-center justify-content-between mb-3 px-4">
            <div>
              <APYLabel className="d-block">Yield (APY)</APYLabel>
              <APYNumber>{perfStr}</APYNumber>
            </div>
            <div>
              <DateFilter
                active={monthFilter}
                className="mr-3"
                onClick={() => setMonthFilter(true)}
              >
                1m
              </DateFilter>
              <DateFilter
                active={!monthFilter}
                onClick={() => setMonthFilter(false)}
              >
                All
              </DateFilter>
            </div>
          </div>
        }
      />
    </VaultPerformacneChartContainer>
  );
};

export default VaultPerformanceChart;
