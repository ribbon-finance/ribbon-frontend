import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { Space, InputNumber, Button } from "antd";
import { useContracts } from "../utils/contracts";

const VaultActions = () => {
  const contracts = useContracts();
  const [instrument, setInstrument] = useState(null);
  const [depositAmount, setDepositAmount] = useState(0);

  useEffect(() => {
    if (contracts !== null && contracts.dojimaInstrument) {
      setInstrument(instrument);
    }
  }, [contracts]);

  return (
    <div>
      Deposit
      <div>
        <InputNumber
          defaultValue={depositAmount}
          formatter={(value) =>
            `${value} ETH`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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
