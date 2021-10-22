import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { formatUnits } from "@ethersproject/units";
import { AnimatePresence, motion } from "framer-motion";

import { SecondaryText, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import PerformanceChart from "../../components/PerformanceChart/PerformanceChart";
import { HoverInfo } from "../../components/PerformanceChart/types";
import {
  getAssets,
  VaultOptions,
  VaultVersion,
} from "shared/lib/constants/constants";
import theme from "shared/lib/designSystem/theme";
import useVaultPriceHistory, {
  useLatestAPY,
} from "shared/lib/hooks/useVaultPerformanceUpdate";
import { getAssetDecimals, getAssetDisplay } from "shared/lib/utils/asset";
import SegmentControl from "shared/lib/components/Common/SegmentControl";
import { useAssetsPriceHistory } from "shared/lib/hooks/useAssetPrice";
import { assetToFiat } from "shared/lib/utils/math";

const VaultPerformacneChartContainer = styled.div`
  background: ${colors.background.two};
  border-radius: ${theme.border.radiusSmall} ${theme.border.radiusSmall} 0px 0px;
  padding-bottom: 30px;
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
  const { priceHistory } = useVaultPriceHistory(vaultOption, vaultVersion);
  const { searchAssetPriceFromTimestamp } = useAssetsPriceHistory();
  const latestAPY = useLatestAPY(vaultOption, vaultVersion);
  const [vaultPerformanceTerm, setVaultPerformanceTerm] = useState<
    "crypto" | "fiat"
  >("crypto");
  const [monthFilter, setMonthFilter] = useState(false);
  const [chartIndex, setChartIndex] = useState(0);

  const termThemeColor = useMemo(
    () =>
      Object.fromEntries(
        (["crypto", "fiat"] as const).map((term) => {
          if (priceHistory.length <= 1) {
            return [term, colors.green];
          }
          const initialPoint = priceHistory[0];
          const latestPoint = priceHistory[priceHistory.length - 1];

          switch (term) {
            case "crypto":
              return [
                term,
                latestPoint.pricePerShare.gte(initialPoint.pricePerShare)
                  ? colors.green
                  : colors.red,
              ];
            case "fiat":
            default:
              const initialPrice = parseFloat(
                assetToFiat(
                  initialPoint.pricePerShare,
                  searchAssetPriceFromTimestamp(
                    getAssets(vaultOption),
                    initialPoint.timestamp * 1000
                  ),
                  getAssetDecimals(getAssets(vaultOption))
                )
              );
              const latestPrice = parseFloat(
                assetToFiat(
                  latestPoint.pricePerShare,
                  searchAssetPriceFromTimestamp(
                    getAssets(vaultOption),
                    latestPoint.timestamp * 1000
                  ),
                  getAssetDecimals(getAssets(vaultOption))
                )
              );
              return [
                term,
                latestPrice >= initialPrice ? colors.green : colors.red,
              ];
          }
        })
      ) as { [key in "crypto" | "fiat"]: string },
    [priceHistory, searchAssetPriceFromTimestamp, vaultOption]
  );

  const { yields, timestamps } = useMemo(() => {
    if (priceHistory.length === 0) {
      return {
        yields: [0, 0],
        timestamps: [new Date(), new Date()],
      };
    }

    if (priceHistory.length === 1) {
      return {
        yields: [0, 0],
        timestamps: [
          new Date(priceHistory[0].timestamp * 1000),
          new Date(priceHistory[0].timestamp * 1000),
        ],
      };
    }

    switch (vaultPerformanceTerm) {
      case "crypto":
        return {
          yields: priceHistory.map((data, index) => {
            /**
             * Initial yield as 0
             */
            if (index === 0) {
              return 0;
            }

            const decimals = getAssetDecimals(getAssets(vaultOption));
            const initialPrice = parseFloat(
              formatUnits(priceHistory[0].pricePerShare, decimals)
            );
            const currentPrice = parseFloat(
              formatUnits(data.pricePerShare, decimals)
            );

            return ((currentPrice - initialPrice) / initialPrice) * 100;
          }),
          timestamps: priceHistory.map(
            (data) => new Date(data.timestamp * 1000)
          ),
        };

      case "fiat":
        const fiatPriceHistory = priceHistory.map((pricePoint) => ({
          timestamp: pricePoint.timestamp,
          pricePerShare: parseFloat(
            assetToFiat(
              pricePoint.pricePerShare,
              searchAssetPriceFromTimestamp(
                getAssets(vaultOption),
                pricePoint.timestamp * 1000
              ),
              getAssetDecimals(getAssets(vaultOption))
            )
          ),
        }));

        return {
          yields: fiatPriceHistory.map((data, index) => {
            /**
             * Initial yield as 0
             */
            if (index === 0) {
              return 0;
            }

            const initialPrice = fiatPriceHistory[0].pricePerShare;
            const currentPrice = data.pricePerShare;

            return ((currentPrice - initialPrice) / initialPrice) * 100;
          }),
          timestamps: fiatPriceHistory.map(
            (data) => new Date(data.timestamp * 1000)
          ),
        };
    }
  }, [
    priceHistory,
    searchAssetPriceFromTimestamp,
    vaultOption,
    vaultPerformanceTerm,
  ]);

  // Set new chart index
  useEffect(() => {
    if (yields.length) {
      setChartIndex(yields.length - 1);
    }
  }, [yields]);

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

  return (
    <>
      <div className="d-flex align-items-center mb-3">
        <Title fontSize={18} lineHeight={24} className="mr-2">
          Vault Performance
        </Title>
        <SegmentControl
          segments={[
            {
              value: "crypto",
              display: getAssetDisplay(getAssets(vaultOption)),
              textColor: termThemeColor["crypto"],
            },
            {
              value: "fiat",
              display: "usd",
              textColor: termThemeColor["fiat"],
            },
          ]}
          value={vaultPerformanceTerm}
          onSelect={(value) =>
            setVaultPerformanceTerm(value as "fiat" | "crypto")
          }
          config={{
            theme: "outline",
            color: termThemeColor[vaultPerformanceTerm],
            button: {
              px: 12,
              py: 8,
              fontSize: 12,
              lineHeight: 16,
            },
          }}
        />
      </div>
      <AnimatePresence exitBeforeEnter>
        <motion.div
          key={vaultPerformanceTerm}
          transition={{
            type: "keyframes",

            duration: 0.125,
          }}
          initial={{
            opacity: 0,
            x: vaultPerformanceTerm === "fiat" ? 50 : -50,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          exit={{
            opacity: 0,
            x: vaultPerformanceTerm === "fiat" ? 50 : -50,
          }}
        >
          <VaultPerformacneChartContainer className="pt-4">
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
                      {yields.length
                        ? `${(yields[chartIndex] || 0.0).toFixed(2)}%`
                        : "Loading"}
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
              themeColor={termThemeColor[vaultPerformanceTerm]}
            />
          </VaultPerformacneChartContainer>
          <VaultPerformacneChartSecondaryContainer>
            <div className="d-flex align-items-center justify-content-between px-4">
              <div>
                <SecondaryText fontSize={12} className="d-block">
                  Current Projected Yield (APY)
                </SecondaryText>
                <Title fontSize={28} lineHeight={36} color={colors.green}>
                  {latestAPY.fetched
                    ? `+${latestAPY.res.toFixed(2)}%`
                    : "Loading"}
                </Title>
              </div>
            </div>
          </VaultPerformacneChartSecondaryContainer>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default VaultPerformanceChart;
