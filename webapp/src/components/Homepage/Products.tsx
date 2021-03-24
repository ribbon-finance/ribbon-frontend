import React, { useState } from "react";
import { Container } from "react-bootstrap";
import styled from "styled-components";

import { BaseButton, SecondaryText, Title } from "../../designSystem";
import colors from "../../designSystem/colors";
import theme from "../../designSystem/theme";
import { ProductType, ProductTabProps, ArrowButtonProps } from "./types";

const ProductsContainer = styled(Container)`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

const SectionTitle = styled(Title)`
  margin-top: 48px;
  font-size: 24px;
`;

const ProductTabContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;

const ProductTabButton = styled(BaseButton)<ProductTabProps>`
  padding: 12px 16px;
  background-color: ${(props) => {
    if (!props.selected) {
      return colors.background;
    }

    return colors.products[props.type];
  }};
  margin: 0px 8px;

  ${(props) =>
    props.selected
      ? null
      : `border: ${theme.border.width} ${theme.border.style} ${colors.border};`}

  &:hover {
    span {
      color: white;
    }
  }
`;

const ProductTabButtonText = styled(SecondaryText)<ProductTabProps>`
  color: ${(props) => {
    if (!props.selected) {
      return `${colors.primaryText}A3`;
    }

    switch (props.type) {
      case "yield":
      case "capitalAccumulation":
        return colors.primaryText;
      case "volatility":
      case "principalProtection":
        return "black";
    }
  }};
`;

const ProductContent = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  margin-top: 40px;
  justify-content: center;
  align-items: center;
`;

const ProductContentArrowButton = styled(BaseButton)<ArrowButtonProps>`
  height: 64px;
  width: 64px;
  border-radius: 108px;
  background-color: ${colors.backgroundDarker};
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-${(props) => (props.direction === "left" ? "right" : "left")}: 64px;

  &:hover {
    i {
      opacity: ${theme.hover.opacity};
    }
  }

`;

const ProductContentArrowIcon = styled.i`
  color: white;
`;

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState<ProductType>("yield");

  const renderProductTabButton = (title: string, type: ProductType) => (
    <ProductTabButton
      selected={selectedProduct === type}
      type={type}
      role="button"
      onClick={() => {
        setSelectedProduct(type);
      }}
    >
      <ProductTabButtonText selected={selectedProduct === type} type={type}>
        {title}
      </ProductTabButtonText>
    </ProductTabButton>
  );

  return (
    <ProductsContainer>
      <SectionTitle>PRODUCTS</SectionTitle>
      <ProductTabContainer>
        {renderProductTabButton("Yield", "yield")}
        {renderProductTabButton("Volatility", "volatility")}
        {renderProductTabButton("Principal Protection", "principalProtection")}
        {renderProductTabButton("Capital Accumulation", "capitalAccumulation")}
      </ProductTabContainer>
      <ProductContent>
        <ProductContentArrowButton role="button" direction="left">
          <ProductContentArrowIcon className="fas fa-arrow-left" />
        </ProductContentArrowButton>
        <ProductContentArrowButton role="button" direction="right">
          <ProductContentArrowIcon className="fas fa-arrow-right" />
        </ProductContentArrowButton>
      </ProductContent>
    </ProductsContainer>
  );
};

export default Products;
