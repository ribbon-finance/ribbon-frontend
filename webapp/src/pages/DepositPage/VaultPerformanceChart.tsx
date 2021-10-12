import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { formatUnits } from "@ethersproject/units";

import { SecondaryText, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import PerformanceChart from "../../components/PerformanceChart/PerformanceChart";
import { HoverInfo } from "../../components/PerformanceChart/types";
import {
  useLatestAPY,
  useHistoricalData,
} from "shared/lib/hooks/useAirtableData";
import {
  getAssets,
  VaultOptions,
  VaultVersion,
} from "shared/lib/constants/constants";
import theme from "shared/lib/designSystem/theme";
import useV2VaultPriceHistory from "shared/lib/hooks/useV2VaultPriceHistory";
import { getAssetDecimals } from "shared/lib/utils/asset";
import moment from "moment";

const VaultPerformacneChartContainer = styled.div`
  background: ${colors.background.two};
  border-radius: ${theme.border.radiusSmall} ${theme.border.radiusSmall} 0px 0px;
`;

const VaultPerformacneChartSecondaryContainer = styled.div`
  padding: 20px 0px;
  border-radius: 0px 0px ${theme.border.radiusSmall} ${theme.border.radiusSmall};
  background: ${colors.background.two};
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
  vault: {
    vaultOption: VaultOptions;
    vaultVersion: VaultVersion;
  };
}

const VaultPerformanceChart: React.FC<VaultPerformanceChartProps> = ({
  vault: { vaultOption, vaultVersion },
}) => {
  const airtableData = useHistoricalData(vaultOption);
  const { priceHistory: v2PriceHistory } = useV2VaultPriceHistory(vaultOption);

  const [yields, timestamps] = useMemo(() => {
    switch (vaultVersion) {
      case "v1":
        return [
          airtableData.res.map((data) => data.cumYield),
          airtableData.res.map((data) => new Date(data.timestamp)),
        ];
      case "v2":
        if (v2PriceHistory.length === 0) {
          return [
            [0, 0],
            [moment().toDate(), moment().toDate()],
          ];
        }

        if (v2PriceHistory.length === 1) {
          return [
            [0, 0],
            [
              new Date(v2PriceHistory[0].timestamp),
              new Date(v2PriceHistory[0].timestamp),
            ],
          ];
        }

        return [
          v2PriceHistory.map((data, index) => {
            /**
             * Initial yield as 0
             */
            if (index === 0) {
              return 0;
            }

            const decimals = getAssetDecimals(getAssets(vaultOption));
            const initialPrice = parseFloat(
              formatUnits(v2PriceHistory[0].pricePerShare, decimals)
            );
            const currentPrice = parseFloat(
              formatUnits(data.pricePerShare, decimals)
            );

            return ((currentPrice - initialPrice) / initialPrice) * 100;
          }),
          v2PriceHistory.map((data) => new Date(data.timestamp)),
        ];
    }
  }, [airtableData.res, v2PriceHistory, vaultOption, vaultVersion]);

  // states
  const [monthFilter, setMonthFilter] = useState(false);
  const [chartIndex, setChartIndex] = useState(0);

  const yieldLen = yields.length;

  useEffect(() => {
    if (yieldLen) {
      setChartIndex(yieldLen - 1);
    }
  }, [yieldLen]);

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
  const projectedAPY = latestAPY.fetched
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
            <div className="d-flex align-items-center justify-content-between px-4">
              <div>
                <SecondaryText fontSize={12} className="d-block">
                  Yield (Cumulative)
                </SecondaryText>
                <Title fontSize={28} lineHeight={36}>
                  {perfStr}
                </Title>
              </div>
              <div>
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
        <div className="d-flex align-items-center justify-content-between px-4">
          <div>
            <SecondaryText fontSize={12} className="d-block">
              Current Projected Yield (APY)
            </SecondaryText>
            <Title fontSize={28} lineHeight={36} color={colors.green}>
              {projectedAPY}
            </Title>
          </div>
        </div>
      </VaultPerformacneChartSecondaryContainer>
    </>
  );
};

export default VaultPerformanceChart;
