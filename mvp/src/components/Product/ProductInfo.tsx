import React from "react";
import styled from "styled-components";
import { Divider } from "antd";
import { BaseText, StyledCard } from "../../designSystem";
import { computeStraddleValue } from "../../utils/straddle";
import { useETHPriceInUSD } from "../../hooks/useEthPrice";
import { BasicStraddle } from "../../models";
import { useStraddleTrade } from "../../hooks/useStraddleTrade";
import { ethers } from "ethers";
import PayoffCalculator from "./PayoffCalculator";
import currencyIcons from "../../img/currencyIcons";

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

const DescriptionData = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0px;
  text-align: left;
`;

const DescriptionContainer = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
`;

const Title = styled(BaseText)`
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  color: #000000;
`;

const CustomStyledCard = styled(StyledCard)`
  box-shadow: 0 0 0 0;
  background: #fafafa;
  border-radius: 4px;
  border: 0px;
`;

const ETHIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 8px;
`;

const PriceContainer = styled.div`
  display: flex;
`;

type Props = {
  straddle: BasicStraddle;
  amount: number;
};

const ProductInfo: React.FC<Props> = ({ straddle, amount }) => {
  const ethPrice = useETHPriceInUSD();
  const {
    loading: loadingTrade,
    error: loadTradeError,
    totalPremium,
    callStrikePrice,
    putStrikePrice,
  } = useStraddleTrade(
    straddle.address,
    ethPrice,
    ethers.utils.parseEther(amount.toString())
  );

  const [straddleUSD, straddleETH] = computeStraddleValue(
    totalPremium,
    ethPrice
  );

  const timestamp = new Date(
    straddle.expiryTimestamp * 1000
  ).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let costStr;
  if (loadingTrade && amount > 0) {
    costStr = "Computing cost... Reload the page if this takes too long.";
  } else if (loadingTrade) {
    costStr = "$0.00 (0.00 ETH)";
  } else if (loadTradeError) {
    costStr = "Error loading cost. Try again.";
  } else {
    costStr = `$${straddleUSD} (${straddleETH} ETH)`;
  }

  return (
    <>
      <DescriptionContainer>
        <DescriptionTitle>Expiry</DescriptionTitle>
        <DescriptionData>{timestamp}</DescriptionData>
      </DescriptionContainer>

      <DescriptionContainer>
        <DescriptionTitle>Total Cost</DescriptionTitle>
        <DescriptionData>{costStr}</DescriptionData>
      </DescriptionContainer>

      <CustomStyledCard>
        <Title>Profitability Calculator</Title>
        <Divider />

        <DescriptionTitle>Current ETH Price</DescriptionTitle>
        <PriceContainer>
          <ETHIcon src={currencyIcons.ETH} alt="ETH" />
          <DescriptionData>${ethPrice}</DescriptionData>
        </PriceContainer>

        <PayoffCalculator
          ethPrice={ethPrice}
          callStrikePrice={callStrikePrice}
          putStrikePrice={putStrikePrice}
          straddlePrice={straddleUSD}
          amount={amount}
        ></PayoffCalculator>
      </CustomStyledCard>
    </>
  );
};

export default ProductInfo;
