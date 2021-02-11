import { useWeb3React } from "@web3-react/core";
import { Modal } from "antd";
import { BigNumber, ethers } from "ethers";
import moment from "moment";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { PrimaryMedium, PrimaryText } from "../../designSystem";
import ChiToken from "../../img/chi.png";
import {
  ModalButton,
  StatisticRow,
  StyledStatistic,
} from "../../designSystem/Modal";
import protocolIcons from "../../img/protocolIcons";
import { injectedConnector } from "../../utils/connectors";
import { venueKeyToName } from "../../utils/positions";
import { addConnectEvent } from "../../utils/google";
import { toSignificantDecimals } from "../../utils/math";

const ProtocolIcon = styled.img`
  width: 50px;
  height: 50px;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background: rgba(0, 0, 0, 0.08);
  box-shadow: 1px 2px 24px rgba(0, 0, 0, 0.08);
`;

const UnderlyingContainer = styled.div`
  display: flex;
  align-items: center;
`;

const UnderlyingTermsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 7px;
`;

const UnderlyingTitle = styled(PrimaryMedium)`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
`;

const UnderlyingStrike = styled(PrimaryText)`
  font-size: 12px;
  line-height: 12px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.48);
  margin-top: 4px;
`;

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PlusIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20px;
  margin-right: 20px;
  font-family: "Inter", sans-serif;
  font-size: 20px;
  font-weight: 500;
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
  callPremium: BigNumber;
  putPremium: BigNumber;
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
  callPremium,
  putPremium,
  expiry,
}) => {
  const [isPending, setPending] = useState(false);
  const [isWaitingForConfirmation, setIsWaitingForConfirmation] = useState(
    false
  );
  const { active, activate, account } = useWeb3React();

  const handleOk = async () => {
    if (!active) {
      await activate(injectedConnector);
      return;
    }

    setPending(true);
    await onPurchase(() => setIsWaitingForConfirmation(true));
    setPending(false);
    setIsWaitingForConfirmation(false);
  };

  let buttonText;
  if (!active) {
    buttonText = "Connect to Metamask";
  } else if (isPending && !isWaitingForConfirmation) {
    buttonText = "Purchasing...";
  } else if (isPending && isWaitingForConfirmation) {
    buttonText = "Waiting 1 confirmation...";
  } else {
    buttonText = "Buy";
  }

  useEffect(() => {
    if (account) {
      addConnectEvent("purchaseModal", account);
    }
  }, [account]);

  useEffect(() => {
    if (!isVisible) {
      setPending(false);
      setIsWaitingForConfirmation(false);
    }
  }, [isVisible, setPending, setIsWaitingForConfirmation]);

  const toUSD = (bn: BigNumber) =>
    Math.floor(parseFloat(ethers.utils.formatEther(bn))).toLocaleString();

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
      width={420.69}
      title="ETH Strangle"
      closable={true}
      bodyStyle={{ paddingBottom: 0 }}
      footer={[
        <ModalButton
          disabled={loading}
          key="submit"
          type="primary"
          loading={isPending}
          onClick={handleOk}
        >
          {buttonText}
        </ModalButton>,
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
          value={`${purchaseAmount} contract${purchaseAmount === 1 ? "" : "s"}`}
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
          title="Gas savings"
          hideValue={true}
          value=""
          suffix={
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span>
                <img
                  style={{ width: 25, height: 25, marginRight: 8 }}
                  src={ChiToken}
                  alt="Chi Token"
                ></img>
              </span>
              <span style={{ fontSize: 12, lineHeight: 1.3 }}>
                We are subsidizing your gas fees with Chi token. The gas fee
                that appears in your Metamask prompt will be refunded up to 50%.
              </span>
            </div>
          }
        ></StyledStatistic>
      </StatisticRow>

      <StatisticRow style={{ marginBottom: 0 }}>
        <StyledStatistic
          title="Underlying options"
          hideValue={!loading}
          value="Finding the best price..."
          suffix={
            !loading && (
              <FlexDiv>
                <UnderlyingContainer>
                  <IconContainer>
                    <ProtocolIcon
                      src={protocolIcons[callVenue]}
                      alt={venueKeyToName(callVenue)}
                    />
                  </IconContainer>
                  <UnderlyingTermsContainer>
                    <UnderlyingTitle>
                      {venueKeyToName(callVenue)}
                    </UnderlyingTitle>
                    <UnderlyingStrike>
                      ${toUSD(callStrikePrice)} Call
                    </UnderlyingStrike>
                    <UnderlyingStrike>
                      Cost: {toSignificantDecimals(callPremium, 4)} ETH
                    </UnderlyingStrike>
                  </UnderlyingTermsContainer>
                </UnderlyingContainer>

                <PlusIcon>+</PlusIcon>

                <UnderlyingContainer>
                  <IconContainer>
                    <ProtocolIcon
                      src={protocolIcons[putVenue]}
                      alt={venueKeyToName(putVenue)}
                    />
                  </IconContainer>
                  <UnderlyingTermsContainer>
                    <UnderlyingTitle>
                      {venueKeyToName(putVenue)}
                    </UnderlyingTitle>
                    <UnderlyingStrike>
                      ${toUSD(putStrikePrice)} Put
                    </UnderlyingStrike>
                    <UnderlyingStrike>
                      Cost: {toSignificantDecimals(putPremium, 4)} ETH
                    </UnderlyingStrike>
                  </UnderlyingTermsContainer>
                </UnderlyingContainer>
              </FlexDiv>
            )
          }
        ></StyledStatistic>
      </StatisticRow>
    </Modal>
  );
};

export default PurchaseModal;
