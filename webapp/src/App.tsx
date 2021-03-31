import { Web3ReactProvider } from "@web3-react/core";

import RootApp from "./components/RootApp";
import { Web3ContextProvider } from "./hooks/web3Context";
import { getLibrary } from "./utils/getLibrary";

function App() {
  return (
    <Web3ContextProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <RootApp />
      </Web3ReactProvider>
    </Web3ContextProvider>
  );
}

export default App;
