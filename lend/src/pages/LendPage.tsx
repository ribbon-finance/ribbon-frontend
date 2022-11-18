import React, { useMemo, useState } from "react";
import { Col, Row } from "react-bootstrap";
import colors from "shared/lib/designSystem/colors";
import styled from "styled-components";
import { components } from "../designSystem/components";
import { truncateAddress } from "shared/lib/utils/address";
import { Button, Title } from "../designSystem";
import sizes from "../designSystem/sizes";
import Indicator from "shared/lib/components/Indicator/Indicator";
import { ProductDisclaimer } from "../components/ProductDisclaimer";
import { Balance } from "../components/Balance";
import { Pools, Positions } from "../components/Pools";
import useWeb3Wallet from "shared/lib/hooks/useWeb3Wallet";
import LendModal, { ModalContentEnum } from "../components/Common/LendModal";
import { PoolList } from "shared/lib/constants/lendConstants";
import { isPracticallyZero } from "shared/lib/utils/math";
import { usePoolsData } from "../hooks/web3DataContext";
import { getAssetDecimals } from "../utils/asset";
import useScreenSize from "shared/lib/hooks/useScreenSize";
import { delayedFade } from "../components/animations";
import MobileHeader from "../components/MobileHeader";
import StepsHeader from "../components/StepsHeader";

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

export const HeaderRow = styled(Row)<{ mobile?: boolean }>`
  height: ${components.header}px;
  border-bottom: 1px solid ${colors.border};
  box-sizing: border-box;
  z-index: 1;
  margin-left: 0px;
  background: black;
  ${(props) => props.mobile === true && `display: none;`}
  > * {
    padding: 0;

    &:not(:last-child) {
      border-right: 1px solid ${colors.border};
    }
  }

  @media (max-width: ${sizes.lg}px) {
    ${(props) => props.mobile === true && `display: flex;`}
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

  @media (max-width: ${sizes.lg}px) {
    height: ${components.header + components.footer}px;
    position: sticky;
    bottom: 0;
  }
`;

export const WalletButton = styled.div<{ delay: number }>`
  display: flex;
  margin: auto;
  height: 100%;
  justify-content: center;
  cursor: pointer;
  border-radius: 0;

  ${delayedFade}

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

export const DisclaimerWrapper = styled.div<{ delay: number }>`
  display: flex;
  justify-content: center;
  height: 100%;

  ${delayedFade}

  > * {
    margin: auto 0;
  }

  @media (max-width: ${sizes.lg}px) {
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
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 0;
    background: transparent;
  }
  @media (max-width: ${sizes.md}px) {
    position: relative;
    height: fit-content;
  }
`;

export const MobileHeaderCol = styled(Col)`
  width: 100%;
  height: ${components.header}px;
`;

export const MarqueeCol = styled(Col)`
  height: ${components.header}px;
`;

export const WalletCol = styled(Col)`
  height: ${components.header}px;

  @media (max-width: ${sizes.lg}px) {
    display: none;
  }
`;

export const FooterWalletCol = styled(Col)`
  height: ${components.footer}px;
  border-top: 1px solid ${colors.border};
`;

export const MobileOnly = styled.div`
  display: none;
  @media (max-width: ${sizes.lg}px) {
    display: flex;
    width: 100%;
  }
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
  const { loading, data: poolDatas } = usePoolsData();
  const { account } = useWeb3Wallet();

  const isManager = useMemo(() => {
    if (account && !loading) {
      let managers: string[] = [];
      PoolList.forEach((pool) => {
        managers.push(poolDatas[pool].manager);
      });
      return managers.includes(account);
    }
    return false;
  }, [account, loading, poolDatas]);

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
          isManager={isManager}
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
    <>
      <MobileHeader />
      <HeaderRow>
        <MarqueeCol md={12} lg={6}>
          {/* <StatsMarquee /> */}
          <StepsHeader button={false} />
        </MarqueeCol>
        <WalletCol md={0} lg={6}>
          <WalletButton delay={0.2} onClick={() => setWalletModal(true)}>
            {active && <Indicator connected={active} />}
            <WalletButtonText connected={active}>
              {account ? truncateAddress(account) : "Connect Wallet"}
            </WalletButtonText>
          </WalletButton>
        </WalletCol>
      </HeaderRow>
    </>
  );
};

interface FooterProps {
  activePage: PageEnum;
  setPage: (page: PageEnum) => void;
  setWalletModal: (trigger: boolean) => void;
  isManager: boolean;
}

export const FooterButton = styled(Button)<{
  isActive?: boolean;
  delay: number;
  disabled?: boolean;
  tooltip?: boolean;
  width?: string;
}>`
  font-size: 14px;
  border: none;
  border-radius: 0;
  height: ${components.footer}px;
  width: ${({ width }) => (width ? width : "50%")};
  color: ${({ isActive }) =>
    isActive ? colors.primaryText : colors.tertiaryText};

  &:hover {
    transition: 0.2s;
    color: ${colors.primaryText};
  }
  &:disabled {
    color: ${colors.tertiaryText};
    pointer-events: ${(props) => (props.tooltip ? "auto" : "none")};
  }
  &:not(:last-of-type) {
    border-right: 1px solid ${colors.border};
  }
  ${delayedFade}
`;

const Footer = ({
  activePage,
  setPage,
  setWalletModal,
  isManager,
}: FooterProps) => {
  const { account, active } = useWeb3Wallet();
  const poolDatas = usePoolsData();
  const usdcDecimals = getAssetDecimals("USDC");
  const positionsCount = PoolList.filter(
    (pool) =>
      !isPracticallyZero(poolDatas.data[pool].poolBalanceInAsset, usdcDecimals)
  ).length;
  return (
    <FooterRow>
      <Col md={0} lg={6}>
        <DisclaimerWrapper delay={0.1}>
          <ProductDisclaimer />
        </DisclaimerWrapper>
      </Col>
      {!isManager ? (
        <Col md={12} lg={6}>
          <FooterButton
            disabled={false}
            isActive={activePage === PageEnum.POOLS}
            onClick={() => setPage(PageEnum.POOLS)}
            delay={0.2}
          >
            Pools
          </FooterButton>
          <FooterButton
            disabled={false}
            delay={0.3}
            isActive={activePage === PageEnum.POSITIONS}
            onClick={() => setPage(PageEnum.POSITIONS)}
          >
            Positions{account && `(${positionsCount})`}
          </FooterButton>
        </Col>
      ) : (
        <Col md={12} lg={6}>
          <FooterButton
            disabled={false}
            isActive={activePage === PageEnum.POOLS}
            onClick={() => setPage(PageEnum.POOLS)}
            delay={0.2}
            width={"100%"}
          >
            Pools
          </FooterButton>
        </Col>
      )}
      <FooterWalletCol md={0} lg={6}>
        <WalletButton delay={0.4} onClick={() => setWalletModal(true)}>
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
