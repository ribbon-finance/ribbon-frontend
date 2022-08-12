import React, { useMemo, useState } from "react";
import styled from "styled-components";
import {
  BaseModalContentColumn,
  SecondaryText,
  Title,
} from "shared/lib/designSystem";
import { assetToFiat } from "shared/lib/utils/math";
import EarnChart from "./EarnChart";
import colors from "shared/lib/designSystem/colors";
import EarnModalContentExtra from "shared/lib/components/Common/EarnModalContentExtra";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import HelpInfo from "shared/lib/components/Common/HelpInfo";
const ChartContainer = styled.div`
  height: 264px;
  margin: 0;
  width: calc(100% + 30px);
`;

const RelativeContainer = styled.div`
  height: 264px;
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
  const spotPrice = 1049;
  const strikePrice = 1000;
  const defaultPercentageDiff = Math.abs((spotPrice / strikePrice - 1) * 100);
  const barrierPercentage = 8; // 8% upper and lower barrier
  const [input, setInput] = useState<string>("");
  const [hoverPrice, setHoverPrice] = useState<number>();
  const [hoverPercentage, setHoverPercentage] = useState<number>();
  const [defaultMoneyness, setDefaultMoneyness] = useState<number>(0);
  const [, setChartHovering] = useState(false);

  const optionMoneyness = useMemo(() => {
    console.log(hoverPercentage);
    return hoverPercentage
      ? Math.abs(hoverPercentage) > barrierPercentage
        ? 0
        : Math.abs(hoverPercentage)
      : defaultPercentageDiff > barrierPercentage
      ? 0
      : defaultPercentageDiff;
  }, [defaultPercentageDiff, hoverPercentage]);

  return (
    <>
      <BaseModalContentColumn marginTop={-4}>
        <CalculationContainer2>
          <ParagraphText fontWeight={500}>Expected Yield (APY)</ParagraphText>
          <CalculationData variant={"green"}>
            +{hoverPrice ? hoverPrice.toFixed(2) : defaultMoneyness?.toFixed(2)}
            %
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
              strike={1000}
              price={hoverPrice ? hoverPrice : input ? parseFloat(input) : 100!}
              premium={parseFloat(assetToFiat(1000, 100!, 9)) / 1000}
              isPut={true}
              onHoverPrice={setHoverPrice}
              onHoverPercentage={setHoverPercentage}
              defaultMoneyness={setDefaultMoneyness}
              spotPrice={spotPrice}
              strikePrice={strikePrice}
              defaultPercentageDiff={Math.round(defaultPercentageDiff).toFixed(
                2
              )}
              barrierPercentage={barrierPercentage}
            />
          </ChartContainer>
        </RelativeContainer>
      </BaseModalContentColumn>
      <BaseModalContentColumn marginTop={-24}>
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
            <CalculationData variant={optionMoneyness === 0 ? "red" : "green"}>
              {optionMoneyness === 0 ? "" : "+"}
              {Math.round(optionMoneyness).toFixed(2)}%
            </CalculationData>
          </CalculationColumn>
          <CalculationColumn>
            <SecondaryText
              fontWeight={500}
              fontSize={14}
              color={"rgba(255, 255, 255, 0.48)"}
            >
              Max Yield (APY)
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
            <CalculationData variant={"green"}>+29.12%</CalculationData>
          </CalculationColumn>
        </CalculationContainer>
      </EarnModalContentExtra>
    </>
  );
};

export default Payoff;
