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
import LeftOutlined from "@ant-design/icons/lib/icons/LeftOutlined";
import RightOutlined from "@ant-design/icons/lib/icons/RightOutlined";

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

const greenBarWidth = "160px";
const redBarWidth = "100px";
const barHeight = "8px";
const barBorderRadius = "4px";

const GreenBar = styled.div`
  background: #0dc599;
  width: ${greenBarWidth};
  height: ${barHeight};
`;

const GreenBarLeft = styled(GreenBar)`
  border-top-left-radius: ${barBorderRadius};
  border-bottom-left-radius: ${barBorderRadius};
`;
const GreenBarRight = styled(GreenBar)`
  border-top-right-radius: ${barBorderRadius};
  border-bottom-right-radius: ${barBorderRadius};
`;

const RedBar = styled.div`
  background: #f43469;
  width: ${redBarWidth};
  height: ${barHeight};
`;

const PayoffPrice = styled(PrimaryText)`
  color: #000000;
  font-weight: 500;
  font-size: 12px;
  line-height: 12px;
  margin: 0 8px;
`;

const PayoffPriceContainerTop = styled.div`
  margin-bottom: 16px;
  margin-left: calc(${greenBarWidth} + ${redBarWidth} / 2);
`;

const PayoffPriceContainerBottom = styled.div`
  margin-top: 16px;
  margin-left: calc(${greenBarWidth} - 85px);
`;

const LeftArrow = styled(LeftOutlined)`
  color: #0dc599;
`;

const RightArrow = styled(RightOutlined)`
  color: #0dc599;
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
          <PayoffPriceContainerTop>
            <PayoffPrice>${upperBreakevenStr}</PayoffPrice>
            <PayoffArrows direction="right"></PayoffArrows>
          </PayoffPriceContainerTop>
          <BarContainer>
            <GreenBarLeft></GreenBarLeft>
            <RedBar></RedBar>
            <GreenBarRight></GreenBarRight>
          </BarContainer>
          <PayoffPriceContainerBottom>
            <PayoffArrows direction="left"></PayoffArrows>
            <PayoffPrice>${lowerBreakevenStr}</PayoffPrice>
          </PayoffPriceContainerBottom>
        </div>
      </Row>
    </div>
  );
};

const PayoffArrows: React.FC<{ direction: "left" | "right" }> = ({
  direction,
}) => {
  const ArrowComponent = (direction === "left"
    ? LeftArrow
    : RightArrow) as React.ElementType;

  let opacities = ["0.2", "0.48", "1"];
  opacities = direction === "left" ? opacities.reverse() : opacities;

  return (
    <>
      {opacities.map((opacity) => (
        <ArrowComponent key={opacity} style={{ opacity }} />
      ))}
    </>
  );
};

export default PayoffCalculator;
