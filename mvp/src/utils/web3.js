const Web3 = require("web3");

export const isEthEnabled = () => {
  if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider);
    window.ethereum.enable();
    return true;
  }
  return false;
};

export const getWeb3 = () => {
  return new Web3(window.web3.currentProvider);
};
