import React, { useEffect, useCallback, useState } from "react";
import Web3 from "web3";
import { InputNumber, Button } from "antd";
import { useContracts } from "../utils/contracts";
import { useAssets } from "../utils/useAssets";

const VaultActions = () => {
  const { contracts, loaded: loadedContracts } = useContracts();
  const assets = useAssets();
  const [instrument, setInstrument] = useState(null);
  const [depositAmount, setDepositAmount] = useState(0);
  const [collateralAsset, setCollateralAsset] = useState("");
  const [targetAsset, setTargetAsset] = useState("");

  useEffect(() => {
    if (loadedContracts) {
      setInstrument(contracts.dojimaInstrument);
    }
  }, [contracts, loadedContracts]);

  useEffect(() => {
    if (instrument !== null) {
      (async () => {
        const collateralAddress = await instrument.methods
          .collateralAsset()
          .call();
        setCollateralAsset(assets.get(collateralAddress).toUpperCase());

        const targetAddress = await instrument.methods.targetAsset().call();
        setTargetAsset(assets.get(targetAddress).toUpperCase());
      })();
    }
  }, [instrument]);

  return (
    <div>
      Deposit
      <div>
        <InputNumber
          defaultValue={depositAmount}
          formatter={(value) =>
            `${value} ${collateralAsset}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          onChange={setDepositAmount}
        />
        <Button type="primary">Deposit</Button>
      </div>
    </div>
  );
};
export default VaultActions;
