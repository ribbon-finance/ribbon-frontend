import React, { useState } from "react";
import styled from "styled-components";
import { Row, Col } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Title, PrimaryText, StyledCard } from "../../designSystem";
import { computeStraddleValue } from "../../utils/straddle";
import { useETHPriceInUSD } from "../../hooks/useEthPrice";
import AmountInput from "./AmountInput";
import PayoffCalculator from "./PayoffCalculator";
import ProductInfo from "./ProductInfo";
import PurchaseButton from "./PurchaseButton";
import { timeToExpiry } from "../../utils/time";
import { useDefaultProduct, useInstrument } from "../../hooks/useProducts";
import { useStraddleTrade } from "../../hooks/useStraddleTrade";
import { ethers } from "ethers";
import { useParams } from "react-router-dom";

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
  const { instrumentSymbol } = useParams<ParamTypes>();

  const [purchaseAmount, setPurchaseAmount] = useState(0.0);

  const updatePurchaseAmount = (amount: number) => {
    setPurchaseAmount(amount);
  };
  const ethPrice = useETHPriceInUSD();
  const product = useDefaultProduct();
  const purchaseAmountWei = ethers.utils.parseEther(purchaseAmount.toString());
  const straddle = useInstrument(instrumentSymbol);

  const { totalPremium, callStrikePrice, putStrikePrice } = useStraddleTrade(
    straddle ? straddle.address : "",
    ethPrice,
    purchaseAmountWei
  );

  if (straddle === null) return null;

  const [straddleUSD, straddleETH] = computeStraddleValue(
    totalPremium,
    ethPrice
  );

  const expiryTimestamp = new Date(
    straddle.expiryTimestamp * 1000
  ).toLocaleDateString();

  const expiry = `${expiryTimestamp} (${timeToExpiry(
    straddle.expiryTimestamp
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
                  callStrikePrice={callStrikePrice}
                  putStrikePrice={putStrikePrice}
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
