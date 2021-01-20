import React from "react";
import { StyledCard } from "../../designSystem/index";
import styled from "styled-components";
import { Row, Button, Tooltip } from "antd";
import { Straddle } from "../../models";
import { computeStraddleValue, computeBreakeven } from "../../utils/straddle";
import { timeToExpiry } from "../../utils/time";
import { useETHPriceInUSD } from "../../hooks/useEthPrice";
import PayoffCalculator from "./PayoffCalculator";
import { InfoCircleOutlined } from "@ant-design/icons";
import { ethers } from "ethers";
import { useStraddleTrade } from "../../hooks/useStraddleTrade";

export const Title = styled.div`
  font-weight: bold;
  font-size: 30px;
`;

export const TitleAlt = styled.div`
  font-weight: bold;
  font-size: 14px;
  color: #a7a7a7;
  line-height: 1;
`;

export const Subtitle = styled.div`
  font-size: 14px;
`;

export const Description = styled.div`
  font-size: 14px;
  padding-top: 20px;
`;

export const DescriptionBold = styled.span`
  font-weight: bold;
`;

export const TooltipContainer = styled.span`
  padding-left: 10px;
  font-weight: bold;
`;

export const StyledStraddleCard = styled(StyledCard)`
  width: 125%;
`;

export const CardDescriptionContainer = styled.div`
  padding-bottom: 20px;
`;

const breakevenTooltipText = (
  lowerBreakeven: string,
  upperBreakeven: string
) => {
  return `You make $1 per contract for every dollar that ETH is less than $${lowerBreakeven} or greater than $${upperBreakeven}. If ETH is between this range at expiry, the product expires worthless.`;
};

const StraddleCard: React.FC<{ straddle: Straddle }> = ({ straddle }) => {
  const ethPrice = useETHPriceInUSD();
  const { totalPremium, callStrikePrice, putStrikePrice } = useStraddleTrade(
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
  ).toLocaleDateString();

  const expiry = timeToExpiry(straddle.expiryTimestamp);

  return (
    <StyledStraddleCard
      bordered={false}
      bodyStyle={{ paddingTop: 20, paddingBottom: 20 }}
    >
      <Row justify="center">
        <Title>${straddleUSD}</Title>
      </Row>
      <Row justify="center">
        <TitleAlt>{straddleETH} ETH</TitleAlt>
      </Row>
      <Row justify="center">
        <Subtitle>Cost to purchase</Subtitle>
      </Row>

      <CardDescriptionContainer>
        <Row>
          <Description>
            Expiry: <br></br>
            <DescriptionBold>
              {timestamp} ({expiry} remaining)
            </DescriptionBold>
          </Description>
        </Row>

        <Description>
          Breakeven: <br></br>
          <DescriptionBold>
            ≤ ${lowerBreakeven.toFixed(2)} or ≥ ${upperBreakeven.toFixed(2)}
            <TooltipContainer>
              <Tooltip
                title={breakevenTooltipText(
                  lowerBreakeven.toFixed(2),
                  upperBreakeven.toFixed(2)
                )}
              >
                <InfoCircleOutlined />
              </Tooltip>
            </TooltipContainer>
          </DescriptionBold>
        </Description>

        <Description>
          <PayoffCalculator
            ethPrice={ethPrice}
            callStrikePrice={callStrikePrice}
            putStrikePrice={putStrikePrice}
            straddlePrice={straddleUSD}
          ></PayoffCalculator>
        </Description>
      </CardDescriptionContainer>

      <Row justify="center">
        <Button
          type="primary"
          shape="round"
          href={"/instrument/" + straddle.symbol}
        >
          <DescriptionBold>Buy Product</DescriptionBold>
        </Button>
      </Row>
    </StyledStraddleCard>
  );
};

export default StraddleCard;
