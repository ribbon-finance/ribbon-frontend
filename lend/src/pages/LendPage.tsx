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
import { Pools, Positions } from "../components/Pools";
import useWeb3Wallet from "shared/lib/hooks/useWeb3Wallet";
import LendModal, { ModalContentEnum } from "../components/Common/LendModal";
import { VaultList } from "../constants/constants";
import { isPracticallyZero } from "../utils/math";
import { useVaultsData } from "../hooks/web3DataContext";
import { getAssetDecimals } from "../utils/asset";
import useScreenSize from "shared/lib/hooks/useScreenSize";

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

  @media (max-width: ${sizes.md}px) {
    overflow-y: scroll;
  }
`;

export const HeaderRow = styled(Row)`
  height: ${components.header}px;
  border-bottom: 1px solid ${colors.border};
  box-sizing: border-box;
  z-index: 1;
  margin-left: 0px;
  background: black;

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
  box-sizing: border-box;
  background: black;

  > * {
    padding: 0;

    &:not(:last-child) {
      border-right: 1px solid ${colors.border};
    }
  }

  @media (max-width: ${sizes.md}px) {
    height: ${components.header + components.footer}px;
    position: sticky;
    bottom: 0;
  }
`;

export const WalletButton = styled.div`
  display: flex;
  margin: auto;
  height: 100%;
  justify-content: center;
  cursor: pointer;
  border-radius: 0;

  @media (max-width: ${sizes.md}px) {
    background: black;
  }

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

  @media (max-width: ${sizes.md}px) {
    display: none;
  }
`;

const Content = styled(Row)`
  height: calc(100% - ${components.header}px - ${components.footer}px);

  @media (max-width: ${sizes.lg}px) {
    height: 100%;
  }

  > *:not(:last-child) {
    border-right: 1px solid ${colors.border};
  }
`;

export const ScrollableContent = styled(Content)`
  overflow-y: scroll;
  overflow-x: hidden;

  ::-webkit-scrollbar {
    width: 0;
    background: transparent;
  }
`;

export const StickyCol = styled(Col)`
  display: flex;
  position: sticky;
  height: calc(100vh - ${components.header + components.footer}px);
  top: 0;

  @media (max-width: ${sizes.md}px) {
    position: relative;
    height: fit-content;
  }
`;

export const MarqueeCol = styled(Col)`
  height: ${components.header}px;
`;

export const WalletCol = styled(Col)`
  height: ${components.header}px;

  @media (max-width: ${sizes.md}px) {
    display: none;
  }
`;

export const FooterWalletCol = styled(Col)`
  height: ${components.footer}px;
  border-top: 1px solid ${colors.border};
`;

const BalanceWrapper = styled.div`
  display: flex;
  margin: auto;
  width: 100%;

  > * {
    margin: auto;
  }

  @media (max-width: ${sizes.md}px) {
    margin: 32px auto;
    height: fit-content;

    > * {
      height: fit-content;
      margin: 0 auto;
    }
  }
`;

enum PageEnum {
  POOLS,
  POSITIONS,
}

const LendPage: React.FC = () => {
  const [activePage, setPage] = useState<PageEnum>(PageEnum.POOLS);
  const [triggerWalletModal, setWalletModal] = useState<boolean>(false);
  const { width } = useScreenSize();

  return (
    <>
      <LendModal
        show={Boolean(triggerWalletModal)}
        onHide={() => setWalletModal(false)}
        content={ModalContentEnum.WALLET}
      />
      <HeroContainer>
        <Header setWalletModal={setWalletModal} />
        <ScrollableContent>
          {(width > sizes.md || activePage === PageEnum.POSITIONS) && (
            <StickyCol xs={12} md={6}>
              <BalanceWrapper>
                <Balance />
              </BalanceWrapper>
            </StickyCol>
          )}
          <Col xs={12} md={6}>
            {activePage === PageEnum.POOLS ? <Pools /> : <Positions />}
          </Col>
        </ScrollableContent>
        <Footer
          activePage={activePage}
          setPage={setPage}
          setWalletModal={setWalletModal}
        />
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
      <MarqueeCol xs={12} md={6}>
        <StatsMarquee />
      </MarqueeCol>
      <WalletCol xs={0} md={6}>
        <WalletButton onClick={() => setWalletModal(true)}>
          {active && <Indicator connected={active} />}
          <WalletButtonText connected={active}>
            {account ? truncateAddress(account) : "Connect Wallet"}
          </WalletButtonText>
        </WalletButton>
      </WalletCol>
    </HeaderRow>
  );
};

interface FooterProps {
  activePage: PageEnum;
  setPage: (page: PageEnum) => void;
  setWalletModal: (trigger: boolean) => void;
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

const Footer = ({ activePage, setPage, setWalletModal }: FooterProps) => {
  const { account, active } = useWeb3Wallet();
  const vaultDatas = useVaultsData();
  const usdcDecimals = getAssetDecimals("USDC");
  const positionsCount = VaultList.filter(
    (pool) =>
      !isPracticallyZero(
        vaultDatas.data[pool].vaultBalanceInAsset,
        usdcDecimals
      )
  ).length;
  return (
    <FooterRow>
      <Col xs={0} md={6}>
        <DisclaimerWrapper>
          <ProductDisclaimer />
        </DisclaimerWrapper>
      </Col>
      <Col xs={12} md={6}>
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
          Positions({positionsCount})
        </FooterButton>
      </Col>
      <FooterWalletCol xs={0} md={6}>
        <WalletButton onClick={() => setWalletModal(true)}>
          {active && <Indicator connected={active} />}
          <WalletButtonText connected={active}>
            {account ? truncateAddress(account) : "Connect Wallet"}
          </WalletButtonText>
        </WalletButton>
      </FooterWalletCol>
    </FooterRow>
  );
};

export default LendPage;
