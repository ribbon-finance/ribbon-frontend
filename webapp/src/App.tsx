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
import { GeofenceCountry, useGeofence } from "shared/lib/hooks/useGeofence";
import TextPreview from "shared/lib/components/TextPreview/TextPreview";
import Geoblocked from "shared/lib/components/Geoblocked/Geoblocked";
import { LoadingText } from "shared/lib/hooks/useLoadingText";
import "shared/lib/i18n/config";
import { DeribitContextProvider } from "./hooks/deribitContext";
const SOLANA_WALLETS = [getPhantomWallet(), getSolflareWallet()];

function App() {
  const { loading, rejected } = useGeofence(GeofenceCountry.SINGAPORE);
  useEffect(() => {
    smoothscroll.polyfill();
  }, []);

  if (loading) {
    return (
      <TextPreview>
        <LoadingText>Ribbon Finance</LoadingText>
      </TextPreview>
    );
  } else if (!loading && rejected) {
    return <Geoblocked />;
  }

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
                      <DeribitContextProvider>
                        <RootApp />
                      </DeribitContextProvider>
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
