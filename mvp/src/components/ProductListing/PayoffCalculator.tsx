import React, { useState } from "react";
import { Row } from "antd";
import {
  computeBreakeven,
  computeDefaultPrice,
  computeGainsAmount,
  formatProfit,
} from "../../utils/straddle";
import { InputNumberStyled } from "../../designSystem";
import { BigNumber } from "ethers";

type Props = {
  ethPrice: number;
  callStrikePrice: BigNumber;
  putStrikePrice: BigNumber;
  straddlePrice: string;
};

const PayoffCalculator: React.FC<Props> = ({
  ethPrice,
  callStrikePrice,
  putStrikePrice,
  straddlePrice,
}) => {
  const [inputText, setInputText] = useState("");
  const [, upperBreakeven] = computeBreakeven(
    straddlePrice,
    callStrikePrice,
    putStrikePrice
  );

  const defaultPrice = computeDefaultPrice(upperBreakeven, 1.0);
  const [dollarProfit, percentProfit, profitPositive] = computeGainsAmount(
    ethPrice,
    parseFloat(inputText),
    callStrikePrice,
    putStrikePrice,
    parseFloat(straddlePrice),
    1
  );

  return (
    <div>
      <Row>If the price of ETH is:</Row>
      <Row align="middle">
        <InputNumberStyled
          prefix="$"
          suffix="per ETH"
          placeholder={defaultPrice.toString()}
          type="number"
          min="0"
          step="1"
          value={inputText}
          onKeyDown={(e) => {
            if (e.key === "-") {
              e.preventDefault();
            }
          }}
          onChange={(e) => {
            setInputText(e.target.value);
          }}
        />
      </Row>

      <div style={{ paddingTop: 10 }}>Estimated Profit</div>
      <div>{formatProfit(dollarProfit, percentProfit, profitPositive)}</div>
    </div>
  );
};

export default PayoffCalculator;
