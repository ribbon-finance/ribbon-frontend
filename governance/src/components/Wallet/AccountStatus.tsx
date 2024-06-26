import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

import Indicator from "shared/lib/components/Indicator/Indicator";
import sizes from "shared/lib/designSystem/sizes";
import { Title, BaseButton } from "shared/lib/designSystem";
import { addConnectEvent } from "shared/lib/utils/analytics";
import colors from "shared/lib/designSystem/colors";
import {
  WalletStatusProps,
  AccountStatusVariantProps,
  WalletButtonProps,
  WalletCopyIconProps,
} from "shared/lib/components/Wallet/types";
import theme from "shared/lib/designSystem/theme";
import MobileOverlayMenu from "shared/lib/components/Common/MobileOverlayMenu";
import { copyTextToClipboard } from "shared/lib/utils/text";
import useOutsideAlerter from "shared/lib/hooks/useOutsideAlerter";
import useConnectWalletModal from "shared/lib/hooks/useConnectWalletModal";
import ButtonArrow from "shared/lib/components/Common/ButtonArrow";
import { truncateAddress } from "shared/lib/utils/address";
import useENSSearch from "shared/lib/hooks/useENSSearch";
import { useGovernanceGlobalState } from "../../store/store";
import useTokenAllowance from "shared/lib/hooks/useTokenAllowance";
import { VotingEscrowAddress } from "shared/lib/constants/constants";
import { useRBNTokenAccount } from "shared/lib/hooks/useRBNTokenSubgraph";
import moment from "moment";
import { BigNumber } from "ethers";
import useWeb3Wallet from "shared/lib/hooks/useWeb3Wallet";
import { MenuCloseItem, MenuItem } from "shared/lib/components/Menu/MenuItem";
import DesktopFloatingMenu from "shared/lib/components/Menu/DesktopFloatingMenu";
import AirdropButton from "./Airdrop/AirdropButton";
import AirdropModal from "./Airdrop/AirdropModal";

const walletButtonWidth = 55;

const WalletContainer = styled.div<AccountStatusVariantProps>`
  justify-content: center;
  align-items: center;

  ${(props) => {
    switch (props.variant) {
      case "desktop":
        return `
        display: flex;
        z-index: 1000;
        position: relative;

        @media (max-width: ${sizes.lg}px) {
          padding-right: 40px;
        }

        @media (max-width: ${sizes.md}px) {
          display: none;
        }
        `;
      case "mobile":
        return `
          display: none;

          @media (max-width: ${sizes.md}px) {
            flex: 1;
            display: flex;
            align-items: unset;
            padding: 16px 16px 0 16px;
            width: 100%;
            background-color: ${colors.background.two};
          }
        `;
    }
  }}
`;

const WalletButton = styled(BaseButton)<WalletButtonProps>`
  background-color: ${(props) =>
    props.connected ? colors.background.two : `${colors.green}14`};
  align-items: center;
  height: 48px;

  &:hover {
    opacity: ${theme.hover.opacity};
  }

  ${(props) => {
    switch (props.variant) {
      case "mobile":
        return `
        height: 48px;
        justify-content: center;
        padding: 14px 16px;
        width: ${props.showInvestButton ? `${walletButtonWidth}%` : "90%"};
        background-color: ${props.connected ? "#08090E" : `${colors.green}14`};
      `;
      case "desktop":
        return ``;
    }
  }}
`;

const WalletButtonText = styled(Title)<WalletStatusProps>`
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

const WalletMobileOverlayMenu = styled(
  MobileOverlayMenu
)<AccountStatusVariantProps>`
  display: none;

  ${(props) => {
    switch (props.variant) {
      case "mobile":
        return `
          @media (max-width: ${sizes.md}px) {
            display: flex;
            z-index: ${props.isMenuOpen ? 50 : -1};
          }
        `;
      case "desktop":
        return ``;
    }
  }}
`;

const WalletCopyIcon = styled.i<WalletCopyIconProps>`
  color: white;
  margin-left: 8px;
  transition: 0.1s all ease-out;

  ${(props) => {
    switch (props.state) {
      case "visible":
        return `
          opacity: 1;
        `;
      case "hiding":
        return `
          opacity: 0;
        `;
      case "hidden":
        return `
          visibility: hidden;
          height: 0;
          width: 0;
          opacity: 0;
        `;
    }
  }}
`;

const StakeUnstakeContainer = styled.div`
  display: none;

  @media (max-width: ${sizes.md}px) {
    display: flex;
    padding-left: 8px;
  }
`;

const MobileStakingButton = styled(BaseButton)<{
  variant: "stake" | "unstake";
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: fit-content;
  width: 80px;
  background: ${({ variant }) =>
    variant === "stake" ? `${colors.red}1F` : "rgba(255, 255, 255, 0.08)"};
  color: ${({ variant }) => (variant === "stake" ? colors.red : "white")};
  padding: 14px 0;
  border-radius: 8px;

  margin-left: ${({ variant }) => (variant === "stake" ? "0" : "8px")};

  &:hover {
    opacity: ${theme.hover.opacity};
  }
`;

// No arrows on mobile
const GovernanceButtonArrow = styled(ButtonArrow)`
  @media (max-width: ${sizes.md}px) {
    display: none;
  }
`;

interface AccountStatusProps {
  variant: "desktop" | "mobile";
}

const AccountStatus: React.FC<AccountStatusProps> = ({ variant }) => {
  const {
    ethereumConnector,
    deactivate: deactivateWeb3,
    ethereumProvider,
    isLedgerLive,
    active,
    account,
  } = useWeb3Wallet();
  const rbnAllowance =
    useTokenAllowance("rbn", VotingEscrowAddress) || BigNumber.from(0);
  const { data: rbnTokenAccount } = useRBNTokenAccount();
  const [, setShowConnectModal] = useConnectWalletModal();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copyState, setCopyState] = useState<"visible" | "hiding" | "hidden">(
    "hidden"
  );
  const [showAirdropModal, setShowAirdropModal] = useState(false);

  const { data: ensData } = useENSSearch(account || "");

  const [, setStakingModal] = useGovernanceGlobalState("stakingModal");
  const [, setUnstakingModal] = useGovernanceGlobalState("unstakingModal");

  const stakeMode = useMemo(() => {
    if (rbnAllowance.isZero()) {
      return "approve";
    }

    if (
      rbnTokenAccount &&
      rbnTokenAccount.lockEndTimestamp &&
      moment().isBefore(moment.unix(rbnTokenAccount.lockEndTimestamp))
    ) {
      return "increase";
    }

    return "stake";
  }, [rbnAllowance, rbnTokenAccount]);

  // Track clicked area outside of desktop menu
  const desktopMenuRef = useRef(null);
  useOutsideAlerter(desktopMenuRef, () => {
    if (variant === "desktop" && isMenuOpen) onCloseMenu();
  });

  useEffect(() => {
    if (ethereumProvider && account) {
      addConnectEvent("header", account);
    }
  }, [ethereumProvider, account]);

  useEffect(() => {
    let timer;

    switch (copyState) {
      case "visible":
        timer = setTimeout(() => {
          setCopyState("hiding");
        }, 800);
        break;
      case "hiding":
        timer = setTimeout(() => {
          setCopyState("hidden");
        }, 200);
    }

    if (timer) clearTimeout(timer);
  }, [copyState]);

  const onToggleMenu = useCallback(() => {
    setIsMenuOpen((open) => !open);
  }, []);

  const handleButtonClick = useCallback(async () => {
    if (active) {
      onToggleMenu();
      return;
    }

    setShowConnectModal(true);
  }, [active, onToggleMenu, setShowConnectModal]);

  const onCloseMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleChangeWallet = useCallback(() => {
    setShowConnectModal(true);
    onCloseMenu();
  }, [onCloseMenu, setShowConnectModal]);

  const handleCopyAddress = useCallback(() => {
    if (account) {
      copyTextToClipboard(account);
      setCopyState("visible");
    }
  }, [account]);

  const handleOpenEtherscan = useCallback(() => {
    if (account) {
      window.open(`https://etherscan.io/address/${account}`);
    }
  }, [account]);

  const handleDisconnect = useCallback(async () => {
    if (ethereumConnector instanceof WalletConnectConnector) {
      ethereumConnector.close();
    }
    deactivateWeb3();
    onCloseMenu();
  }, [deactivateWeb3, onCloseMenu, ethereumConnector]);

  const renderButtonContent = () =>
    active && account ? (
      <>
        <Indicator connected={active} />
        <WalletButtonText connected={active}>
          {ensData?.name || truncateAddress(account)}{" "}
          <GovernanceButtonArrow isOpen={isMenuOpen} />
        </WalletButtonText>
      </>
    ) : (
      <WalletButtonText connected={active}>CONNECT WALLET</WalletButtonText>
    );

  const renderCopiedButton = () => {
    return <WalletCopyIcon className="far fa-clone" state={copyState} />;
  };

  return (
    <>
      <AirdropModal
        show={showAirdropModal}
        onClose={() => setShowAirdropModal(false)}
      />

      {/* Main Button and Desktop Menu */}
      <WalletContainer variant={variant} ref={desktopMenuRef}>
        <WalletButton
          variant={variant}
          connected={active}
          role="button"
          onClick={handleButtonClick}
        >
          {renderButtonContent()}
        </WalletButton>
        {active && account && (
          <StakeUnstakeContainer>
            <MobileStakingButton
              role="button"
              variant="stake"
              onClick={() =>
                setStakingModal((prev) => ({
                  ...prev,
                  show: true,
                  mode: stakeMode,
                }))
              }
            >
              <Title fontSize={14} color={colors.red}>
                {stakeMode === "approve" ? "Approve" : "Lock"}
              </Title>
            </MobileStakingButton>
            <MobileStakingButton
              role="button"
              variant="unstake"
              onClick={() => {
                setUnstakingModal((prev) => ({ ...prev, show: true }));
              }}
            >
              <Title fontSize={14}>UNLOCK</Title>
            </MobileStakingButton>
          </StakeUnstakeContainer>
        )}

        <DesktopFloatingMenu isOpen={isMenuOpen}>
          <MenuItem title="CHANGE WALLET" onClick={handleChangeWallet} />
          <MenuItem
            title={copyState === "hidden" ? "COPY ADDRESS" : "ADDRESS COPIED"}
            onClick={handleCopyAddress}
            extra={renderCopiedButton()}
          />
          <MenuItem title="OPEN IN ETHERSCAN" onClick={handleOpenEtherscan} />
          {/* Only shows disconnect if not embedded in ledger live */}
          {!isLedgerLive && (
            <MenuItem title="DISCONNECT" onClick={handleDisconnect} />
          )}

          <AirdropButton onClick={() => setShowAirdropModal(true)} />
        </DesktopFloatingMenu>
      </WalletContainer>

      {/* Mobile Menu */}
      <WalletMobileOverlayMenu
        className="flex-column align-items-center justify-content-center"
        isMenuOpen={isMenuOpen}
        onClick={onCloseMenu}
        variant={variant}
        mountRoot="div#root"
        overflowOnOpen={false}
      >
        <MenuItem title="CHANGE WALLET" onClick={handleChangeWallet} />
        <MenuItem
          title={copyState === "hidden" ? "COPY ADDRESS" : "ADDRESS COPIED"}
          onClick={handleCopyAddress}
          extra={renderCopiedButton()}
        />
        <MenuItem title="OPEN IN ETHERSCAN" onClick={handleOpenEtherscan} />
        {/* Only shows disconnect if not embedded in ledger live */}
        {!isLedgerLive && (
          <MenuItem title="DISCONNECT" onClick={handleDisconnect} />
        )}
        <MenuCloseItem onClose={onCloseMenu} />
      </WalletMobileOverlayMenu>
    </>
  );
};
export default AccountStatus;
