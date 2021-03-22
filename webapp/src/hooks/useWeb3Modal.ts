import { useEffect, useState } from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";

import { getProviderOption } from "../utils/getProviderOption";

export const useWeb3Modal = () => {
  const [web3, setWeb3] = useState<Web3>();
  const [provider, setProvider] = useState<any>();
  const [accounts, setAccounts] = useState<string[]>([]);
  const [web3Modal] = useState(
    new Web3Modal({
      cacheProvider: true,
      providerOptions: getProviderOption(),
    })
  );

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      onConnect();
    }
    // Disable to ensure only run on first load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!web3) {
      return;
    }

    (async () => {
      setAccounts(await web3.eth.getAccounts());
    })();
  }, [web3]);

  const onConnect = async () => {
    const provider = await web3Modal.connect();

    await subscribeProvider(provider);
    setWeb3(new Web3(provider));
    setProvider(provider);
  };

  const onReset = async () => {
    // @ts-ignore
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      // @ts-ignore
      await web3.currentProvider.close();
    }

    await web3Modal.clearCachedProvider();
    setWeb3(undefined);
    setProvider(undefined);
    setAccounts([]);
  };

  const subscribeProvider = async (provider: any) => {
    if (!provider.on) {
      return;
    }
    provider.on("close", () => {
      // TODO: Add provider on close
    });
    provider.on("accountsChanged", async (accounts: string[]) => {
      // TODO: Handle account change
    });
    provider.on("chainChanged", async (chainId: number) => {
      // TODO: Handle chain changed
    });

    provider.on("networkChanged", async (networkId: number) => {
      // TODO: Handle network changed
    });
  };

  return { web3, web3Modal, accounts, provider, onConnect, onReset };
};
