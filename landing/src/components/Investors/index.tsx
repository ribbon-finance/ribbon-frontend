import React, { useState } from "react";
import styled from "styled-components";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Title, PrimaryText, Button, BaseText } from "../../designSystem";
import { Container } from "react-bootstrap";
import DCP from "../../img/Investors/dcp.png";
import Scalar from "../../img/Investors/scalar.png";
import Nascent from "../../img/Investors/nascent.png";
import Coinbase from "../../img/Investors/coinbase.png";
import Consensys from "../../img/Investors/consensys.png";
import FreeCo from "../../img/Investors/freeCo.png";
import Divergence from "../../img/Investors/divergence.png";

const MainContainer = styled(Container)`
  padding-top: 80px;
  padding-bottom: 80px;
`;

const InvestorsTitle = styled(Title)`
  font-size: 24px;
  line-height: 32px;
`;

const InvestorCard = styled.div`
  background: #201e1e;
  border-radius: 8px;
  margin-bottom: 16px;
  height: 136px;
`;

const InvestorRow = styled(Row)`
  margin-top: 64px;
`;

const InvestorLogo = styled.img`
  width: 50%;
`;

const InvestorText = styled(BaseText)`
  font-weight: 600;
  font-size: 22px;
  line-height: 29px;
  text-align: center;
  text-transform: capitalize;
  color: #ffffff;
`;

const Investors = () => {
  return (
    <MainContainer fluid>
      <Row className="d-flex justify-content-center">
        <InvestorsTitle>Our Investors</InvestorsTitle>
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
              <InvestorLogo src={Consensys} />
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
              <InvestorText>Defi Alliance</InvestorText>
            </InvestorCard>
          </Col>
          <Col xl={3} md={4} sm={12} xs={12}>
            <InvestorCard className="d-flex justify-content-center align-items-center">
              <InvestorText>Joshua Lim</InvestorText>
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
              <InvestorText>Tony Sheng</InvestorText>
            </InvestorCard>
          </Col>
        </InvestorRow>
      </Container>
    </MainContainer>
  );
};

export default Investors;
