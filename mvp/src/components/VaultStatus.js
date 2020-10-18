import React, { useContext } from "react";
import { Web3Context } from "./Web3Wrapper";

const VaultStatus = () => {
  const context = useContext(Web3Context);
  console.log(context);
  return <div>Min Collateralization Ratio:</div>;
};

export default VaultStatus;
