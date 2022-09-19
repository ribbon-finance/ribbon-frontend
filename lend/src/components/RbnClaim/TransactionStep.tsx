import React from "react";
import styled from "styled-components";
import { BaseUnderlineLink, PrimaryText } from "shared/lib/designSystem";
import PendingTransactionLoader from "./PendingTransactionLoader";
import {
  getExplorerName,
  getExplorerURI,
  Chains,
} from "../../constants/constants";
import { useChain } from "../../hooks/chainContext";

const TransactionPendingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 320px;
  width: 100%;
  margin-bottom: 32px;
`;

const BottomTextContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  width: 100%;
  margin-bottom: 24px;
`;

const BottomText = styled(PrimaryText)`
  color: rgba(255, 255, 255, 0.8);
`;

interface TransactionStepProps {
  txhash?: string;
  color?: string;
}

const TransactionStep: React.FC<TransactionStepProps> = ({ txhash, color }) => {
  const [chain] = useChain();

  return (
    <>
      <TransactionPendingContainer>
        <PendingTransactionLoader
          active={true}
          numberOfBars={4}
          color={color}
          barHeight={80}
        />
      </TransactionPendingContainer>
      <BottomTextContainer>
        {chain !== Chains.NotSelected && txhash !== "" ? (
          <BaseUnderlineLink
            to={`${getExplorerURI(chain)}/tx/${txhash}`}
            target="_blank"
            rel="noreferrer noopener"
            className="d-flex"
          >
            {<BottomText>View on {getExplorerName(chain)}</BottomText>}
          </BaseUnderlineLink>
        ) : (
          <BottomText>Confirm this transaction in your wallet</BottomText>
        )}
      </BottomTextContainer>
    </>
  );
};

export default TransactionStep;
