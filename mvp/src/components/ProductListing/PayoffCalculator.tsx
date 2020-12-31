import React, { useState } from "react";
import styled from "styled-components";
import { Input, Row, Col } from "antd";
import {
  computeBreakeven,
  computeDefaultPrice,
  computeGains,
  formatProfit,
} from "../../utils/straddle";

type Props = {
  ethPrice: number;
  straddlePrice: string;
};

const PayoffCalculator: React.FC<Props> = ({ ethPrice, straddlePrice }) => {
  const [inputText, setInputText] = useState("");
  const [lowerBreakeven, upperBreakeven] = computeBreakeven(
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
      <Row align="middle">
        <Col span={14}>If the price of ETH is:</Col>
        <Col span={8}>
          <Input
            prefix="$"
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
        </Col>
      </Row>

      <div style={{ paddingTop: 10 }}>Estimated Profit</div>
      <div>{formatProfit(dollarProfit, percentProfit, profitPositive)}</div>
    </div>
  );
};

export default PayoffCalculator;
