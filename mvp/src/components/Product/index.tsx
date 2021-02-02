import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { Row, Col } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import {
  BaseText,
  PrimaryText,
  StyledCard,
  SecondaryFont,
} from "../../designSystem";
import { computeStraddleValue } from "../../utils/straddle";
import { useETHPriceInUSD } from "../../hooks/useEthPrice";
import AmountInput from "./AmountInput";
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

const CategoryContainer = styled.div`
  padding-top: 30px;
`;

const ProductTitleContainer = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
`;

const ProductDescriptionContainer = styled.div`
  padding-bottom: 20px;
`;

const CheckoutTitle = styled(BaseText)`
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  color: #000000;
`;

const Title = styled(BaseText)`
  font-style: normal;
  font-weight: bold;
  font-size: 44px;
  line-height: 64px;
  color: #000000;
`;

const CategoryTag = styled(SecondaryFont)`
  color: white;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  padding: 8px 20px 8px 20px;
  border-radius: 100px;
  background: #2300f9;
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
          Bet that ETH will be volatile over some period of time - the more ETH
          moves from today’s price, the more money you make.
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
        <Col span={14}>
          <ProductTitleContainer>
            <Title>{product.name}</Title>
          </ProductTitleContainer>

          <ProductDescriptionContainer>
            {productDescription(product.name)}
          </ProductDescriptionContainer>

          <ProductInfo
            straddle={straddle}
            amount={purchaseAmount}
          ></ProductInfo>
        </Col>
        <Col span={9} offset={1}>
          <StyledCard title="Buy ETH Strangle">
            <DescriptionTitle>No. of contracts</DescriptionTitle>
            <AmountInput
              purchaseAmount={purchaseAmount}
              onChange={updatePurchaseAmount}
            ></AmountInput>

            <PurchaseButton
              onClick={() => setIsModalVisible(true)}
              purchaseAmount={purchaseAmount}
            ></PurchaseButton>
          </StyledCard>
        </Col>
      </Row>
    </div>
  );
};
export default PurchaseInstrumentWrapper;
