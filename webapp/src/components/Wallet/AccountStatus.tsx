import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";
import { setTimeout } from "timers";
import { AnimatePresence, motion } from "framer";

import Indicator from "shared/lib/components/Indicator/Indicator";
import sizes from "shared/lib/designSystem/sizes";
import { Title, BaseButton } from "shared/lib/designSystem";
import { addConnectEvent } from "shared/lib/utils/analytics";
import colors from "shared/lib/designSystem/colors";
import {
  WalletStatusProps,
  AccountStatusVariantProps,
  WalletButtonProps,
  MenuStateProps,
  WalletCopyIconProps,
} from "shared/lib/components/Wallet/types";
import theme from "shared/lib/designSystem/theme";
import MobileOverlayMenu from "shared/lib/components/Common/MobileOverlayMenu";
import MenuButton from "shared/lib/components/Common/MenuButton";
import { copyTextToClipboard } from "shared/lib/utils/text";
import useOutsideAlerter from "shared/lib/hooks/useOutsideAlerter";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { ActionButton } from "shared/lib/components/Common/buttons";
import ActionModal from "../Vault/VaultActionsForm/Modal/ActionModal";
import useConnectWalletModal from "shared/lib/hooks/useConnectWalletModal";
import useENS from "shared/lib/hooks/useENS";
import ButtonArrow from "shared/lib/components/Common/ButtonArrow";
import {
  BLOCKCHAIN_EXPLORER_NAME,
  BLOCKCHAIN_EXPLORER_URI,
  getAssets,
  VaultList,
  VaultOptions,
  VaultVersion,
} from "shared/lib/constants/constants";
import { CHAINID } from "shared/lib/utils/env";
import { getVaultColor } from "shared/lib/utils/vault";
import { truncateAddress } from "shared/lib/utils/address";
import { useVaultData } from "shared/lib/hooks/web3DataContext";
import useVaultAccounts from "shared/lib/hooks/useVaultAccounts";

import { isPracticallyZero } from "shared/lib/utils/math";
import { getAssetDecimals } from "shared/lib/utils/asset";
import YourPosition from "shared/lib/components/Vault/YourPosition";
import AirdropButton from "../Airdrop/AirdropButton";
import AirdropModal from "../Airdrop/AirdropModal";

const walletButtonMarginLeft = 5;
const walletButtonWidth = 55;
const investButtonWidth = 30;
const investButtonMarginLeft =
  100 - walletButtonMarginLeft * 2 - walletButtonWidth - investButtonWidth;

const AccountStatusContainer = styled.div<AccountStatusVariantProps>`
  flex-wrap: wrap;
  flex-direction: column;

  ${(props) => {
    switch (props.variant) {
      case "mobile":
        return `
          display: none;

          @media (max-width: ${sizes.md}px) {
            display: flex;
            width: 100%;
          }
        `;
      case "desktop":
        return `
          display: flex;
        `;
    }
  }}
`;

const WalletContainer = styled.div<AccountStatusVariantProps>`
  justify-content: center;
  align-items: center;

  ${(props) => {
    switch (props.variant) {
      case "desktop":
        return `
        display: flex;
        padding-right: 40px;
        z-index: 1000;
        position: relative;

        @media (max-width: ${sizes.md}px) {
          display: none;
        }
        `;
      case "mobile":
        return `
          display: none;

          @media (max-width: ${sizes.md}px) {
            display: flex;
            align-items: unset;
            padding-top: 16px;
            width: 100%;
          }
        `;
    }
  }}
`;

const WalletButton = styled(BaseButton)<WalletButtonProps>`
  background-color: ${(props) =>
    props.connected ? colors.background.two : `${colors.green}14`};
  align-items: center;
  height: fit-content;

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

const InvestButton = styled(ActionButton)`
  margin-left: ${investButtonMarginLeft}%;
  width: ${investButtonWidth}%;
  height: 48px;
  border-radius: ${theme.border.radius};
`;

const WalletDesktopMenu = styled(motion.div)<MenuStateProps>`
  ${(props) =>
    props.isMenuOpen
      ? `
          position: absolute;
          right: 40px;
          top: 64px;
          width: fit-content;
          background-color: ${colors.background.two};
          border-radius: ${theme.border.radius};
        `
      : `
          display: none;
        `}

  @media (max-width: ${sizes.md}px) {
    display: none;
  }
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

const MenuItem = styled.div`
  padding: 8px 16px;
  padding-right: 38px;
  opacity: 1;
  display: flex;
  align-items: center;

  &:first-child {
    padding-top: 16px;
  }

  &:last-child {
    padding-bottom: 16px;
  }

  &:hover {
    span {
      color: ${colors.primaryText};
    }
  }

  @media (max-width: ${sizes.md}px) {
    margin: unset;
    && {
      padding: 28px;
    }
  }
`;

const MenuItemText = styled(Title)`
  color: ${colors.primaryText}A3;
  white-space: nowrap;
  font-size: 14px;
  line-height: 20px;

  @media (max-width: ${sizes.md}px) {
    font-size: 24px;
  }
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

const MenuCloseItem = styled(MenuItem)`
  position: absolute;
  bottom: 50px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const AirdropMenuItem = styled(MenuItem)`
  padding: 8px 8px;
`;

interface AccountStatusProps {
  vault?: {
    vaultOption: VaultOptions;
    vaultVersion: VaultVersion;
  };
  variant: "desktop" | "mobile";
  showVaultPositionHook?: (show: boolean) => void;
}

const AccountStatus: React.FC<AccountStatusProps> = ({
  vault,
  variant,
  showVaultPositionHook,
}) => {
  const {
    connector,
    deactivate: deactivateWeb3,
    library,
    active,
    account,
    chainId,
  } = useWeb3React();
  const [, setShowConnectModal] = useConnectWalletModal();
  const [showActionModal, setShowActionModal] = useState(false);
  const [showAirdropModal, setShowAirdropModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copyState, setCopyState] = useState<"visible" | "hiding" | "hidden">(
    "hidden"
  );
  const { ensName } = useENS(account || "");
  const { status, vaultLimit } = useVaultData(
    vault?.vaultOption || VaultList[0]
  );
  const { vaultAccounts: v1VaultAccounts, loading: v1VaultAccountsLoading } =
    useVaultAccounts("v1");

  // Track clicked area outside of desktop menu
  const desktopMenuRef = useRef(null);
  useOutsideAlerter(desktopMenuRef, () => {
    if (variant === "desktop" && isMenuOpen) onCloseMenu();
  });

  useEffect(() => {
    if (library && account) {
      addConnectEvent("header", account);
    }
  }, [library, account]);

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

  const onShowAirdropModal = useCallback(() => {
    setIsMenuOpen(false);
    setShowAirdropModal(true);
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
    if (account && chainId) {
      window.open(`${BLOCKCHAIN_EXPLORER_URI[chainId]}/address/${account}`);
    }
  }, [account, chainId]);

  const handleDisconnect = useCallback(async () => {
    if (connector instanceof WalletConnectConnector) {
      connector.close();
    }
    deactivateWeb3();
    onCloseMenu();
  }, [deactivateWeb3, onCloseMenu, connector]);

  const onCloseActionsModal = useCallback(() => {
    setShowActionModal(false);
  }, [setShowActionModal]);

  const handleInvestButtonClick = () => {
    setShowActionModal(true);
  };

  const renderButtonContent = () =>
    active && account ? (
      <>
        <Indicator connected={active} />
        <WalletButtonText connected={active}>
          {ensName || truncateAddress(account)}{" "}
          <ButtonArrow isOpen={isMenuOpen} />
        </WalletButtonText>
      </>
    ) : (
      <WalletButtonText connected={active}>CONNECT WALLET</WalletButtonText>
    );

  const renderMenuItem = (
    title: string,
    onClick?: () => void,
    extra?: React.ReactNode
  ) => {
    return (
      <MenuItem onClick={onClick} role="button">
        <MenuItemText>{title}</MenuItemText>
        {extra}
      </MenuItem>
    );
  };

  const renderCopiedButton = () => {
    return <WalletCopyIcon className="far fa-clone" state={copyState} />;
  };

  const formModal = useMemo(
    () =>
      vault ? (
        <ActionModal
          vault={vault}
          variant="mobile"
          show={showActionModal}
          onClose={onCloseActionsModal}
        />
      ) : null,
    [vault, showActionModal, onCloseActionsModal]
  );

  return (
    <AccountStatusContainer variant={variant}>
      {vault && (
        <YourPosition
          vault={vault}
          variant="mobile"
          onShowHook={showVaultPositionHook}
        />
      )}

      {/* Main Button and Desktop Menu */}
      <WalletContainer variant={variant} ref={desktopMenuRef}>
        <WalletButton
          variant={variant}
          showInvestButton={vault !== undefined}
          connected={active}
          role="button"
          onClick={handleButtonClick}
        >
          {renderButtonContent()}
        </WalletButton>
        {vault && (
          <InvestButton
            onClick={handleInvestButtonClick}
            color={getVaultColor(vault.vaultOption)}
          >
            {(status !== "loading" &&
              vault.vaultVersion === "v1" &&
              vaultLimit.isZero()) ||
            (!v1VaultAccountsLoading &&
              vault.vaultVersion === "v2" &&
              v1VaultAccounts[vault.vaultOption] &&
              !isPracticallyZero(
                v1VaultAccounts[vault.vaultOption]!.totalBalance,
                getAssetDecimals(getAssets(vault.vaultOption))
              ))
              ? "Migrate"
              : "Invest"}
          </InvestButton>
        )}
        <AnimatePresence>
          <WalletDesktopMenu
            key={isMenuOpen.toString()}
            isMenuOpen={isMenuOpen}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 20,
            }}
            transition={{
              type: "keyframes",
              duration: 0.2,
            }}
          >
            {renderMenuItem("CHANGE WALLET", handleChangeWallet)}
            {renderMenuItem(
              copyState === "hidden" ? "COPY ADDRESS" : "ADDRESS COPIED",
              handleCopyAddress,
              renderCopiedButton()
            )}
            {chainId &&
              renderMenuItem(
                `OPEN IN ${BLOCKCHAIN_EXPLORER_NAME[chainId]}`,
                handleOpenEtherscan
              )}
            {renderMenuItem("DISCONNECT", handleDisconnect)}
            {chainId === CHAINID.ETH_MAINNET && (
              <AirdropMenuItem role="button">
                <AirdropButton onClick={onShowAirdropModal}></AirdropButton>
              </AirdropMenuItem>
            )}
          </WalletDesktopMenu>
        </AnimatePresence>
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
        {renderMenuItem("CHANGE WALLET", handleChangeWallet)}
        {renderMenuItem(
          copyState === "hidden" ? "COPY ADDRESS" : "ADDRESS COPIED",
          handleCopyAddress,
          renderCopiedButton()
        )}
        {chainId &&
          renderMenuItem(
            `OPEN IN ${BLOCKCHAIN_EXPLORER_NAME[chainId]}`,
            handleOpenEtherscan
          )}
        {renderMenuItem("DISCONNECT", handleDisconnect)}
        <MenuCloseItem role="button" onClick={onCloseMenu}>
          <MenuButton isOpen={true} onToggle={onCloseMenu} />
        </MenuCloseItem>
        {chainId === CHAINID.ETH_MAINNET && (
          <AirdropMenuItem role="button">
            <AirdropButton onClick={onShowAirdropModal}></AirdropButton>
          </AirdropMenuItem>
        )}
      </WalletMobileOverlayMenu>

      {formModal}

      <AirdropModal
        show={showAirdropModal}
        onClose={() => {
          setShowAirdropModal(false);
        }}
      />
    </AccountStatusContainer>
  );
};
export default AccountStatus;
