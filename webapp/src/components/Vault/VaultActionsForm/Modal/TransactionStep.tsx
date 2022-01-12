import React from "react";
import styled from "styled-components";
import { useWeb3Wallet } from "shared/lib/hooks/useWeb3Wallet";
import { BaseUnderlineLink, PrimaryText } from "shared/lib/designSystem";
import TrafficLight from "shared/lib/components/Common/TrafficLight";
import {
  BLOCKCHAIN_EXPLORER_NAME,
  getEtherscanURI,
} from "shared/lib/constants/constants";

const TrafficLightContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 220px;
  margin-bottom: 24px;
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
}

const TransactionStep: React.FC<TransactionStepProps> = ({ txhash }) => {
  const { chainId } = useWeb3Wallet();
  return (
    <>
      <TrafficLightContainer>
        <TrafficLight active={Boolean(txhash)} />
      </TrafficLightContainer>
      <BottomTextContainer>
        {chainId && txhash ? (
          <BaseUnderlineLink
            to={`${getEtherscanURI(chainId)}/tx/${txhash}`}
            target="_blank"
            rel="noreferrer noopener"
            className="d-flex"
          >
            {chainId && (
              <BottomText>
                View on {BLOCKCHAIN_EXPLORER_NAME[chainId]}
              </BottomText>
            )}
          </BaseUnderlineLink>
        ) : (
          <BottomText>Confirm this transaction in your wallet</BottomText>
        )}
      </BottomTextContainer>
    </>
  );
};

export default TransactionStep;
