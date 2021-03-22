import WalletConnectProvider from "@walletconnect/web3-provider";

export const getProviderOption = () => {
  return {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: "INFURA_ID", // TODO: Fill in Infura ID
      },
    },
  };
};
