import React, { useState } from "react";
import styled from "styled-components";
import { Input, Row, Col } from "antd";
import { computeBreakeven } from "../../utils/straddle";

const Profit = styled.span`
  font-size: 18px;
  font-weight: bold;
`;

const ProfitPositive = styled(Profit)`
  color: #06c018;
`;

const ProfitNegative = styled(Profit)`
  color: #c01515;
`;

type Props = {
  ethPrice: number;
  straddlePrice: string;
};

const computeDefaultPrice = (upperBreakeven: string, buffer: number) => {
  const defaultPrice = parseFloat(upperBreakeven) * buffer;
  return Math.round(defaultPrice);
};

const computeGains = (
  currentAssetPrice: number,
  futureAssetPrice: number,
  instrumentPrice: number
): [string, string, boolean] => {
  if (isNaN(futureAssetPrice)) {
    return ["0.00", "0.0", true];
  }

  const dollarProfit = futureAssetPrice - currentAssetPrice - instrumentPrice;
  const percentProfit = (dollarProfit / instrumentPrice) * 100;
  if (dollarProfit >= 0) {
    return [dollarProfit.toFixed(2), percentProfit.toFixed(1), true];
  } else {
    return [dollarProfit.toFixed(2), percentProfit.toFixed(1), false];
  }
};

const formatProfit = (
  dollarProfit: string,
  percentProfit: string,
  profitPositive: boolean
) => {
  if (dollarProfit == "0.00") {
    return <Profit>$0.00 (+0%)</Profit>;
  }
  if (profitPositive) {
    return (
      <ProfitPositive>
        ${dollarProfit} (+{percentProfit}%)
      </ProfitPositive>
    );
  } else {
    return (
      <ProfitNegative>
        ${dollarProfit} ({percentProfit}%)
      </ProfitNegative>
    );
  }
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
