import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { LAST_CONNECTED_WALLET_LOCAL_STORAGE_KEY } from "../utils/wallet/connectors";
import { metaMask } from "../utils/wallet/connectors/metamask";
import { walletConnectV2 } from "../utils/wallet/connectors/walletConnectV2";
import { coinbaseWallet } from "../utils/wallet/connectors/coinbaseWallet";
import { EthereumWallet, Wallet } from "../models/wallets";

const useEagerConnect = () => {
  const { isActive } = useWeb3React();

  const [tried, setTried] = useState(false);

  useEffect(() => {
    if (tried) {
      return;
    }

    const lastConnectedWalletString = localStorage.getItem(
      LAST_CONNECTED_WALLET_LOCAL_STORAGE_KEY
    );
    const lastConnectedWallet: Wallet | undefined = Number.isNaN(
      Number(lastConnectedWalletString)
    )
      ? undefined
      : (Number(lastConnectedWalletString) as Wallet);

    // Connects to last connected connector if valid
    const promises: Promise<any>[] = [];
    switch (lastConnectedWallet) {
      case EthereumWallet.Metamask:
        promises.push(metaMask.connectEagerly?.());
        break;
      case EthereumWallet.WalletConnect:
        promises.push(walletConnectV2.connectEagerly?.());
        break;
      case EthereumWallet.WalletLink:
        promises.push(coinbaseWallet.connectEagerly?.());
        break;
      default:
        break;
    }
    Promise.all(promises).catch(() => {
      setTried(true);
    });
  }, [tried]); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && isActive) {
      setTried(true);
    }
  }, [tried, isActive]);

  return tried;
};
export default useEagerConnect;