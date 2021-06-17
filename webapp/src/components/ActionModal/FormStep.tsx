import React from "react";
import ActionsForm, { FormStepProps } from "../ActionsForm/ActionsForm";

const FormStep: React.FC<FormStepProps> = ({ vaultOption, onSubmit }) => {
  return (
    <>
      <div>
        <ActionsForm
          vaultOption={vaultOption}
          variant="mobile"
          onSubmit={onSubmit}
        ></ActionsForm>
      </div>
    </>
  );
};

export default FormStep;
