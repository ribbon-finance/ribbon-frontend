import { useState } from "react";
import { Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import {
  getAssets,
  getMakerLogo,
  VaultDetailsMap,
  VaultOptions,
} from "../constants/constants";
import { BaseLink, Title } from "../designSystem";
import NotFound from "./NotFound";
import Marquee from "react-fast-marquee/dist";
import styled from "styled-components";
import { components } from "../designSystem/components";
import sizes from "../designSystem/sizes";
import {
  DisclaimerWrapper,
  FooterButton,
  FooterRow,
  HeaderRow,
  MarqueeCol,
  ScrollableContent,
  StickyCol,
  WalletButton,
  WalletButtonText,
  WalletCol,
  FooterWalletCol,
} from "./LendPage";
import { ProductDisclaimer } from "../components/ProductDisclaimer";
import Indicator from "shared/lib/components/Indicator/Indicator";
import { truncateAddress } from "shared/lib/utils/address";
import useWeb3Wallet from "../hooks/useWeb3Wallet";
import LendModal, { ModalContentEnum } from "../components/Common/LendModal";
import ActionModal from "../components/ActionModal";
import { useVaultsData } from "../hooks/web3DataContext";
import { usePoolsAPR } from "../hooks/usePoolsAPR";
import {
  getAssetDecimals,
  getAssetLogo,
  getUtilizationDecimals,
} from "../utils/asset";
import { formatBigNumber } from "../utils/math";
import colors from "shared/lib/designSystem/colors";
import ExternalLinkIcon from "../components/Common/ExternalLinkIcon";
import currency from "currency.js";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import HelpInfo from "shared/lib/components/Common/HelpInfo";
import UtilizationBar from "../components/Common/UtilizationBar";
import PoolActivity from "../components/Pools/PoolActivity";
import useScreenSize from "shared/lib/hooks/useScreenSize";
import { delayedFade, delayedUpwardFade } from "../components/animations";
import credora from "../assets/icons/credora.svg";
import MobileHeader from "../components/MobileHeader";
import PositionWidget from "../components/PositionWidget";
import ActionMMModal from "../components/ActionMMModal";
import { LoadingText } from "shared/lib/hooks/useLoadingText";

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
  REBALANCE,
}

const MakerLogo = styled.div<{ delay: number }>`
  display: flex;
  justify-content: center;
  width: 100%;

  ${delayedUpwardFade}

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

const Stat = styled.div<{ delay?: number }>`
  display: flex;
  justify-content: space-between;
  padding: 30px 0;

  ${delayedUpwardFade}

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
  color: ${({ color }) => (color ? color : colors.primaryText)};

  > * {
    margin: auto 0;
  }

  svg {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
`;

const PillButton = styled.a<{ delay: number }>`
  padding-left: 16px;
  padding-right: 16px;
  border: 1px solid white;
  background-color: transparent;
  border-radius: 100px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  transition: 0.2s ease-in-out;
  color: ${colors.primaryText} !important;
  ${delayedUpwardFade}

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

const Details = styled.div<{ delay?: number }>`
  align-items: center;
  padding: 32px;
  width: 100%;

  ${delayedUpwardFade}

  @media (max-width: ${sizes.lg}px) {
    padding: 16px;
  }

  a:not(${PillButton}) {
    color: ${colors.text};
    text-decoration: underline;

    svg {
      margin-left: 8px;
    }

    &:hover {
      svg {
        transition: 0.2s ease-in-out;
        transform: translate(4px, -4px);
      }
    }
  }
`;

const DetailsStatWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;

  > ${Stat} {
    display: inline-flex;
    width: calc(50% - 16px);
    border-top: 1px solid ${colors.border};
    border-bottom: 1px solid ${colors.border};
  }

  @media (max-width: 1472px) {
    display: block;

    > ${Stat} {
      &:first-of-type {
        border-top: none;
      }

      width: 100%;
    }
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

  @media (max-width: ${sizes.lg}px) {
    padding-bottom: ${components.footer * 4}px;
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

const StyledBaseLink = styled(BaseLink)`
  text-decoration: none !important;
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

const YieldExplainerTitle = styled.div<{ color: string }>`
  color: ${(props) => props.color};
  fontsize: 14px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  min-width: 224px;

  > span {
    &:last-child {
      font-family: VCR;
    }
  }
`;

const YieldExplainerStat = styled.div`
  fontsize: 14px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  margin-left: 8px;

  > span {
    &:first-child {
      margin-left: 8px;
    }

    &:last-child {
      font-family: VCR;
    }
  }
`;

export const MobileHeaderCol = styled(Col)`
  width: 100%;
  height: ${components.header}px;
`;

const PoolPage = () => {
  const { poolId }: { poolId: VaultOptions } = useParams();
  const [activePage, setPage] = useState<PageEnum>();
  const [triggerWalletModal, setWalletModal] = useState<boolean>(false);
  const { loading: vaultLoading, data: vaultDatas } = useVaultsData();
  const { account, active } = useWeb3Wallet();
  const { loading, aprs: poolAPRs, supplyAprs, rbnAprs } = usePoolsAPR();
  const utilizationDecimals = getUtilizationDecimals();
  const usdcDecimals = getAssetDecimals("USDC");
  const { width } = useScreenSize();
  if (!poolId) return <NotFound />;

  const logo = getMakerLogo(poolId);
  const poolSize = formatBigNumber(vaultDatas[poolId].poolSize, usdcDecimals);
  const manager = vaultDatas[poolId].manager;
  const apr = poolAPRs[poolId].toFixed(2);
  const supplyApr = supplyAprs[poolId].toFixed(2);
  const rbnApr = rbnAprs[poolId].toFixed(2);
  const poolDetails = VaultDetailsMap[poolId];
  const utilizationRate = formatBigNumber(
    vaultDatas[poolId].utilizationRate,
    utilizationDecimals
  );

  const AssetLogo = getAssetLogo(getAssets(poolId));

  return (
    <>
      <LendModal
        show={triggerWalletModal}
        onHide={() => setWalletModal(false)}
        content={ModalContentEnum.WALLET}
      />
      <ActionModal
        show={activePage !== undefined}
        actionType={activePage === PageEnum.DEPOSIT ? "deposit" : "withdraw"}
        onHide={() => setPage(undefined)}
        pool={poolId}
      />
      <ActionMMModal
        show={activePage !== undefined && activePage === PageEnum.REBALANCE}
        onHide={() => setPage(undefined)}
        pool={poolId}
      />
      <PoolContainer>
        <Header setWalletModal={setWalletModal} pool={poolId} />
        <ScrollableContent>
          <StickyCol xs={12} md={6}>
            <UserDetailsWrapper>
              <Details>
                <MakerLogo delay={0.1}>
                  <img src={logo} alt={poolId} />
                </MakerLogo>
                <SocialsWrapper>
                  <PillButton
                    delay={0.2}
                    href={poolDetails.contract}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <span>
                      {width < sizes.lg + 200 ? "Pool" : "Pool Contract"}
                    </span>
                    <ExternalLinkIcon />
                  </PillButton>
                  <PillButton
                    delay={0.3}
                    href={poolDetails.twitter}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <span>Twitter</span>
                    <ExternalLinkIcon />
                  </PillButton>
                  <PillButton
                    delay={0.4}
                    href={poolDetails.website}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <span>Website</span>
                    <ExternalLinkIcon />
                  </PillButton>
                </SocialsWrapper>
                <StatsWrapper>
                  <Stat delay={0.5}>
                    <Label>Pool size:</Label>
                    <Value>
                      <AssetLogo />{" "}
                      {currency(poolSize, { symbol: "" }).format()}
                    </Value>
                  </Stat>
                  <Stat delay={0.6}>
                    <div className="d-flex justify-content-center align-items-center">
                      <Label>APR:</Label>
                      <TooltipExplanation
                        explanation={
                          <>
                            <YieldExplainerTitle
                              color={
                                loading || parseFloat(apr) === 0
                                  ? colors.primaryText
                                  : parseFloat(apr) >= 0
                                  ? colors.green
                                  : colors.red
                              }
                            >
                              <span>Total APR</span>
                              <span>
                                {loading ? (
                                  <LoadingText>LOADING</LoadingText>
                                ) : (
                                  `${currency(apr, { symbol: "" }).format()}%`
                                )}
                              </span>
                            </YieldExplainerTitle>
                            <YieldExplainerStat>
                              <span>Supply APR</span>
                              <span>
                                {loading ? (
                                  <LoadingText>LOADING</LoadingText>
                                ) : (
                                  `${currency(supplyApr, {
                                    symbol: "",
                                  }).format()}%`
                                )}
                              </span>
                            </YieldExplainerStat>
                            <YieldExplainerStat>
                              <span>RBN Rewards APR</span>
                              <span>
                                {loading ? (
                                  <LoadingText>LOADING</LoadingText>
                                ) : (
                                  `${currency(rbnApr, {
                                    symbol: "",
                                  }).format()}%`
                                )}
                              </span>
                            </YieldExplainerStat>
                          </>
                        }
                        renderContent={({ ref, ...triggerHandler }) => (
                          <HelpInfo containerRef={ref} {...triggerHandler}>
                            i
                          </HelpInfo>
                        )}
                      />
                    </div>
                    <Value
                      color={
                        loading || parseFloat(apr) === 0
                          ? colors.primaryText
                          : parseFloat(apr) >= 0
                          ? colors.green
                          : colors.red
                      }
                    >
                      {loading ? (
                        <LoadingText>LOADING</LoadingText>
                      ) : (
                        `${currency(apr, {
                          symbol: "",
                        }).format()}%`
                      )}
                    </Value>
                  </Stat>
                  <Stat delay={0.7}>
                    <Label>Utilization rate:</Label>
                    <div className="d-flex">
                      <UtilizationBar
                        percent={parseFloat(utilizationRate)}
                        color="white"
                        width={64}
                      />
                      <Value>{utilizationRate}%</Value>
                    </div>
                  </Stat>
                </StatsWrapper>
              </Details>
            </UserDetailsWrapper>
          </StickyCol>
          <Col xs={12} md={6}>
            <PoolDetailsWrapper>
              {account !== manager && !loading && (
                <>
                  <Details delay={0.25}>
                    <DetailsIndex>01</DetailsIndex>
                    <StyledTitle>{poolDetails.name}</StyledTitle>
                    <Paragraph>{poolDetails.bio}</Paragraph>
                  </Details>
                  <Details delay={0.5}>
                    <DetailsIndex>02</DetailsIndex>
                    <StyledTitle>Credit Rating</StyledTitle>
                    <Paragraph>{poolDetails.credit.content}</Paragraph>
                    <DetailsStatWrapper>
                      <Stat>
                        <Label>Credit Rating:</Label>
                        <StyledBaseLink
                          to="https://credora.gitbook.io/credit-methodology/SbLmTxogePkrzsF4z9IK/credit-evaluation/credit-score"
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          <Value>{poolDetails.credit.rating}</Value>
                        </StyledBaseLink>
                      </Stat>
                      <Stat>
                        <div className="d-flex justify-content-center align-items-center">
                          <Label>Borrow Limit: </Label>
                          <TooltipExplanation
                            explanation={
                              <>
                                Credora calculates a Borrow Capacity for each
                                trading firm. The Borrow Capacity calculation
                                uses the Credit Score to define a target
                                Portfolio Leverage, and subsequently calculates
                                a USD Borrow Capacity based on trading firm
                                current Debt and Portfolio Equity.
                              </>
                            }
                            renderContent={({ ref, ...triggerHandler }) => (
                              <HelpInfo containerRef={ref} {...triggerHandler}>
                                i
                              </HelpInfo>
                            )}
                          />
                        </div>
                        <Value>
                          <AssetLogo />{" "}
                          {currency(poolDetails.credit.borrowLimit).format({
                            symbol: "",
                          })}
                        </Value>
                      </Stat>
                    </DetailsStatWrapper>
                    <CreditRating>
                      Credit ratings provided by{" "}
                      <BaseLink
                        color="white"
                        target="_blank"
                        rel="noreferrer noopener"
                        to="https://credora.io/"
                      >
                        <img src={credora} alt="credora" />
                      </BaseLink>
                    </CreditRating>
                  </Details>
                </>
              )}
              <Details delay={account !== manager ? 0.75 : 0.25}>
                <DetailsIndex>{account !== manager ? "03" : "01"}</DetailsIndex>
                <StyledTitle>Pool Activity</StyledTitle>
                <PoolActivity
                  vault={{
                    vaultOption: poolId,
                    vaultVersion: "lend",
                  }}
                />
              </Details>
            </PoolDetailsWrapper>
          </Col>
        </ScrollableContent>
        <Footer
          activePage={activePage}
          setPage={setPage}
          setWalletModal={setWalletModal}
          manager={manager}
        />
        <PositionWidget
          vault={{
            vaultOption: poolId,
            vaultVersion: "lend",
          }}
        />
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
    <>
      <HeaderRow mobile={true}>
        <MobileHeaderCol md={12} lg={0}>
          <MobileHeader />
        </MobileHeaderCol>
      </HeaderRow>
      <HeaderRow>
        <MarqueeCol md={12} lg={6}>
          <PoolMarquee pool={pool} />
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
  activePage?: PageEnum;
  setPage: (page: PageEnum) => void;
  setWalletModal: (trigger: boolean) => void;
  manager: string;
}

const Footer = ({
  activePage,
  setPage,
  setWalletModal,
  manager,
}: FooterProps) => {
  const { account, active } = useWeb3Wallet();

  return (
    <FooterRow>
      <Col md={0} lg={6}>
        <DisclaimerWrapper delay={0.1}>
          <ProductDisclaimer />
        </DisclaimerWrapper>
      </Col>
      <Col md={12} lg={6}>
        {account !== manager ? (
          <>
            <FooterButton
              delay={0.2}
              isActive={activePage === PageEnum.DEPOSIT}
              onClick={() => setPage(PageEnum.DEPOSIT)}
            >
              Deposit
            </FooterButton>
            <FooterButton
              delay={0.3}
              isActive={activePage === PageEnum.WITHDRAW}
              onClick={() => setPage(PageEnum.WITHDRAW)}
            >
              Withdraw
            </FooterButton>
          </>
        ) : (
          <>
            <FooterButton
              delay={0.3}
              isActive={activePage === PageEnum.REBALANCE}
              onClick={() => setPage(PageEnum.REBALANCE)}
              width={"100%"}
            >
              Rebalance Utilization
            </FooterButton>
          </>
        )}
      </Col>
      <FooterWalletCol md={0} lg={0}>
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

const StyledMarquee = styled(Marquee)<{ delay: number }>`
  height: 100%;
  ${delayedFade}
`;

const PoolMarquee = ({ pool }: { pool: VaultOptions }) => {
  return (
    <StyledMarquee gradient={false} speed={50} delay={0.1} pauseOnHover>
      {new Array(10).fill("").map((v, i) => (
        <MarqueeItem key={i}>
          <Title>{VaultDetailsMap[pool].name}</Title>
          <img src={getMakerLogo(pool)} alt={pool} height={20} width={20} />
        </MarqueeItem>
      ))}
    </StyledMarquee>
  );
};
export default PoolPage;
