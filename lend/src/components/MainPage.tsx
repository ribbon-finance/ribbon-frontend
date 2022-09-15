import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import colors from "shared/lib/designSystem/colors";
import styled from "styled-components";
import { components } from "../designSystem/components";
import { StatsMarquee } from "./StatsMarquee";
import { truncateAddress } from "shared/lib/utils/address";
import { Button, Subtitle, Title } from "../designSystem";
import sizes from "../designSystem/sizes";
import Indicator from "shared/lib/components/Indicator/Indicator";
import { ProductDisclaimer } from "./ProductDisclaimer";
import { Assets } from "shared/lib/store/types";
import alameda from "../assets/icons/makers/alameda.svg";
import jump from "../assets/icons/makers/jump.svg";
import wintermute from "../assets/icons/makers/wintermute.svg";
import orthogonal from "../assets/icons/makers/orthogonal.svg";
import folkvang from "../assets/icons/makers/folkvang.svg";
import { getAssetLogo } from "shared/lib/utils/asset";

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
  box-sizing: content-box;

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

const ListRow = styled(Row)`
  display: block;
  height: calc(100% - ${components.header}px - ${components.footer}px);

  @media (max-width: ${sizes.lg}px) {
    height: 100%;
  }

  padding: 0;
`;

const PoolWrapper = styled.div`
  height: 120px;
  width: 100%;
  border-bottom: 1px solid ${colors.border};
  display: flex;
`;

const PoolLogo = styled.div`
  width: 120px;
  height: 120px;
  border-right: 1px solid ${colors.border};
  display: inline-flex;

  img {
    margin: auto;
  }
`;

const Stat = styled.div`
  margin: auto 0;
  height: fit-content;

  > * {
    display: flex;
  }
`;

const PoolStats = styled.div`
  height: 120px;
  border-right: 1px solid ${colors.border};
  display: flex;
  justify-content: space-between;
  width: calc(100% - 120px);
  padding: 16px 32px;

  > ${Stat}:last-of-type {
    > * {
      display: flex;
      justify-content: flex-end;
    }
  }
`;

const StyledTitle = styled(Title)`
  font-size: 14px;
  line-height: 36px;
  // width: fit-content;

  svg {
    width: fit-content;
    height: fit-content;
    margin: auto;
    margin-right: 8px;
  }
`;

const StyledSubtitle = styled(Subtitle)<{ color: string }>`
  font-size: 12px;
  line-height: 16px;
  text-transform: uppercase;
  color: ${({ color }) => color ?? colors.tertiaryText};
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
      <Pools />
      <Footer activePage={activePage} setPage={setPage} />
    </HeroContainer>
  );
};

interface Pool {
  logo: string;
  name: string;
  asset: Assets;
  apr: number;
  deposits: number;
  capacity: number;
}

const Pools = () => {
  const poolList: Pool[] = [
    {
      logo: alameda,
      name: "Alameda Research",
      asset: "USDC",
      apr: 12.43,
      deposits: 100,
      capacity: 1000,
    },
    {
      logo: jump,
      name: "Jump Trading",
      asset: "USDC",
      apr: 12.43,
      deposits: 100,
      capacity: 1000,
    },
    {
      logo: wintermute,
      name: "Wintermute",
      asset: "USDC",
      apr: 12.43,
      deposits: 100,
      capacity: 1000,
    },
    {
      logo: orthogonal,
      name: "Orthogonal",
      asset: "USDC",
      apr: 12.43,
      deposits: 100,
      capacity: 1000,
    },
    {
      logo: folkvang,
      name: "Folkvang",
      asset: "USDC",
      apr: 12.43,
      deposits: 100,
      capacity: 1000,
    },
  ];

  return (
    <ListRow>
      {poolList.map((pool, i) => {
        const Logo = getAssetLogo(pool.asset);
        return (
          <PoolWrapper key={i}>
            <PoolLogo>
              <img src={pool.logo} alt={pool.name} />
            </PoolLogo>
            <PoolStats>
              <Stat>
                <StyledTitle>{pool.name}</StyledTitle>
                <StyledSubtitle>
                  Utilization {(pool.deposits / pool.capacity) * 100}%
                </StyledSubtitle>
              </Stat>
              <Stat>
                <StyledTitle>
                  <Logo height={24} />
                  <span>{pool.deposits}</span>
                </StyledTitle>
                <StyledSubtitle color={colors.green}>
                  {pool.apr}%
                </StyledSubtitle>
              </Stat>
            </PoolStats>
          </PoolWrapper>
        );
      })}
    </ListRow>
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

interface FooterProps {
  activePage: PageEnum;
  setPage: (page: PageEnum) => void;
}

const FooterButton = styled(Button)<{ isActive?: boolean }>`
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

export default MainPage;
