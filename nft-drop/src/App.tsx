import { Web3ReactProvider } from "@web3-react/core";
import React, { useEffect } from "react";
import smoothscroll from "smoothscroll-polyfill";

import RootApp from "./components/RootApp";
import { Web3ContextProvider } from "shared/lib/hooks/web3Context";
import { getLibrary } from "shared/lib/utils/getLibrary";
import { NFTDataContextProvider } from "./hooks/nftDataContext";

function App() {
  useEffect(() => {
    smoothscroll.polyfill();
  }, []);

  return (
    <Web3ContextProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <NFTDataContextProvider>
          <RootApp />
        </NFTDataContextProvider>
      </Web3ReactProvider>
    </Web3ContextProvider>
  );
}

export default App;
