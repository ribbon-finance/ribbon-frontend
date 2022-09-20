import { useState } from "react";
import { Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import {
  getAssets,
  getMakerLogo,
  VaultAddressMap,
  VaultOptions,
} from "../constants/constants";
import { BaseButton, Title } from "../designSystem";
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
import DepositModal from "../components/DepositModal";
import { useVaultsData } from "../hooks/web3DataContext";
import { usePoolsAPR } from "../hooks/usePoolsAPR";
import { getAssetLogo, getUtilizationDecimals } from "../utils/asset";
import { formatBigNumber } from "../utils/math";
import colors from "shared/lib/designSystem/colors";
import { Assets } from "../store/types";
import ExternalLinkIcon from "../components/Common/ExternalLinkIcon";

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

const DetailsWrapper = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`;

const Details = styled.div`
  align-items: center;
  margin: auto 0;
  padding: 32px;
  width: 100%;
`;

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

const PillButton = styled(BaseButton)`
  padding: 16px;
  border: 1px solid white;
  background-color: transparent;
  border-radius: 100px;
  color: ${colors.primaryText};
  width: fit-content;

  &:hover {
    cursor: pointer;
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

interface PoolDetails {
  logo: string;
  contract: string;
  poolSize: string;
  asset: Assets;
  utilizationRate: string;
  apr: string;
  twitter: string;
  website: string;
}

const PoolPage = () => {
  const { poolId }: { poolId: VaultOptions } = useParams();
  const [activePage, setPage] = useState<PageEnum>();
  const [triggerWalletModal, setWalletModal] = useState<boolean>(false);
  const { data: vaultDatas } = useVaultsData();
  const { aprs: poolAPRs } = usePoolsAPR();
  const decimals = getUtilizationDecimals();
  if (!poolId) return <NotFound />;

  const details: PoolDetails = {
    logo: getMakerLogo(poolId),
    contract: VaultAddressMap[poolId].lend,
    poolSize: formatBigNumber(vaultDatas[poolId].poolSize, decimals),
    asset: getAssets(poolId),
    utilizationRate: formatBigNumber(
      vaultDatas[poolId].utilizationRate,
      decimals
    ),
    apr: poolAPRs[poolId].toFixed(2),
    twitter: "",
    website: "",
  };

  const AssetLogo = getAssetLogo(details.asset);
  return (
    <>
      <LendModal
        show={triggerWalletModal}
        onHide={() => setWalletModal(false)}
        content={ModalContentEnum.WALLET}
      />
      <DepositModal
        show={activePage === PageEnum.DEPOSIT}
        onHide={() => setPage(undefined)}
        pool={poolId}
      />
      <PoolContainer>
        <Header setWalletModal={setWalletModal} pool={poolId} />
        <Content>
          <Col xs={6}>
            <DetailsWrapper>
              <Details>
                <MakerLogo>
                  <img src={details.logo} alt={poolId} />
                </MakerLogo>
                <SocialsWrapper>
                  <PillButton>
                    <span>Pool Contract</span>
                    <ExternalLinkIcon />
                  </PillButton>
                  <PillButton>
                    <span>Twitter</span>
                    <ExternalLinkIcon />
                  </PillButton>
                  <PillButton>
                    <span>Website</span>
                    <ExternalLinkIcon />
                  </PillButton>
                </SocialsWrapper>
                <StatsWrapper>
                  <Stat>
                    <Label>Pool size:</Label>
                    <Value>
                      <AssetLogo /> {details.poolSize}
                    </Value>
                  </Stat>
                  <Stat>
                    <Label>APR:</Label>
                    <Value>{details.apr}</Value>
                  </Stat>
                  <Stat>
                    <Label>Utilization rate:</Label>
                    <Value>{details.utilizationRate}%</Value>
                  </Stat>
                </StatsWrapper>
              </Details>
            </DetailsWrapper>
          </Col>
          <Col></Col>
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
