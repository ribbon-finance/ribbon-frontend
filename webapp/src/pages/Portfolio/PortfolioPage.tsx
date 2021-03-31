import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

import PortfolioHeader from "../../components/Portfolio/PortfolioHeader";
import PortfolioPerformance from "../../components/Portfolio/PortfolioPerformance";
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
        </Col>
      </Row>
    </Container>
  );
};

export default PortfolioPage;
