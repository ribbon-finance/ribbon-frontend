import React from "react";
import { VaultVersion } from "shared/lib/constants/constants";
import { FormStepProps } from "../types";
import VaultV1ActionsForm from "../VaultV1ActionsForm";
import VaultV2ActionsForm from "../VaultV2ActionForm";

interface VaultVersionProps {
  vaultVersion: VaultVersion;
}

const FormStep: React.FC<FormStepProps & VaultVersionProps> = ({
  vaultVersion,
  ...props
}) => {
  switch (vaultVersion) {
    case "v1":
      return <VaultV1ActionsForm variant="mobile" {...props} />;
    case "v2":
      return <VaultV2ActionsForm />;
  }
};

export default FormStep;
