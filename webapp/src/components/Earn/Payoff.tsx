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
import EarnSTETHChart from "./EarnChart";
import { VaultOptions } from "shared/lib/constants/constants";
import {
  getExpectedPrincipalReturnRange,
  getOptionMoneyness,
  getOptionMoneynessRange,
  getYieldRange,
} from "./PayoffHelper";

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
const Payoff: React.FC<PayoffSTETHProps> = ({ vaultOption }) => {
  const {
    baseYield,
    maxYield,
    expectedYield,
    participationRate,
    lowerBarrierPercentage,
    upperBarrierPercentage,
    performance,
    loading,
    optionPrice,
    numericalPerformance,
    lowerBarrierMaxYield,
    upperBarrierMaxYield,
    isUpperBarrierHigher,
  } = useAirtableEarnData(vaultOption);
  const loadingText = useLoadingText();

  const [hoverMoneyness, setHoverMoneyness] = useState<number>();
  const [hoverIndex, setHoverIndex] = useState<number>();
  const [hoverPercentage, setHoverPercentage] = useState<number>();
  const [, setChartHovering] = useState(false);

  const optionMoneyness = useMemo(() => {
    return getOptionMoneyness(
      hoverPercentage ? hoverPercentage / 100 : undefined,
      lowerBarrierPercentage,
      upperBarrierPercentage,
      performance,
      vaultOption
    );
  }, [
    hoverPercentage,
    lowerBarrierPercentage,
    upperBarrierPercentage,
    performance,
    vaultOption,
  ]);

  const optionMoneynessRange = useMemo(() => {
    return getOptionMoneynessRange(
      vaultOption,
      lowerBarrierPercentage,
      upperBarrierPercentage,
      isUpperBarrierHigher
    );
  }, [
    isUpperBarrierHigher,
    lowerBarrierPercentage,
    upperBarrierPercentage,
    vaultOption,
  ]);

  const yieldRange = useMemo(() => {
    return getYieldRange(
      vaultOption,
      lowerBarrierPercentage,
      upperBarrierPercentage,
      maxYield,
      baseYield,
      participationRate,
      optionPrice,
      lowerBarrierMaxYield,
      upperBarrierMaxYield,
      isUpperBarrierHigher
    );
  }, [
    vaultOption,
    lowerBarrierPercentage,
    upperBarrierPercentage,
    maxYield,
    baseYield,
    participationRate,
    optionPrice,
    lowerBarrierMaxYield,
    upperBarrierMaxYield,
    isUpperBarrierHigher,
  ]);

  const expectedPrincipalReturnRange = useMemo(() => {
    return getExpectedPrincipalReturnRange(
      vaultOption,
      lowerBarrierPercentage,
      upperBarrierPercentage,
      maxYield,
      baseYield,
      participationRate,
      optionPrice
    );
  }, [
    vaultOption,
    lowerBarrierPercentage,
    upperBarrierPercentage,
    maxYield,
    baseYield,
    participationRate,
    optionPrice,
  ]);

  const maxYieldText = useMemo(() => {
    const commonText =
      "The max yield is defined as the max payout if the price of the underlying asset is at the barrier at expiry, fees are not included. Each trade is independent and we display it in APY format for comparison purposes only. The formula used to compute the max yield is as follows: ";
    switch (vaultOption) {
      case "rEARN":
        return (
          commonText +
          "BASE APY + (MAX PERF * PARTICIPATION RATE + 1)^(365 / 28) - 1"
        );
      case "rEARN-stETH":
        return (
          commonText +
          "BASE APY + (MAX PERF * PARTICIPATION RATE + 1)^(365 / 7) - 1"
        );
    }
  }, [vaultOption]);

  const expectedYieldTitle = useMemo(() => {
    switch (vaultOption) {
      case "rEARN":
        return "Expected Yield";
      case "rEARN-stETH":
        return "Expected Principal Returned";
    }
  }, [vaultOption]);

  const expectedYieldText = useMemo(() => {
    switch (vaultOption) {
      case "rEARN":
        return "The expected yield is computed using the current moneyness. It is computed using the current spot price, fees are not included. Each trade is independent. It does not incorporate the expectation of future price and the volatility of the asset.";
      case "rEARN-stETH":
        return "The expected weekly yield represents how much of the initial capital the depositor will receive at the end of the trade. 101% means that the depositor is expected to make 1% this week. It is computed using the current spot price, fees are not included. Each trade is independent. It does not incorporate the expectation of future price and the volatility of the underlying asset.";
    }
  }, [vaultOption]);

  const expectedYieldPercentage = useMemo(() => {
    switch (vaultOption) {
      case "rEARN":
        if (loading) {
          return loadingText;
        } else {
          return `+${
            hoverMoneyness
              ? hoverMoneyness.toFixed(2)
              : (expectedYield * 100).toFixed(2)
          }%`;
        }
      case "rEARN-stETH":
        if (loading) {
          return loadingText;
        } else {
          return `${
            hoverIndex
              ? expectedPrincipalReturnRange[hoverIndex].toFixed(2)
              : (expectedYield * 100).toFixed(2)
          }%`;
        }
    }
  }, [
    expectedPrincipalReturnRange,
    expectedYield,
    hoverIndex,
    hoverMoneyness,
    loading,
    loadingText,
    vaultOption,
  ]);

  return (
    <>
      <BaseModalContentColumn marginTop={-2}>
        <CalculationContainer2>
          <div className="d-flex flex-row ml-4 align-items-center">
            <ParagraphText fontWeight={500}>Max Yield (APY) </ParagraphText>
            <TooltipExplanation
              title="MAX YIELD"
              explanation={maxYieldText}
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
              key={`${maxYield}-${lowerBarrierPercentage}-${upperBarrierPercentage}`}
              onHoverMoneyness={setHoverMoneyness}
              onHoverIndex={setHoverIndex}
              onHoverPercentage={setHoverPercentage}
              performance={
                vaultOption === "rEARN-stETH"
                  ? numericalPerformance
                  : performance
              }
              lowerBarrierPercentage={lowerBarrierPercentage}
              upperBarrierPercentage={upperBarrierPercentage}
              maxYield={maxYield}
              lowerBarrierMaxYield={lowerBarrierMaxYield}
              upperBarrierMaxYield={upperBarrierMaxYield}
              moneynessRange={optionMoneynessRange}
              yieldRange={yieldRange}
              vaultOption={vaultOption}
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
                : `${
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
              {expectedYieldTitle}
            </SecondaryText>
            <div className="mr-auto">
              <TooltipExplanation
                title="WEEKLY RETURN"
                explanation={expectedYieldText}
                renderContent={({ ref, ...triggerHandler }) => (
                  <HelpInfo containerRef={ref} {...triggerHandler}>
                    i
                  </HelpInfo>
                )}
              />
            </div>
            <CalculationData variant={loading ? undefined : "green"}>
              {expectedYieldPercentage}
            </CalculationData>
          </CalculationColumn>
        </CalculationContainer>
      </EarnModalContentExtra>
    </>
  );
};

export default Payoff;
