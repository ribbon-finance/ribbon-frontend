import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { Button, Table } from "antd";
import {
  CALL_OPTION_TYPE,
  InstrumentPosition,
  PUT_OPTION_TYPE,
} from "../../models";
import { ethers } from "ethers";
import { timeToExpiry } from "../../utils/time";
import { useWeb3React } from "@web3-react/core";
import { IAggregatedOptionsInstrumentFactory } from "../../codegen/IAggregatedOptionsInstrumentFactory";
import ExerciseModal from "./ExerciseModal";
import { useETHPriceInUSD } from "../../hooks/useEthPrice";
import { formatProfitsInUSD } from "../../utils/math";

type PositionsTableProps = {
  positions: InstrumentPosition[];
  isPastPositions: boolean;
  loading: boolean;
};

const StyledTable = styled(Table)`
  margin-bottom: 30px;
`;

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

const PositionsTable: React.FC<PositionsTableProps> = ({
  positions,
  isPastPositions,
  loading,
}) => {
  const [
    exercisingPosition,
    setExercisingPosition,
  ] = useState<InstrumentPosition | null>(null);

  const { library } = useWeb3React();
  const ethPriceUSD = useETHPriceInUSD();

  const handleOpenExerciseModal = useCallback(
    (position: InstrumentPosition) => {
      setExercisingPosition(position);
    },
    [setExercisingPosition]
  );

  const handleCloseExerciseModal = useCallback(
    () => setExercisingPosition(null),
    [setExercisingPosition]
  );

  const handleExercise = useCallback(async () => {
    if (library && exercisingPosition !== null) {
      try {
        const signer = library.getSigner();
        const instrument = IAggregatedOptionsInstrumentFactory.connect(
          exercisingPosition.instrumentAddress,
          signer
        );
        const receipt = await instrument.exercisePosition(
          exercisingPosition.positionID
        );
        await receipt.wait(1);
        setExercisingPosition(null);
      } catch (e) {}
    }
  }, [library, exercisingPosition]);

  const dataSource = positions.map((pos, index) =>
    positionToDataSource(
      pos,
      index,
      isPastPositions,
      handleOpenExerciseModal,
      ethPriceUSD
    )
  );
  return (
    <>
      <StyledTable
        loading={loading}
        dataSource={dataSource}
        columns={isPastPositions ? pastColumns : activeColumns}
        pagination={{ hideOnSinglePage: true, pageSize: 5 }}
      />
      {!isPastPositions && exercisingPosition ? (
        <ExerciseModal
          position={exercisingPosition}
          onClose={handleCloseExerciseModal}
          onExercise={handleExercise}
        ></ExerciseModal>
      ) : null}
    </>
  );
};

const positionToDataSource = (
  position: InstrumentPosition,
  index: number,
  isPastPositions: boolean,
  onExercise: (position: InstrumentPosition) => void,
  ethPriceUSD: number
) => {
  const { optionTypes, strikePrices, pnl, canExercise } = position;
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

  const pnlUSD = formatProfitsInUSD(pnl, ethPriceUSD);

  const showExerciseButton = !isPastPositions && canExercise;
  const exerciseButton = (
    <Button onClick={() => onExercise(position)}>Exercise</Button>
  );

  let data = {
    key: `${position.instrumentAddress}:${position.positionID}`,
    number: (index + 1).toString(),
    name: `ETH Straddle $${putStrikePrice}/$${callStrikePrice}`,
    expiry,
    pnl: pnlUSD,
    exerciseButton: showExerciseButton && exerciseButton,
  };
  return data;
};

export default PositionsTable;
