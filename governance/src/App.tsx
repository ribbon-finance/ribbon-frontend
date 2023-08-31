import { Web3ReactProvider } from "@web3-react/core";
import { useEffect } from "react";
import smoothscroll from "smoothscroll-polyfill";
import "shared/lib/i18n/config";

import { SubgraphDataContextProvider } from "shared/lib/hooks/subgraphDataContext";
import RootApp from "./components/RootApp";
import { Web3ContextProvider } from "shared/lib/hooks/web3Context";
import { ExternalAPIDataContextProvider } from "shared/lib/hooks/externalAPIDataContext";
import { Web3DataContextProvider } from "shared/lib/hooks/web3DataContext";
import { PendingTransactionsContextProvider } from "shared/lib/hooks/pendingTransactionsContext";
import { ChainContextProvider } from "shared/lib/hooks/chainContext";
import { GeofenceCountry, useGeofence } from "shared/lib/hooks/useGeofence";
import TextPreview from "shared/lib/components/TextPreview/TextPreview";
import Geoblocked from "shared/lib/components/Geoblocked/Geoblocked";
import { LoadingText } from "shared/lib/hooks/useLoadingText";
import { allConnectors } from "shared/lib/utils/wallet/connectors";

function App() {
  const { loading, rejected } = useGeofence(GeofenceCountry.SINGAPORE);
  useEffect(() => {
    smoothscroll.polyfill();
  }, []);

  if (loading) {
    return (
      <TextPreview>
        <LoadingText>Ribbon Finance Governance</LoadingText>
      </TextPreview>
    );
  } else if (!loading && rejected) {
    return <Geoblocked />;
  }

  return (
    <ChainContextProvider>
      <Web3ContextProvider>
        <Web3ReactProvider connectors={allConnectors}>
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
    </ChainContextProvider>
  );
}

export default App;
