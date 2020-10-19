import React, { useState, useEffect } from "react";
import { getWeb3, isEthEnabled } from "../utils/web3";

export const Web3Context = React.createContext({
  web3: null,
  metamaskError: "",
});

const Web3Wrapper = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [metamaskError, setMetamaskError] = useState("");
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    if (!isEthEnabled()) {
      setMetamaskError("Please install metamask");
    } else {
      setWeb3(getWeb3);
    }
  }, []);

  useEffect(() => {
    if (web3 !== null) {
      (async () => {
        const accounts = await web3.eth.getAccounts();
        setAccounts(accounts);
      })();
    }
  }, [web3]);

  const contextVal = { web3, accounts, metamaskError };

  return (
    <Web3Context.Provider value={contextVal}>{children}</Web3Context.Provider>
  );
};
export default Web3Wrapper;
