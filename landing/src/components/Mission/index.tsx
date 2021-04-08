import React from "react";
import styled from "styled-components";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Title, BaseText } from "../../designSystem";
import { Container } from "react-bootstrap";
import Trail from "../../img/trail.svg";
import Plane from "../../img/ShapePlane.svg";
import sizes from "../../designSystem/sizes";

const MainContainer = styled(Container)`
  padding-bottom: 40px;
`;

const MissionText = styled(BaseText)`
  font-size: 11px;
  line-height: 16px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #ff385c;
`;

const MissionSubtitle = styled(BaseText)`
  font-size: 16px;
  line-height: 24px;
  color: rgba(255, 255, 255, 0.8);
`;

const TrailImage = styled.img`
  margin-left: 50px;

  @media (max-width: ${sizes.md}px) {
    display: none;
  }
`;

const PlaneImage = styled.img`
  margin-top: 50px;
  width: 100%;
`;

const MissionTitleRow = styled(Row)`
  margin-top: 40px;
`;

const MissionSubtitleRow = styled(Row)`
  margin-top: 40px;
`;

const MissionTitle = styled(Title)`
  font-size: 64px;
  line-height: 64px;
  text-transform: uppercase;
  color: #ffffff;

  @media (max-width: ${sizes.md}px) {
    font-size: 40px;
    line-height: 40px;
  }
`;

const Mission = () => {
  return (
    <MainContainer>
      <Row>
        <Col>
          <MissionText>Our Mission</MissionText>
          <TrailImage src={Trail} />
        </Col>
      </Row>
      <MissionTitleRow fluid>
        <Col>
          <MissionTitle>Bringing Structured Products to DeFi</MissionTitle>
        </Col>
      </MissionTitleRow>

      <MissionSubtitleRow>
        <Col md={6} sm={12} xs={12}>
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
          <PlaneImage src={Plane} />
        </Col>
      </Row>
    </MainContainer>
  );
};

export default Mission;
