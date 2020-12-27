import React from "react";
import { StyledCard } from "../../designSystem/index";
import styled from "styled-components";
import { Row, Button } from "antd";
import { Straddle } from "../../models";
import { computeStraddleValue, computeBreakeven } from "../../utils/straddle";
import { useEthPrice } from "../../hooks/marketPrice";

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

export const StyledStraddleCard = styled(StyledCard)`
  width: 100%;
`;

export const CardDescriptionContainer = styled.div`
  padding-bottom: 20px;
`;

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
        <Row>
          <Description>
            Breakeven: <br></br>
            <DescriptionBold>
              ≤ ${lowerBreakeven} or ≥ ${upperBreakeven}
            </DescriptionBold>
          </Description>
        </Row>
      </CardDescriptionContainer>

      <Row justify="center">
        <Button
          type="primary"
          shape="round"
          href={"/instrument/" + straddle.symbol}
        >
          <DescriptionBold>See Product</DescriptionBold>
        </Button>
      </Row>
    </StyledStraddleCard>
  );
};

export default StraddleCard;
