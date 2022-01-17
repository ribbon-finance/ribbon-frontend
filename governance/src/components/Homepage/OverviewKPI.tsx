import React from "react";
import styled from "styled-components";
import currency from "currency.js";
import { Col, Row } from "react-bootstrap";

import { ExternalIcon } from "shared/lib/assets/icons/icons";
import {
  BaseUnderlineLink,
  PrimaryText,
  SecondaryText,
  Title,
} from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import useAssetPrice from "shared/lib/hooks/useAssetPrice";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";
import useTreasuryAccount from "shared/lib/hooks/useTreasuryAccount";
import useTVL from "shared/lib/hooks/useTVL";
import useScreenSize from "shared/lib/hooks/useScreenSize";
import sizes from "shared/lib/designSystem/sizes";

const Content = styled(Row)`
  z-index: 1;
`;

const KPICard = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 16px;
  background: ${colors.background.two};
  border-radius: ${theme.border.radius};

  &:not(:first-child) {
    margin-top: 16px;
  }
`;

const FloatingBackgroundContainer = styled.div`
  position: absolute;
  justify-content: space-between;
  display: flex;
  top: 20%;
  left: 10%;
  height: 60%;
  width: 80%;
  filter: blur(60px);
`;

const FloatingBackgroundBar = styled.div<{ index: number }>`
  height: 100%;
  width: 14%;
  background: ${colors.red};
  box-shadow: 2px 4px 40px ${colors.red};
  opacity: ${(props) => {
    switch (props.index) {
      case 0:
        return 0.08;
      case 1:
        return 0.16;
      case 2:
        return 0.24;
      case 3:
        return 0.4;
      case 4:
        return 0.64;

      default:
        return 1;
    }
  }};
`;

const OverviewKPI = () => {
  const { width } = useScreenSize();
  const { price: RBNPrice, loading: assetPriceLoading } = useAssetPrice({
    asset: "RBN",
  });
  const { total, loading: treasuryLoading } = useTreasuryAccount();
  const { totalTVL } = useTVL();

  const loadingText = useTextAnimation(assetPriceLoading || treasuryLoading);

  return (
    <>
      <Content className="justify-content-center">
        {/* Left text */}
        <Col
          xs={12}
          lg={5}
          className="d-flex flex-column justify-content-center"
        >
          <Title
            fontSize={width >= sizes.lg ? 56 : 48}
            lineHeight={width >= sizes.lg ? 60 : 56}
            letterSpacing={1}
            className={width < sizes.lg ? "text-center" : ""}
          >
            RIBBON GOVERNANCE
          </Title>
          <SecondaryText
            fontSize={16}
            lineHeight={24}
            className={`mt-4 ${width < sizes.lg ? "text-center" : ""}`}
          >
            The Ribbon Finance Protocol is owned and governed by RBN holders via
            fully on-chain governance
          </SecondaryText>
          <BaseUnderlineLink
            // TODO: Replace URL
            to="https://google.com"
            target="_blank"
            rel="noreferrer noopener"
            className={`d-flex mt-4 ${width < sizes.lg ? "mx-auto" : ""}`}
          >
            <PrimaryText fontSize={16} lineHeight={24} fontWeight={400}>
              Learn More
            </PrimaryText>
            <ExternalIcon className="ml-2" color={colors.primaryText} />
          </BaseUnderlineLink>
        </Col>

        {/* Right KPI */}
        <Col
          lg={{ span: 5, offset: 1 }}
          className="d-none d-lg-flex flex-column justify-content-center"
        >
          <KPICard>
            <SecondaryText fontSize={12} lineHeight={16}>
              Protocol TVL
            </SecondaryText>
            <Title
              fontSize={18}
              lineHeight={24}
              letterSpacing={1}
              className="mt-2"
            >
              {currency(totalTVL).format()}
            </Title>
          </KPICard>
          <KPICard></KPICard>
          <KPICard>
            <SecondaryText fontSize={12} lineHeight={16}>
              Ribbon Treasury
            </SecondaryText>
            <Title
              fontSize={18}
              lineHeight={24}
              letterSpacing={1}
              className="mt-2"
            >
              {treasuryLoading ? loadingText : currency(total).format()}
            </Title>
          </KPICard>
          <KPICard>
            <SecondaryText fontSize={12} lineHeight={16}>
              RBN Price
            </SecondaryText>
            <Title
              fontSize={18}
              lineHeight={24}
              letterSpacing={1}
              className="mt-2"
            >
              {assetPriceLoading ? loadingText : `$${RBNPrice.toFixed(2)}`}
            </Title>
          </KPICard>
        </Col>
      </Content>
      <FloatingBackgroundContainer>
        {[...new Array(6)].map((_item, index) => (
          <FloatingBackgroundBar key={index} index={index} />
        ))}
      </FloatingBackgroundContainer>
    </>
  );
};

export default OverviewKPI;
