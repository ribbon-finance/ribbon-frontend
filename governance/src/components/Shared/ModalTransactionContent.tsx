import React from "react";
import styled from "styled-components";

import {
  BaseUnderlineLink,
  BaseModalContentColumn,
  Title,
  PrimaryText,
} from "shared/lib/designSystem";
import PendingTransactionLoader from "shared/lib/components/Common/PendingTransactionLoader";
import { getEtherscanURI } from "shared/lib/constants/constants";
import { useWeb3React } from "@web3-react/core";

const FloatingBoxContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`;

interface ModalTransactionContentProps {
  title: string;
  txhash?: string;
}

const ModalTransactionContent: React.FC<ModalTransactionContentProps> = ({
  title,
  txhash,
}) => {
  const { chainId } = useWeb3React();

  return (
    <>
      <BaseModalContentColumn marginTop={8}>
        <Title lineHeight={24}>{title}</Title>
      </BaseModalContentColumn>
      <FloatingBoxContainer>
        <PendingTransactionLoader active={Boolean(txhash)} />
      </FloatingBoxContainer>
      {Boolean(txhash) && (
        <BaseModalContentColumn marginTop="auto">
          {chainId !== undefined && (
            <BaseUnderlineLink
              to={`${getEtherscanURI(chainId)}/tx/${txhash}`}
              target="_blank"
              rel="noreferrer noopener"
              className="d-flex"
            >
              <PrimaryText className="mb-2">View on Etherscan</PrimaryText>
            </BaseUnderlineLink>
          )}
        </BaseModalContentColumn>
      )}
    </>
  );
};

export default ModalTransactionContent;
