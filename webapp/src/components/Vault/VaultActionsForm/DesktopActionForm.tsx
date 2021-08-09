import React, { useState } from "react";

import ActionModal from "./Modal/ActionModal";
import { VaultOptions } from "shared/lib/constants/constants";

interface DesktopActionFormProps {
  vaultOption: VaultOptions;
}

const DesktopActionForm: React.FC<DesktopActionFormProps> = ({
  vaultOption,
}) => {
  const [showActionModal, setShowActionModal] = useState(false);

  return (
    <>
      <ActionModal
        vault={{ vaultOption, vaultVersion: "v1" }}
        variant={"desktop"}
        show={showActionModal}
        onClose={() => setShowActionModal(false)}
      />
    </>
  );
};

export default DesktopActionForm;
