import React, {
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Col, Container, Row } from "react-bootstrap";
import styled from "styled-components";
import { Frame } from "framer";

import { BaseButton, SecondaryText, Title } from "../../designSystem";
import colors from "../../designSystem/colors";
import theme from "../../designSystem/theme";
import YieldCard from "./Product/YieldCard";
import {
  ProductType,
  ProductTabProps,
  ArrowButtonProps,
  ProductSectionContainerProps,
  DynamicMarginProps,
} from "./types";
import Volatility from "./Splash/Volatility";
import PrincipalProtection from "./Splash/PrincipalProtection";
import CapitalAccumulation from "./Splash/CapitalAccumulation";
import useScreenSize from "../../hooks/useScreenSize";
import useElementSize from "../../hooks/useElementSize";

const ProductSectionContainer = styled(Container)<ProductSectionContainerProps>`
  height: ${(props) =>
    props.height ? `calc(${props.height}px - 81px)` : `calc(100vh - 81px)`};
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ProductContainerBody = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const HeaderContainer = styled.div<DynamicMarginProps>`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  padding-top: 40px;
  ${(props) => {
    if (props.empty <= 0) return null;

    return `
      margin-top: calc(${props.empty}px * 0.15);
    `;
  }}
`;

const ProductTabContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 8px;
  background-color: ${colors.backgroundDarker};
  border-radius: ${theme.border.radius};
  position: relative;
`;

const ProductTabButton = styled(BaseButton)<ProductTabProps>`
  padding: 12px 16px;
  margin-right: 4px;
  z-index: 1;

  &:nth-last-child(2) {
    margin-right: 0px;
  }

  &:hover {
    span {
      color: ${(props) => {
        switch (props.type) {
          case "yield":
          case "capitalAccumulation":
            return props.selected
              ? `${colors.primaryText}A3`
              : colors.primaryText;
          case "volatility":
          case "principalProtection":
            return props.selected ? `#000000A3` : colors.primaryText;
        }
      }};
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

const ProductContentContainer = styled(Row)<DynamicMarginProps>`
  position: relative;
  padding: 40px 0px;
  ${(props) => {
    if (props.empty <= 0) return null;

    return `
      margin-top: calc(${props.empty}px * 0.15);
    `;
  }}
`;

const ProductContent = styled(Col)`
  width: 100%;
  display: flex;
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

const ComingSoonContainer = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;

const ComingSoonText = styled(Title)`
  font-size: 80px;
`;

const productTabs: Array<{ name: ProductType; title: string }> = [
  {
    name: "yield",
    title: "Yield",
  },
  {
    name: "volatility",
    title: "Volatility",
  },
  {
    name: "principalProtection",
    title: "Principal Protection",
  },
  {
    name: "capitalAccumulation",
    title: "Capital Accumulation",
  },
];

const Products = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductType>("yield");
  const { height } = useScreenSize();
  const { height: headerHeight } = useElementSize(headerRef, {
    mutationObserver: false,
  });
  const { height: contentHeight } = useElementSize(contentRef, {
    mutationObserver: false,
  });
  const tabRefs = productTabs.reduce<any>((acc, tab) => {
    acc[tab.name] = createRef();
    return acc;
  }, {});
  const [activeButtonAnimate, setActiveButtonAnimate] = useState<
    object | boolean
  >(false);
  const empty = height - headerHeight - contentHeight - 81;

  useEffect(() => {
    const currentTab = tabRefs[selectedProduct].current;

    if (!currentTab) {
      return;
    }

    setActiveButtonAnimate({
      backgroundColor: colors.products[selectedProduct],
      left: currentTab.offsetLeft,
      top: currentTab.offsetTop,
      height: currentTab.clientHeight,
      width: currentTab.clientWidth,
      radius: 8,
    });
  }, [selectedProduct, tabRefs]);

  const renderProductTabButton = useCallback(
    (title: string, type: ProductType) => (
      <ProductTabButton
        key={title}
        selected={selectedProduct === type}
        type={type}
        role="button"
        onClick={() => {
          setSelectedProduct(type);
        }}
        ref={tabRefs[type]}
      >
        <ProductTabButtonText selected={selectedProduct === type} type={type}>
          {title}
        </ProductTabButtonText>
      </ProductTabButton>
    ),
    // tabRefs should not be deps as they are being set here as well
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedProduct]
  );

  const renderSplashFromType = useCallback(() => {
    switch (selectedProduct) {
      case "volatility":
        return <Volatility width="35%" opacity="0.4" />;
      case "principalProtection":
        return <PrincipalProtection width="70%" opacity="0.4" />;
      case "capitalAccumulation":
        return <CapitalAccumulation width="50%" opacity="0.4" />;
    }
  }, [selectedProduct]);

  const renderProduct = useCallback(() => {
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
      case "volatility":
      case "principalProtection":
      case "capitalAccumulation":
        return (
          <>
            {renderSplashFromType()}
            <ComingSoonContainer>
              <ComingSoonText>COMING SOON</ComingSoonText>
            </ComingSoonContainer>
          </>
        );
    }
  }, [selectedProduct, renderSplashFromType]);

  return (
    <ProductSectionContainer
      height={Math.max(
        height,
        headerHeight && contentHeight ? headerHeight + contentHeight + 81 : 0
      )}
    >
      <ProductContainerBody>
        {/* Title and product tab */}
        <HeaderContainer ref={headerRef} empty={empty}>
          <ProductTabContainer>
            {productTabs.map((tab) =>
              renderProductTabButton(tab.title, tab.name)
            )}
            <Frame
              transition={{ type: "keyframes", ease: "easeOut" }}
              height={0}
              width={0}
              top={8}
              left={8}
              color={colors.products.yield}
              radius={8}
              animate={activeButtonAnimate}
            />
          </ProductTabContainer>
        </HeaderContainer>

        {/* Product Content */}
        <ProductContentContainer
          className="justify-content-center"
          ref={contentRef}
          empty={empty}
        >
          <ProductContent lg={7}>{renderProduct()}</ProductContent>
          {/* <SplashImgContainer>{renderProductSplash()}</SplashImgContainer> */}
        </ProductContentContainer>
      </ProductContainerBody>
    </ProductSectionContainer>
  );
};

export default Products;
