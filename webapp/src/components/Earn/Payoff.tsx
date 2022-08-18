import React, { useMemo, useState } from "react";
import styled from "styled-components";
import {
  BaseModalContentColumn,
  SecondaryText,
  Title,
} from "shared/lib/designSystem";
import EarnChart from "./EarnChart";
import colors from "shared/lib/designSystem/colors";
import EarnModalContentExtra from "shared/lib/components/Common/EarnModalContentExtra";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import HelpInfo from "shared/lib/components/Common/HelpInfo";
import { useAirtable } from "shared/lib/hooks/useAirtable";
import useLoadingText from "shared/lib/hooks/useLoadingText";
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

interface ProfitCalculatorProps {}

const Payoff: React.FC<ProfitCalculatorProps> = () => {
  const {
    strikePrice,
    maxYield,
    baseYield,
    absolutePerformance,
    barrierPercentage,
    loading,
  } = useAirtable();
  const loadingText = useLoadingText();

  const [input, setInput] = useState<string>("");
  const [hoverPrice, setHoverPrice] = useState<number>();
  const [hoverPercentage, setHoverPercentage] = useState<number>();
  const [, setChartHovering] = useState(false);

  const optionMoneyness = useMemo(() => {
    return hoverPercentage
      ? Math.abs(hoverPercentage) > barrierPercentage * 100
        ? 0
        : Math.abs(hoverPercentage)
      : absolutePerformance > barrierPercentage
      ? 0
      : absolutePerformance;
  }, [absolutePerformance, barrierPercentage, hoverPercentage]);

  // x axis
  const priceRange = useMemo(() => {
    let leftArray = [];
    let array = [];
    let rightArray = [];

    for (let i = 0; i < 20; i += 1) {
      leftArray.push(-Math.round(barrierPercentage * 100) - (20 - i));
    }

    for (
      let i = -(Math.round(barrierPercentage * 100) - 1);
      i <= Math.round(barrierPercentage * 100) - 1;
      i += 1
    ) {
      array.push(i);
    }

    for (let i = 0; i < 20; i += 1) {
      rightArray.push(Math.round(barrierPercentage * 100) + i + 1);
    }

    return [
      ...leftArray,
      -(barrierPercentage * 100) - 0.01,
      -(barrierPercentage * 100),
      ...array,
      barrierPercentage * 100,
      barrierPercentage * 100 + 0.01,
      ...rightArray,
    ];
  }, [barrierPercentage]);

  const otherRange = useMemo(() => {
    let leftArray = [];
    let array = [];
    let rightArray = [];

    for (let i = 0; i <= 20; i += 1) {
      leftArray.push(4);
    }

    for (
      let i = -Math.round(barrierPercentage * 100);
      i <= Math.round(barrierPercentage * 100);
      i += 1
    ) {
      array.push(
        4 +
          Math.abs(i / (barrierPercentage * 100)) * (maxYield - baseYield) * 100
      );
    }

    for (let i = 0; i <= 20; i += 1) {
      rightArray.push(4);
    }
    return [...leftArray, ...array, ...rightArray];
  }, [barrierPercentage, baseYield, maxYield]);

  const defaultMoneyness = useMemo(() => {
    return otherRange[priceRange.indexOf(parseInt(Math.round(6).toFixed(2)))];
  }, [otherRange, priceRange]);

  return (
    <>
      <BaseModalContentColumn marginTop={-4}>
        <CalculationContainer2>
          <ParagraphText fontWeight={500}>Max Yield (APY)</ParagraphText>
          <CalculationData variant={"green"}>
            {loading ? "---" : `+${(maxYield * 100).toFixed(2)}%`}
          </CalculationData>
        </CalculationContainer2>
      </BaseModalContentColumn>
      <BaseModalContentColumn marginTop={-16}>
        <RelativeContainer>
          <ChartContainer
            onClick={() => {
              if (hoverPrice) {
                setInput(hoverPrice.toFixed(2));
              }
            }}
            onMouseEnter={() => setChartHovering(true)}
            onMouseLeave={() => setChartHovering(false)}
          >
            <EarnChart
              loading={loading}
              onHoverPrice={setHoverPrice}
              onHoverPercentage={setHoverPercentage}
              absolutePerformance={absolutePerformance}
              barrierPercentage={barrierPercentage}
              maxYield={maxYield}
              priceRange={priceRange}
              otherRange={otherRange}
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
                explanation="Base Yield is good"
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
                explanation="I love money."
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
                : `${optionMoneyness === 0 ? "" : "+"}${Math.round(
                    optionMoneyness
                  ).toFixed(2)}%`}
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
                title="MAX YIELD"
                explanation="I love yield."
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
                      : defaultMoneyness?.toFixed(2)
                  }%`}
            </CalculationData>
          </CalculationColumn>
        </CalculationContainer>
      </EarnModalContentExtra>
    </>
  );
};

export default Payoff;
