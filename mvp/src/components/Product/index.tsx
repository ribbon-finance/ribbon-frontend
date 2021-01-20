import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { Row, Col, Button, Modal } from "antd";
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
import StyledStatistic from "../../designSystem/StyledStatistic";
import { useWeb3React } from "@web3-react/core";
import { IAggregatedOptionsInstrumentFactory } from "../../codegen/IAggregatedOptionsInstrumentFactory";
import { CALL_OPTION_TYPE, PUT_OPTION_TYPE } from "../../models";

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

  const { library, account } = useWeb3React();
  const ethPrice = useETHPriceInUSD();
  const product = useDefaultProduct();
  const purchaseAmountWei = ethers.utils.parseEther(purchaseAmount.toString());
  const straddle = useInstrument(instrumentSymbol);

  const {
    totalPremium,
    callStrikePrice,
    putStrikePrice,
    venues,
    amounts,
    buyData,
    gasPrice,
  } = useStraddleTrade(
    straddle ? straddle.address : "",
    ethPrice,
    purchaseAmountWei
  );

  const handleCloseModal = useCallback(() => setIsModalVisible(false), [
    setIsModalVisible,
  ]);
  const updatePurchaseAmount = useCallback(
    (amount: number) => {
      setPurchaseAmount(amount);
    },
    [setPurchaseAmount]
  );
  const handlePurchase = useCallback(async () => {
    if (library && straddle) {
      const signer = library.getSigner();
      const instrument = IAggregatedOptionsInstrumentFactory.connect(
        straddle.address,
        signer
      );
      const optionTypes = [PUT_OPTION_TYPE, CALL_OPTION_TYPE];
      const strikePrices = [putStrikePrice, callStrikePrice];
      console.log([
        venues,
        optionTypes,
        amounts,
        strikePrices,
        buyData,
        { value: totalPremium, gasPrice },
      ]);
      await instrument.buyInstrument(
        venues,
        optionTypes,
        amounts,
        strikePrices,
        buyData,
        { value: totalPremium, gasPrice }
      );
    }
  }, [
    library,
    account,
    straddle,
    amounts,
    buyData,
    callStrikePrice,
    putStrikePrice,
    venues,
    gasPrice,
    totalPremium,
  ]);

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
      <PurchaseModal
        isVisible={isModalVisible}
        onPurchase={handlePurchase}
        onClose={handleCloseModal}
        purchaseAmount={purchaseAmount}
        straddleETH={totalCostETH}
        expiry={expiry}
      ></PurchaseModal>

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

type PurchaseModalProps = {
  isVisible: boolean;
  onPurchase: () => void;
  onClose: () => void;
  purchaseAmount: number;
  straddleETH: string;
  expiry: string;
};

const PurchaseModal: React.FC<PurchaseModalProps> = ({
  isVisible,
  onPurchase,
  onClose,
  purchaseAmount,
  straddleETH,
  expiry,
}) => {
  const [isPending, setPending] = useState(false);

  const handleOk = () => {
    setPending(true);
    onPurchase();
  };

  return (
    <Modal
      visible={isVisible}
      onOk={handleOk}
      onCancel={onClose}
      width={300}
      title={"Confirm Purchase"}
      footer={[
        <Button key="back" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isPending}
          onClick={handleOk}
        >
          Purchase
        </Button>,
      ]}
    >
      <Row>
        <StyledStatistic
          title="I am purchasing"
          value={`${purchaseAmount} contracts`}
        ></StyledStatistic>
      </Row>
      <Row>
        <StyledStatistic
          title="This will cost"
          value={
            parseFloat(straddleETH) ? `${straddleETH} ETH` : "Computing cost..."
          }
        ></StyledStatistic>
      </Row>

      <Row>
        <StyledStatistic
          title="The contracts will expire by"
          value={expiry.toString()}
        ></StyledStatistic>
      </Row>
    </Modal>
  );
};

export default PurchaseInstrumentWrapper;
