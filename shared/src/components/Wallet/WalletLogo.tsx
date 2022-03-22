import React from "react";
import {
  MetamaskIcon,
  PhantomIcon,
  SolflareIcon,
  WalletConnectIcon,
  WalletLinkIcon,
} from "../../assets/icons/connector";
import { EthereumWallet, SolanaWallet } from "../../models/wallets";
interface WalletLogoProps {
  wallet: EthereumWallet | SolanaWallet;
}

const WalletLogo: React.FC<WalletLogoProps> = ({ wallet }) => {
  switch (wallet) {
    case EthereumWallet.Metamask:
      return <MetamaskIcon width={40} height={40} />;
    case EthereumWallet.WalletConnect:
      return <WalletConnectIcon width={40} height={40} />;
    case EthereumWallet.WalletLink:
      return <WalletLinkIcon width={40} height={40} />;
    case SolanaWallet.Phantom:
      return <PhantomIcon width={40} height={40} />;
    case SolanaWallet.Solflare:
      return <SolflareIcon width={40} height={40} />;
    default:
      return null;
  }
};

export default WalletLogo;
