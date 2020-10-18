import "../App.css";
import React from "react";
import Web3Wrapper from "../components/Web3Wrapper";
import VaultManagement from "./VaultManagement";

function App() {
  return (
    <Web3Wrapper>
      <div className="App">
        <VaultManagement></VaultManagement>
      </div>
    </Web3Wrapper>
  );
}

export default App;
