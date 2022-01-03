import { Web3ReactProvider } from "@web3-react/core";
import { useEffect } from "react";
import smoothscroll from "smoothscroll-polyfill";

import RootApp from "./components/RootApp";
import { Web3ContextProvider } from "shared/lib/hooks/web3Context";
import { getLibrary } from "shared/lib/utils/getLibrary";
import { Web3DataContextProvider } from "shared/lib/hooks/web3DataContext";
import { SubgraphDataContextProvider } from "shared/lib/hooks/subgraphDataContext";
import { PendingTransactionsContextProvider } from "shared/lib/hooks/pendingTransactionsContext";
import { ExternalAPIDataContextProvider } from "shared/lib/hooks/externalAPIDataContext";

function App() {
  useEffect(() => {
    smoothscroll.polyfill();
  }, []);

  return (
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
  );
}

export default App;
