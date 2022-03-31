import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import BasicModal from "shared/lib/components/Common/BasicModal";
import colors from "shared/lib/designSystem/colors";
import { BaseModalContentColumn } from "shared/lib/designSystem";
import { DelegateIcon } from "shared/lib/assets/icons/icons";
import DelegationModalOption from "./DelegationModalOption";
import DelegationModalForm from "./DelegationModalForm";
import useVotingEscrowDelegationProxy from "../../../hooks/useVotingEscrowDelegationProxy";

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  width: 64px;
  background: ${colors.red}1F;
  border-radius: 100px;
`;

const delegationModalModes = ["options", "form"] as const;
type DelegationModalMode = typeof delegationModalModes[number];

interface DelegationModalProps {
  show: boolean;
  onClose: () => void;
}

const DelegationModal: React.FC<DelegationModalProps> = ({ show, onClose }) => {
  const delegationProxyContract = useVotingEscrowDelegationProxy();
  const [mode, setMode] = useState<DelegationModalMode>(
    delegationModalModes[0]
  );

  useEffect(() => {
    if (!show) {
      setMode(delegationModalModes[0]);
    }
  }, [show]);

  const onDelegateSelf = useCallback(async () => {
    try {
      await delegationProxyContract?.kill_delegation();
      onClose();
    } catch (err) {
      setMode("options");
    }
  }, [delegationProxyContract, onClose]);

  const onDelegateAddress = useCallback(
    async (address: string) => {
      try {
        await delegationProxyContract?.set_delegation(address);
        onClose();
      } catch (err) {
        setMode("form");
      }
    },
    [delegationProxyContract, onClose]
  );

  const modalContent = useMemo(() => {
    switch (mode) {
      case "options":
        return (
          <DelegationModalOption
            onDelegateSelf={onDelegateSelf}
            onDelegateOthers={() => setMode("form")}
          />
        );
      case "form":
        return (
          <DelegationModalForm
            onBack={() => setMode("options")}
            onDelegate={onDelegateAddress}
          />
        );
    }
  }, [mode, onDelegateAddress, onDelegateSelf]);

  return (
    <BasicModal show={show} height={583} onClose={onClose}>
      <>
        {/* Logo */}
        <BaseModalContentColumn>
          <LogoContainer>
            <DelegateIcon color={colors.red} width="32px" />
          </LogoContainer>
        </BaseModalContentColumn>

        {modalContent}
      </>
    </BasicModal>
  );
};

export default DelegationModal;
