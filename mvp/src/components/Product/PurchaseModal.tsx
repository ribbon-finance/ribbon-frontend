import { Button, Modal, Row } from "antd";
import { BigNumber, ethers } from "ethers";
import React, { useEffect, useState } from "react";
import StyledStatistic from "../../designSystem/StyledStatistic";
import { venueKeyToName } from "../../utils/positions";

type PurchaseModalProps = {
  isVisible: boolean;
  loading: boolean;
  onPurchase: (setWaitingForConfirmation: () => void) => Promise<void>;
  onClose: () => void;
  purchaseAmount: number;
  straddleETH: string;
  expiry: string;
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
    buttonText = "Purchase";
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

  return (
    <Modal
      visible={isVisible}
      onOk={handleOk}
      onCancel={onClose}
      width={300}
      title={"Confirm Purchase"}
      footer={[
        !isWaitingForConfirmation && (
          <Button
            key="back"
            disabled={isWaitingForConfirmation}
            onClick={onClose}
          >
            Cancel
          </Button>
        ),
        <Button
          disabled={loading}
          key="submit"
          type="primary"
          loading={isPending}
          onClick={handleOk}
        >
          {buttonText}
        </Button>,
      ].filter(Boolean)}
    >
      <Row>
        <StyledStatistic
          title="I am purchasing"
          value={`${purchaseAmount} contracts`}
        ></StyledStatistic>
      </Row>
      <Row>
        <StyledStatistic
          title="This will cost"
          value={loading ? "Computing cost..." : `${totalCostETH} ETH`}
        ></StyledStatistic>
      </Row>

      <Row>
        <StyledStatistic
          title="The contracts will expire by"
          value={expiry.toString()}
        ></StyledStatistic>
      </Row>

      <Row>
        <StyledStatistic
          title="The underlying options are"
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
      </Row>
    </Modal>
  );
};

export default PurchaseModal;
