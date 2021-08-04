import React from "react";
import styled from "styled-components";

import { BaseUnderlineLink, PrimaryText } from "shared/lib/designSystem";
import TrafficLight from "shared/lib/components/Common/TrafficLight";
import { getEtherscanURI } from "shared/lib/constants/constants";

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
  return (
    <>
      <TrafficLightContainer>
        <TrafficLight active={Boolean(txhash)} />
      </TrafficLightContainer>
      <BottomTextContainer>
        {txhash ? (
          <BaseUnderlineLink
            to={`${getEtherscanURI()}/tx/${txhash}`}
            target="_blank"
            rel="noreferrer noopener"
            className="d-flex"
          >
            <BottomText>View on Etherscan</BottomText>
          </BaseUnderlineLink>
        ) : (
          <BottomText>Confirm this transaction in your wallet</BottomText>
        )}
      </BottomTextContainer>
    </>
  );
};

export default TransactionStep;
