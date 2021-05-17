import React, { useMemo, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import styled from "styled-components";

import Logo from "shared/lib/assets/icons/logo";
import { Title } from "shared/lib/designSystem";
import AirdropModal from "./AirdropModal";
import colors from "shared/lib/designSystem/colors";
import useAirdrop from "../../hooks/useAirdrop";

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 16px 8px 8px;
  background: linear-gradient(
    96.84deg,
    ${colors.red}24 1.04%,
    ${colors.red}0F 98.99%
  );
  border-radius: 48px;
`;

const ClaimAmount = styled(Title)`
  color: ${colors.red};
  margin-left: 8px;
  font-size: 14px;
  line-height: 24px;
`;

const AirdropButton = () => {
  // Update the set amount logic
  const [showModal, setShowModal] = useState(false);
  const { account } = useWeb3React();
  const airdrop = useAirdrop();

  const amountStr = useMemo(() => {
    if (!account) {
      return "$RIBBON";
    }

    if (!airdrop) {
      return "0.00";
    }

    return airdrop.total;
  }, [account, airdrop]);

  return (
    <>
      <LogoContainer
        role="button"
        onClick={() => setShowModal((show) => !show)}
      >
        <Logo height="32px" width="32px" />
        <ClaimAmount>{amountStr}</ClaimAmount>
      </LogoContainer>
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
