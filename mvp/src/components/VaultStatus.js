import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { Space } from "antd";
import { useContracts } from "../utils/contracts";

const VaultStatus = () => {
  const contracts = useContracts();
  const [colRatio, setColRatio] = useState(0.0);
  const [instrumentName, setInstrumentName] = useState("");
  const [expiry, setExpiry] = useState("");

  useEffect(() => {
    if (contracts !== null && contracts.dojimaInstrument) {
      (async () => {
        const { dojimaInstrument } = contracts;

        const colRatio = await dojimaInstrument.methods
          .collateralizationRatio()
          .call();

        const colRatioEther = parseFloat(Web3.utils.fromWei(colRatio));
        setColRatio(colRatioEther * 100);

        setInstrumentName(await dojimaInstrument.methods.name().call());

        const expiryDate = new Date(
          (await dojimaInstrument.methods.expiry().call()) * 1000
        );
        setExpiry(expiryDate.toDateString());
      })();
    }
  }, [contracts]);

  return (
    <Space direction="vertical">
      <div>{instrumentName}</div>
      <div>Min Collateralization Ratio: {colRatio}%</div>
      <div>Expiring: {expiry}</div>
    </Space>
  );
};

export default VaultStatus;
