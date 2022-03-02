import React, { useState } from "react";
import styled from "styled-components";
import { ReactComponent as RevenueClaimIcon } from "../../assets/icons/revenueClaim.svg";

import BasicModal from "shared/lib/components/Common/BasicModal";
import { Title } from "shared/lib/designSystem";
import { getAssetLogo } from "shared/lib/utils/asset";
import NumberInput from "shared/lib/components/Inputs/NumberInput";
import useLoadingText from "shared/lib/hooks/useLoadingText";
import ToggleRowItem from "./ToggleRowItem";

const ModalContainer = styled(BasicModal)``;

const ModalColumn = styled.div<{ marginTop?: number | "auto" }>`
  display: flex;
  justify-content: center;
  margin-top: ${(props) =>
    props.marginTop === "auto"
      ? props.marginTop
      : `${props.marginTop === undefined ? 24 : props.marginTop}px`};
`;

const LogoContainer = styled.div.attrs({
  className: "d-flex align-items-center justify-content-center",
})`
  width: 40px;
  height: 100%;
  margin-left: 8px;
`;

interface RewardsCalculatorModalProps {
  show: boolean;
  onClose: () => void;
}

const USDCLogo = getAssetLogo("USDC");
const RevenueClaimModal: React.FC<RewardsCalculatorModalProps> = ({
  show,
  onClose,
}) => {
  const loadingText = useLoadingText();

  const [claimVaultRevenue, setClaimVaultRevenue] = useState(false);
  const [claimUnlockPenalty, setClaimUnlockPenalty] = useState(false);
  const [lockToVERBN, setlockToVERBN] = useState(false);

  return (
    <ModalContainer show={show} headerBackground height={532} onClose={onClose}>
      <>
        <ModalColumn marginTop={8}>
          <Title style={{ zIndex: 1 }}>CLAIM RIBBON REVENUE</Title>
        </ModalColumn>
        <ModalColumn marginTop={40}>
          <NumberInput
            size="s"
            leftContent={
              <LogoContainer>
                <USDCLogo width="100%" height="100%" />
              </LogoContainer>
            }
            labelProps={{
              text: "VAULT REVENUE",
              isInside: true,
            }}
            inputProps={{
              min: "0",
              placeholder: "0.00",
              value: "0.00",
              contentEditable: false,
              disabled: true,
            }}
          />
        </ModalColumn>
        <ModalColumn marginTop={16}>
          <NumberInput
            size="s"
            leftContent={
              <LogoContainer>
                <RevenueClaimIcon width="100%" height="100%" />
              </LogoContainer>
            }
            labelProps={{
              text: "SHARE OF UNLOCK PENALTY",
              isInside: true,
            }}
            inputProps={{
              min: "0",
              placeholder: "0.00",
              value: "0.00",
              contentEditable: false,
              disabled: true,
            }}
          />
        </ModalColumn>
        <ModalColumn marginTop={24}>
          <ToggleRowItem
            title="Claim Vault Revenue"
            tooltip={{
              title: "Claim Vault Revenue",
              explanation: "TEST",
            }}
            isChecked={claimVaultRevenue}
            onChecked={setClaimVaultRevenue}
          />
        </ModalColumn>
        <ModalColumn marginTop={16}>
          <ToggleRowItem
            title="Claim Unlock Penalty"
            tooltip={{
              title: "Claim Unlock Penalty",
              explanation: "TEST",
            }}
            isChecked={claimUnlockPenalty}
            onChecked={setClaimUnlockPenalty}
          />
        </ModalColumn>
        <ModalColumn marginTop={16}>
          <ToggleRowItem
            title="Lock to veRBN"
            tooltip={{
              title: "Lock to veRBN",
              explanation: "TEST",
            }}
            isChecked={lockToVERBN}
            onChecked={setlockToVERBN}
          />
        </ModalColumn>
      </>
    </ModalContainer>
  );
};

export default RevenueClaimModal;
