import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import { SecondaryText, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import PerformanceChart from "../../components/PerformanceChart/PerformanceChart";
import { HoverInfo } from "../../components/PerformanceChart/types";
import {
  useLatestAPY,
  useHistoricalData,
} from "shared/lib/hooks/useAirtableData";
import { VaultOptions } from "shared/lib/constants/constants";

const VaultPerformacneChartContainer = styled.div`
  border: 1px solid ${colors.border};
  border-radius: 4px 4px 0px 0px;
`;

const VaultPerformacneChartSecondaryContainer = styled.div`
  padding-top: 20px;
  border-bottom: 1px solid ${colors.border};
  border-left: 1px solid ${colors.border};
  border-right: 1px solid ${colors.border};
  border-radius: 0px 0px 4px 4px;
`;

const APYLabel = styled(SecondaryText)`
  font-size: 12px;
`;

const APYNumber = styled(Title)`
  font-size: 28px;
  line-height: 36px;
`;

const FutureAPYNumber = styled(Title)`
  font-size: 28px;
  line-height: 36px;
  color: #16ceb9;
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

interface VaultPerformanceChartProps {
  vaultOption: VaultOptions;
}

const VaultPerformanceChart: React.FC<VaultPerformanceChartProps> = ({
  vaultOption,
}) => {
  const airtableData = useHistoricalData(vaultOption);
  const yields = airtableData.res.map((data) => data.cumYield);
  const timestamps = airtableData.res.map((data) => new Date(data.timestamp));

  // states
  const [monthFilter, setMonthFilter] = useState(false);
  const [chartIndex, setChartIndex] = useState(0);

  const yieldLen = yields.length;

  useEffect(() => {
    if (yieldLen) {
      setChartIndex(yieldLen - 1);
    }
  }, [yieldLen]);

  // Comment out month changes while data is < 5 rows
  // const aMonthFromNow = moment(new Date()).subtract(1, "months");
  // const dataset = monthFilter
  //   ? yields.filter((_, index) => {
  //       return moment(timestamps[index]).isAfter(aMonthFromNow);
  //     })
  //   : yields;
  // const labels = monthFilter
  //   ? timestamps.filter((date) => {
  //       return moment(date).isAfter(aMonthFromNow);
  //     })
  //   : timestamps;

  const handleChartHover = useCallback(
    (hoverInfo: HoverInfo) => {
      if (hoverInfo.focused) {
        setChartIndex(hoverInfo.index);
      } else {
        setChartIndex(yields.length - 1);
      }
    },
    [yields]
  );

  // formatted data
  const perfStr = yields.length
    ? `${(yields[chartIndex] || 0.0).toFixed(2)}%`
    : "Loading";

  const latestAPY = useLatestAPY(vaultOption);
  const projectedAPY = latestAPY.res
    ? `+${latestAPY.res.toFixed(2)}%`
    : "Loading";

  return (
    <>
      <VaultPerformacneChartContainer
        className="pt-4"
        style={{ paddingBottom: 30 }}
      >
        <PerformanceChart
          dataset={yields}
          labels={timestamps}
          onChartHover={handleChartHover}
          extras={
            <div className="d-flex align-items-center justify-content-between mb-3 px-4">
              <div>
                <APYLabel className="d-block">Yield (Cumulative)</APYLabel>
                <APYNumber>{perfStr}</APYNumber>
              </div>
              <div>
                {/* <DateFilter
                active={monthFilter}
                className="mr-3"
                onClick={() => setMonthFilter(true)}
              >
                1m
              </DateFilter> */}
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
      <VaultPerformacneChartSecondaryContainer>
        <div className="d-flex align-items-center justify-content-between mb-3 px-4">
          <div>
            <APYLabel className="d-block">
              Current Projected Yield (APY)
            </APYLabel>
            <FutureAPYNumber>{projectedAPY}</FutureAPYNumber>
          </div>
        </div>
      </VaultPerformacneChartSecondaryContainer>
    </>
  );
};

export default VaultPerformanceChart;
