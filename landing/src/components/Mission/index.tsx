import React from "react";
import styled from "styled-components";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Container } from "react-bootstrap";

import { Title, BaseText } from "../../designSystem";
import sizes from "../../designSystem/sizes";
import theme from "../../designSystem/theme";
import colors from "shared/lib/designSystem/colors";
import { Waves } from "shared/lib/assets";

const MainContainer = styled(Container)`
  padding-top: 80px;
  padding-bottom: 80px;
`;

const StyledWaves = styled(Waves)`
  opacity: 0.64;
  margin-top: 64px;

  * {
    stroke: ${colors.green};
  }
`;

const MissionTitleRow = styled(Row)`
  margin-top: 40px;
  justify-content: center;
`;

const MissionSubtitleRow = styled(Row)`
  margin-top: 40px;
  justify-content: center;
`;

const MissionPill = styled.div`
  padding: 8px 16px;
  border-radius: ${theme.border.radius};
  background: ${colors.products.yield}29;
`;

const MissionText = styled(BaseText)`
  font-family: VCR;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${colors.products.yield};
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

const Mission = () => {
  return (
    <MainContainer>
      <div className="d-flex justify-content-center w-100">
        <MissionPill>
          <MissionText>Our Mission</MissionText>
        </MissionPill>
      </div>
      <MissionTitleRow fluid>
        <Col xs={11} lg={10} xl={6} className="d-flex">
          <MissionTitle>Bringing Structured Products to DeFi</MissionTitle>
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

      <Row>
        <Col>
          <StyledWaves />
        </Col>
      </Row>
    </MainContainer>
  );
};

export default Mission;
