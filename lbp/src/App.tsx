import React, { useEffect } from "react";
import { Web3ReactProvider } from "@web3-react/core";
import smoothscroll from "smoothscroll-polyfill";

import { Web3ContextProvider } from "shared/lib/hooks/web3Context";
import { getLibrary } from "shared/lib/utils/getLibrary";
import RootApp from "./components/RootApp";

function App() {
  useEffect(() => {
    smoothscroll.polyfill();
  }, []);

  return (
    <Web3ContextProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <RootApp />
      </Web3ReactProvider>
    </Web3ContextProvider>
  );
}

export default App;
