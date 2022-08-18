import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { formatUnits } from "@ethersproject/units";
import { AnimatePresence, motion } from "framer-motion";

import { SecondaryText, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import PerformanceChart, {
  HoverInfo,
} from "shared/lib/components/Common/PerformanceChart";
import {
  getAssets,
  VaultOptions,
  VaultVersion,
} from "shared/lib/constants/constants";
import theme from "shared/lib/designSystem/theme";
import { getAssetDecimals } from "shared/lib/utils/asset";
import { useAssetsPriceHistory } from "shared/lib/hooks/useAssetPrice";
import { assetToFiat } from "shared/lib/utils/math";
import useVaultPriceHistory from "shared/lib/hooks/useVaultPerformanceUpdate";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import HelpInfo from "shared/lib/components/Common/HelpInfo";
import useLoadingText from "shared/lib/hooks/useLoadingText";
import PerformanceScroller from "../../components/Earn/PerformanceScroller";
import { HistoricalPerformance } from "../../components/Earn/Details";
import SegmentControl from "shared/lib/components/Common/SegmentControl";

const VaultPerformanceChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: ${colors.background.two};
  border-radius: ${theme.border.radiusSmall} ${theme.border.radiusSmall} 0px 0px;
  padding-bottom: 30px;
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

interface EarnPerformanceSectionProps {
  vault: {
    vaultOption: VaultOptions;
    vaultVersion: VaultVersion;
  };
}

type Step = "current" | "historical";

const StepList = ["current", "historical"] as const;

const EarnPerformanceSection: React.FC<EarnPerformanceSectionProps> = ({
  vault: { vaultOption, vaultVersion },
}) => {
  const { priceHistory } = useVaultPriceHistory(vaultOption, vaultVersion);
  const { searchAssetPriceFromTimestamp } = useAssetsPriceHistory();
  const [step, setStep] = useState<Step>("current");
  const [vaultPerformanceTerm] = useState<"crypto" | "fiat">("crypto");
  const [monthFilter, setMonthFilter] = useState(false);
  const [chartIndex, setChartIndex] = useState(0);
  const asset = getAssets(vaultOption);
  const decimals = getAssetDecimals(asset);

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
              searchAssetPriceFromTimestamp(asset, pricePoint.timestamp * 1000),
              decimals
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
    asset,
    decimals,
    priceHistory,
    searchAssetPriceFromTimestamp,
    vaultPerformanceTerm,
  ]);

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
                    asset,
                    initialPoint.timestamp * 1000
                  ),
                  decimals
                )
              );
              const latestPrice = parseFloat(
                assetToFiat(
                  latestPoint.pricePerShare,
                  searchAssetPriceFromTimestamp(
                    asset,
                    latestPoint.timestamp * 1000
                  ),
                  decimals
                )
              );
              return [
                term,
                latestPrice >= initialPrice ? colors.green : colors.red,
              ];
          }
        })
      ) as { [key in "crypto" | "fiat"]: string },
    [asset, decimals, priceHistory, searchAssetPriceFromTimestamp]
  );

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

  const loadingText = useLoadingText();

  return (
    <>
      <AnimatePresence exitBeforeEnter>
        <motion.div
          key={step}
          transition={{
            type: "keyframes",

            duration: 0.125,
          }}
          initial={{
            opacity: 0,
            x: step === "historical" ? 50 : -50,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          exit={{
            opacity: 0,
            x: step === "historical" ? 50 : -50,
          }}
        >
          {step === "current" ? (
            <VaultPerformanceChartContainer>
              <PerformanceChart
                earn={true}
                dataset={yields}
                labels={timestamps}
                onChartHover={handleChartHover}
                extras={
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <div className="d-flex align-items-center">
                        <SecondaryText fontSize={12} className="d-block">
                          Cumulative Yield
                        </SecondaryText>
                        <TooltipExplanation
                          title="CUMULATIVE YIELD"
                          explanation="The sum of the vault’s weekly yield."
                          renderContent={({ ref, ...triggerHandler }) => (
                            <HelpInfo containerRef={ref} {...triggerHandler}>
                              i
                            </HelpInfo>
                          )}
                        />
                      </div>
                      <Title fontSize={28} lineHeight={36}>
                        {yields.length
                          ? `${(yields[chartIndex] || 0.0).toFixed(2)}%`
                          : loadingText}
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
            </VaultPerformanceChartContainer>
          ) : (
            <HistoricalPerformance />
          )}
        </motion.div>
      </AnimatePresence>
      <div
        style={{
          display: "flex",
          position: "absolute",
          left: "0",
          right: "0",
          bottom: "0",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ width: "100%", padding: 16 }} className="">
          <SegmentControl
            segments={StepList.map((item) => ({
              value: item,
              display: item,
            }))}
            value={step}
            onSelect={(page) => setStep(page as Step)}
            config={{
              theme: "outline",
              widthType: "fullWidth",
              backgroundColor: "rgba(22, 206, 185, 0.08)",
              color: "#16CEB9",
              button: {
                px: 16,
                py: 12,
                fontSize: 14,
                lineHeight: 16,
              },
            }}
          />
        </div>
        {/* <EarnPerformanceControl
          page={StepList.indexOf(step) + 1}
          stepList={StepList as unknown as string[]}
          step={step}
          total={StepList.length}
          onPageClick={(page) => {
            setStep(StepList[page - 1]);
          }}
          config={{
            theme: "outline",
            color: colors.green,
            button: {
              px: 12,
              py: 8,
              fontSize: 12,
              lineHeight: 16,
            },
          }}
        /> */}
      </div>
    </>
  );
};

export default EarnPerformanceSection;
