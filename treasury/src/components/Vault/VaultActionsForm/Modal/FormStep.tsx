import React from "react";
import { VaultVersion } from "shared/lib/constants/constants";
import { FormStepProps } from "../types";
import VaultV2ActionsForm from "../VaultV2ActionForm";

interface VaultVersionProps {
  vaultVersion: VaultVersion;
}

const FormStep: React.FC<FormStepProps & VaultVersionProps> = ({
  vaultVersion,
  ...props
}) => {
  return <VaultV2ActionsForm {...props} />;
};

export default FormStep;
