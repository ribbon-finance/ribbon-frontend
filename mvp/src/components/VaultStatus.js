import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { useContracts } from "../utils/contracts";

const VaultStatus = () => {
  const contracts = useContracts();
  const [colRatio, setColRatio] = useState(0.0);

  useEffect(() => {
    if (contracts !== null && contracts.dojimaInstrument) {
      (async () => {
        const colRatio = await contracts.dojimaInstrument.methods
          .collateralizationRatio()
          .call();

        const colRatioEther = parseFloat(Web3.utils.fromWei(colRatio));
        setColRatio(colRatioEther * 100);
      })();
    }
  }, [contracts]);

  return <div>Min Collateralization Ratio: {colRatio}%</div>;
};

export default VaultStatus;
