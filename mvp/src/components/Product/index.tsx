import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { Button, Row, Col, Input, Form } from "antd";
import { useParams } from "react-router-dom";
import {
  DollarCircleOutlined,
  ArrowLeftOutlined,
  LineChartOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Title, PrimaryText, StyledCard } from "../../designSystem";
import { products } from "../../mockData";
import { computeStraddleValue, computeBreakeven } from "../../utils/straddle";
import { useEthPrice } from "../../hooks/marketPrice";
import { PositionCalculator } from "./PositionCalculator";
import AmountInput from "./AmountInput";

const ProductTitleContainer = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
`;

const ProductDescriptionContainer = styled.div`
  padding-bottom: 30px;
`;

const SupplementaryInfoContainer = styled.div`
  padding-top: 30px;
  padding-bottom: 30px;
`;

const ButtonStyled = styled(Button)`
  height: 100%;
  border-radius: 10px;
`;

const DescriptionCardText = styled.span`
  font-weight: bold;
  padding-left: 15px;
`;

const DescriptionRow = styled(Row)`
  padding-bottom: 15px;
`;

type PurchaseInstrumentWrapperProps = {};

interface ParamTypes {
  instrumentSymbol: string;
}

const DescriptionCard = (text: string, icon: string) => {
  let useIcon;
  switch (icon) {
    case "dollar":
      useIcon = <DollarCircleOutlined />;
      break;
    case "clock":
      useIcon = <ClockCircleOutlined />;
      break;
    case "breakeven":
      useIcon = <LineChartOutlined />;
      break;
  }
  return (
    <DescriptionRow>
      <StyledCard
        style={{ width: "100%" }}
        bodyStyle={{ paddingTop: 15, paddingBottom: 15 }}
      >
        {useIcon}
        <DescriptionCardText>{text}</DescriptionCardText>
      </StyledCard>
    </DescriptionRow>
  );
};

const productDescription = (name: string) => {
  var description;
  switch (name) {
    case "ETH Straddle":
      description = (
        <PrimaryText>
          Bet on ETH volatility. If the price of ETH is <b>lower or higher</b>{" "}
          than the breakeven prices, you will make a profit.
        </PrimaryText>
      );
      break;
  }

  return description;
};

const PurchaseInstrumentWrapper: React.FC<PurchaseInstrumentWrapperProps> = () => {
  const [purchaseAmount, setPurchaseAmount] = useState(0.0);

  console.log(setPurchaseAmount);

  const { instrumentSymbol } = useParams<ParamTypes>();
  const ethPrice = useEthPrice();
  const product = products[0];
  const straddle = product.instruments[0];
  const [straddleUSD, straddleETH] = computeStraddleValue(
    straddle.callPremium,
    straddle.putPremium,
    ethPrice
  );
  const [lowerBreakeven, upperBreakeven] = computeBreakeven(
    straddleUSD,
    ethPrice
  );
  const expiryTimestamp = new Date(
    straddle.expiryTimestamp * 1000
  ).toLocaleDateString();

  return (
    <div>
      <a href="/">
        <ArrowLeftOutlined />
      </a>
      <ProductTitleContainer>
        <Title>{product.name}</Title>
      </ProductTitleContainer>

      <Row>
        <Col span={16}>
          <ProductDescriptionContainer>
            {productDescription(product.name)}
          </ProductDescriptionContainer>

          <Row align="middle">
            <Col span={18}>
              <AmountInput
                onChange={(amount) => setPurchaseAmount(amount)}
              ></AmountInput>{" "}
            </Col>
            <Col span={6}>
              <ButtonStyled
                type="primary"
                shape="round"
                href={"/instrument/" + straddle.symbol}
              >
                <b>Review Order</b>
              </ButtonStyled>
            </Col>
          </Row>

          <SupplementaryInfoContainer>
            <Row>
              <Col span={11}>
                {DescriptionCard(
                  `Cost per contract: $${straddleUSD}`,
                  "dollar"
                )}
              </Col>
              <Col span={12} offset={1}>
                {DescriptionCard(`Expiry: ${expiryTimestamp}`, "clock")}
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                {DescriptionCard(
                  `Breakeven Price: ≤ $${lowerBreakeven} or ≥ $${upperBreakeven}`,
                  "breakeven"
                )}
              </Col>
            </Row>
          </SupplementaryInfoContainer>
        </Col>
        <Col span={7} offset={1}>
          <PositionCalculator></PositionCalculator>
        </Col>
      </Row>
    </div>
  );
};

export default PurchaseInstrumentWrapper;
