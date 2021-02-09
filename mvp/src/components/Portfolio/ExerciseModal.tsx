import { Row } from "antd";
import Modal from "antd/lib/modal/Modal";
import { ethers } from "ethers";
import React, { useState } from "react";
import { ModalButton, StyledStatistic } from "../../designSystem/Modal";
import { useETHPriceInUSD } from "../../hooks/useEthPrice";
import { InstrumentPosition } from "../../models";
import { formatProfitsInUSD, toSignificantDecimals } from "../../utils/math";

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
  const [isExercising, setIsExercising] = useState(false);
  const ethPriceUSD = useETHPriceInUSD();
  const { pnl, amount } = position;
  const pnlUSD = formatProfitsInUSD(pnl, ethPriceUSD);

  const pnlETH = toSignificantDecimals(pnl, 8);
  const numContracts = ethers.utils.formatEther(amount); // we assume that we only take 2 options positions

  const handleExercise = async () => {
    setIsExercising(true);
    await onExercise();
    setIsExercising(false);
  };

  return (
    <Modal
      visible={true}
      onOk={handleExercise}
      onCancel={onClose}
      width={300}
      title="Confirm Exercise"
      bodyStyle={{ paddingBottom: 0 }}
      footer={[
        <ModalButton
          disabled={isExercising}
          key="submit"
          type="primary"
          loading={isExercising}
          onClick={handleExercise}
        >
          {isExercising ? "Exercising..." : "Exercise"}
        </ModalButton>,
      ]}
    >
      <Row>
        <StyledStatistic
          title="I am exercising"
          value={`${numContracts} contracts`}
        ></StyledStatistic>
      </Row>
      <Row>
        <StyledStatistic
          title={`This will be a ${pnl.isNegative() ? "loss" : "profit"} of`}
          value={`${pnlUSD} (${pnlETH} ETH)`}
        ></StyledStatistic>
      </Row>
    </Modal>
  );
};
export default ExerciseModal;
