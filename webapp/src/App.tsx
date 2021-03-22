import { BrowserRouter as Router } from "react-router-dom";
import { Web3ReactProvider } from "@web3-react/core";

import Header from "./components/Header";
import { Web3ContextProvider } from "./hooks/web3Context";
import { getLibrary } from "./utils/getLibrary";

function App() {
  return (
    <Web3ContextProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Router>
          <div>
            <Header />
          </div>
        </Router>
      </Web3ReactProvider>
    </Web3ContextProvider>
  );
}

export default App;
