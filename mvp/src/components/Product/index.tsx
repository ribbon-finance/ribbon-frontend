import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { Row, Col } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { BaseText, PrimaryText, StyledCard } from "../../designSystem";
import { computeStraddleValue } from "../../utils/straddle";
import { useETHPriceInUSD } from "../../hooks/useEthPrice";
import AmountInput from "./AmountInput";
import ProductInfo from "./ProductInfo";
import PurchaseButton from "./PurchaseButton";
import { useDefaultProduct, useInstrument } from "../../hooks/useProducts";
import { useStraddleTrade } from "../../hooks/useStraddleTrade";
import { ethers } from "ethers";
import { Link, useHistory, useParams } from "react-router-dom";
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

const Title = styled(BaseText)`
  font-style: normal;
  font-weight: bold;
  font-size: 44px;
  line-height: 64px;
  color: #000000;
`;

const DescriptionTitle = styled.p`
  font-family: "Inter", sans-serif;
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
    case "ETH Strangle":
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
  const { library, active } = useWeb3React();
  const ethPrice = useETHPriceInUSD();
  const product = useDefaultProduct();
  const purchaseAmountWei = ethers.utils.parseEther(purchaseAmount.toString());
  const straddle = useInstrument(instrumentSymbol);
  const history = useHistory();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    loading: loadingTrade,
    totalPremium,
    callPremium,
    putPremium,
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
    (amount: string) => {
      setPurchaseAmount(parseFloat(amount));
    },
    [setPurchaseAmount]
  );
  const handlePurchase = useCallback(
    async (setIsWaitingForConfirmation: () => void) => {
      if (library && active && straddle && gasPrice !== 0) {
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
            amounts[0],
            strikePrices,
            buyData,
            {
              value: totalPremium,
              gasPrice,
              gasLimit: useHigherGasLimit ? 1400000 : 1200000,
            }
          );
          setIsWaitingForConfirmation();

          await receipt.wait(1);

          setIsModalVisible(false);

          history.push("/portfolio");
        } catch (e) {
          setIsModalVisible(false);
        }
      }
    },
    [
      library,
      active,
      straddle,
      amounts,
      buyData,
      venues,
      gasPrice,
      totalPremium,
      optionTypes,
      strikePrices,
      history,
    ]
  );

  if (straddle === null) return null;

  const [, straddleETH] = computeStraddleValue(totalPremium, ethPrice);

  const expiryTimestamp = new Date(straddle.expiryTimestamp * 1000);

  return (
    <div>
      <PurchaseModal
        loading={loadingTrade}
        isVisible={isModalVisible}
        onPurchase={handlePurchase}
        onClose={handleCloseModal}
        purchaseAmount={purchaseAmount}
        straddleETH={straddleETH}
        expiry={expiryTimestamp}
        callStrikePrice={callStrikePrice}
        putStrikePrice={putStrikePrice}
        callVenue={callVenue}
        putVenue={putVenue}
        callPremium={callPremium}
        putPremium={putPremium}
      ></PurchaseModal>

      <Link to="/">
        <ArrowLeftOutlined />
      </Link>
      <ProductTitleContainer>
        <Title>{product.name}</Title>
      </ProductTitleContainer>

      <Row>
        <Col span={14}>
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

            <DescriptionTitle
              style={{ marginTop: 10, fontSize: 12, textTransform: "inherit" }}
            >
              You can buy less than 1 contract.
            </DescriptionTitle>
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
