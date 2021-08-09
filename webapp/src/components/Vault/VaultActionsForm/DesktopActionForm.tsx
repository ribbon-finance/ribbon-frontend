import React, { useState } from "react";

import ActionModal from "./Modal/ActionModal";
import { VaultOptions, VaultVersion } from "shared/lib/constants/constants";
import { useCallback } from "react";
import VaultV1ActionsForm from "./VaultV1ActionsForm";
import VaultV2ActionsForm from "./VaultV2ActionForm";

interface DesktopActionFormProps {
  vault: {
    vaultOption: VaultOptions;
    vaultVersion: VaultVersion;
  };
}

const DesktopActionForm: React.FC<DesktopActionFormProps> = ({ vault }) => {
  const [showActionModal, setShowActionModal] = useState(false);

  const renderForm = useCallback(() => {
    switch (vault.vaultVersion) {
      case "v1":
        return (
          <VaultV1ActionsForm
            variant="desktop"
            vaultOption={vault.vaultOption}
            onFormSubmit={() => setShowActionModal(true)}
          />
        );
      case "v2":
        return <VaultV2ActionsForm />;
    }
  }, [vault]);

  return (
    <>
      <ActionModal
        vault={vault}
        variant={"desktop"}
        show={showActionModal}
        onClose={() => setShowActionModal(false)}
      />
      {renderForm()}
    </>
  );
};

export default DesktopActionForm;
