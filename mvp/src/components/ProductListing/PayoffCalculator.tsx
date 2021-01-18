import React, { useState } from "react";
import { Row } from "antd";
import {
  computeBreakeven,
  computeDefaultPrice,
  computeGains,
  formatProfit,
} from "../../utils/straddle";
import { InputNumberStyled } from "../../designSystem";

type Props = {
  ethPrice: number;
  straddlePrice: string;
};

const PayoffCalculator: React.FC<Props> = ({ ethPrice, straddlePrice }) => {
  const [inputText, setInputText] = useState("");
  const [, upperBreakeven] = computeBreakeven(
    straddlePrice,
    ethPrice
  );

  const defaultPrice = computeDefaultPrice(upperBreakeven, 1.0);
  const [dollarProfit, percentProfit, profitPositive] = computeGains(
    ethPrice,
    parseFloat(inputText),
    parseFloat(straddlePrice)
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
