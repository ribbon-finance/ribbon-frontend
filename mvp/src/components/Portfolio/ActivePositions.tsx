import React, { useMemo } from "react";
import { Table } from "antd";
import usePositions from "../../hooks/usePositions";
import {
  CALL_OPTION_TYPE,
  InstrumentPosition,
  PUT_OPTION_TYPE,
} from "../../models";
import { ethers } from "ethers";
import { useInstrumentAddresses } from "../../hooks/useProducts";
import { timeToExpiry } from "../../utils/time";

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

  const instrumentAddresses = useInstrumentAddresses();
  const positions = usePositions(instrumentAddresses);
  const sortedPositions = positions.sort((a, b) => {
    if (a.expiry > b.expiry) return -1;
    if (a.expiry < b.expiry) return 1;
    return 0;
  });
  const dataSource = sortedPositions.map(positionToDataSource);

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
  const nowTimestamp = Math.floor(Date.now() / 1000);
  const hasExpired = nowTimestamp >= position.expiry;
  const expiryDate = new Date(position.expiry * 1000).toLocaleDateString();

  let expiry;
  if (hasExpired) {
    expiry = `${expiryDate} (Expired)`;
  } else {
    expiry = `${expiryDate} (${timeToExpiry(position.expiry)} remaining)`;
  }

  return {
    number: (index + 1).toString(),
    name: `ETH Straddle $${putStrikePrice}/$${callStrikePrice}`,
    expiry,
    pnl: "$102",
  };
};

export default ActivePositions;
