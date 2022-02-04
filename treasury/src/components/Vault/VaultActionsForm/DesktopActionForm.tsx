import React, { useState } from "react";
import { useWeb3Wallet } from "webapp/lib/hooks/useWeb3Wallet";
import styled from "styled-components";

import ActionModal from "./Modal/ActionModal";
import {
  getEtherscanURI,
  VaultAddressMap,
  VaultOptions,
  VaultVersion,
} from "shared/lib/constants/constants";
import { useCallback } from "react";
import VaultV1ActionsForm from "webapp/lib/components/Vault/VaultActionsForm/VaultV1ActionsForm";
import VaultV2ActionsForm from "./VaultV2ActionForm";
import { BaseLink, Title } from "shared/lib/designSystem";
import { getVaultColor } from "shared/lib/utils/vault";
import { truncateAddress } from "shared/lib/utils/address";
import { ExternalIcon } from "shared/lib/assets/icons/icons";

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
  const { chainId } = useWeb3Wallet();
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
        return (
          <VaultV2ActionsForm
            vaultOption={vault.vaultOption}
            onFormSubmit={() => setShowActionModal(true)}
          />
        );
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

      {chainId && VaultAddressMap[vault.vaultOption][vault.vaultVersion] && (
        <BaseLink
          to={`${getEtherscanURI(chainId)}/address/${VaultAddressMap[
            vault.vaultOption
          ][vault.vaultVersion]!}`}
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
