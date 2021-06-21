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
import Volatility from "../../assets/icons/theta/Volatility";
import PrincipalProtection from "../../assets/icons/theta/PrincipalProtection";
import CapitalAccumulation from "../../assets/icons/theta/CapitalAccumulation";
import sizes from "../../designSystem/sizes";
import {
  ProductType,
  ProductTabProps,
  DynamicMarginProps,
  HeaderScrollIndicatorProps,
} from "./types";
import useScreenSize from "../../hooks/useScreenSize";
import useElementSize from "../../hooks/useElementSize";
import useElementScroll from "../../hooks/useElementScroll";
import ThetaCarousel from "./Theta/ThetaCarousel";
import MobileThetaProducts from "./Theta/MobileThetaProducts";
import { VaultOptions } from "../../constants/constants";

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
          default:
            return null;
        }
      }};
    }
  }
`;

const ProductTabButtonText = styled(SecondaryText)<ProductTabProps>`
  white-space: nowrap;
  font-family: VCR, sans-serif;
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
      default:
        return null;
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
      default:
        return null;
    }
  }}
`;

const IndicatorIcon = styled.i`
  color: white;
`;

const ProductContentContainer = styled(Row)<DynamicMarginProps>`
  position: relative;
  padding: 40px 0px 24px 0px;
  ${(props) => {
    if (props.empty <= 0) return null;
    return `
      margin-top: calc(${props.empty}px * 0.15);
    `;
  }}

  @media (max-width: ${sizes.md}px) {
    padding: 40px 0px 0px 0px;
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
    title: "Protection",
  },
  {
    name: "capitalAccumulation",
    title: "Accumulation",
  },
];

interface ProductCarouselProps {
  dynamicMargin: boolean;
  onVaultPress: (vault: VaultOptions) => void;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  dynamicMargin = true,
  onVaultPress,
}) => {
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

  const { width, height } = useScreenSize();
  const { height: headerHeight } = useElementSize(headerRef, {
    mutationObserver: false,
  });
  const { height: contentHeight } = useElementSize(contentRef, {
    mutationObserver: false,
  });
  const { scrollY } = useElementScroll(tabContainerRef);
  // Minus header and footer to determine the empty space available for offset
  const empty = dynamicMargin
    ? height -
      headerHeight -
      contentHeight -
      theme.header.height -
      theme.footer.desktop.height
    : 0;

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
        return <Volatility height="50vh" opacity="0.4" />;
      case "principalProtection":
        return <PrincipalProtection height="50vh" opacity="0.4" />;
      case "capitalAccumulation":
        return <CapitalAccumulation height="50vh" opacity="0.4" />;
      default:
        return <></>;
    }
  }, [selectedProduct]);

  const renderProduct = useCallback(() => {
    switch (selectedProduct) {
      case "yield":
        return width > sizes.md ? (
          <ThetaCarousel onVaultPress={onVaultPress} />
        ) : (
          <MobileThetaProducts onVaultPress={onVaultPress} />
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
      default:
        return <></>;
    }
  }, [selectedProduct, renderSplashFromType, width]);

  return (
    <ProductSectionContainer>
      <ProductContainerBody color={colors.products[selectedProduct]}>
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

export default ProductCarousel;
