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
  DynamicMarginProps,
  HeaderScrollIndicatorProps,
} from "./types";
import Volatility from "./Splash/Volatility";
import PrincipalProtection from "./Splash/PrincipalProtection";
import CapitalAccumulation from "./Splash/CapitalAccumulation";
import useScreenSize from "../../hooks/useScreenSize";
import useElementSize from "../../hooks/useElementSize";
import useElementScroll from "../../hooks/useElementScroll";
import sizes from "../../designSystem/sizes";

const ProductSectionContainer = styled(Container)`
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
  ${(props) => {
    if (props.empty <= 0) return null;
    return `
      margin-top: calc(${props.empty}px * 0.15);
    `;
  }}
  @media (max-width: ${sizes.md}px) {
    margin-top: 0px;
  }
`;

const ProductTitle = styled(Title)`
  display: none;
  font-size: 24px;
  text-align: center;
  margin-top: 16px;
  @media (max-width: ${sizes.md}px) {
    display: block;
  }
`;

const ProductTabScrollContainer = styled.div`
  position: relative;
  width: 100%;
  margin-top: 40px;
  display: flex;
  justify-content: center;
  @media (max-width: ${sizes.md}px) {
    margin-top: 24px;
  }
`;

const ProductTabContainer = styled.div`
  background-color: ${colors.backgroundDarker};
  border-radius: ${theme.border.radius};
  position: relative;
  @media (max-width: ${sizes.md}px) {
    justify-content: unset;
    flex-wrap: nowrap;
    overflow-y: scroll;
  }
`;

const ProductActiveButton = styled(Frame)`
  border-radius: ${theme.border.radius} !important;
`;

const ProductTabButtons = styled.div`
  display: flex;
  flex-direction: row;
  padding: 8px;
  width: fit-content;
`;

const ProductTabButton = styled(BaseButton)<ProductTabProps>`
  padding: 12px 16px;
  margin-right: 4px;
  z-index: 1;
  &:last-child {
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
  font-size: 14px;
  white-space: nowrap;
  font-family: VCR;
  text-transform: uppercase;
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

const HeaderScrollIndicator = styled.div<HeaderScrollIndicatorProps>`
  display: flex;
  ${(props) =>
    props.show
      ? `
          opacity: 1;
        `
      : `
          opacity: 0;
          visibility: hidden;
        `}
  position: absolute;
  height: 60px;
  width: 48px;
  justify-content: center;
  align-items: center;
  background: linear-gradient(270deg, #08090e 40.63%, rgba(8, 9, 14, 0) 100%);
  border-radius: ${theme.border.radius};
  z-index: 2;
  transition: 0.2s all ease-out;
  top: 0;
  ${(props) => {
    switch (props.direction) {
      case "left":
        return `
          left: 0;
          transform: rotate(-180deg);
        `;
      case "right":
        return `
          right: 0;
        `;
    }
  }}
`;

const IndicatorIcon = styled.i`
  color: white;
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
  @media (max-width: ${sizes.md}px) {
    margin-top: 0px;
  }
`;

const ProductContent = styled(Col)`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
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
  text-align: center;
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
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = productTabs.reduce<any>((acc, tab) => {
    acc[tab.name] = createRef();
    return acc;
  }, {});

  const [selectedProduct, setSelectedProduct] = useState<ProductType>("yield");
  const [activeButtonAnimate, setActiveButtonAnimate] = useState<
    object | boolean
  >(false);

  const { height } = useScreenSize();
  const { height: headerHeight } = useElementSize(headerRef, {
    mutationObserver: false,
  });
  const { height: contentHeight } = useElementSize(contentRef, {
    mutationObserver: false,
  });
  const { scrollY } = useElementScroll(tabContainerRef);
  // Minus header and footer to determine the empty space available for offset
  const empty = height - headerHeight - contentHeight - 81 - 52;

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
        return <Volatility height="40vh" opacity="0.4" />;
      case "principalProtection":
        return <PrincipalProtection height="40vh" opacity="0.4" />;
      case "capitalAccumulation":
        return <CapitalAccumulation height="40vh" opacity="0.4" />;
    }
  }, [selectedProduct]);

  const renderProduct = useCallback(() => {
    switch (selectedProduct) {
      case "yield":
        return <YieldCard />;
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
    <ProductSectionContainer>
      <ProductContainerBody>
        {/* Title and Product tab */}
        <HeaderContainer ref={headerRef} empty={empty}>
          <ProductTabScrollContainer>
            <ProductTabContainer ref={tabContainerRef}>
              {/** Active Button Background */}
              <ProductActiveButton
                transition={{
                  type: "keyframes",
                  ease: "easeOut",
                }}
                height={0}
                width={0}
                top={8}
                left={8}
                color={colors.products.yield}
                animate={activeButtonAnimate}
              />

              {/** Tab Button */}
              <ProductTabButtons>
                {productTabs.map((tab) =>
                  renderProductTabButton(tab.title, tab.name)
                )}
              </ProductTabButtons>
            </ProductTabContainer>

            {/** Scroll Indicator */}
            <HeaderScrollIndicator direction="left" show={scrollY.left > 0}>
              <IndicatorIcon className="fas fa-chevron-right" />
            </HeaderScrollIndicator>
            <HeaderScrollIndicator direction="right" show={scrollY.right > 0}>
              <IndicatorIcon className="fas fa-chevron-right" />
            </HeaderScrollIndicator>
          </ProductTabScrollContainer>
        </HeaderContainer>

        {/* Product Content */}
        <ProductContentContainer
          className="justify-content-center"
          ref={contentRef}
          empty={empty}
        >
          <ProductContent>{renderProduct()}</ProductContent>
        </ProductContentContainer>
      </ProductContainerBody>
    </ProductSectionContainer>
  );
};

export default Products;
