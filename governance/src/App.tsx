import { Web3ReactProvider } from "@web3-react/core";
import React, { useEffect } from "react";
import smoothscroll from "smoothscroll-polyfill";

import { SubgraphDataContextProvider } from "shared/lib/hooks/subgraphDataContext";
import RootApp from "./components/RootApp";
import { Web3ContextProvider } from "shared/lib/hooks/web3Context";
import { getLibrary } from "shared/lib/utils/getLibrary";
import { ExternalAPIDataContextProvider } from "shared/lib/hooks/externalAPIDataContext";
import { Web3DataContextProvider } from "shared/lib/hooks/web3DataContext";
import { PendingTransactionsContextProvider } from "shared/lib/hooks/pendingTransactionsContext";
import { ChainContextProvider } from "shared/lib/hooks/chainContext";

function App() {
  useEffect(() => {
    smoothscroll.polyfill();
  }, []);

  return (
    <ChainContextProvider>
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
    </ChainContextProvider>
  );
}

export default App;
