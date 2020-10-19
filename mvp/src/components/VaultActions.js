import React, { useEffect, useMemo, useContext, useState } from "react";
import Web3 from "web3";
import { InputNumber, Button } from "antd";
import { useContracts } from "../utils/contracts";
import { useAssets } from "../utils/useAssets";
import { Web3Context } from "./Web3Wrapper";
import ERC20ABI from "../abis/ERC20.json";

const VaultActions = () => {
  const { contracts, loaded: loadedContracts } = useContracts();
  const [instrument, setInstrument] = useState(null);

  useEffect(() => {
    if (loadedContracts) {
      setInstrument(contracts.dojimaInstrument);
    }
  }, [contracts, loadedContracts]);

  return <ActionsPanel type="deposit" instrument={instrument}></ActionsPanel>;
};

export default VaultActions;

const ActionsPanel = ({ type, instrument }) => {
  const assets = useAssets();
  const { web3, accounts } = useContext(Web3Context);
  const [inputAmount, setInputAmount] = useState(0);
  const [collateralAsset, setCollateralAsset] = useState("");
  const [collateralERC20, setCollateralERC20] = useState(null);
  const [collateralAllowance, setCollateralAllowance] = useState(0);
  const [targetAsset, setTargetAsset] = useState("");
  const actionTitle =
    type.slice(0, 1).toUpperCase() + type.slice(1, type.length);

  useEffect(() => {
    if (web3 !== null && instrument !== null) {
      (async () => {
        const collateralAddress = await instrument.methods
          .collateralAsset()
          .call();
        setCollateralAsset(assets.get(collateralAddress).toUpperCase());

        const targetAddress = await instrument.methods.targetAsset().call();
        setTargetAsset(assets.get(targetAddress).toUpperCase());

        const contract = new web3.eth.Contract(ERC20ABI, collateralAddress);
        setCollateralERC20(contract);
      })();
    }
  }, [instrument]);

  useEffect(() => {
    (async () => {
      if (instrument !== null && accounts.length && collateralERC20 != null) {
        const allowance = await collateralERC20.methods
          .allowance(accounts[0], instrument._address)
          .call();
        setCollateralAllowance(allowance);
      }
    })();
  }, [instrument, collateralERC20, accounts]);

  const allowanceGiven = collateralAllowance > 0;
  const allowanceText = allowanceGiven ? "Given" : "Not Given";
  const buttonTitle = allowanceGiven ? actionTitle : "Approve";

  const actionEnabled = useMemo(() => {
    if (!allowanceGiven) {
      return true;
    }
    return accounts.length && inputAmount && targetAsset && collateralERC20;
  }, [
    collateralAllowance,
    accounts,
    inputAmount,
    targetAsset,
    collateralAsset,
  ]);

  const handleAction = async () => {
    if (!allowanceGiven) {
      const maxUint256 =
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
      await collateralERC20.methods
        .approve(instrument._address, maxUint256)
        .send({ from: accounts[0] });
      return;
    }

    if (type === "deposit") {
      const inputWei = Web3.utils.toWei(inputAmount.toString());
      await instrument.methods.deposit(inputWei).send({ from: accounts[0] });
    }
  };

  return (
    <div>
      {actionTitle}
      <div>
        <InputNumber
          defaultValue={inputAmount}
          formatter={(value) =>
            `${value} ${collateralAsset}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          onChange={setInputAmount}
        />
        <div>Allowance: {allowanceText}</div>
        <Button disabled={!actionEnabled} type="primary" onClick={handleAction}>
          {buttonTitle}
        </Button>
      </div>
    </div>
  );
};
