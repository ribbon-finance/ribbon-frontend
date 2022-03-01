import React from "react";
import styled from "styled-components";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Container } from "react-bootstrap";

import { Title, BaseText } from "../../designSystem";
import sizes from "../../designSystem/sizes";
import colors from "shared/lib/designSystem/colors";

const MainContainer = styled(Container)`
  padding-top: 80px;
  padding-bottom: 80px;
`;

const MissionTitleRow = styled(Row)`
  margin-top: 40px;
  justify-content: center;
`;

const MissionSubtitleRow = styled(Row)`
  margin-top: 24px;
  justify-content: center;
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

  > div {
    padding: 0px 24px;

    &:not(:last-child) {
      border-right: 2px solid ${colors.background.three};
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
        <Col xs={12} lg={10} xl={8} className="d-flex">
          <MissionTitle>
            Multichain Decentralised Structured Products
          </MissionTitle>
        </Col>
      </MissionTitleRow>

      <MissionSubtitleRow>
        <Col xs={12} md={8} xl={6} className="d-flex">
          <MissionSubtitle>
            Ribbon uses financial engineering to create structured products that
            deliver sustainable yield. Ribbon's first product focuses on yield
            through automated options strategies. The protocol also allows
            developers to create arbitrary structured products through combining
            various DeFi derivatives.
          </MissionSubtitle>
        </Col>
      </MissionSubtitleRow>

      <MissionSubtitleRow>
        <Col xs={12} md={6}>
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
        </Col>
      </MissionSubtitleRow>
    </MainContainer>
  );
};

export default Mission;
