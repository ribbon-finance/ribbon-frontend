import { Button, Modal, Row } from "antd";
import { BigNumber, ethers } from "ethers";
import moment from "moment";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import StyledStatistic from "../../designSystem/StyledStatistic";
import { venueKeyToName } from "../../utils/positions";

const StatisticRow = styled(Row)`
  margin-bottom: 20px;
`;

const BuyButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
  border-radius: 8px;
  width: 100%;
  font-size: 24px;
  font-family: "Montserrat";
`;

type PurchaseModalProps = {
  isVisible: boolean;
  loading: boolean;
  onPurchase: (setWaitingForConfirmation: () => void) => Promise<void>;
  onClose: () => void;
  purchaseAmount: number;
  straddleETH: string;
  expiry: Date;
  callStrikePrice: BigNumber;
  putStrikePrice: BigNumber;
  callVenue: string;
  putVenue: string;
};

const PurchaseModal: React.FC<PurchaseModalProps> = ({
  isVisible,
  onPurchase,
  onClose,
  loading,
  purchaseAmount,
  straddleETH,
  callStrikePrice,
  putStrikePrice,
  callVenue,
  putVenue,
  expiry,
}) => {
  const [isPending, setPending] = useState(false);
  const [isWaitingForConfirmation, setIsWaitingForConfirmation] = useState(
    false
  );

  const handleOk = async () => {
    setPending(true);
    await onPurchase(() => setIsWaitingForConfirmation(true));
    setPending(false);
    setIsWaitingForConfirmation(false);
  };

  let buttonText;
  if (isPending && !isWaitingForConfirmation) {
    buttonText = "Purchasing...";
  } else if (isPending && isWaitingForConfirmation) {
    buttonText = "Waiting for 1 confirmation...";
  } else {
    buttonText = "Buy";
  }

  useEffect(() => {
    if (!isVisible) {
      setPending(false);
      setIsWaitingForConfirmation(false);
    }
  }, [isVisible, setPending, setIsWaitingForConfirmation]);

  const toUSD = (bn: BigNumber) =>
    Math.floor(parseFloat(ethers.utils.formatEther(bn)));

  const totalCostETH = ethers.utils.formatEther(
    ethers.utils.parseEther(
      (parseFloat(straddleETH) * purchaseAmount).toFixed(8)
    )
  );

  const formattedExpiry = moment(expiry).format("MMM D, YYYY");

  return (
    <Modal
      visible={isVisible}
      onOk={handleOk}
      onCancel={onClose}
      width={380}
      title="ETH Strangle"
      closable={false}
      footer={[
        <BuyButton
          disabled={loading}
          key="submit"
          type="primary"
          loading={isPending}
          onClick={handleOk}
        >
          {buttonText}
        </BuyButton>,
      ]}
    >
      <StatisticRow>
        <StyledStatistic
          title="Contract expiry"
          value={formattedExpiry}
        ></StyledStatistic>
      </StatisticRow>
      <StatisticRow>
        <StyledStatistic
          title="No. of contracts"
          value={`${purchaseAmount} contracts`}
        ></StyledStatistic>
      </StatisticRow>
      <StatisticRow>
        <StyledStatistic
          title="Total Cost"
          value={loading ? "Computing cost..." : `${totalCostETH} ETH`}
        ></StyledStatistic>
      </StatisticRow>

      <StatisticRow>
        <StyledStatistic
          title="Underlying options"
          value={
            loading
              ? "Finding the best trade for you..."
              : `$${toUSD(putStrikePrice)} PUT from ${venueKeyToName(
                  putVenue
                )}, $${toUSD(callStrikePrice)} CALL from ${venueKeyToName(
                  callVenue
                )}`
          }
        ></StyledStatistic>
      </StatisticRow>
    </Modal>
  );
};

export default PurchaseModal;
