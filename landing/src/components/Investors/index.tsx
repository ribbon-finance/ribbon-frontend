import React from "react";
import styled from "styled-components";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { Title, BaseText } from "../../designSystem";
import { Container } from "react-bootstrap";
import Paradigm from "../../img/Investors/paradigm.svg";
import DCP from "../../img/Investors/dcp.svg";
import Nascent from "../../img/Investors/nascent.svg";
import Coinbase from "../../img/Investors/coinbase.svg";
import Ethereal from "../../img/Investors/ethereal.svg";
import Scalar from "../../img/Investors/scalar.svg";
import Alliance from "../../img/Investors/alliance.svg";
import Robot from "../../img/Investors/robot.svg";

import colors from "shared/lib/designSystem/colors";

const InvestorsTitle = styled(Title)`
  font-size: 24px;
  line-height: 32px;
`;

const InvestorCard = styled.div`
  background: ${colors.background.two};
  border-radius: 8px;
  border: 2px solid transparent;
  height: 120px;
  transition: 0.2s ease-in;
  margin: 0 8px 16px 8px;

  &:hover {
    transition: 0.2s;
    border: 2px solid ${colors.red};
    background-color: ${colors.red}12 !important;
    box-shadow: 2px 4px 80px ${colors.red}50 !important;
  }
`;

const InvestorRow = styled(Row)`
  margin: auto;
  margin-top: 64px;
`;

const InvestorLogo = styled.img``;

const InvestorText = styled(BaseText)`
  font-family: VCR;
  text-transform: uppercase;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  color: ${colors.primaryText};
`;

interface InvestorAsset {
  src: string;
  alt?: string;
  isText?: boolean;
}

const investorList: Array<InvestorAsset> = [
  {
    src: Paradigm,
    alt: "paradigm",
  },
  {
    src: DCP,
    alt: "dcp",
  },
  {
    src: Ethereal,
    alt: "ethereal",
  },
  {
    src: Coinbase,
    alt: "coinbase",
  },
  {
    src: Nascent,
    alt: "nascent",
  },
  {
    src: Robot,
    alt: "robot",
  },
  {
    src: Scalar,
    alt: "scalar",
  },
  {
    src: Alliance,
    alt: "alliance",
  },
];

const Investors = () => {
  return (
    <Container fluid>
      <Row className="w-100 mx-0">
        <Col className="d-flex justify-content-center">
          <InvestorsTitle>Our Investors</InvestorsTitle>
        </Col>
      </Row>
      <Container>
        <InvestorRow noGutters>
          {investorList.map((investor) => {
            return investor.isText ? (
              <Col xl={3} md={4} sm={12} xs={12}>
                <InvestorCard className="d-flex justify-content-center align-items-center">
                  <InvestorText>{investor.src}</InvestorText>
                </InvestorCard>
              </Col>
            ) : (
              <Col xl={3} md={4} sm={12} xs={12}>
                <InvestorCard className="d-flex justify-content-center align-items-center">
                  <InvestorLogo src={investor.src} alt={investor.alt} />
                </InvestorCard>
              </Col>
            );
          })}
        </InvestorRow>
      </Container>
    </Container>
  );
};

export default Investors;
