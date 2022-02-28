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

import colors from "shared/lib/designSystem/colors";
import sizes from "shared/lib/designSystem/sizes";

const MainContainer = styled(Container)`
  padding-top: 80px;
  padding-bottom: 160px;
`;

const InvestorsTitle = styled(Title)`
  font-size: 24px;
  line-height: 32px;
`;

const InvestorCard = styled.div`
  background: ${colors.background.two};
  border-radius: 8px;
  margin-bottom: 16px;
  height: 120px;
`;

const InvestorRow = styled(Row)`
  margin-top: 64px;

  @media (min-width: ${sizes.xxl}px) {
    > {
      &:not(:nth-child(4n)) {
        ${InvestorCard} {
          margin-right: 16px;
        }
      }
    }
  }

  @media (min-width: ${sizes.md}px) {
    > {
      &:not(:nth-child(3n)) {
        ${InvestorCard} {
          margin-right: 16px;
        }
      }
    }
  }
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
    src: "Robot Ventures",
    isText: true,
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
    <MainContainer fluid>
      <Row className="d-flex justify-content-center">
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
    </MainContainer>
  );
};

export default Investors;
