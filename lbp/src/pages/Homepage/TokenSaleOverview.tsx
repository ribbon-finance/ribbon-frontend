import React from "react";
import styled from "styled-components";

import RibbonFinanceInfo from "../../components/Shared/RibbonFinanceInfo";
import PoolTransaction from "../../components/TokenSale/PoolTransaction";
import TokenSaleInfo from "../../components/TokenSale/TokenSaleInfo";

const Section = styled.div`
  &:not(:first-child) {
    margin-top: 64px;
  }
`;

const TokenSaleOverview = () => {
  return (
    <>
      <Section>
        <TokenSaleInfo />
      </Section>
      <Section>
        <RibbonFinanceInfo />
      </Section>
      <Section>
        <PoolTransaction />
      </Section>
    </>
  );
};

export default TokenSaleOverview;
