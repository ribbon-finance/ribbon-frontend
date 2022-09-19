import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import colors from "shared/lib/designSystem/colors";
import styled from "styled-components";
import { components } from "../designSystem/components";
import { StatsMarquee } from "../components/StatsMarquee";
import { truncateAddress } from "shared/lib/utils/address";
import { Button, Title } from "../designSystem";
import sizes from "../designSystem/sizes";
import Indicator from "shared/lib/components/Indicator/Indicator";
import { ProductDisclaimer } from "../components/ProductDisclaimer";
import { Balance } from "../components/Balance";
import { Pools } from "../components/Pools";
import useWeb3Wallet from "shared/lib/hooks/useWeb3Wallet";
import LendModal, { ModalContentEnum } from "../components/Common/LendModal";

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

export const HeaderRow = styled(Row)`
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

export const FooterRow = styled(Row)`
  height: ${components.footer}px;
  border-top: 1px solid ${colors.border};
  box-sizing: content-box;

  > * {
    padding: 0;

    &:not(:last-child) {
      border-right: 1px solid ${colors.border};
    }
  }
`;

export const WalletButton = styled.div`
  display: flex;
  margin: auto;
  height: 100%;
  justify-content: center;
  cursor: pointer;
  border-radius: 0;

  > * {
    margin: auto 0;

    &:not(:last-child) {
      margin-right: 8px;
    }
  }
`;

export const WalletButtonText = styled(Title)<{ connected: boolean }>`
  font-size: 14px;
  line-height: 20px;

  @media (max-width: ${sizes.md}px) {
    font-size: 16px;
  }

  @media (max-width: 350px) {
    font-size: 13px;
  }

  ${({ connected }) => {
    return `color: ${connected ? colors.primaryText : colors.green}`;
  }}
`;

export const DisclaimerWrapper = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;

  > * {
    margin: auto 0;
  }
`;

export const Content = styled(Row)`
  height: calc(100% - ${components.header}px - ${components.footer}px);

  @media (max-width: ${sizes.lg}px) {
    height: 100%;
  }

  > *:not(:last-child) {
    border-right: 1px solid ${colors.border};
  }
`;

enum PageEnum {
  POOLS,
  POSITIONS,
}

const LendPage: React.FC = () => {
  const [activePage, setPage] = useState<PageEnum>(PageEnum.POOLS);
  const [triggerWalletModal, setWalletModal] = useState<boolean>(false);

  return (
    <>
      <LendModal
        show={Boolean(triggerWalletModal)}
        onHide={() => setWalletModal(false)}
        content={ModalContentEnum.WALLET}
      />
      <HeroContainer>
        <Header setWalletModal={setWalletModal} />
        <Content>
          <Col xs={6}>
            <Balance />
          </Col>
          <Col xs={6}>
            <Pools />
          </Col>
        </Content>
        <Footer activePage={activePage} setPage={setPage} />
      </HeroContainer>
    </>
  );
};

interface HeaderProps {
  setWalletModal: (trigger: boolean) => void;
}

const Header = ({ setWalletModal }: HeaderProps) => {
  const { account, active } = useWeb3Wallet();

  return (
    <HeaderRow>
      <Col xs={6}>
        <StatsMarquee />
      </Col>
      <Col xs={6}>
        <WalletButton onClick={() => setWalletModal(true)}>
          {active && <Indicator connected={active} />}
          <WalletButtonText connected={active}>
            {account ? truncateAddress(account) : "Connect Wallet"}
          </WalletButtonText>
        </WalletButton>
      </Col>
    </HeaderRow>
  );
};

interface FooterProps {
  activePage: PageEnum;
  setPage: (page: PageEnum) => void;
}

export const FooterButton = styled(Button)<{ isActive?: boolean }>`
  border: none;
  border-radius: 0;
  height: ${components.footer}px;
  width: 50%;
  color: ${({ isActive }) =>
    isActive ? colors.primaryText : colors.tertiaryText};

  &:hover {
    transition: 0.2s;
    color: ${colors.primaryText};
  }

  &:not(:last-of-type) {
    border-right: 1px solid ${colors.border};
  }
`;

const Footer = ({ activePage, setPage }: FooterProps) => {
  return (
    <FooterRow>
      <Col xs={6}>
        <DisclaimerWrapper>
          <ProductDisclaimer />
        </DisclaimerWrapper>
      </Col>
      <Col xs={6}>
        <FooterButton
          isActive={activePage === PageEnum.POOLS}
          onClick={() => setPage(PageEnum.POOLS)}
        >
          Pools
        </FooterButton>
        <FooterButton
          isActive={activePage === PageEnum.POSITIONS}
          onClick={() => setPage(PageEnum.POSITIONS)}
        >
          Positions
        </FooterButton>
      </Col>
    </FooterRow>
  );
};

export default LendPage;
