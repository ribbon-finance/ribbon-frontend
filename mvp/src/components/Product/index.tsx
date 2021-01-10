import React, { useState } from "react";
import styled from "styled-components";
import { Row, Col } from "antd";
import { useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Title, PrimaryText, StyledCard } from "../../designSystem";
import { products } from "../../mockData";
import { computeStraddleValue } from "../../utils/straddle";
import { useEthPrice } from "../../hooks/marketPrice";
import AmountInput from "./AmountInput";
import PayoffCalculator from "./PayoffCalculator";
import ProductInfo from "./ProductInfo";
import PurchaseButton from "./PurchaseButton";
import { timeToExpiry } from "../../utils/time";

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

type PurchaseInstrumentWrapperProps = {};

interface ParamTypes {
  instrumentSymbol: string;
}

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
            To construct this product, Ribbon combines multiple options into a
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

  const { instrumentSymbol } = useParams<ParamTypes>();
  const ethPrice = useEthPrice();
  const product = products[0];
  const straddle = product.instruments[0];
  const [straddleUSD, straddleETH] = computeStraddleValue(
    straddle.callPremium,
    straddle.putPremium,
    ethPrice
  );

  const expiryTimestamp = new Date(
    straddle.expiryTimestamp * 1000
  ).toLocaleDateString();

  const expiry = `${expiryTimestamp} (${timeToExpiry(
    expiryTimestamp
  )} remaining)`;

  const totalCostETH = (parseFloat(straddleETH) * purchaseAmount).toFixed(3);

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
                <PurchaseButton
                  purchaseAmount={purchaseAmount}
                  straddleETH={totalCostETH}
                  expiry={expiry}
                ></PurchaseButton>
              </Col>
            </Row>
          </PositionSize>
          <Row>
            <Col span={14}>
              <ProductInfo
                straddle={straddle}
                amount={purchaseAmount}
              ></ProductInfo>
            </Col>
            <Col span={10}>
              <StyledCard style={{ height: "100%" }}>
                <PayoffCalculator
                  ethPrice={ethPrice}
                  straddlePrice={straddleUSD}
                  amount={purchaseAmount}
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
