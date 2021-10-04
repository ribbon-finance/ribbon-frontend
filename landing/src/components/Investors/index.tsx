import React from "react";
import styled from "styled-components";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { Title, BaseText } from "../../designSystem";
import { Container } from "react-bootstrap";
import DCP from "../../img/Investors/dcp.svg";
import Scalar from "../../img/Investors/scalar.svg";
import Nascent from "../../img/Investors/nascent.svg";
import Coinbase from "../../img/Investors/coinbase.svg";
import FreeCo from "../../img/Investors/freeCo.svg";
import Divergence from "../../img/Investors/divergence.svg";
import colors from "shared/lib/designSystem/colors";

const MainContainer = styled(Container)`
  padding-top: 80px;
  padding-bottom: 160px;
`;

const InvestorsTitle = styled(Title)`
  font-size: 24px;
  line-height: 32px;
`;

const InvestorCard = styled.div`
  background: ${colors.backgroundLight};
  border-radius: 8px;
  margin-bottom: 16px;
  height: 120px;
`;

const InvestorRow = styled(Row)`
  margin-top: 64px;
`;

const InvestorLogo = styled.img``;

const InvestorText = styled(BaseText)`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  text-transform: capitalize;
  color: ${colors.primaryText};
`;

const Investors = () => {
  return (
    <MainContainer fluid>
      <Row className="d-flex justify-content-center">
        <Col className="d-flex justify-content-center">
          <InvestorsTitle>Our Investors</InvestorsTitle>
        </Col>
      </Row>
      <Container>
        <InvestorRow>
          <Col xl={3} md={4} sm={12} xs={12}>
            <InvestorCard className="d-flex justify-content-center align-items-center">
              <InvestorLogo src={DCP} />
            </InvestorCard>
          </Col>
          <Col xl={3} md={4} sm={12} xs={12}>
            <InvestorCard className="d-flex justify-content-center align-items-center">
              <InvestorLogo src={Nascent} />
            </InvestorCard>
          </Col>
          <Col xl={3} md={4} sm={12} xs={12}>
            <InvestorCard className="d-flex justify-content-center align-items-center">
              <InvestorLogo src={Coinbase} />
            </InvestorCard>
          </Col>
          <Col xl={3} md={4} sm={12} xs={12}>
            <InvestorCard className="d-flex justify-content-center align-items-center">
              <InvestorLogo src={Scalar} />
            </InvestorCard>
          </Col>
          <Col xl={3} md={4} sm={12} xs={12}>
            <InvestorCard className="d-flex justify-content-center align-items-center">
              <InvestorLogo src={Divergence} />
            </InvestorCard>
          </Col>
          <Col xl={3} md={4} sm={12} xs={12}>
            <InvestorCard className="d-flex justify-content-center align-items-center">
              <InvestorLogo src={FreeCo} />
            </InvestorCard>
          </Col>
          <Col xl={3} md={4} sm={12} xs={12}>
            <InvestorCard className="d-flex justify-content-center align-items-center">
              <InvestorText>Joseph Lubin</InvestorText>
            </InvestorCard>
          </Col>
          <Col xl={3} md={4} sm={12} xs={12}>
            <InvestorCard className="d-flex justify-content-center align-items-center">
              <InvestorText>Defi Alliance</InvestorText>
            </InvestorCard>
          </Col>
          <Col xl={3} md={4} sm={12} xs={12}>
            <InvestorCard className="d-flex justify-content-center align-items-center">
              <InvestorText>Hart Lambur</InvestorText>
            </InvestorCard>
          </Col>
          <Col xl={3} md={4} sm={12} xs={12}>
            <InvestorCard className="d-flex justify-content-center align-items-center">
              <InvestorText>Tiantian Kullander</InvestorText>
            </InvestorCard>
          </Col>
          <Col xl={3} md={4} sm={12} xs={12}>
            <InvestorCard className="d-flex justify-content-center align-items-center">
              <InvestorText>Kain Warwick</InvestorText>
            </InvestorCard>
          </Col>
          <Col xl={3} md={4} sm={12} xs={12}>
            <InvestorCard className="d-flex justify-content-center align-items-center">
              <InvestorText>Tony Sheng</InvestorText>
            </InvestorCard>
          </Col>
        </InvestorRow>
      </Container>
    </MainContainer>
  );
};

export default Investors;
