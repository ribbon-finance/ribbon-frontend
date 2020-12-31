import React from "react";
import { StyledCard } from "../../designSystem/index";
import styled from "styled-components";
import { Row, Button, Tooltip } from "antd";
import { Straddle } from "../../models";
import { computeStraddleValue, computeBreakeven } from "../../utils/straddle";
import { useEthPrice } from "../../hooks/marketPrice";
import PayoffCalculator from "./PayoffCalculator";
import { InfoCircleOutlined } from "@ant-design/icons";

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
  const ethPrice = useEthPrice();
  const [straddleUSD, straddleETH] = computeStraddleValue(
    straddle.callPremium,
    straddle.putPremium,
    ethPrice
  );
  const [lowerBreakeven, upperBreakeven] = computeBreakeven(
    straddleUSD,
    ethPrice
  );

  const timestamp = new Date(
    straddle.expiryTimestamp * 1000
  ).toLocaleDateString();

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
            <DescriptionBold>{timestamp}</DescriptionBold>
          </Description>
        </Row>

        <Description>
          Breakeven: <br></br>
          <DescriptionBold>
            ≤ ${lowerBreakeven} or ≥ ${upperBreakeven}
            <TooltipContainer>
              <Tooltip
                title={breakevenTooltipText(lowerBreakeven, upperBreakeven)}
              >
                <InfoCircleOutlined />
              </Tooltip>
            </TooltipContainer>
          </DescriptionBold>
        </Description>

        <Description>
          <PayoffCalculator
            ethPrice={ethPrice}
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
