import React, { useCallback, useState } from "react";
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
import { Link, useParams } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { IAggregatedOptionsInstrumentFactory } from "../../codegen/IAggregatedOptionsInstrumentFactory";
import useGasPrice from "../../hooks/useGasPrice";
import PurchaseModal from "./PurchaseModal";

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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState(0.0);

  const currentGasPrice = useGasPrice();
  const { library } = useWeb3React();
  const ethPrice = useETHPriceInUSD();
  const product = useDefaultProduct();
  const purchaseAmountWei = ethers.utils.parseEther(purchaseAmount.toString());
  const straddle = useInstrument(instrumentSymbol);

  const {
    loading: loadingTrade,
    totalPremium,
    callVenue,
    putVenue,
    callStrikePrice,
    putStrikePrice,
    strikePrices,
    optionTypes,
    venues,
    amounts,
    buyData,
    gasPrice: recommendedGasPrice,
  } = useStraddleTrade(
    straddle ? straddle.address : "",
    ethPrice,
    purchaseAmountWei
  );

  const gasPrice = recommendedGasPrice.toNumber() || currentGasPrice;

  const handleCloseModal = useCallback(() => setIsModalVisible(false), [
    setIsModalVisible,
  ]);
  const updatePurchaseAmount = useCallback(
    (amount: number) => {
      setPurchaseAmount(amount);
    },
    [setPurchaseAmount]
  );
  const handlePurchase = useCallback(
    async (setIsWaitingForConfirmation: () => void) => {
      if (library && straddle && gasPrice !== 0) {
        try {
          const signer = library.getSigner();
          const instrument = IAggregatedOptionsInstrumentFactory.connect(
            straddle.address,
            signer
          );
          const useHigherGasLimit = venues.includes("OPYN_GAMMA");

          const receipt = await instrument.buyInstrument(
            venues,
            optionTypes,
            amounts,
            strikePrices,
            buyData,
            {
              value: totalPremium,
              gasPrice,
              gasLimit: useHigherGasLimit ? 1700000 : 1200000,
            }
          );
          setIsWaitingForConfirmation();

          await receipt.wait(1);

          setIsModalVisible(false);
        } catch (e) {
          setIsModalVisible(false);
        }
      }
    },
    [
      library,
      straddle,
      amounts,
      buyData,
      venues,
      gasPrice,
      totalPremium,
      optionTypes,
      strikePrices,
    ]
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

  return (
    <div>
      <PurchaseModal
        loading={loadingTrade}
        isVisible={isModalVisible}
        onPurchase={handlePurchase}
        onClose={handleCloseModal}
        purchaseAmount={purchaseAmount}
        straddleETH={straddleETH}
        expiry={expiry}
        callStrikePrice={callStrikePrice}
        putStrikePrice={putStrikePrice}
        callVenue={callVenue}
        putVenue={putVenue}
      ></PurchaseModal>

      <Link to="/">
        <ArrowLeftOutlined />
      </Link>
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
                  onClick={() => setIsModalVisible(true)}
                  purchaseAmount={purchaseAmount}
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
