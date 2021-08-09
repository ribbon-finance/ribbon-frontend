import { VaultOptions } from "shared/lib/constants/constants";

export interface FormStepProps {
  vaultOption: VaultOptions;
  onFormSubmit: () => void;
}
