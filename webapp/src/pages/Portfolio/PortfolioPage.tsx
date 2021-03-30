import React, { useState } from "react";
import { Container } from "react-bootstrap";

import PortfolioHeader from "../../components/Portfolio/PortfolioHeader";
import { currencies, CurrencyType } from "./types";

const PortfolioPage = () => {
  const [currency, setCurrency] = useState<CurrencyType>(currencies[0]);

  return (
    <Container>
      <PortfolioHeader
        currency={currency}
        updateCurrency={(newCurrency: CurrencyType) => setCurrency(newCurrency)}
      />
    </Container>
  );
};

export default PortfolioPage;
