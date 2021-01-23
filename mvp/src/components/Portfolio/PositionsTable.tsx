import React, { useCallback, useState } from "react";
import { Button, Modal, Row, Table } from "antd";
import {
  CALL_OPTION_TYPE,
  Instrument,
  InstrumentPosition,
  PUT_OPTION_TYPE,
} from "../../models";
import { ethers } from "ethers";
import { timeToExpiry } from "../../utils/time";
import StyledStatistic from "../../designSystem/StyledStatistic";
import { useWeb3React } from "@web3-react/core";
import { IAggregatedOptionsInstrumentFactory } from "../../codegen/IAggregatedOptionsInstrumentFactory";

type PositionsTableProps = {
  positions: InstrumentPosition[];
  isPastPositions: boolean;
  loading: boolean;
};

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
        await instrument.exercisePosition(exercisingPosition.positionID);
      } catch (e) {}
    }
  }, [library, exercisingPosition]);

  const dataSource = positions.map((pos, index) =>
    positionToDataSource(pos, index, isPastPositions, handleOpenExerciseModal)
  );
  return (
    <>
      <Table
        loading={loading}
        dataSource={dataSource}
        columns={isPastPositions ? pastColumns : activeColumns}
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
  onExercise: (position: InstrumentPosition) => void
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
  const showExerciseButton = !isPastPositions && !pnl.isZero();
  const exerciseButton = (
    <Button onClick={() => onExercise(position)}>Exercise</Button>
  );

  let data = {
    key: `${position.instrumentAddress}:${position.positionID}`,
    number: (index + 1).toString(),
    name: `ETH Straddle $${putStrikePrice}/$${callStrikePrice}`,
    expiry,
    pnl: `$${pnlUSD}`,
    exerciseButton: showExerciseButton && exerciseButton,
  };
  return data;
};

type ExerciseModalProps = {
  position: InstrumentPosition;
  onClose: () => void;
  onExercise: () => Promise<void>;
};

const ExerciseModal: React.FC<ExerciseModalProps> = ({
  position,
  onExercise,
  onClose,
}) => {
  const { pnl, amounts } = position;
  const pnlUSD = parseFloat(ethers.utils.formatEther(pnl)).toFixed(2);
  const numContracts = ethers.utils.formatEther(amounts[0]); // we assume that we only take 2 options positions

  return (
    <Modal
      visible={true}
      onOk={onExercise}
      onCancel={onClose}
      width={300}
      title="Confirm Exercise"
    >
      <Row>
        <StyledStatistic
          title="I am exercising"
          value={`${numContracts} contracts`}
        ></StyledStatistic>
      </Row>
      <Row>
        <StyledStatistic
          title="This will be a profit of"
          value={`$${pnlUSD}`}
        ></StyledStatistic>
      </Row>
    </Modal>
  );
};

export default PositionsTable;
