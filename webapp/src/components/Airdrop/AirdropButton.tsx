import React, { useMemo, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import styled, { css, keyframes } from "styled-components";

import Logo from "shared/lib/assets/icons/logo";
import { Title } from "shared/lib/designSystem";
import AirdropModal from "./AirdropModal";
import colors from "shared/lib/designSystem/colors";
import useAirdrop from "../../hooks/useAirdrop";
import usePendingTransactions from "../../hooks/usePendingTransactions";
import theme from "shared/lib/designSystem/theme";

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  background: linear-gradient(
    96.84deg,
    ${colors.red}24 1.04%,
    ${colors.red}3D 98.99%
  );
  border-radius: 48px;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  width: 48px;
`;

const signalAnimation = keyframes`
  0% {
    padding: 0;
    border: ${theme.border.width} ${theme.border.style} ${colors.products.yield};
  }

  25% {
    padding: 8px;
    border: ${theme.border.width} ${theme.border.style} ${colors.products.yield};
  }

  50% {
    padding: 8px;
    border: ${theme.border.width} ${theme.border.style} ${colors.products.yield}00;
  }
`;

const LogoSignal = styled.div<{ claiming: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;

  ${(props) =>
    props.claiming
      ? css`
          animation: 1s ${signalAnimation} linear infinite;
          border-radius: 100px;
        `
      : `

    `}
`;

const RedLogo = styled(Logo)`
  circle {
    fill: ${colors.products.yield}3D;
  }

  path {
    stroke: ${colors.products.yield};
  }
`;

const ClaimAmount = styled(Title)`
  color: ${colors.products.yield};
  margin-right: 16px;
  font-size: 14px;
  line-height: 24px;
`;

const AirdropButton = () => {
  // Update the set amount logic
  const [showModal, setShowModal] = useState(false);
  const { account } = useWeb3React();
  const airdrop = useAirdrop();
  const [pendingTransactions] = usePendingTransactions();

  const amountStr = useMemo(() => {
    if (!account) {
      return "$RBN";
    }

    if (!airdrop || !airdrop.total) {
      return "0.00";
    }

    return airdrop.total;
  }, [account, airdrop]);

  const isClaiming = useMemo(() => {
    return !!pendingTransactions.find((item) => item.type === "claim");
  }, [pendingTransactions]);

  return (
    <>
      <ButtonContainer
        role="button"
        onClick={() => setShowModal((show) => !show)}
      >
        <LogoContainer>
          <LogoSignal claiming={isClaiming}>
            <RedLogo height="32px" width="32px" />
          </LogoSignal>
        </LogoContainer>
        {!isClaiming && <ClaimAmount>{amountStr}</ClaimAmount>}
      </ButtonContainer>
      <AirdropModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
        }}
      />
    </>
  );
};

export default AirdropButton;
