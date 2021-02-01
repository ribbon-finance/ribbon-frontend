import React from "react";
import { StyledCard } from "../../designSystem/index";
import styled from "styled-components";
import { Row, Button, Skeleton } from "antd";
import { Straddle } from "../../models";
import { computeStraddleValue, computeBreakeven } from "../../utils/straddle";
import { timeToExpiry } from "../../utils/time";
import { useETHPriceInUSD } from "../../hooks/useEthPrice";
import PayoffCalculator from "./PayoffCalculator";
import CardIcon from "./CardIcon";
import { InfoCircleOutlined } from "@ant-design/icons";
import { ethers } from "ethers";
import { useStraddleTrade } from "../../hooks/useStraddleTrade";

const Title = styled.div`
  font-family: Montserrat;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0px;
  text-align: left;
  padding-left: 10px;
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

const Description = styled.p`
  font-family: Montserrat;
  font-size: 10px;
  font-style: normal;
  font-weight: 500;
  line-height: 12px;
  letter-spacing: 1.5px;
  text-align: left;
  color: #999999;
`;

const DescriptionBold = styled.span`
  font-weight: bold;
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

const TooltipContainer = styled.span`
  padding-left: 10px;
  font-weight: bold;
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

const breakevenTooltipText = (
  lowerBreakeven: string,
  upperBreakeven: string
) => {
  return `You make $1 per contract for every dollar that ETH is less than $${lowerBreakeven} or greater than $${upperBreakeven}. If ETH is between this range at expiry, the product expires worthless.`;
};

const StraddleCard: React.FC<{ straddle: Straddle }> = ({ straddle }) => {
  const ethPrice = useETHPriceInUSD();
  const {
    loading: loadingTrade,
    totalPremium,
    callStrikePrice,
    putStrikePrice,
  } = useStraddleTrade(
    straddle.address,
    ethPrice,
    ethers.utils.parseEther("1")
  );
  const [straddleUSD, straddleETH] = computeStraddleValue(
    totalPremium,
    ethPrice
  );
  const [lowerBreakeven, upperBreakeven] = computeBreakeven(
    straddleUSD,
    callStrikePrice,
    putStrikePrice
  );

  const timestamp = new Date(
    straddle.expiryTimestamp * 1000
  ).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const expiry = timeToExpiry(straddle.expiryTimestamp);

  if (loadingTrade) {
    return <Skeleton></Skeleton>;
  }

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
        <DescriptionTitle>Eth Price</DescriptionTitle>
        <PayoffCalculator
          ethPrice={ethPrice}
          callStrikePrice={callStrikePrice}
          putStrikePrice={putStrikePrice}
          straddlePrice={straddleUSD}
        />
      </CardDescriptionContainer>

      <Row justify="center">
        <StyledButton
          size="large"
          type="primary"
          href={"/instrument/" + straddle.symbol}
        >
          <ButtonText>Buy</ButtonText>
        </StyledButton>
      </Row>
    </StyledCard>
  );
};

export default StraddleCard;
