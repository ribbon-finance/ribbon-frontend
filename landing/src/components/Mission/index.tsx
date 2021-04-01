import React, { useState } from "react";
import styled from "styled-components";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Title, PrimaryText, Button, BaseText } from "../../designSystem";
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

const MissionTitle = styled(Title)`
  font-size: 64px;
  line-height: 80px;
  text-transform: capitalize;
  color: #ffffff;
`;

const MissionSubtitle = styled(BaseText)`
  font-size: 16px;
  line-height: 24px;
  text-transform: capitalize;
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

  @media (max-width: ${sizes.md}px) {
    display: none;
  }
`;

const MissionTitleMobileContainer = styled(MissionTitleRow)`
  display: none;

  @media (max-width: ${sizes.md}px) {
    display: flex;
  }
`;

const MissionSubtitleRow = styled(Row)`
  margin-top: 40px;
`;

const MissionTitleMobile = styled(Title)`
  font-size: 40px;
  line-height: 48px;
  text-transform: capitalize;
  color: #ffffff;
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
          <MissionTitle>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam
          </MissionTitle>
        </Col>
      </MissionTitleRow>

      <MissionTitleMobileContainer>
        <Col>
          <MissionTitleMobile>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam
          </MissionTitleMobile>
        </Col>
      </MissionTitleMobileContainer>

      <MissionSubtitleRow>
        <Col md={6} sm={12} xs={12}>
          <MissionSubtitle>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam,
            purus sit amet luctus venenatis, lectus magna fringilla urna,
            porttitor rhoncus dolor purus non enim praesent elementum facilisis
            leo, vel fringilla est ullamcorper eget nulla facilisi etiam
            dignissim diam quis enim lobortis scelerisque fermentum dui faucibus
            in ornare.
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
