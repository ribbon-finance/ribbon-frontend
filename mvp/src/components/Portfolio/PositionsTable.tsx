import React, { useMemo } from "react";
import { Button, Table } from "antd";
import {
  CALL_OPTION_TYPE,
  InstrumentPosition,
  PUT_OPTION_TYPE,
} from "../../models";
import { ethers } from "ethers";
import { timeToExpiry } from "../../utils/time";

type Props = {
  positions: InstrumentPosition[];
  isPastPositions: boolean;
  loading: boolean;
};

const PositionsTable: React.FC<Props> = ({
  positions,
  isPastPositions,
  loading,
}) => {
  const activeColumns = [
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
    {
      title: "",
      dataIndex: "exerciseButton",
      key: "exerciseButton",
    },
  ];

  const pastColumns = [
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
      title: "Realized Profit",
      dataIndex: "pnl",
      key: "pnl",
    },
  ];

  const dataSource = positions.map((pos, index) =>
    positionToDataSource(pos, index, isPastPositions)
  );
  return (
    <Table
      loading={loading}
      dataSource={dataSource}
      columns={isPastPositions ? pastColumns : activeColumns}
    />
  );
};

const positionToDataSource = (
  position: InstrumentPosition,
  index: number,
  isPastPositions: boolean
) => {
  const { optionTypes, strikePrices, pnl } = position;
  const callIndex = optionTypes.findIndex(
    (optionType) => optionType === CALL_OPTION_TYPE
  );
  const putIndex = optionTypes.findIndex(
    (optionType) => optionType === PUT_OPTION_TYPE
  );
  if (callIndex === -1 || putIndex === -1) {
    throw new Error("No call or put option found");
  }
  const callStrikePrice = parseInt(
    ethers.utils.formatEther(strikePrices[callIndex])
  );
  const putStrikePrice = parseInt(
    ethers.utils.formatEther(strikePrices[putIndex])
  );
  const nowTimestamp = Math.floor(Date.now() / 1000);
  const hasExpired = nowTimestamp >= position.expiry;
  const expiryDate = new Date(position.expiry * 1000).toLocaleDateString();

  let expiry;
  if (hasExpired) {
    expiry = `${expiryDate} (Expired)`;
  } else {
    expiry = `${expiryDate} (${timeToExpiry(position.expiry)} remaining)`;
  }

  const pnlUSD = parseFloat(ethers.utils.formatEther(pnl)).toFixed(2);

  let data = {
    key: `${position.instrumentAddress}:${position.positionID}`,
    number: (index + 1).toString(),
    name: `ETH Straddle $${putStrikePrice}/$${callStrikePrice}`,
    expiry,
    pnl: `$${pnlUSD}`,
    exerciseButton: !isPastPositions && <Button>Exercise</Button>,
  };
  return data;
};

export default PositionsTable;
