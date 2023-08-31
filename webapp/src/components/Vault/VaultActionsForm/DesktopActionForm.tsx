import React, { useState } from "react";
import styled from "styled-components";

import ActionModal from "./Modal/ActionModal";
import {
  getExplorerURI,
  VaultAddressMap,
  VaultOptions,
  VaultVersion,
  getVaultChain,
} from "shared/lib/constants/constants";
import { useCallback } from "react";
import VaultV1ActionsForm from "./VaultV1ActionsForm";
import VaultV2ActionsForm from "./VaultV2ActionForm";
import { BaseLink, Title } from "shared/lib/designSystem";
import { getVaultColor } from "shared/lib/utils/vault";
import { truncateAddress } from "shared/lib/utils/address";
import { ExternalIcon } from "shared/lib/assets/icons/icons";
import useVaultActionForm from "../../../hooks/useVaultActionForm";
import { ACTIONS } from "./Modal/types";

const ContractButton = styled.div<{ color: string }>`
  display: flex;
  justify-content: center;
  padding: 10px 16px;
  background: ${(props) => props.color}14;
  border-radius: 100px;
  margin-top: 24px;
`;

const ContractButtonTitle = styled(Title)`
  letter-spacing: 1px;
`;

interface DesktopActionFormProps {
  vault: {
    vaultOption: VaultOptions;
    vaultVersion: VaultVersion;
  };
}

const DesktopActionForm: React.FC<DesktopActionFormProps> = ({ vault }) => {
  const [showActionModal, setShowActionModal] = useState(false);

  const { vaultActionForm, handleActionTypeChange } = useVaultActionForm(vault.vaultOption);
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
      case "earn":
      case "v2":
        return (
          <VaultV2ActionsForm
            vaultOption={vault.vaultOption}
            onFormSubmit={() => setShowActionModal(true)}
          />
        );
    }
  }, [vault]);

  const reset = useCallback(() => {
    if (vaultActionForm.withdrawOption === "complete") {
      handleActionTypeChange(ACTIONS.withdraw, "v2", {
        withdrawOption: "standard",
      });
    }
    setShowActionModal(false);
  }, [handleActionTypeChange, vaultActionForm.withdrawOption]);
  return (
    <>
      <ActionModal
        vault={vault}
        variant={"desktop"}
        show={showActionModal}
        onClose={() => {
         reset();
        }}
      />
      {renderForm()}

      {VaultAddressMap[vault.vaultOption][vault.vaultVersion] && (
        <BaseLink
          to={`${getExplorerURI(
            getVaultChain(vault.vaultOption)
          )}/address/${VaultAddressMap[vault.vaultOption][
            vault.vaultVersion
          ]!}`}
          target="_blank"
          rel="noreferrer noopener"
          className="w-100"
        >
          <ContractButton color={getVaultColor(vault.vaultOption)}>
            <ContractButtonTitle
              fontSize={14}
              lineHeight={20}
              color={getVaultColor(vault.vaultOption)}
              className="mr-2"
            >
              {`CONTRACT: ${truncateAddress(
                VaultAddressMap[vault.vaultOption][vault.vaultVersion]!
              )}`}
            </ContractButtonTitle>
            <ExternalIcon color={getVaultColor(vault.vaultOption)} />
          </ContractButton>
        </BaseLink>
      )}
    </>
  );
};

export default DesktopActionForm;
