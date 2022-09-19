import { useMemo, useState } from "react";
import { Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { VaultOptions } from "../constants/constants";
import { Title } from "../designSystem";
import NotFound from "./NotFound";
import globe from "../assets/icons/globe.svg";
import Marquee from "react-fast-marquee/dist";
import styled from "styled-components";
import { components } from "../designSystem/components";
import sizes from "../designSystem/sizes";
import {
  Content,
  DisclaimerWrapper,
  FooterButton,
  FooterRow,
  HeaderRow,
  WalletButton,
  WalletButtonText,
} from "./LendPage";
import { ProductDisclaimer } from "../components/ProductDisclaimer";
import Indicator from "shared/lib/components/Indicator/Indicator";
import { truncateAddress } from "shared/lib/utils/address";
import useWeb3Wallet from "../hooks/useWeb3Wallet";
import LendModal, { ModalContentEnum } from "../components/Common/LendModal";

const poolMap: Record<string, VaultOptions> = {
  alameda: "Alameda",
  jumptrading: "JumpTrading",
  wintermute: "Wintermute",
  orthogonal: "Orthogonal",
  folkvang: "Folkvang",
};

const PoolContainer = styled.div`
  width: calc(100% - ${components.sidebar}px);

  @media (max-width: ${sizes.lg}px) {
    width: 100%;
  }

  > .row {
    margin-left: 0 !important;
    width: 100%;
  }
`;

enum PageEnum {
  DEPOSIT,
  WITHDRAW,
}

const PoolPage = () => {
  const { poolId }: { poolId: VaultOptions } = useParams();
  const [activePage, setPage] = useState<PageEnum>();
  const [triggerWalletModal, setWalletModal] = useState<boolean>(false);

  const pool = useMemo(() => {
    return poolMap[poolId];
  }, [poolId]);

  if (!pool) return <NotFound />;

  return (
    <>
      <LendModal
        show={triggerWalletModal}
        onHide={() => setWalletModal(false)}
        content={ModalContentEnum.WALLET}
      />
      <PoolContainer>
        <Header setWalletModal={setWalletModal} pool={pool} />
        <Content>
          <Col xs={6}>
            <p>hi</p>
          </Col>
        </Content>
        <Footer activePage={activePage} setPage={setPage} />
      </PoolContainer>
    </>
  );
};

interface HeaderProps {
  pool: VaultOptions;
  setWalletModal: (trigger: boolean) => void;
}

const Header = ({ pool, setWalletModal }: HeaderProps) => {
  const { account, active } = useWeb3Wallet();

  return (
    <HeaderRow>
      <Col xs={6}>
        <PoolMarquee pool={pool} />
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
  activePage?: PageEnum;
  setPage: (page: PageEnum) => void;
}

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
          isActive={activePage === PageEnum.DEPOSIT}
          onClick={() => setPage(PageEnum.DEPOSIT)}
        >
          Deposit
        </FooterButton>
        <FooterButton
          isActive={activePage === PageEnum.WITHDRAW}
          onClick={() => setPage(PageEnum.WITHDRAW)}
        >
          Withdraw
        </FooterButton>
      </Col>
    </FooterRow>
  );
};

const MarqueeItem = styled.div`
  display: flex;
  justify-content: space-between;

  span {
    font-size: 14px;
  }

  > * {
    margin: auto;
  }

  img {
    margin: auto 40px;
  }
`;

const PoolMarquee = ({ pool }: any) => {
  return (
    <Marquee gradient={false} speed={100} delay={0} pauseOnHover>
      {new Array(6).fill("").map((i) => (
        <MarqueeItem key={i}>
          <Title>{pool}</Title>
          <img src={globe} alt="globe" />
        </MarqueeItem>
      ))}
    </Marquee>
  );
};
export default PoolPage;
