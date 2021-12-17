import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import BasicModal from "shared/lib/components/Common/BasicModal";
import colors from "shared/lib/designSystem/colors";
import { BaseModalContentColumn } from "shared/lib/designSystem";
import { DelegateIcon } from "shared/lib/assets/icons/icons";
import DelegationModalOption from "./DelegationModalOption";
import DelegationModalForm from "./DelegationModalForm";

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
  const [mode, setMode] = useState<DelegationModalMode>(
    delegationModalModes[0]
  );

  useEffect(() => {
    if (!show) {
      setMode(delegationModalModes[0]);
    }
  }, [show]);

  const modalContent = useMemo(() => {
    switch (mode) {
      case "options":
        return (
          <DelegationModalOption
            onDelegateSelf={() => onClose()}
            onDelegateOthers={() => setMode("form")}
          />
        );
      case "form":
        return (
          <DelegationModalForm
            onBack={() => setMode("options")}
            onDelegate={() => onClose()}
          />
        );
    }
  }, [mode, onClose]);

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
