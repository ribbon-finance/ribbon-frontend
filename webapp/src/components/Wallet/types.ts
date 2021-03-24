export interface AccountStatusVariantProps {
  variant: "desktop" | "mobile";
}

export interface WalletStatusProps {
  connected: boolean;
}

export type WalletButtonProps = AccountStatusVariantProps & WalletStatusProps;

export type connectorType = "metamask" | "walletConnect";

export interface ConnectorButtonProps {
  status: "normal" | "initializing" | "neglected";
}

export interface MenuStateProps {
  isMenuOpen: boolean;
}
