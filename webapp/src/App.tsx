import { Web3ReactProvider } from "@web3-react/core";
import { useEffect } from "react";
import smoothscroll from "smoothscroll-polyfill";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletProvider as SolanaWalletProvider } from "@solana/wallet-adapter-react";
import RootApp from "./components/RootApp";
import { Web3ContextProvider } from "shared/lib/hooks/web3Context";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import { getSolanaClusterURI } from "shared/lib/utils/nodeEnv";
import { SubgraphDataContextProvider } from "shared/lib/hooks/subgraphDataContext";
import { PendingTransactionsContextProvider } from "shared/lib/hooks/pendingTransactionsContextProvider";
import { ExternalAPIDataContextProvider } from "shared/lib/hooks/externalAPIDataContext";
import { ChainContextProvider } from "shared/lib/hooks/chainContext";
import { GeofenceCountry, useGeofence } from "shared/lib/hooks/useGeofence";
import TextPreview from "shared/lib/components/TextPreview/TextPreview";
import Geoblocked from "shared/lib/components/Geoblocked/Geoblocked";
import { LoadingText } from "shared/lib/hooks/useLoadingText";
import { allConnectors } from "shared/lib/utils/wallet/connectors";
import "shared/lib/i18n/config";

const SOLANA_WALLETS = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
];

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
        <SolanaWalletProvider wallets={SOLANA_WALLETS} autoConnect={false}>
          <Web3ContextProvider>
            <Web3ReactProvider connectors={allConnectors}>
              <PendingTransactionsContextProvider>
                <SubgraphDataContextProvider>
                  <ExternalAPIDataContextProvider>
                    <RootApp />
                  </ExternalAPIDataContextProvider>
                </SubgraphDataContextProvider>
              </PendingTransactionsContextProvider>
            </Web3ReactProvider>
          </Web3ContextProvider>
        </SolanaWalletProvider>
      </ConnectionProvider>
    </ChainContextProvider>
  );
}

export default App;
