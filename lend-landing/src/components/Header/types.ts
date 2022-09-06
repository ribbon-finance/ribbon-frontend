export interface NavItemProps {
  isSelected: boolean;
}

export interface MobileMenuOpenProps {
  isMenuOpen: boolean;
}

export interface AccountStatusVariantProps {
  variant: "desktop" | "mobile";
}

export interface WalletStatusProps {}

export type WalletButtonProps = AccountStatusVariantProps &
  WalletStatusProps & {
    isMenuOpen: boolean;
  };

export type connectorType = "metamask" | "walletConnect";

export interface ConnectorButtonProps {
  status: "normal" | "initializing" | "neglected" | "connected";
}

export interface MenuStateProps {
  isMenuOpen: boolean;
}

export interface WalletCopyIconProps {
  state: "visible" | "hiding" | "hidden";
}
