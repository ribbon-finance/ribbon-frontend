import React, { useMemo } from "react";
import { Table } from "antd";
import usePositions from "../../hooks/usePositions";
import {
  CALL_OPTION_TYPE,
  InstrumentPosition,
  PUT_OPTION_TYPE,
} from "../../models";
import { BigNumber, ethers } from "ethers";

const ActivePositions = () => {
  const columns = useMemo(
    () => [
      {
        title: "#",
        dataIndex: "number",
        key: "number",
      },
      {
        title: "Product Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Expiry Date",
        dataIndex: "expiry",
        key: "expiry",
      },
      {
        title: "PNL",
        dataIndex: "pnl",
        key: "pnl",
      },
    ],
    []
  );

  const positions = usePositions("0xE273FA3dFFc415e7472F2D5477C987dcAF2e9263");
  const dataSource = positions.map(positionToDataSource);

  return <Table dataSource={dataSource} columns={columns} />;
};

const positionToDataSource = (position: InstrumentPosition, index: number) => {
  const callIndex = position.optionTypes.findIndex(
    (optionType) => optionType === CALL_OPTION_TYPE
  );
  const putIndex = position.optionTypes.findIndex(
    (optionType) => optionType === PUT_OPTION_TYPE
  );
  if (callIndex === -1 || putIndex === -1) {
    throw new Error("No call or put option found");
  }
  const callStrikePrice = parseInt(
    ethers.utils.formatEther(position.strikePrices[callIndex])
  );
  const putStrikePrice = parseInt(
    ethers.utils.formatEther(position.strikePrices[putIndex])
  );

  return {
    number: index.toString(),
    name: `ETH Straddle $${putStrikePrice}/$${callStrikePrice}`,
    expiry: "12",
    pnl: "$102",
  };
};

export default ActivePositions;
