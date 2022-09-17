import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import colors from "shared/lib/designSystem/colors";
import styled, { keyframes } from "styled-components";
import { components } from "../designSystem/components";
import { StatsMarquee } from "../components/StatsMarquee";
import { truncateAddress } from "shared/lib/utils/address";
import { BaseButton, Button, Subtitle, Title } from "../designSystem";
import sizes from "../designSystem/sizes";
import Indicator from "shared/lib/components/Indicator/Indicator";
import { ProductDisclaimer } from "../components/ProductDisclaimer";
import { getMakerLogo } from "../constants/constants";
import { getAssetLogo } from "shared/lib/utils/asset";
import { getAssets } from "../constants/constants";
import { fadeIn } from "shared/lib/designSystem/keyframes";
import { VaultList } from "../constants/constants";
import { useVaultsData } from "../hooks/web3DataContext";
import { formatBigNumber } from "../utils/math";
import { getAssetDecimals, getUtilizationDecimals } from "../utils/asset";
import { motion } from "framer-motion";
import { Balance } from "../components/Balance";
import { usePoolsAPR } from "../hooks/usePoolsAPR";
const statSideContainer: number = 120;

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

  padding: 0;
`;

const PoolLogo = styled.div`
  width: ${statSideContainer}px;
  height: ${statSideContainer}px;
  border-right: 1px solid ${colors.border};
  display: inline-flex;

  > * {
    overflow: hidden;
  }

  img {
    margin: auto;
  }
`;

const PoolButton = styled(BaseButton)`
  opacity: 0;
  width: 0;
  padding: 0;

  > * {
    overflow: hidden;
  }

  i {
    text-align: center;
    margin: auto;
    width: 24px;
    height: 24px;
    color: white;
  }
`;

const slide = keyframes`
  0% {
    opacity: 1;
    width: ${statSideContainer}px;
  } 

  50% {
    opacity: 0;
  }

  100% {
    width: 0;
    opacity: 0;
  }
`;

const reverseSlide = keyframes`
  0% {
    width: 0;
  } 

  100% {
    width: ${statSideContainer}px;
    opacity: 1;
  }
`;

const PoolWrapper = styled.div`
  height: ${statSideContainer}px;
  width: 100%;
  border-bottom: 1px solid ${colors.border};
  display: flex;

  &:hover {
    transition: 0.25s;
    background: ${colors.background.two};

    ${PoolLogo} {
      animation: 0.5s ${slide} forwards;
    }

    ${PoolButton} {
      animation: 0.5s ${reverseSlide} forwards;
      width: ${statSideContainer}px;
      height: ${statSideContainer}px;
    }
  }

  &:not(:hover) {
    ${PoolLogo} {
      animation: 0.5s ${reverseSlide} forwards;

      > img {
        animation: 0.5s ${fadeIn};
      }
    }

    ${PoolButton} {
      transition: 0.5s ease-in-out;
      animation: 0.5s ${slide};
    }
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
  height: ${statSideContainer}px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  width: calc(100% - ${statSideContainer}px);
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

  svg {
    width: fit-content;
    height: fit-content;
    margin: auto;
    margin-right: 8px;
  }
`;

const StyledSubtitle = styled(Subtitle)<{ color?: string }>`
  font-size: 12px;
  line-height: 16px;
  text-transform: uppercase;
  color: ${({ color }) => color ?? colors.tertiaryText};
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

enum PageEnum {
  POOLS,
  POSITIONS,
}

const MainPage: React.FC = () => {
  const [activePage, setPage] = useState<PageEnum>(PageEnum.POOLS);

  return (
    <HeroContainer>
      <Header />
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
  );
};

const Pools = () => {
  const vaultDatas = useVaultsData();
  const utilizationDecimals = getUtilizationDecimals();
  const aprs = usePoolsAPR();
  return (
    <ListRow>
      {VaultList.map((pool, i) => {
        const balance = vaultDatas.data[pool].vaultBalanceInAsset;
        const utilizationRate = vaultDatas.data[pool].utilizationRate;
        const poolLogo = getMakerLogo(pool);
        const asset = getAssets(pool);
        const decimals = getAssetDecimals(asset);
        const Logo = getAssetLogo(asset);
        const apr = aprs[pool];
        return (
          <motion.div
            key={i}
            transition={{
              duration: 0.5,
              delay: (i + 1) / 10,
              type: "keyframes",
              ease: "easeInOut",
            }}
            initial={{
              y: 50,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: 50,
              opacity: 0,
            }}
          >
            <PoolWrapper key={i}>
              <PoolLogo>
                <img src={poolLogo} alt={pool} />
              </PoolLogo>
              <PoolStats>
                <Stat>
                  <StyledTitle>{pool}</StyledTitle>
                  <StyledSubtitle>
                    Utilization{" "}
                    {formatBigNumber(utilizationRate, utilizationDecimals)}%
                  </StyledSubtitle>
                </Stat>
                <Stat>
                  <StyledTitle>
                    <Logo height={24} />
                    <span>{formatBigNumber(balance, decimals)}</span>
                  </StyledTitle>
                  <StyledSubtitle color={colors.green}>
                    {apr.toFixed(2)}%
                  </StyledSubtitle>
                </Stat>
              </PoolStats>
              <PoolButton>
                <i className="fas fa-chevron-right" />
              </PoolButton>
            </PoolWrapper>
          </motion.div>
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
