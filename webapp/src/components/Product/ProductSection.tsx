import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styled from "styled-components";

import { BaseButton, SecondaryText, Title } from "../../designSystem";
import colors from "../../designSystem/colors";
import theme from "../../designSystem/theme";
import YieldCard from "./Product/YieldCard";
import {
  ProductType,
  ProductTabProps,
  ArrowButtonProps,
  ProductSectionContainerProps,
} from "./types";
import Theta from "./Splash/Theta";
import Volatility from "./Splash/Volatility";
import PrincipalProtection from "./Splash/PrincipalProtection";
import CapitalAccumulation from "./Splash/CapitalAccumulation";
import useScreenSize from "../../hooks/useScreenSize";

const ProductSectionContainer = styled(Container)<ProductSectionContainerProps>`
  height: ${(props) =>
    props.height ? `calc(${props.height}px - 81px)` : `calc(100vh - 81px)`};
  overflow: hidden;
`;

const HeaderContainer = styled.div`
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

const ProductContentContainer = styled(Row)`
  position: relative;
`;

const ProductContent = styled(Col)`
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

const SplashImgContainer = styled.div`
  position: absolute;
  top: 24px;
  right: 0;
  width: 100%;
  overflow: hidden;
  z-index: -1;
  text-align: center;
`;

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState<ProductType>("yield");
  const { height } = useScreenSize();

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

  const renderProduct = () => {
    switch (selectedProduct) {
      case "yield":
        return (
          <>
            <ProductContentArrowButton role="button" direction="left">
              <ProductContentArrowIcon className="fas fa-arrow-left" />
            </ProductContentArrowButton>
            <YieldCard />
            <ProductContentArrowButton role="button" direction="right">
              <ProductContentArrowIcon className="fas fa-arrow-right" />
            </ProductContentArrowButton>
          </>
        );
    }

    return <></>;
  };

  const renderProductSplash = () => {
    switch (selectedProduct) {
      case "yield":
        return (
          <Theta width="100%" height="auto" viewBox="0 0 550.74982 523.74988" />
        );

      case "volatility":
        return <Volatility width="35%" height="auto" />;
      case "principalProtection":
        return <PrincipalProtection width="70%" height="auto" />;
      case "capitalAccumulation":
        return <CapitalAccumulation width="50%" height="auto" />;
    }
  };

  return (
    <ProductSectionContainer height={height}>
      {/* Title and product tab */}
      <HeaderContainer>
        <SectionTitle>PRODUCTS</SectionTitle>
        <ProductTabContainer>
          {renderProductTabButton("Yield", "yield")}
          {renderProductTabButton("Volatility", "volatility")}
          {renderProductTabButton(
            "Principal Protection",
            "principalProtection"
          )}
          {renderProductTabButton(
            "Capital Accumulation",
            "capitalAccumulation"
          )}
        </ProductTabContainer>
      </HeaderContainer>

      {/* Product Content */}
      <ProductContentContainer className="justify-content-center">
        <ProductContent lg={7}>{renderProduct()}</ProductContent>
        <SplashImgContainer>{renderProductSplash()}</SplashImgContainer>
      </ProductContentContainer>
    </ProductSectionContainer>
  );
};

export default Products;
