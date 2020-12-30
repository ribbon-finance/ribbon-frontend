import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { Button, Row, Col, Statistic } from "antd";
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
import AmountInput from "./AmountInput";
import PayoffCalculator from "./PayoffCalculator";

const ProductTitleContainer = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
`;

const ProductDescriptionContainer = styled.div`
  padding-bottom: 20px;
`;

const PositionSize = styled.div`
  padding-bottom: 20px;
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

const StyledStatistic = (title: string, value: string) => {
  return (
    <Statistic
      valueStyle={{ fontSize: 15, fontWeight: "bold", paddingBottom: "15px" }}
      title={title}
      value={value}
    />
  );
};

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
          <p>
            Bet on ETH volatility. If the price of ETH is <b>lower or higher</b>{" "}
            than the breakeven prices, you will make a profit.
          </p>
          <p>
            To construct this product, Doji combines multiple options into a
            structured product on-chain. Learn more about how this product works
          </p>
        </PrimaryText>
      );
      break;
  }

  return description;
};

const PurchaseInstrumentWrapper: React.FC<PurchaseInstrumentWrapperProps> = () => {
  const [purchaseAmount, setPurchaseAmount] = useState(0.0);

  const updatePurchaseAmount = (amount: number) => {
    setPurchaseAmount(amount);
  };

  console.log(purchaseAmount);

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
        <Col>
          <ProductDescriptionContainer>
            {productDescription(product.name)}
          </ProductDescriptionContainer>

          <PositionSize>
            <Row align="middle">
              <Col span={5}>
                <PrimaryText>
                  <b>Position Size:</b>
                </PrimaryText>
              </Col>
              <Col span={15}>
                <AmountInput
                  purchaseAmount={purchaseAmount}
                  onChange={updatePurchaseAmount}
                ></AmountInput>
              </Col>
              <Col span={4}>
                <ButtonStyled
                  type="primary"
                  shape="round"
                  href={"/instrument/" + straddle.symbol}
                >
                  <b>Buy Now</b>
                </ButtonStyled>
              </Col>
            </Row>
          </PositionSize>

          <Row>
            <Col span={14}>
              <StyledCard style={{ height: "100%" }}>
                <Row>{StyledStatistic("Expiry", "21/12/2020")}</Row>
                <Row>{StyledStatistic("Total Cost", "$300 (0.2 ETH)")}</Row>
                <Row>
                  <Col span={12}>
                    {StyledStatistic("Breakeven Price", "$<500 or >$600")}
                  </Col>
                  <Col span={12}>
                    {StyledStatistic("To Breakeven", "+5.2%")}
                  </Col>
                </Row>
              </StyledCard>
            </Col>
            <Col span={10}>
              <StyledCard style={{ height: "100%" }}>
                <PayoffCalculator
                  ethPrice={100}
                  straddlePrice={"100"}
                ></PayoffCalculator>
              </StyledCard>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default PurchaseInstrumentWrapper;
