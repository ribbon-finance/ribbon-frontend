import React from "react";
import { StyledCard } from "../../designSystem/index";
import styled from "styled-components";
import { Row, Button } from "antd";
import { Straddle } from "../../models";
import { computeStraddleValue } from "../../utils/straddle";
import { useETHPriceInUSD } from "../../hooks/useEthPrice";
import PayoffCalculator from "./PayoffCalculator";
import CardIcon from "./CardIcon";
import { ethers } from "ethers";
import { useStraddleTrade } from "../../hooks/useStraddleTrade";
import { Link } from "react-router-dom";

const Title = styled.div`
  font-family: Montserrat;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0px;
  text-align: left;
  padding-left: 10px;

  @media (max-width: 1100px) {
    font-size: 16px;
  }
  @media (max-width: 990px) {
    font-size: 13px;
  }
  @media (max-width: 880px) {
    font-size: 11px;
  }
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

const ButtonText = styled.span`
  font-family: Montserrat;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0px;
  text-align: center;
`;

const CardDescriptionContainer = styled.div`
  padding-top: 20px;
  padding-bottom: 20px;
`;

const StyledButton = styled(Button)`
  background-color: black;
  width: 100%;
  border-radius: 8px;
`;

const StraddleCard: React.FC<{ straddle: Straddle }> = ({ straddle }) => {
  const ethPrice = useETHPriceInUSD();
  const { totalPremium, callStrikePrice, putStrikePrice } = useStraddleTrade(
    straddle.address,
    ethPrice,
    ethers.utils.parseEther("0.1")
  );
  const [straddleUSD] = computeStraddleValue(totalPremium, ethPrice);

  const timestamp = new Date(
    straddle.expiryTimestamp * 1000
  ).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <StyledCard
      bordered={false}
      bodyStyle={{ paddingTop: 20, paddingBottom: 20 }}
    >
      <Row justify="start" align="middle">
        <CardIcon />
        <Title>{timestamp}</Title>
      </Row>

      <CardDescriptionContainer>
        <DescriptionTitle>EXPECTED FUTURE ETH PRICE</DescriptionTitle>
        <PayoffCalculator
          ethPrice={ethPrice}
          callStrikePrice={callStrikePrice}
          putStrikePrice={putStrikePrice}
          straddlePrice={straddleUSD}
        />
      </CardDescriptionContainer>

      <Row justify="center">
        <Link style={{ width: "100%" }} to={"/instrument/" + straddle.symbol}>
          <StyledButton size="large" type="primary">
            <ButtonText>Buy</ButtonText>
          </StyledButton>
        </Link>
      </Row>
    </StyledCard>
  );
};

export default StraddleCard;
