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
import styled from "styled-components";

type Props = {
  ethPrice: number;
  callStrikePrice: BigNumber;
  putStrikePrice: BigNumber;
  straddlePrice: string;
};

const DescriptionTitle = styled.p`
  font-family: Montserrat;
  font-size: 10px;
  font-style: normal;
  font-weight: 500;
  line-height: 12px;
  letter-spacing: 1.5px;
  text-align: left;
  text-transform: uppercase;
  color: #999999;
  padding-top: 20px;
`;

const Description = styled.p`
  font-family: Montserrat;
  font-size: 10px;
  font-style: normal;
  font-weight: 500;
  line-height: 12px;
  letter-spacing: 1.5px;
  text-align: left;
  color: #999999;
`;

const DescriptionData = styled.span`
  font-family: Montserrat;
  font-size: 10px;
  font-style: normal;
  font-weight: 500;
  line-height: 12px;
  letter-spacing: 1.5px;
  text-align: left;
  color: black;
`;

const DescriptionDataPrimary = styled.span`
  font-family: Montserrat;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0px;
  text-align: left;
`;

const PayoffCalculator: React.FC<Props> = ({
  ethPrice,
  callStrikePrice,
  putStrikePrice,
  straddlePrice,
}) => {
  const [inputText, setInputText] = useState("");
  const [lowerBreakeven, upperBreakeven] = computeBreakeven(
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
      <Description>
        Breakeven Price: ≤
        <DescriptionData>${lowerBreakeven.toFixed(2)}</DescriptionData> or ≥
        <DescriptionData>${upperBreakeven.toFixed(2)}</DescriptionData>
      </Description>
      <DescriptionTitle>Estimated Profit</DescriptionTitle>
      {formatProfit(dollarProfit, percentProfit, profitPositive)}
      <DescriptionTitle>Cost</DescriptionTitle>
      <DescriptionDataPrimary>${straddlePrice}</DescriptionDataPrimary>
    </div>
  );
};

export default PayoffCalculator;
