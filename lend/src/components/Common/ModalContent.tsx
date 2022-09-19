import { useCallback, useEffect, useMemo, useState } from "react";
import { Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import { getExplorerURI, URLS } from "shared/lib/constants/constants";
import styled, { css, keyframes } from "styled-components";
import ExternalLinkIcon from "./ExternalLinkIcon";
import twitter from "../../assets/icons/socials/twitter.svg";
import etherscan from "../../assets/icons/socials/etherscan.svg";
import discord from "../../assets/icons/socials/discord.svg";
import github from "../../assets/icons/socials/github.svg";
import disconnect from "../../assets/icons/disconnect.svg";
import { ProductDisclaimer } from "../ProductDisclaimer";
import { ModalContentEnum } from "./LendModal";
import WalletLogo from "shared/lib/components/Wallet/WalletLogo";
import LearnMoreWallet from "shared/lib/components/Wallet/LearnMoreWallet";
import { Button, PrimaryText, SecondaryText } from "../../designSystem";
import { motion } from "framer-motion";
import { useVaultAccountBalances } from "../../hooks/useVaultAccountBalances";
import { formatBigNumber } from "../../utils/math";
import TransactionStep from "../RbnClaim/TransactionStep";
import usePoolFactoryContract from "../../hooks/usePoolFactoryContract";
import { PoolFactory } from "../../codegen";
import { usePendingTransactions } from "../../hooks/pendingTransactionsContext";
import { getAssetColor } from "../../utils/asset";
import { VaultAddressMap, VaultList } from "../../constants/constants";
import Logo from "shared/lib/assets/icons/logo";
import {
  EthereumWallet,
  ETHEREUM_WALLETS,
  WALLET_TITLES,
} from "shared/lib/models/wallets";
import useWeb3Wallet from "../../hooks/useWeb3Wallet";
import { Chains } from "../../constants/constants";
import { AssetsList } from "../../store/types";
import { getAssetDisplay, getAssetLogo } from "../../utils/asset";
import currency from "currency.js";

const TextContent = styled.div`
  color: ${colors.primaryText}A3;
  padding: 16px 24px;
`;

const hoveredContentRow = css`
  cursor: pointer;
  transition: 0.2s ease-in-out;
  border: 1px solid ${colors.primaryText} !important;
  box-shadow: inset 0 0 5px ${colors.primaryText};

  > svg:last-of-type {
    transform: translate(4px, -4px);
  }
`;

const ContentRow = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  height: 80px;
  padding: 0 24px;
  font-size: 14px;
  transition: 0.2s ease-in-out;
  border: 1px solid transparent;

  &:hover {
    ${hoveredContentRow}
  }

  ${({ active }) => {
    if (active) return hoveredContentRow;
  }}

  > img {
    width: 32px;
    height: 32px;
    margin-right: 20px;
  }

  > svg {
    transition: all 0.2s ease-in-out;

    &:first-of-type {
      margin-right: 20px;
    }

    &:last-of-type {
      margin-left: 8px;
      width: 20px;
      height: 20px;
    }
  }
`;

const ContentWrapper = styled.div`
  > ${ContentRow} {
    &:not(:last-of-type) {
      border-bottom: 1px solid ${colors.primaryText}1F;
    }
  }
`;

const ContentFooter = styled.div`
  display: flex;
  align-items: center;
  height: 80px;
  padding: 0;
  font-size: 14px;
`;

interface ModalContentProps {
  content?: ModalContentEnum;
  onHide: () => void;
}

export const ModalContent = ({ content, onHide }: ModalContentProps) => {
  const modalContent = useMemo(() => {
    switch (content) {
      case ModalContentEnum.ABOUT:
        return <AboutPage />;
      case ModalContentEnum.COMMUNITY:
        return <CommunityPage />;
      case ModalContentEnum.WALLET:
        return <WalletPage onHide={onHide} />;
      default:
        return null;
    }
  }, [content, onHide]);

  return (
    <motion.div
      key={content}
      transition={{
        delay: 0.2,
        duration: 0.5,
        type: "keyframes",
        ease: "easeInOut",
      }}
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
    >
      {modalContent}
    </motion.div>
  );
};

const AboutPage = () => {
  return (
    <TextContent>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus
      sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus
      dolor purus non enim praesent elementum facilisis leo, vel fringilla est
      ullamcorper eget nulla facilisi etiam dignissim diam quis enim lobortis
      scelerisque fermentum dui faucibus in ornare quam viverra orci sagittis eu
      volutpat odio facilisis mauris sit amet massa vitae tortor condimentum
      lacinia
    </TextContent>
  );
};

interface CommunityLink {
  title: string;
  img: string;
  url: string;
}

const CommunityPage = () => {
  const links: CommunityLink[] = [
    {
      title: "Twitter",
      img: twitter,
      url: URLS.twitter,
    },
    {
      title: "Discord",
      img: discord,
      url: URLS.discord,
    },
    {
      title: "Github",
      img: github,
      url: URLS.github,
    },
  ];

  return (
    <ContentWrapper>
      {links.map((link) => (
        <ContentRow onClick={() => window.open(link.url)}>
          <img src={link.img} alt={link.title} />
          <Title>{link.title}</Title>
          <ExternalLinkIcon />
        </ContentRow>
      ))}
      <ContentFooter>
        <ProductDisclaimer />
      </ContentFooter>
    </ContentWrapper>
  );
};

enum WalletPageEnum {
  DISCLAIMER,
  CONNECT_WALLET,
  ACCOUNT,
}

const ButtonWrapper = styled.div`
  border-top: 1px solid ${colors.primaryText}1F;
  display: block;
  width: 100%;
  padding: 16px 24px;
  text-align: center;

  a {
    display: block;
    margin-top: 16px;
  }

  > * {
    width: 100%;
  }
`;

const ContinueButton = styled(Button)`
  background-color: ${colors.primaryText};
  color: #000000;
  height: 64px;
  border-radius: 0;
`;

const ConnectButton = styled(Button)`
  background: ${colors.buttons.secondaryBackground};
  color: ${colors.buttons.secondaryText};
  border: none;
  padding: 12px 30px;
  height: 64px;
  border-radius: 0;

  &:disabled {
    opacity: 0.6 !important;
    cursor: default !important;
  }
`;

const ContentLogoWrapper = styled.div`
  background-color: ${colors.background.three};
  padding: 8px;
  margin-right: 16px;
  border-radius: 8px;

  img {
    width: 24px;
    height: 24px;
  }
`;

const AssetRowWrapper = styled.div`
  border-bottom: 1px solid ${colors.primaryText}1F;
`;

const AssetRow = styled.div`
  display: flex;
  padding: 24px;
`;

const AssetStat = styled.div`
  display: block;
  flex-direction: column;
  text-transform: uppercase;
  margin-left: 16px;

  > * {
    display: flex;
    font-family: VCR;
    line-height: 1;
  }

  label {
    color: ${colors.tertiaryText};
    font-size: 10px;
  }

  span {
    color: white;
  }
`;

interface WalletPageProps {
  onHide: () => void;
}

const WalletPage = ({ onHide }: WalletPageProps) => {
  const [page, setPage] = useState<WalletPageEnum>(WalletPageEnum.DISCLAIMER);
  const [selectedWallet, setWallet] = useState<EthereumWallet>();
  const { active, activate, deactivate } = useWeb3Wallet();

  useEffect(() => {
    setTimeout(() => {
      if (active) setPage(WalletPageEnum.ACCOUNT);
    }, 200);
  });

  const onActivate = useCallback(async () => {
    if (selectedWallet) {
      try {
        await activate(selectedWallet as EthereumWallet, Chains.Ethereum);
        onHide();
      } catch (error) {
        console.error(error);
      }
    }
  }, [activate, onHide, selectedWallet]);

  const content = useMemo(() => {
    if (page === WalletPageEnum.DISCLAIMER) {
      return (
        <ContentWrapper>
          <TextContent>
            By continuing, you are confirming that you are not a resident of the
            following countries: United States of America, Belarus, Cuba,
            Democratic People's Republic of Korea (DPRK), Democratic Republic of
            Congo, Iran, Iraq, Lebanon, Libya, Mali, Myanmar, Nicaragua, Russia,
            Somalia, South Sudan, Sudan, Syria.
          </TextContent>
          <ButtonWrapper>
            <ContinueButton
              onClick={() => setPage(WalletPageEnum.CONNECT_WALLET)}
            >
              Continue
            </ContinueButton>
          </ButtonWrapper>
        </ContentWrapper>
      );
    }

    if (page === WalletPageEnum.CONNECT_WALLET) {
      return (
        <>
          <ContentWrapper>
            {ETHEREUM_WALLETS.map((wallet) => (
              <ContentRow
                key={wallet}
                active={selectedWallet === wallet}
                onClick={() => setWallet(wallet)}
              >
                <WalletLogo wallet={wallet} />
                <Title>{WALLET_TITLES[wallet]}</Title>
                <ExternalLinkIcon />
              </ContentRow>
            ))}
          </ContentWrapper>
          <ButtonWrapper>
            <ConnectButton
              disabled={!!!selectedWallet}
              onClick={() => onActivate()}
            >
              Connect Wallet
            </ConnectButton>
            <LearnMoreWallet />
          </ButtonWrapper>
        </>
      );
    }

    if (page === WalletPageEnum.ACCOUNT) {
      const actions = [
        {
          img: etherscan,
          title: "Change wallet",
          showExternalIcon: false,
          onClick: async () => {
            await deactivate().then(() => {
              setPage(WalletPageEnum.CONNECT_WALLET);
            });
          },
        },
        {
          img: etherscan,
          title: "Etherscan",
          showExternalIcon: true,
          onClick: () => window.open(getExplorerURI(Chains.Ethereum)),
        },
        {
          img: disconnect,
          title: "Disconnect",
          showExternalIcon: false,
          onClick: async () => {
            await deactivate().then(() => {
              onHide();
            });
          },
        },
      ];

      return (
        <>
          <AssetRowWrapper>
            {AssetsList.map((asset) => {
              const Logo = getAssetLogo(asset);
              const name = getAssetDisplay(asset);

              return (
                <AssetRow>
                  <Logo height={40} width={40} />
                  <AssetStat>
                    <label>{name} Balance</label>
                    <span>{currency(0).format({ symbol: "" })}</span>
                  </AssetStat>
                </AssetRow>
              );
            })}
          </AssetRowWrapper>
          <ContentWrapper>
            {actions.map((action) => (
              <ContentRow onClick={() => action.onClick()}>
                <ContentLogoWrapper>
                  <img src={action.img} alt={action.title} />
                </ContentLogoWrapper>
                <Title>{action.title}</Title>
                {action.showExternalIcon && <ExternalLinkIcon />}
              </ContentRow>
            ))}
          </ContentWrapper>
        </>
      );
    }

    return <></>;
  }, [deactivate, onActivate, onHide, page, selectedWallet]);

  return content;
};

const LogoContent = styled.div<{ padding?: number; height?: number }>`
  width: 100%;
  height:   height: ${(props) =>
    props.padding !== undefined ? `${props.height}px` : ``};
  padding: ${(props) =>
    props.padding !== undefined
      ? `${props.padding}px`
      : `40px 132px 40px 132px`};
  border-bottom: 1px solid ${colors.primaryText}1F;
  background: linear-gradient(
    102.28deg,
    rgba(252, 10, 84, 0.04) 0%,
    rgba(252, 10, 84, 0) 100%
  );
`;

const StyledTitle = styled(Title)<{ color?: string; position?: string }>`
  color: ${(props) => props.color};
  text-align: right;
`;

const StyledSecondaryText = styled(SecondaryText)<{ color?: string }>`
  color: ${(props) => props.color};
  font-size: 14px;
  font-weight: 500;
`;

const ClaimTextContent = styled.div`
  padding: 24px 16px;
`;

const RbnButtonWrapper = styled.div`
  display: block;
  width: 100%;
  padding-left: 16px;
  padding-right: 16px;
  > * {
    width: 100%;
  }
`;

const ClaimRbnButton = styled(Button)`
  background: #fc0a541f;
  color: #fc0a54;
  border: none;
  border-radius: 0;
  padding: 20px;
`;

const LearnMoreContainer = styled.div`
  display: flex;
  width: 100%;
  text-align: center;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
`;

const Footer = styled.div`
  display: flex;
  margin-top: 20px;
  font-size: 14px;

  color: ${colors.primaryText};

  svg {
    transition: all 0.2s ease-in-out;
  }

  > a {
    color: ${colors.primaryText};
    text-decoration: underline;
    &:hover {
      svg {
        transform: translate(2px, -2px);
      }
    }
  }
`;

const BottomTextContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  width: 100%;
  margin-bottom: 24px;
  margin-top: 24px;
`;

const BottomText = styled(PrimaryText)`
  color: rgba(255, 255, 255, 0.8);
`;

const livelyAnimation = (position: "top" | "bottom") => keyframes`
  0% {
    background-position-x: ${position === "top" ? 0 : 100}%;
  }

  50% {
    background-position-x: ${position === "top" ? 100 : 0}%; 
  }

  100% {
    background-position-x: ${position === "top" ? 0 : 100}%;
  }
`;

const FrameBar = styled.div<{
  color: string;
  position: "top" | "bottom";
  height: number;
}>`
  width: 100%;
  height: ${(props) => props.height}px;
  background: ${(props) => `linear-gradient(
    270deg,
    ${props.color}00 5%,
    ${props.color} 50%,
    ${props.color}00 95%
  )`};
  background-size: 200%;
  animation: 10s ${(props) => livelyAnimation(props.position)} linear infinite;

  &:before {
    content: "";
    z-index: -1;
    position: absolute;
    ${(props) => props.position}: 0;
    right: 0;
    left: 0;
    background: inherit;
    filter: blur(${(props) => props.height * 4}px);
    opacity: 1;
    transition: opacity 0.3s;
    height: ${(props) => props.height * 2}px;
  }
`;

const LogoContainer = styled.div`
  width: 100%;
`;

const StyledExternalLinkIcon = styled(ExternalLinkIcon)`
  margin-left: 4px;
`;
export enum ClaimRbnPageEnum {
  CLAIM_RBN,
  TRANSACTION_STEP,
  SUCCESS_STEP,
}

interface ClaimRbnProps {
  setRbnClaimStep: (step: ClaimRbnPageEnum) => void;
  onHide: () => void;
}

export const ClaimRbn: React.FC<ClaimRbnProps> = ({
  setRbnClaimStep,
  onHide,
}) => {
  const { pendingTransactions, addPendingTransaction } =
    usePendingTransactions();

  const [txhash, setTxhash] = useState("");
  const { account } = useWeb3Wallet();
  const { loading, accountBalances } = useVaultAccountBalances();
  const claimableRbn = accountBalances.rbnClaimable;
  const claimedRbn = accountBalances.rbnClaimed;
  const poolFactory = usePoolFactoryContract();
  const [page, setPage] = useState<ClaimRbnPageEnum>(
    ClaimRbnPageEnum.CLAIM_RBN
  );

  useEffect(() => {
    // we check that the txhash and check if it had succeed
    // so we can move to successmodal
    if (page === ClaimRbnPageEnum.TRANSACTION_STEP && txhash !== "") {
      const pendingTx = pendingTransactions.find((tx) => tx.txhash === txhash);

      if (pendingTx && pendingTx.status) {
        setTimeout(() => {
          setTxhash("");
          setPage(ClaimRbnPageEnum.SUCCESS_STEP);
          setRbnClaimStep(ClaimRbnPageEnum.SUCCESS_STEP);
        }, 300);
      }
    }
  }, [pendingTransactions, txhash, page, setRbnClaimStep]);

  const handleClickClaimButton = useCallback(async () => {
    const pool = poolFactory as PoolFactory;
    if (pool !== null) {
      setPage(ClaimRbnPageEnum.TRANSACTION_STEP);
      setRbnClaimStep(ClaimRbnPageEnum.TRANSACTION_STEP);
      let addresses: string[] = [];
      VaultList.forEach((pool) => {
        addresses.push(VaultAddressMap[pool].lend);
      });
      try {
        let res: any;
        res = await pool.withdrawReward(addresses);

        const withdrawAmount = formatBigNumber(claimableRbn, 18);
        addPendingTransaction({
          txhash: res.hash,
          type: "claim",
          amount: withdrawAmount,
        });

        setTxhash(res.hash);
      } catch (e) {
        onHide();
        console.error(e);
      }
    }
  }, [
    addPendingTransaction,
    claimableRbn,
    onHide,
    poolFactory,
    setRbnClaimStep,
  ]);

  const content = useMemo(() => {
    if (page === ClaimRbnPageEnum.CLAIM_RBN) {
      return (
        <>
          <LogoContent height={160}>
            <Logo width={80} height={80} />
          </LogoContent>
          <ClaimTextContent>
            <div className="d-flex w-100 flex-row align-items-center justify-content-between">
              <StyledSecondaryText color={colors.tertiaryText}>
                Unclaimed RBN
              </StyledSecondaryText>
              <StyledTitle>
                {loading || !account
                  ? "---"
                  : formatBigNumber(claimableRbn, 18, 2)}
              </StyledTitle>
            </div>
            <div className="d-flex w-100 flex-row align-items-center justify-content-between mt-4">
              <StyledSecondaryText color={colors.tertiaryText}>
                Claimed RBN
              </StyledSecondaryText>
              <StyledTitle>
                {loading || !account
                  ? "---"
                  : formatBigNumber(claimedRbn, 18, 2)}
              </StyledTitle>
            </div>
          </ClaimTextContent>
          <RbnButtonWrapper>
            <ClaimRbnButton
              // onClick={() => setPage(ClaimRbnPageEnum.TRANSACTION_STEP)}
              onClick={() => handleClickClaimButton()}
            >
              Claim RBN
            </ClaimRbnButton>
            <LearnMoreContainer>
              <Footer>
                <a
                  href={URLS.ribbonFinance}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Learn more about RBN
                  <StyledExternalLinkIcon />
                </a>
              </Footer>
            </LearnMoreContainer>
          </RbnButtonWrapper>
        </>
      );
    }
    if (page === ClaimRbnPageEnum.TRANSACTION_STEP) {
      return (
        <>
          <TransactionStep txhash={txhash} color={getAssetColor("RBN")} />
        </>
      );
    }

    if (page === ClaimRbnPageEnum.SUCCESS_STEP) {
      return (
        <>
          <LogoContainer>
            <FrameBar color={colors.asset.RBN} position="top" height={4} />
            <LogoContent>
              <Logo width={96} height={96} />
            </LogoContent>
            <FrameBar color={colors.asset.RBN} position="bottom" height={4} />
          </LogoContainer>
          <BottomTextContainer>
            <BottomText>Thank you for being part of the community</BottomText>
          </BottomTextContainer>
        </>
      );
    }

    return <></>;
  }, [
    account,
    claimableRbn,
    claimedRbn,
    handleClickClaimButton,
    loading,
    page,
    txhash,
  ]);

  return content;
};
