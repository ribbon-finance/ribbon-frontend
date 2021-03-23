export type connectorType = "metamask" | "walletConnect";

export interface ConnectorButtonProps {
  status: "normal" | "initializing" | "neglected";
}
