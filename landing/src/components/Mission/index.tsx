import React from "react";
import styled from "styled-components";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Container } from "react-bootstrap";

import { Title, BaseText } from "../../designSystem";
import sizes from "../../designSystem/sizes";
import colors from "shared/lib/designSystem/colors";

const MainContainer = styled(Container)`
  padding: 80px 0;
`;

const MissionTitleRow = styled(Row)`
  margin: 0;
  margin-top: 40px;
  text-align: center;
  justify-content: center;
  width: 100%;
`;

const MissionSubtitleRow = styled(Row)`
  margin: 0;
  margin-top: 24px;
  justify-content: center;
  width: 100%;
`;

const MissionTitle = styled(Title)`
  font-size: 48px;
  line-height: 56px;
  width: 100%;
  text-transform: uppercase;
  text-align: center;

  @media (max-width: ${sizes.md}px) {
    font-size: 40px;
    line-height: 40px;
  }
`;

const MissionSubtitle = styled(BaseText)`
  display: flex;
  font-size: 16px;
  line-height: 24px;
  color: ${colors.text};
  text-align: center;
`;

const MissionFactor = styled(Row)`
  font-size: 16px;
  color: ${colors.text};
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(4px);
  border-radius: 6px;
  padding: 18px 0px;
  text-align: center;
  width: 100%;
  margin: 0;

  > div {
    padding: 0px 24px;

    @media (min-width: ${sizes.md}px) {
      &:not(:last-child) {
        border-right: 2px solid ${colors.background.three};
      }
    }
  }

  @media (max-width: ${sizes.sm}px) {
    padding: 0;

    > div {
      padding: 18px 0;
      border-bottom: 1px solid ${colors.background.three};
    }
  }
`;

const FactorTitle = styled.div`
  font-size: 12px;
  margin-bottom: 4px;
`;

const FactorAmount = styled.div`
  font-family: VCR;
  color: ${colors.primaryText};
`;

const Mission = () => {
  return (
    <MainContainer>
      <MissionTitleRow fluid>
        <Col xs={12} lg={10} xl={8}>
          <Container>
            <MissionTitle>
              Multichain Decentralised Structured Products
            </MissionTitle>
          </Container>
        </Col>
      </MissionTitleRow>

      <MissionSubtitleRow>
        <Col md={12} xl={6}>
          <Container>
            <MissionSubtitle>
              Ribbon uses financial engineering to create structured products
              that deliver sustainable yield. Ribbon's first product focuses on
              yield through automated options strategies. The protocol also
              allows developers to create arbitrary structured products through
              combining various DeFi derivatives.
            </MissionSubtitle>
          </Container>
        </Col>
      </MissionSubtitleRow>

      <MissionSubtitleRow>
        <Col xs={12} md={12} lg={6}>
          <Container>
            <MissionFactor>
              <Col xs={12} md={4}>
                <FactorTitle>Total Value Locked</FactorTitle>
                <FactorAmount>$200M</FactorAmount>
              </Col>
              <Col xs={12} md={4}>
                <FactorTitle>Notional Options Sold</FactorTitle>
                <FactorAmount>$3.2B</FactorAmount>
              </Col>
              <Col xs={12} md={4}>
                <FactorTitle>Protocol Revenue</FactorTitle>
                <FactorAmount>$100.5K</FactorAmount>
              </Col>
            </MissionFactor>
          </Container>
        </Col>
      </MissionSubtitleRow>
    </MainContainer>
  );
};

export default Mission;
