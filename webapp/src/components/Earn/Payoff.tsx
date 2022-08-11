import React, { useState } from "react";
import styled from "styled-components";
import { BaseModalContentColumn, Title } from "shared/lib/designSystem";
import { assetToFiat } from "shared/lib/utils/math";
import EarnChart from "./EarnChart";

const ChartContainer = styled.div`
  height: 264px;
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
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
  const [input, setInput] = useState<string>("");
  const [hoverPrice, setHoverPrice] = useState<number>();
  const [, setChartHovering] = useState(false);

  // const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  //   const parsedInput = parseFloat(e.target.value);
  //   setInput(isNaN(parsedInput) || parsedInput < 0 ? "" : `${parsedInput}`);
  // }, []);

  // const handleCurrentPress = useCallback(() => {
  //   setInput(`${prices[optionAsset]!}`);
  // }, [prices, optionAsset]);

  // const KPI = useMemo(() => {
  //   let calculatePrice = input ? parseFloat(input) : prices[optionAsset]!;

  //   if (hoverPrice) {
  //     calculatePrice = hoverPrice;
  //   }

  //   const higherStrike =
  //     formatOptionStrike(currentOption.strike, chain) > calculatePrice;
  //   const isExercisedRange = currentOption.isPut ? higherStrike : !higherStrike;
  //   const assetDecimals = getAssetDecimals(asset);
  //   let profit: number;

  //   if (!isExercisedRange) {
  //     profit = parseFloat(formatUnits(currentOption.premium, assetDecimals));
  //   } else if (currentOption.isPut) {
  //     const exerciseCost =
  //       formatOptionStrike(currentOption.strike, chain) - calculatePrice;

  //     profit =
  //       parseFloat(formatUnits(currentOption.premium, assetDecimals)) -
  //       currentOption.amount * exerciseCost;
  //   } else {
  //     profit =
  //       (currentOption.amount *
  //         formatOptionStrike(currentOption.strike, chain)) /
  //         calculatePrice -
  //       currentOption.amount +
  //       parseFloat(formatUnits(currentOption.premium, assetDecimals));
  //   }

  //   return {
  //     isProfit: profit >= 0,
  //     roi:
  //       (profit /
  //         parseFloat(formatUnits(currentOption.depositAmount, assetDecimals))) *
  //       100 *
  //       0.9,
  //   };
  // }, [chain, asset, currentOption, input, hoverPrice, optionAsset, prices]);

  // const toExpiryText = useMemo(() => {
  //   const toExpiryDuration = moment.duration(
  //     currentOption.expiry.diff(moment()),
  //     "milliseconds"
  //   );

  //   if (toExpiryDuration.asMilliseconds() <= 0) {
  //     return "Expired";
  //   }

  //   return `${toExpiryDuration.days()}D ${toExpiryDuration.hours()}H ${toExpiryDuration.minutes()}M`;
  // }, [currentOption]);

  return (
    <>
      <BaseModalContentColumn marginTop={8}>
        <Title>PROFIT CALCULATOR</Title>
      </BaseModalContentColumn>

      <BaseModalContentColumn>
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
            onHover={setHoverPrice}
          />
        </ChartContainer>
      </BaseModalContentColumn>
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
