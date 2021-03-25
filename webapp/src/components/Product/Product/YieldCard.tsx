import React from "react";
import styled from "styled-components";

import {
  BaseButton,
  Title,
  Subtitle,
  SecondaryText,
} from "../../../designSystem";
import colors from "../../../designSystem/colors";
import theme from "../../../designSystem/theme";
import DepositCapBar from "../../../pages/DepositPage/DepositCapBar";
import noiseImg from "../../../assets/img/noise.png";

const ProductCard = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  background-color: ${colors.background};
  background-image: url(${noiseImg});
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: ${theme.border.radius};
  padding: 16px 24px 24px 16px;
  box-shadow: 4px 8px 80px rgba(255, 56, 92, 0.16);
`;

const ProductTagContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
`;

const ProductTag = styled(BaseButton)`
  background: ${colors.tagBackground}CC;
  padding: 8px;
  margin-right: 4px;
  margin-bottom: 8px;
`;

const ProductTitle = styled(Title)`
  color: ${colors.products.yield};
  font-size: 36px;
  margin-bottom: 8px;
`;

const ProductDescription = styled(SecondaryText)`
  line-height: 1.5;
  margin-bottom: 24px;
`;

const ExpectedYieldTitle = styled(Subtitle)`
  color: ${colors.primaryText}A3;
  width: 100%;
`;

const YieldText = styled(Title)`
  font-size: 32px;
  width: 100%;
  margin-bottom: 24px;
`;

const YieldCard = () => {
  const renderTag = (name: string) => (
    <ProductTag>
      <Subtitle>{name}</Subtitle>
    </ProductTag>
  );

  return (
    <ProductCard>
      <ProductTagContainer>
        {renderTag("THETA VAULT")}
        {renderTag("ETH")}
      </ProductTagContainer>
      <ProductTitle>T-100-E</ProductTitle>
      <ProductDescription>
        Theta Vault is a yield-generating strategy on ETH. The vault runs an
        automated covered call strategy.
      </ProductDescription>
      <ExpectedYieldTitle>EXPECTED YIELD (APY)</ExpectedYieldTitle>
      <YieldText>30%</YieldText>
      <DepositCapBar totalDeposit={215} limit={500} />
    </ProductCard>
  );
};

export default YieldCard;
