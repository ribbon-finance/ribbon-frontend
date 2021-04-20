import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styled from "styled-components";

import PortfolioPerformance from "../../components/Portfolio/PortfolioPerformance";
import PortfolioPositions from "../../components/Portfolio/PortfolioPositions";
import PortfolioTransactions from "../../components/Portfolio/PortfolioTransactions";
import { Title } from "../../designSystem";
import { currencies, CurrencyType } from "./types";

const PerformanceTitle = styled(Title)`
  font-size: 18px;
  margin-top: 48px;
`;

const PortfolioPage = () => {
  const [currency, setCurrency] = useState<CurrencyType>(currencies[0]);

  return (
    <Container>
      <Row className="justify-content-center">
        <Col sm="11" md="9" lg="7" className="d-flex flex-wrap">
          <PerformanceTitle>PORTFOLIO SUMMARY</PerformanceTitle>
          <PortfolioPerformance />
          <PortfolioPositions
            currency={currency}
            updateCurrency={(newCurrency: CurrencyType) =>
              setCurrency(newCurrency)
            }
          />
          <PortfolioTransactions currency={currency} />
        </Col>
      </Row>
    </Container>
  );
};

export default PortfolioPage;
