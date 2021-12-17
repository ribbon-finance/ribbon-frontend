import { Web3ReactProvider } from "@web3-react/core";
import { useEffect } from "react";
import smoothscroll from "smoothscroll-polyfill";

import RootApp from "./components/RootApp";
import { Web3ContextProvider } from "./hooks/web3Context";
import { getLibrary } from "shared/lib/utils/getLibrary";
import { Web3DataContextProvider } from "./hooks/web3DataContext";
import { SubgraphDataContextProvider } from "./hooks/subgraphDataContext";
import { PendingTransactionsContextProvider } from "./hooks/pendingTransactionsContext";
import { AssetPriceContextProvider } from "./hooks/assetPriceContext";

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
              <AssetPriceContextProvider>
                <RootApp />
              </AssetPriceContextProvider>
            </SubgraphDataContextProvider>
          </Web3DataContextProvider>
        </PendingTransactionsContextProvider>
      </Web3ReactProvider>
    </Web3ContextProvider>
  );
}

export default App;
