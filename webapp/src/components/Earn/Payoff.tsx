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
import ModalContentExtra from "shared/lib/components/Common/ModalContentExtra";
const ChartContainer = styled.div`
  height: 264px;
  margin: 0 -15px;
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

const STRIKEPRICE = 1000;
const PARTICIPATIONRATE = 0.03;
const SPOTPRICE = 900;
const ABSOLUTEPERFORMANCE =
  ((Math.abs(SPOTPRICE - STRIKEPRICE) / STRIKEPRICE) * PARTICIPATIONRATE * 4 +
    1) **
    (365 / 28) -
  1;

console.log(ABSOLUTEPERFORMANCE);
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
      <BaseModalContentColumn marginTop={-32}>
        <SecondaryText
          fontSize={12}
          lineHeight={16}
          color={colors.primaryText + "FA"}
        >
          ETH Spot Weekly % Change
        </SecondaryText>
      </BaseModalContentColumn>
      <ModalContentExtra style={{ flex: 1 }}>
        <CalculationContainer>
          <CalculationColumn>
            <SecondaryText fontSize={14} className="mr-auto">
              Options Moneyness
            </SecondaryText>
            <CalculationData variant={optionMoneyness === 0 ? "red" : "green"}>
              {optionMoneyness === 0 ? "" : "+"}
              {Math.round(optionMoneyness).toFixed(2)}%
            </CalculationData>
          </CalculationColumn>
          <CalculationColumn>
            <SecondaryText fontSize={14} className="mr-auto">
              Max Yield (APY)
            </SecondaryText>
            <CalculationData variant={"green"}>+29.12%</CalculationData>
          </CalculationColumn>
        </CalculationContainer>
      </ModalContentExtra>
      {/* <BaseModalContentColumn marginTop={8}>
        {chartHovering ? (
          <SecondaryText
            fontSize={12}
            lineHeight={16}
            color={colors.primaryText}
          >
            Tap to update price field above
          </SecondaryText>
        ) : (
          <StrikeLabel>STRIKE PRICE: {currency(1000).format()}</StrikeLabel>
        )}
      </BaseModalContentColumn> */}
      {/* <ModalContentExtra style={{ flex: 1 }}>
        <CalculationContainer>
          <CalculationColumn>
            <SecondaryText fontSize={14} className="mr-auto">
              Options Moneyness
            </SecondaryText>
            <CalculationData></CalculationData>
          </CalculationColumn>
          <CalculationColumn>
            <SecondaryText fontSize={14} className="mr-auto">
              Max Yield (APY)
            </SecondaryText>
            <CalculationData> {MAXAPR}%</CalculationData>
          </CalculationColumn>
        </CalculationContainer>
      </ModalContentExtra> */}
    </>
  );
};

export default Payoff;
