import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import styled from "styled-components";

import PortfolioPerformance from "../../components/Portfolio/PortfolioPerformance";
import PortfolioPositions from "../../components/Portfolio/PortfolioPositions";
import PortfolioTransactions from "../../components/Portfolio/PortfolioTransactions";
import { Title } from "shared/lib/designSystem";
import StakingBanner from "../../components/Banner/StakingBanner";

const PerformanceTitle = styled(Title)`
  font-size: 18px;
  margin-top: 48px;
`;

const PortfolioPage = () => {
  return (
    <>
      <StakingBanner />
      <Container>
        <Row className="justify-content-center">
          <Col sm="11" md="9" lg="7" className="d-flex flex-wrap">
            <PerformanceTitle>PORTFOLIO SUMMARY</PerformanceTitle>
            <PortfolioPerformance />
            <PortfolioPositions />
            <PortfolioTransactions />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PortfolioPage;
