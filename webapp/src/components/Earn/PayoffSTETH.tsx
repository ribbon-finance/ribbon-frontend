import React, { useMemo, useState } from "react";
import styled from "styled-components";
import {
  BaseModalContentColumn,
  SecondaryText,
  Title,
} from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import EarnModalContentExtra from "shared/lib/components/Common/EarnModalContentExtra";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import HelpInfo from "shared/lib/components/Common/HelpInfo";
import { useAirtableEarnData } from "shared/lib/hooks/useAirtableEarnData";
import useLoadingText from "shared/lib/hooks/useLoadingText";
import EarnSTETHChart from "./EarnSTETHChart";
import { VaultOptions } from "shared/lib/constants/constants";

const ChartContainer = styled.div`
  height: 264px;
  margin: 0;
  width: calc(100% + 30px);
`;

const RelativeContainer = styled.div`
  height: 208px;
  width: 100%;
  display: flex;
`;

const CalculationContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex: 1;
  align-items: center;
  align-content: center;
`;

const CalculationContainer2 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
`;

const ParagraphText = styled(SecondaryText)`
  color: #ffffff7a;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
`;

const CalculationColumn = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 8px;
  align-items: center;
  &:last-child {
    margin-bottom: unset;
  }
`;

const CalculationData = styled(Title)<{ variant?: "red" | "green" }>`
  color: ${(props) => {
    switch (props.variant) {
      case "red":
        return colors.red;
      case "green":
        return colors.green;
      default:
        return colors.primaryText;
    }
  }};
`;

interface PayoffSTETHProps {
  vaultOption: VaultOptions;
}

// Calls user_checkpoint and shows a transaction loading screen
const PayoffSTETH: React.FC<PayoffSTETHProps> = ({ vaultOption }) => {
  const {
    baseYield,
    maxYield,
    expectedYield,
    lowerBarrierPercentage,
    upperBarrierPercentage,
    performance,
    loading,
  } = useAirtableEarnData(vaultOption);

  const loadingText = useLoadingText();

  const [hoverPrice, setHoverPrice] = useState<number>();
  const [hoverPercentage, setHoverPercentage] = useState<number>();
  const [, setChartHovering] = useState(false);

  const optionMoneyness = useMemo(() => {
    return hoverPercentage
      ? hoverPercentage / 100 < lowerBarrierPercentage ||
        hoverPercentage / 100 > upperBarrierPercentage
        ? 0
        : hoverPercentage / 100
      : performance < lowerBarrierPercentage ||
        performance > upperBarrierPercentage
      ? 0
      : performance;
  }, [
    hoverPercentage,
    lowerBarrierPercentage,
    upperBarrierPercentage,
    performance,
  ]);

  const moneynessRange = useMemo(() => {
    let leftArray = [];
    let array = [];
    let rightArray = [];

    for (let i = 0; i < 2500; i += 1) {
      leftArray.push(Math.round(lowerBarrierPercentage * 100) - (2500 - i));
    }

    for (
      let i = Math.round(lowerBarrierPercentage * 100) * 100;
      i <= Math.round(upperBarrierPercentage * 100) * 100;
      i += 1
    ) {
      array.push(i / 100);
    }

    for (let i = 0; i < 2000; i += 1) {
      rightArray.push(Math.round(upperBarrierPercentage * 100) + i + 1);
    }

    return [
      ...leftArray,
      lowerBarrierPercentage * 100 - 0.01,
      ...array,
      upperBarrierPercentage * 100 + 0.01,
      ...rightArray,
    ];
  }, [lowerBarrierPercentage, upperBarrierPercentage]);

  const yieldRange = useMemo(() => {
    let leftArray = [];
    let array = [];
    let rightArray = [];

    for (let i = 0; i < 2500; i += 1) {
      leftArray.push(baseYield * 100);
    }

    for (
      let i = 0;
      i <=
      Math.round((upperBarrierPercentage - lowerBarrierPercentage) * 100) * 100;
      i += 1
    ) {
      array.push(
        baseYield * 100 +
          Math.abs(
            i / 100 / ((upperBarrierPercentage - lowerBarrierPercentage) * 100)
          ) *
            (maxYield - baseYield) *
            100
      );
    }

    for (let i = 0; i < 2000; i += 1) {
      rightArray.push(baseYield * 100);
    }
    return [
      ...leftArray,
      baseYield * 100,
      ...array,
      baseYield * 100,
      ...rightArray,
    ];
  }, [lowerBarrierPercentage, upperBarrierPercentage, maxYield, baseYield]);

  return (
    <>
      <BaseModalContentColumn marginTop={-2}>
        <CalculationContainer2>
          <div className="d-flex flex-row ml-4 align-items-center">
            <ParagraphText fontWeight={500}>Max Yield (APY) </ParagraphText>
            <TooltipExplanation
              title="MAX YIELD"
              explanation="The max yield is defined as the max payout if the price of the underlying asset is at the barrier at expiry. The formula used to compute the max yield is as follows: BASE APY + (MAX PERF * 4 * PARTICIPATION RATE + 1)^(365 / 28) - 1"
              renderContent={({ ref, ...triggerHandler }) => (
                <HelpInfo containerRef={ref} {...triggerHandler}>
                  i
                </HelpInfo>
              )}
            />
          </div>
          <CalculationData variant={"green"}>
            {loading ? "---" : `+${(maxYield * 100).toFixed(2)}%`}
          </CalculationData>
        </CalculationContainer2>
      </BaseModalContentColumn>
      <BaseModalContentColumn marginTop={-18}>
        <RelativeContainer>
          <ChartContainer
            onMouseEnter={() => setChartHovering(true)}
            onMouseLeave={() => setChartHovering(false)}
          >
            <EarnSTETHChart
              onHoverPrice={setHoverPrice}
              onHoverPercentage={setHoverPercentage}
              performance={performance}
              baseYield={baseYield}
              lowerBarrierPercentage={lowerBarrierPercentage}
              upperBarrierPercentage={upperBarrierPercentage}
              maxYield={maxYield}
              moneynessRange={moneynessRange}
              yieldRange={yieldRange}
            />
          </ChartContainer>
        </RelativeContainer>
      </BaseModalContentColumn>
      <BaseModalContentColumn marginTop={16}>
        <SecondaryText
          fontSize={12}
          lineHeight={16}
          color={colors.primaryText + "7A"}
        >
          ETH Spot Weekly % Change
        </SecondaryText>
      </BaseModalContentColumn>
      <EarnModalContentExtra style={{ flex: 1 }}>
        <CalculationContainer>
          <CalculationColumn>
            <SecondaryText
              color={colors.primaryText + "7A"}
              fontWeight={500}
              fontSize={14}
            >
              Base Yield
            </SecondaryText>
            <div className="mr-auto">
              <TooltipExplanation
                title="BASE YIELD"
                explanation="The base yield is the yield depositors will get regardless of where the underlying asset price is at expiry. As such, the base yield is earned even if one of the barrier is breached."
                renderContent={({ ref, ...triggerHandler }) => (
                  <HelpInfo containerRef={ref} {...triggerHandler}>
                    i
                  </HelpInfo>
                )}
              />
            </div>
            <CalculationData variant={loading ? undefined : "green"}>
              {loading ? loadingText : `+${(baseYield * 100).toFixed(2)}%`}
            </CalculationData>
          </CalculationColumn>
          <CalculationColumn>
            <SecondaryText
              color={colors.primaryText + "7A"}
              fontWeight={500}
              fontSize={14}
            >
              Options Moneyness
            </SecondaryText>
            <div className="mr-auto">
              <TooltipExplanation
                title="OPTIONS MONEYNESS"
                explanation="The moneyness is defined as the current spot price over the strike price. It shows the relative position of the current price of the underlying asset with respect to the strike price."
                renderContent={({ ref, ...triggerHandler }) => (
                  <HelpInfo containerRef={ref} {...triggerHandler}>
                    i
                  </HelpInfo>
                )}
              />
            </div>
            <CalculationData
              variant={
                loading ? undefined : optionMoneyness === 0 ? "red" : "green"
              }
            >
              {loading
                ? loadingText
                : `${optionMoneyness <= 0 ? "" : "+"}${
                    optionMoneyness <= 0
                      ? (optionMoneyness * 100).toFixed(2)
                      : (optionMoneyness * 100).toFixed(2)
                  }%`}
            </CalculationData>
          </CalculationColumn>
          <CalculationColumn>
            <SecondaryText
              fontWeight={500}
              fontSize={14}
              color={"rgba(255, 255, 255, 0.48)"}
            >
              Expected Yield (APY)
            </SecondaryText>
            <div className="mr-auto">
              <TooltipExplanation
                title="EXPECTED YIELD"
                explanation="The expected yield is computed using the current moneyness. The formula used to compute the expected yield is as follows: BASE APY + (CURRENT PERF * 4 * PARTICIPATION RATE + 1)^(365 / 28) - 1"
                renderContent={({ ref, ...triggerHandler }) => (
                  <HelpInfo containerRef={ref} {...triggerHandler}>
                    i
                  </HelpInfo>
                )}
              />
            </div>
            <CalculationData variant={loading ? undefined : "green"}>
              {loading
                ? loadingText
                : `+${
                    hoverPrice
                      ? hoverPrice.toFixed(2)
                      : (expectedYield * 100).toFixed(2)
                  }%`}
            </CalculationData>
          </CalculationColumn>
        </CalculationContainer>
      </EarnModalContentExtra>
    </>
  );
};

export default PayoffSTETH;
