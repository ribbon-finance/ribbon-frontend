import { useState } from "react";
import { Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import {
  getAssets,
  getMakerLogo,
  VaultDetailsMap,
  VaultOptions,
} from "../constants/constants";
import { Title } from "../designSystem";
import NotFound from "./NotFound";
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
import { useVaultsData } from "../hooks/web3DataContext";
import { usePoolsAPR } from "../hooks/usePoolsAPR";
import { getAssetLogo, getUtilizationDecimals } from "../utils/asset";
import { formatBigNumber } from "../utils/math";
import colors from "shared/lib/designSystem/colors";
import ExternalLinkIcon from "../components/Common/ExternalLinkIcon";
import currency from "currency.js";

const PoolContainer = styled.div`
  width: calc(100% - ${components.sidebar}px);

  @media (max-width: ${sizes.lg}px) {
    width: 100%;
  }

  > .row {
    margin-left: 0 !important;
    width: 100%;
    border-right: 1px solid ${colors.border};
  }
`;

enum PageEnum {
  DEPOSIT,
  WITHDRAW,
}

const MakerLogo = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;

  img {
    width: 120px;
    height: 120px;
    text-align: center;
    margin-bottom: 40px;
  }
`;

const StatsWrapper = styled.div`
  display: block;
  width: 100%;
`;

const Stat = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 30px 0;

  &:not(:last-of-type) {
    border-bottom: 1px solid ${colors.border};
  }
`;

const Label = styled.span`
  color: ${colors.tertiaryText};
`;

const Value = styled.span<{ color?: string }>`
  display: flex;
  font-family: VCR;
  color: ${({ color }) => color ?? colors.primaryText};

  > * {
    margin: auto 0;
  }

  svg {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
`;

const Details = styled.div`
  align-items: center;
  padding: 32px;
  width: 100%;
`;

const DetailsStatWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 24px;

  > ${Stat} {
    display: inline-flex;
    width: calc(50% - 16px);
    border-top: 1px solid ${colors.border};
    border-bottom: 1px solid ${colors.border};
  }
`;

const CreditRating = styled.div`
  margin: 24px auto;
  color: ${colors.tertiaryText};

  > * {
    margin: auto 0;
  }

  img {
    margin-left: 8px;
  }
`;

const UserDetailsWrapper = styled.div`
  display: flex;
  margin: auto;
  width: 100%;

  > ${Details} {
    margin: auto 0;
  }
`;

const PoolDetailsWrapper = styled.div`
  height: 100%;
  width: 100%;

  > ${Details} {
    display: block;
    width: 100%;
  }
`;

const PillButton = styled.a`
  padding: 16px;
  border: 1px solid white;
  background-color: transparent;
  border-radius: 100px;
  width: fit-content;
  transition: 0.2s ease-in-out;
  color: ${colors.primaryText};

  &:hover {
    cursor: pointer;
    color: ${colors.primaryText} !important;
    text-decoration: none !important;

    svg {
      transition: 0.2s ease-in-out;
      transform: translate(4px, -4px);
    }
  }

  > * {
    margin: auto 0;

    &:not(:last-child) {
      margin-right: 8px;
    }
  }
`;

const SocialsWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 52px;

  > ${PillButton} {
    &:not(:last-of-type) {
      margin-right: 16px;
    }
  }
`;

const StyledTitle = styled(Title)`
  font-size: 22px;
`;

const DetailsIndex = styled.span`
  display: block;
  color: ${colors.quaternaryText};
  font-size: 12px;
  font-family: VCR;
`;

const Paragraph = styled.p`
  color: ${colors.text};
`;

const PoolPage = () => {
  const { poolId }: { poolId: VaultOptions } = useParams();
  const [activePage, setPage] = useState<PageEnum>();
  const [triggerWalletModal, setWalletModal] = useState<boolean>(false);
  const { data: vaultDatas } = useVaultsData();
  const { aprs: poolAPRs } = usePoolsAPR();
  const decimals = getUtilizationDecimals();

  if (!poolId) return <NotFound />;

  const logo = getMakerLogo(poolId);
  const poolSize = formatBigNumber(vaultDatas[poolId].poolSize, decimals);
  const apr = poolAPRs[poolId].toFixed(2);
  const poolDetails = VaultDetailsMap[poolId];
  const utilizationRate = formatBigNumber(
    vaultDatas[poolId].utilizationRate,
    decimals
  );

  const AssetLogo = getAssetLogo(getAssets(poolId));
  return (
    <>
      <LendModal
        show={triggerWalletModal}
        onHide={() => setWalletModal(false)}
        content={ModalContentEnum.WALLET}
      />
      <PoolContainer>
        <Header setWalletModal={setWalletModal} pool={poolId} />
        <Content style={{ overflow: "scroll" }}>
          <Col
            xs={6}
            style={{
              display: "flex",
              position: "sticky",
              height: `calc(100vh - ${
                components.header + components.footer
              }px)`,
              top: 0,
            }}
          >
            <UserDetailsWrapper>
              <Details>
                <MakerLogo>
                  <img src={logo} alt={poolId} />
                </MakerLogo>
                <SocialsWrapper>
                  <PillButton
                    href={poolDetails.contract}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <span>Pool Contract</span>
                    <ExternalLinkIcon />
                  </PillButton>
                  <PillButton
                    href={poolDetails.twitter}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <span>Twitter</span>
                    <ExternalLinkIcon />
                  </PillButton>
                  <PillButton
                    href={poolDetails.website}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <span>Website</span>
                    <ExternalLinkIcon />
                  </PillButton>
                </SocialsWrapper>
                <StatsWrapper>
                  <Stat>
                    <Label>Pool size:</Label>
                    <Value>
                      <AssetLogo /> {poolSize}
                    </Value>
                  </Stat>
                  <Stat>
                    <Label>APR:</Label>
                    <Value>{apr}</Value>
                  </Stat>
                  <Stat>
                    <Label>Utilization rate:</Label>
                    <Value>{utilizationRate}%</Value>
                  </Stat>
                </StatsWrapper>
              </Details>
            </UserDetailsWrapper>
          </Col>
          <Col>
            <PoolDetailsWrapper>
              <Details>
                <DetailsIndex>01</DetailsIndex>
                <StyledTitle>{poolDetails.name}</StyledTitle>
                <Paragraph>{poolDetails.bio}</Paragraph>
              </Details>
              <Details>
                <DetailsIndex>02</DetailsIndex>
                <StyledTitle>Credit Rating</StyledTitle>
                <Paragraph>{poolDetails.bio}</Paragraph>

                <DetailsStatWrapper>
                  <Stat>
                    <Label>Credit Rating:</Label>
                    <Value>{poolDetails.creditRating.rating}</Value>
                  </Stat>
                  <Stat>
                    <Label>Borrow Limit:</Label>
                    <Value>
                      <AssetLogo />{" "}
                      {currency(poolDetails.creditRating.borrowLimit).format({
                        symbol: "",
                      })}
                    </Value>
                  </Stat>
                </DetailsStatWrapper>
                <CreditRating>
                  Credit ratings provided by{" "}
                  <img
                    src={poolDetails.creditRating.ratingProvider}
                    alt={poolDetails.creditRating.ratingProvider}
                  />
                </CreditRating>
              </Details>
            </PoolDetailsWrapper>
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
    <Marquee gradient={false} speed={50} delay={0} pauseOnHover>
      {new Array(10).fill("").map((i) => (
        <MarqueeItem key={i}>
          <Title>{pool}</Title>
          <img src={getMakerLogo(pool)} alt={pool} height={20} width={20} />
        </MarqueeItem>
      ))}
    </Marquee>
  );
};
export default PoolPage;
