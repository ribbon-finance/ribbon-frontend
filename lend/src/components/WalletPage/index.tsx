import { useCallback, useEffect, useMemo, useState } from "react";
import { CloseIcon } from "shared/lib/assets/icons/icons";
import { Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import { getExplorerURI } from "shared/lib/constants/constants";
import styled, { css } from "styled-components";
import ExternalLinkIcon from "../Common/ExternalLinkIcon";
import wallet from "../../assets/icons/socials/wallet.svg";
import etherscan from "../../assets/icons/socials/etherscan.svg";
import disconnect from "../../assets/icons/disconnect.svg";
import WalletLogo from "shared/lib/components/Wallet/WalletLogo";
import LearnMoreWallet from "shared/lib/components/Wallet/LearnMoreWallet";
import { Button } from "../../designSystem";
import { getAssetDecimals } from "../../utils/asset";
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
import { useAssetsBalance } from "../../hooks/web3DataContext";
import Indicator from "shared/lib/components/Indicator/Indicator";
import { truncateAddress } from "shared/lib/utils/address";
import { formatUnits } from "ethers/lib/utils";
import { useChain } from "../../hooks/chainContext";

const borderStyle = `1px solid ${colors.primaryText}1F`;

const TextContent = styled.div`
  color: ${colors.primaryText}A3;
  padding: 16px 24px;
`;

const hoveredContentRow = css`
  cursor: pointer;
  transition: 0.2s ease-in-out;
  border: 1px solid ${colors.primaryText} !important;
`;

const ContentRow = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  height: 80px;
  padding: 0 16px;
  font-size: 14px;
  transition: 0.2s ease-in-out;

  &:hover {
    cursor: pointer;
  }

  ${({ active }) => {
    if (active) return hoveredContentRow;
  }}

  > img {
    width: 32px;
    height: 32px;
    margin-right: 20px;
  }
`;

const ActionContentRow = styled(ContentRow)`
  border: 1px solid transparent;

  &:hover {
    > svg:last-of-type {
      transform: translate(4px, -4px);
    }
  }

  > svg {
    transition: all 0.2s ease-in-out;

    &:first-of-type {
      margin-right: 20px;
      height: 40px;
      width: 40px;
    }

    &:last-of-type {
      margin-left: 8px;
      width: 20px;
      height: 20px;
    }
  }
`;

const WalletContentRow = styled(ContentRow)<{ active: boolean; color: string }>`
  ${({ active, color }) => {
    if (active)
      return `
        border-color: ${color} !important;
        background-color: ${color}08;
      `;
  }}

  > svg {
    transition: all 0.2s ease-in-out;
    margin-right: 20px;
    height: 40px;
    width: 40px;
  }
`;

const ContentWrapper = styled.div`
  > ${ContentRow} {
    &:not(:last-of-type) {
      border-bottom: 1px solid ${colors.primaryText}1F;
    }
  }
`;

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
    letter-spacing: 1.5px;
  }

  span {
    color: ${colors.primaryText};
  }
`;

const AssetRow = styled.div`
  display: flex;
`;

const AssetRowWrapper = styled.div`
  padding-top: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid ${colors.primaryText}1F;
  margin-left: 16px;
  > ${AssetRow} {
    &:not(:last-of-type) {
      margin-bottom: 16px;
    }
  }
`;

const WalletButton = styled.div`
  display: flex;
  margin: auto;
  height: 100%;
  justify-content: center;
  cursor: pointer;

  > * {
    margin: auto 0;
    margin-right: 8px;
  }
`;

const Header = styled.div`
  padding-left: 24px;
  border-bottom: ${borderStyle};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  width: 80px;
  height: 80px;
  border-left: ${borderStyle};
`;

export enum WalletPageEnum {
  DISCLAIMER = "IMPORTANT",
  CONNECT_WALLET = "SELECT YOUR WALLET",
  ACCOUNT = "ACCOUNT",
}

interface WalletPageProps {
  onHide: () => void;
}

export const WalletPage = ({ onHide }: WalletPageProps) => {
  const { active, account, activate, deactivate } = useWeb3Wallet();
  const [walletStep, setWalletStep] = useState<WalletPageEnum>(
    active ? WalletPageEnum.ACCOUNT : WalletPageEnum.DISCLAIMER
  );
  const [selectedWallet, setWallet] = useState<EthereumWallet>();
  const balances = useAssetsBalance();
  const [chain] = useChain();
  useEffect(() => {
    setTimeout(() => {
      if (active) setWalletStep(WalletPageEnum.ACCOUNT);
    }, 200);
  });

  const onActivate = useCallback(async () => {
    if (selectedWallet) {
      try {
        await activate(selectedWallet as EthereumWallet, chain);
        onHide();
      } catch (error) {
        console.error(error);
      }
    }
  }, [activate, chain, onHide, selectedWallet]);

  const modalTitle = useMemo(() => {
    if (walletStep === WalletPageEnum.ACCOUNT) {
      return account ? (
        <WalletButton>
          <Indicator connected={active} /> {truncateAddress(account)}
        </WalletButton>
      ) : (
        walletStep
      );
    }

    return walletStep;
  }, [account, active, walletStep]);

  const walletHeader = useMemo(() => {
    return (
      <Header>
        <Title>{modalTitle}</Title>
        <CloseButton onClick={onHide}>
          <CloseIcon />
        </CloseButton>
      </Header>
    );
  }, [modalTitle, onHide]);

  const walletContent = useMemo(() => {
    if (walletStep === WalletPageEnum.DISCLAIMER) {
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
              onClick={() => {
                setWalletStep !== undefined &&
                  setWalletStep(WalletPageEnum.CONNECT_WALLET);
              }}
            >
              Continue
            </ContinueButton>
          </ButtonWrapper>
        </ContentWrapper>
      );
    }

    if (walletStep === WalletPageEnum.CONNECT_WALLET) {
      const walletColors = {
        [EthereumWallet.Metamask]: colors.wallets.Metamask,
        [EthereumWallet.WalletConnect]: colors.wallets.WalletConnect,
        [EthereumWallet.WalletLink]: colors.wallets.WalletLink,
      };

      return (
        <>
          <ContentWrapper>
            {ETHEREUM_WALLETS.map((wallet) => (
              <WalletContentRow
                key={wallet}
                active={selectedWallet === wallet}
                onClick={() => setWallet(wallet)}
                color={walletColors[wallet]}
              >
                <WalletLogo wallet={wallet} />
                <Title>{WALLET_TITLES[wallet]}</Title>
              </WalletContentRow>
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

    if (walletStep === WalletPageEnum.ACCOUNT) {
      const actions = [
        {
          img: wallet,
          title: "Change wallet",
          showExternalIcon: false,
          onClick: async () => {
            await deactivate().then(() => {
              setWalletStep(WalletPageEnum.CONNECT_WALLET);
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
              const decimals = getAssetDecimals(asset);

              return (
                <AssetRow>
                  <Logo height={40} width={40} />
                  <AssetStat>
                    <label>{name} Balance</label>
                    <span>
                      {currency(
                        formatUnits(balances.data[asset], decimals)
                      ).format({ symbol: "" })}
                    </span>
                  </AssetStat>
                </AssetRow>
              );
            })}
          </AssetRowWrapper>
          <ContentWrapper>
            {actions.map((action) => (
              <ActionContentRow onClick={() => action.onClick()}>
                <ContentLogoWrapper>
                  <img src={action.img} alt={action.title} />
                </ContentLogoWrapper>
                <Title>{action.title}</Title>
                {action.showExternalIcon && <ExternalLinkIcon />}
              </ActionContentRow>
            ))}
          </ContentWrapper>
        </>
      );
    }

    return <></>;
  }, [
    balances.data,
    deactivate,
    onActivate,
    onHide,
    selectedWallet,
    walletStep,
  ]);

  const walletPage = useMemo(() => {
    return (
      <>
        {walletHeader}
        {walletContent}
      </>
    );
  }, [walletContent, walletHeader]);

  return walletPage;
};
