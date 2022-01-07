import { Web3ReactProvider } from "@web3-react/core";
import React, { useEffect } from "react";
import smoothscroll from "smoothscroll-polyfill";

import { SubgraphDataContextProvider } from "shared/lib/hooks/subgraphDataContext";
import RootApp from "./components/RootApp";
import { Web3ContextProvider } from "shared/lib/hooks/web3Context";
import { getLibrary } from "shared/lib/utils/getLibrary";
import { ExternalAPIDataContextProvider } from "shared/lib/hooks/externalAPIDataContext";
import { Web3DataContextProvider } from "shared/lib/hooks/web3DataContext";

function App() {
  useEffect(() => {
    smoothscroll.polyfill();
  }, []);

  return (
    <Web3ContextProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3DataContextProvider>
          <SubgraphDataContextProvider>
            <ExternalAPIDataContextProvider>
              <RootApp />
            </ExternalAPIDataContextProvider>
          </SubgraphDataContextProvider>
        </Web3DataContextProvider>
      </Web3ReactProvider>
    </Web3ContextProvider>
  );
}

export default App;
