import React, { useState } from "react";

import ActionModal from "./Modal/ActionModal";
import { VaultOptions } from "../../../../../shared/lib/constants/constants";

interface DesktopActionFormProps {
  variant: "desktop" | "mobile";
  vaultOption: VaultOptions;
}

const DesktopActionForm: React.FC<DesktopActionFormProps> = ({
  variant,
  vaultOption,
}) => {
  const [showActionModal, setShowActionModal] = useState(false);

  return (
    <>
      {variant === "desktop" && (
        <ActionModal
          vault={{ vaultOption, vaultVersion: "v1" }}
          variant={"desktop"}
          show={showActionModal}
          onClose={() => setShowActionModal(false)}
        />
      )}
    </>
  );
};

export default DesktopActionForm;
