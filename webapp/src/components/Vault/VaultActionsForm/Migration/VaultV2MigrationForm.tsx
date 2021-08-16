import React from "react";
import styled from "styled-components";

import { getAssets, VaultOptions } from "shared/lib/constants/constants";
import theme from "shared/lib/designSystem/theme";
import colors from "shared/lib/designSystem/colors";
import { PrimaryText, SecondaryText, Title } from "shared/lib/designSystem";
import { getAssetDecimals, getAssetDisplay } from "shared/lib/utils/asset";
import { VaultAccount } from "shared/lib/models/vault";
import { formatBigNumber } from "shared/lib/utils/math";
import { MigrateIcon } from "shared/lib/assets/icons/icons";
import { getVaultColor } from "shared/lib/utils/vault";
import { ActionButton } from "shared/lib/components/Common/buttons";

const MigrationFormContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  text-align: center;
  padding: 24px;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: ${theme.border.radius};
`;

const MigrateLogoContainer = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 100px;
  background: ${(props) => props.color}14;
`;

const FormTitle = styled(Title)`
  font-size: 22px;
  line-height: 28px;
  letter-spacing: 1px;
`;

const FormDescription = styled(PrimaryText)`
  color: ${colors.text};
`;

const FormDescriptionHighlight = styled.span`
  color: ${colors.primaryText};
`;

const PillButton = styled.div`
  padding: 10px 16px;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: 100px;
`;

interface VaultV2MigrationFormProps {
  vaultOption: VaultOptions;
  vaultAccount: VaultAccount;
}

const VaultV2MigrationForm: React.FC<VaultV2MigrationFormProps> = ({
  vaultOption,
  vaultAccount,
}) => {
  const asset = getAssets(vaultOption);
  const color = getVaultColor(vaultOption);

  return (
    <MigrationFormContainer>
      {/* Logo */}
      <MigrateLogoContainer color={color} className="mt-3">
        <MigrateIcon color={color} />
      </MigrateLogoContainer>

      {/* Texts */}
      <FormTitle className="mt-3">MIRGATE TO V2</FormTitle>
      <FormDescription className="mt-3">
        You can now move your V1 deposit balance of{" "}
        <FormDescriptionHighlight>
          {formatBigNumber(
            vaultAccount.totalBalance,
            6,
            getAssetDecimals(asset)
          )}{" "}
          {getAssetDisplay(asset)}
        </FormDescriptionHighlight>{" "}
        to the V2 vault
      </FormDescription>

      {/* Migrate button */}
      <ActionButton color={color} className="py-3 mt-4">
        MIGRATE {getAssetDisplay(asset)}
      </ActionButton>

      <SecondaryText className="mt-3">OR</SecondaryText>

      {/* Withdraw button */}
      <PillButton className="mt-3" role="button">
        <PrimaryText>Withdraw {getAssetDisplay(asset)}</PrimaryText>
      </PillButton>
    </MigrationFormContainer>
  );
};

export default VaultV2MigrationForm;
