import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import {
  BaseUnderlineLink,
  BaseModalContentColumn,
  Title,
  PrimaryText,
} from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import { getEtherscanURI } from "shared/lib/constants/constants";
import { useWeb3React } from "@web3-react/core";

const barAnimationTime = 500;
const barRowsNum = 6;
/**
 * Ratio denominated as follow
 * total animation time : delay time
 */
const animationDelayRatio = 4;

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

const FloatingBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 200px;
  height: 240px;
  margin-top: 32px;
`;

const FloatingBoxBar = styled.div<{ color: string }>`
  width: 100%;
  height: 40px;
  transition: ${barAnimationTime / 6}ms all;
  background: ${(props) => props.color};
  box-shadow: 2px 4px 40px ${(props) => props.color};
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
  const [activeBarIndex, setActiveBarIndex] = useState<number>(
    barRowsNum * animationDelayRatio - 1
  );

  useEffect(() => {
    const animationInterval = setInterval(() => {
      setActiveBarIndex((prev) => (prev - 1 < 0 ? 6 * 4 - 1 : prev - 1));
    }, barAnimationTime / 6);

    return () => clearInterval(animationInterval);
  }, []);

  const gapToAlpha = useCallback((gap: number) => {
    switch (gap) {
      case 0:
        return "0A";
      case 1:
        return "14";
      case 2:
        return "29";
      case 3:
        return "3D";
      case 4:
        return "7A";
      case 5:
        return "A3";
      case 6:
        return "FF";
    }
  }, []);

  return (
    <>
      <BaseModalContentColumn marginTop={8}>
        <Title lineHeight={24}>{title}</Title>
      </BaseModalContentColumn>
      <FloatingBoxContainer>
        <FloatingBox>
          {Boolean(txhash) &&
            [...new Array(6)].map((_item, index) => (
              <FloatingBoxBar
                key={index}
                color={`${colors.red}${gapToAlpha(activeBarIndex - index)}`}
              />
            ))}
        </FloatingBox>
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
