import React from "react";
import { VaultVersion } from "shared/lib/constants/constants";
import { FormStepProps } from "../types";
import EarnActionForm from "../EarnActionForm";
interface VaultVersionProps {
  vaultVersion: VaultVersion;
}

const FormStep: React.FC<FormStepProps & VaultVersionProps> = ({
  vaultVersion,
  ...props
}) => {
  return <EarnActionForm {...props} />;
};
export default FormStep;
