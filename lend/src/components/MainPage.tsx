import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import colors from "shared/lib/designSystem/colors";
import styled from "styled-components";
import { components } from "../designSystem/components";
import { StatsMarquee } from "./StatsMarquee";
import { truncateAddress } from "shared/lib/utils/address";
import { Title } from "../designSystem";
import sizes from "../designSystem/sizes";
import Indicator from "shared/lib/components/Indicator/Indicator";
import { ProductDisclaimer } from "./ProductDisclaimer";

const HeroContainer = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  width: calc(100% - ${components.sidebar}px);

  @media (max-width: ${sizes.lg}px) {
    width: 100%;
  }

  > .row {
    margin-left: 0 !important;
    width: 100%;
  }
`;

const HeaderRow = styled(Row)`
  height: ${components.header}px;
  border-bottom: 1px solid ${colors.border};
  z-index: 1;
  margin-left: 0px;

  > * {
    padding: 0;

    &:not(:last-child) {
      border-right: 1px solid ${colors.border};
    }
  }
`;

const FooterRow = styled(Row)`
  height: ${components.footer}px;
  border-top: 1px solid ${colors.border};
  z-index: 1;

  > * {
    padding: 0;

    &:not(:last-child) {
      border-right: 1px solid ${colors.border};
    }
  }
`;

const WalletButton = styled.div`
  display: flex;
  margin: auto;
  height: 100%;
  justify-content: center;

  > * {
    margin: auto 0;

    &:not(:last-child) {
      margin-right: 8px;
    }
  }
`;

const WalletButtonText = styled(Title)<{ connected: boolean }>`
  font-size: 14px;
  line-height: 20px;

  @media (max-width: ${sizes.md}px) {
    font-size: 16px;
  }

  @media (max-width: 350px) {
    font-size: 13px;
  }

  ${(props) => {
    if (props.connected) return null;

    return `color: ${colors.green}`;
  }}
`;

const DisclaimerWrapper = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;

  > * {
    margin: auto 0;
  }
`;

enum PageEnum {
  POOLS,
  POSITIONS,
}

const MainPage: React.FC = () => {
  const [activePage, setPage] = useState<PageEnum>(PageEnum.POOLS);

  return (
    <HeroContainer>
      <Header />
      <Row>
        <Col xs={6}></Col>
        <Col xs={6}></Col>
      </Row>
      <Footer />
    </HeroContainer>
  );
};

const Header = () => {
  return (
    <HeaderRow>
      <Col xs={6}>
        <StatsMarquee />
      </Col>
      <Col xs={6}>
        <WalletButton>
          <Indicator connected={true} />
          <WalletButtonText connected={true}>
            {truncateAddress("0xaaaD4c0fa8287Ca5bCcFf0E71Bf93044De0A3f13")}
          </WalletButtonText>
        </WalletButton>
      </Col>
    </HeaderRow>
  );
};

const Footer = () => {
  return (
    <FooterRow>
      <Col xs={6}>
        <DisclaimerWrapper>
          <ProductDisclaimer />
        </DisclaimerWrapper>
      </Col>
      <Col xs={6}></Col>
    </FooterRow>
  );
};

export default MainPage;
