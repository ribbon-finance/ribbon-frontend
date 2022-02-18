import { Web3ReactProvider } from "@web3-react/core";
import { useEffect } from "react";
import smoothscroll from "smoothscroll-polyfill";
import {
  getPhantomWallet,
  getSolflareWallet,
} from "@solana/wallet-adapter-wallets";
import { WalletProvider as SolanaWalletProvider } from "@solana/wallet-adapter-react";

import RootApp from "./components/RootApp";
import { Web3ContextProvider } from "shared/lib/hooks/web3Context";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import { getLibrary } from "shared/lib/utils/getLibrary";
import { getSolanaClusterURI } from "shared/lib/utils/env";
import { Web3DataContextProvider } from "shared/lib/hooks/web3DataContext";
import { SubgraphDataContextProvider } from "shared/lib/hooks/subgraphDataContext";
import { PendingTransactionsContextProvider } from "shared/lib/hooks/pendingTransactionsContext";
import { ExternalAPIDataContextProvider } from "shared/lib/hooks/externalAPIDataContext";
import { ChainContextProvider } from "shared/lib/hooks/chainContext";

const SOLANA_WALLETS = [getPhantomWallet(), getSolflareWallet()];

function App() {
  useEffect(() => {
    smoothscroll.polyfill();
  }, []);

  return (
    <ChainContextProvider>
      <ConnectionProvider endpoint={getSolanaClusterURI()}>
        {/* TODO: We only enable autoConnect when Solana is production ready as to not prompt the user */}
        <SolanaWalletProvider wallets={SOLANA_WALLETS} autoConnect={true}>
          <Web3ContextProvider>
            <Web3ReactProvider getLibrary={getLibrary}>
              <PendingTransactionsContextProvider>
                <Web3DataContextProvider>
                  <SubgraphDataContextProvider>
                    <ExternalAPIDataContextProvider>
                      <RootApp />
                    </ExternalAPIDataContextProvider>
                  </SubgraphDataContextProvider>
                </Web3DataContextProvider>
              </PendingTransactionsContextProvider>
            </Web3ReactProvider>
          </Web3ContextProvider>
        </SolanaWalletProvider>
      </ConnectionProvider>
    </ChainContextProvider>
  );
}

export default App;
