import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

import PortfolioHeader from "../../components/Portfolio/PortfolioHeader";
import PortfolioPerformance from "../../components/Portfolio/PortfolioPerformance";
import PortfolioPositions from "../../components/Portfolio/PortfolioPositions";
import PortfolioTransactions from "../../components/Portfolio/PortfolioTransactions";
import { currencies, CurrencyType } from "./types";

const PortfolioPage = () => {
  const [currency, setCurrency] = useState<CurrencyType>(currencies[0]);

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs="7">
          <PortfolioHeader
            currency={currency}
            updateCurrency={(newCurrency: CurrencyType) =>
              setCurrency(newCurrency)
            }
          />
          <PortfolioPerformance currency={currency} />
          <PortfolioPositions currency={currency} />
          <PortfolioTransactions />
        </Col>
      </Row>
    </Container>
  );
};

export default PortfolioPage;
