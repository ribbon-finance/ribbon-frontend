import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { Frame } from "framer";

import { Subtitle, Title } from "../../designSystem";
import colors from "../../designSystem/colors";
import theme from "../../designSystem/theme";
import { currencies, CurrencyType } from "../../pages/Portfolio/types";

const PortfolioContainer = styled.div`
  margin-top: 52px;
  display: flex;
  align-items: center;
`;

const PortfolioTitle = styled(Title)`
  font-size: 18px;
  margin-right: 16px;
`;

const CurrencySwitch = styled.div`
  border-radius: ${theme.border.radius};
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  background-color: rgba(255, 255, 255, 0.04);
  display: flex;
  position: relative;
`;

const CurrencyButton = styled.div`
  padding: 8px 13px;
  z-index: 1;
`;

const ActiveCurrencyButton = styled(Frame)`
  border-radius: ${theme.border.radius} !important;
  background-color: ${colors.pillBackground} !important;
`;

interface PortfolioHeaderProps {
  currency: CurrencyType;
  updateCurrency: (current: CurrencyType) => void;
}

const PortfolioHeader: React.FC<PortfolioHeaderProps> = ({
  currency,
  updateCurrency,
}) => {
  const currencyRefs = currencies.reduce<any>((acc, curr) => {
    acc[curr] = React.createRef();
    return acc;
  }, {});
  const [currencyButtonAnimation, setCurrencyButtonAnimation] = useState<
    object | boolean
  >(false);

  useEffect(() => {
    const currentCurrency = currencyRefs[currency].current;

    if (!currentCurrency) {
      return;
    }

    setCurrencyButtonAnimation({
      left: currentCurrency.offsetLeft,
      top: currentCurrency.offsetTop,
      height: currentCurrency.clientHeight,
      width: currentCurrency.clientWidth,
    });
  }, [currency, currencyRefs]);

  const toggleCurrency = useCallback(() => {
    updateCurrency(currencies.find((c) => c !== currency) as CurrencyType);
  }, [updateCurrency, currency]);

  const renderCurrencyButton = useCallback(
    (currency: CurrencyType) => (
      <CurrencyButton ref={currencyRefs[currency]} key={currency}>
        <Subtitle>{currency.toUpperCase()}</Subtitle>
      </CurrencyButton>
    ),
    // currencyRefs are being changed from this block, having dependencies will causes max depth reach
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currency]
  );

  return (
    <PortfolioContainer>
      <PortfolioTitle>PORTFOLIO SUMMARY</PortfolioTitle>
      <CurrencySwitch role="button" onClick={toggleCurrency}>
        <ActiveCurrencyButton
          transition={{
            type: "keyframes",
            ease: "easeOut",
          }}
          height={0}
          width={0}
          animate={currencyButtonAnimation}
        />
        {currencies.map((currency) => renderCurrencyButton(currency))}
      </CurrencySwitch>
    </PortfolioContainer>
  );
};

export default PortfolioHeader;
