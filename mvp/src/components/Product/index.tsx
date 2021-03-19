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
import PayoffCalculator from "./PayoffCalculator";
import { VENUE_MAP } from "../../models";

const { constants } = ethers;

const ParentContainer = styled.div`
  @media (max-width: 500px) {
    margin-bottom: 60px;
  }
`;

const ProductHeader = styled.div`
  @media (max-width: 500px) {
    padding: 0 5%;
  }
`;

const StyledRow = styled(Row)`
  @media (max-width: 500px) {
    flex-direction: column;
  }
`;

const ContentContainer = styled(Col)`
  @media (max-width: 500px) {
    flex: 0 0 100%;
    max-width: 100%;
    padding: 0 5%;
  }
`;

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

  @media (max-width: 500px) {
    font-size: 28px;
  }
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

const WarningText = styled.p`
  font-size: 12px;
  font-style: normal;
  text-align: left;
  color: #999999;
`;

const CustomStyledCard = styled(StyledCard)`
  box-shadow: 8px 16px 40px rgba(172, 172, 172, 0.24);
  border-radius: 10px;
  z-index: 1;
`;

const CustomStyledCardDark = styled(StyledCard)`
  box-shadow: 0 0 0 0;
  background: #f8f8f8;
  border-radius: 10px;
  border: 0px;
  z-index: 0;
`;

const ProfitabilityTitle = styled(BaseText)`
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  color: #000000;
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
    venues,
    amounts,
    buyData,
    callIndex,
    putIndex,
    gasPrice: recommendedGasPrice,
  } = useStraddleTrade(
    straddle ? straddle.address : "",
    ethPrice,
    purchaseAmountWei
  );
  const callPremiumStr = callPremium.toString();
  const putPremiumStr = putPremium.toString();

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

          const params = {
            callVenue: VENUE_MAP[venues[callIndex]],
            putVenue: VENUE_MAP[venues[putIndex]],
            paymentToken: constants.AddressZero,
            callStrikePrice: strikePrices[callIndex],
            putStrikePrice: strikePrices[putIndex],
            amount: amounts[0],
            callMaxCost: callPremiumStr,
            putMaxCost: putPremiumStr,
            callBuyData: buyData[callIndex],
            putBuyData: buyData[putIndex],
          };

          const receipt = await instrument.buyInstrument(params, {
            value: totalPremium,
            gasPrice,
            gasLimit: useHigherGasLimit ? 1400000 : 1200000,
          });
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
      strikePrices,
      history,
      callIndex,
      putIndex,
      callPremiumStr,
      putPremiumStr,
    ]
  );

  if (straddle === null) return null;

  const [straddleUSD, straddleETH] = computeStraddleValue(
    totalPremium,
    ethPrice
  );

  const expiryTimestamp = new Date(straddle.expiryTimestamp * 1000);

  return (
    <ParentContainer>
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

      <ProductHeader>
        <Link to="/">
          <ArrowLeftOutlined />
        </Link>
        <ProductTitleContainer>
          <Title>{product.name}</Title>
        </ProductTitleContainer>
      </ProductHeader>

      <StyledRow>
        <ContentContainer span={12}>
          <ProductDescriptionContainer>
            {productDescription(product.name)}
          </ProductDescriptionContainer>

          <ProductInfo
            straddle={straddle}
            amount={purchaseAmount}
            callVenue={callVenue}
            putVenue={putVenue}
          ></ProductInfo>
        </ContentContainer>
        <ContentContainer span={11} offset={1}>
          <CustomStyledCard title="Buy ETH Strangle">
            <DescriptionTitle>No. of contracts</DescriptionTitle>
            <AmountInput
              purchaseAmount={purchaseAmount}
              onChange={updatePurchaseAmount}
            ></AmountInput>

            <WarningText style={{ marginTop: 10 }}>
              You can buy less than 1 contract.
            </WarningText>
            {/* <WarningText style={{ marginTop: 10 }}>
              ETH Strangle purchases are disabled now due to lack of liquidity
              in underlying options.
            </WarningText> */}
            <PurchaseButton
              onClick={() => setIsModalVisible(true)}
              purchaseAmount={purchaseAmount}
            ></PurchaseButton>
          </CustomStyledCard>
          <CustomStyledCardDark>
            <ProfitabilityTitle>Profitability Calculator</ProfitabilityTitle>
            <WarningText style={{ marginTop: 5 }}>
              Enter your ETH price prediction to calculate your estimated
              profit.
            </WarningText>

            <PayoffCalculator
              ethPrice={ethPrice}
              callStrikePrice={callStrikePrice}
              putStrikePrice={putStrikePrice}
              straddlePrice={straddleUSD}
              amount={purchaseAmount}
            ></PayoffCalculator>
          </CustomStyledCardDark>
        </ContentContainer>
      </StyledRow>
    </ParentContainer>
  );
};
export default PurchaseInstrumentWrapper;
