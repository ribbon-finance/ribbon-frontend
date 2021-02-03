import React, { useState } from "react";
import styled from "styled-components";
import { Input } from "antd";
import {
  computeBreakeven,
  computeDefaultPrice,
  computeGainsAmount,
  formatProfit,
} from "../../utils/straddle";
import { BigNumber } from "ethers";
import { PrimaryText } from "../../designSystem";

const StatisticTitle = styled.p`
  padding-top: 10px;
  margin-bottom: 0px;
  padding-bottom: 10px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
`;

const DescriptionContainer = styled.div`
  padding-top: 10px;
`;

const InputNumberStyled = styled(Input)`
  background-color: white;
  border-radius: 10px;
  width: 80%;
  margin-bottom: 15px;
`;

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
`;

const CustomInputStyled = styled(InputNumberStyled)`
  background: rgba(0, 0, 0, 0.04);
  border-radius: 8px;
  border: 0px;
  height: 40px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
`;

const BarContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const GreenBar = styled.div`
  background: #0dc599;
  width: 160px;
  height: 8px;
`;

const GreenBarLeft = styled(GreenBar)`
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
`;
const GreenBarRight = styled(GreenBar)`
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
`;

const RedBar = styled.div`
  background: #f43469;
  width: 100px;
  height: 8px;
`;

type Props = {
  ethPrice: number;
  straddlePrice: string;
  callStrikePrice: BigNumber;
  putStrikePrice: BigNumber;
  amount: number;
};

const PayoffCalculator: React.FC<Props> = ({
  ethPrice,
  straddlePrice,
  callStrikePrice,
  putStrikePrice,
  amount,
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
    amount
  );

  const upperBreakevenStr = upperBreakeven.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const lowerBreakevenStr = lowerBreakeven.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div>
      <DescriptionContainer>
        <DescriptionTitle>Expected Future ETH Price</DescriptionTitle>
      </DescriptionContainer>
      <CustomInputStyled
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

      <Row>
        <DescriptionContainer>
          <DescriptionTitle>Estimated Profit</DescriptionTitle>
        </DescriptionContainer>
        {formatProfit(dollarProfit, percentProfit, profitPositive)}
      </Row>

      <Row>
        <DescriptionContainer>
          <DescriptionTitle>Profitability Conditions</DescriptionTitle>
        </DescriptionContainer>
        <div>
          <div>
            <PrimaryText>{upperBreakevenStr}</PrimaryText>
          </div>
          <BarContainer>
            <GreenBarLeft></GreenBarLeft>
            <RedBar></RedBar>
            <GreenBarRight></GreenBarRight>
          </BarContainer>
          <div>{lowerBreakevenStr}</div>
        </div>
      </Row>
    </div>
  );
};

export default PayoffCalculator;
