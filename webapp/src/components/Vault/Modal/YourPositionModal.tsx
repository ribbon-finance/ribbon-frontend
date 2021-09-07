import React, { useMemo } from "react";
import styled from "styled-components";
import { formatUnits } from "ethers/lib/utils";

import {
  getAssets,
  VaultOptions,
  VaultVersion,
} from "shared/lib/constants/constants";
import BasicModal from "shared/lib/components/Common/BasicModal";
import { useWebappGlobalState } from "../../../store/store";
import { getVaultColor } from "shared/lib/utils/vault";
import {
  BaseModalContentColumn,
  Subtitle,
  Title,
} from "shared/lib/designSystem";
import AssetCircleContainer from "../../Common/AssetCircleContainer";
import {
  getAssetDecimals,
  getAssetDisplay,
  getAssetLogo,
} from "shared/lib/utils/asset";
import colors from "shared/lib/designSystem/colors";
import useVaultAccounts from "shared/lib/hooks/useVaultAccounts";
import { formatBigNumber, isPracticallyZero } from "shared/lib/utils/math";

const PositionData = styled(Title)`
  font-size: 40px;
  line-height: 40px;
`;

interface YourPositionModalProps {
  vault: {
    vaultOption: VaultOptions;
    vaultVersion: VaultVersion;
  };
}

const YourPositionModal: React.FC<YourPositionModalProps> = ({
  vault: { vaultOption, vaultVersion },
}) => {
  const color = getVaultColor(vaultOption);
  const asset = getAssets(vaultOption);
  const decimals = getAssetDecimals(asset);
  const Logo = getAssetLogo(asset);

  const vaultOptions = useMemo(() => [vaultOption], [vaultOption]);
  const { vaultAccounts } = useVaultAccounts(vaultOptions, vaultVersion);

  const [show, setShow] = useWebappGlobalState("showVaultPosition");

  const roi = useMemo(() => {
    const vaultAccount = vaultAccounts[vaultOption];

    if (
      !vaultAccount ||
      isPracticallyZero(vaultAccount.totalDeposits, decimals)
    ) {
      return 0;
    }

    return (
      (parseFloat(
        formatUnits(
          vaultAccount.totalBalance.sub(vaultAccount.totalDeposits),
          decimals
        )
      ) /
        parseFloat(formatUnits(vaultAccount.totalDeposits, decimals))) *
      100
    );
  }, [vaultAccounts, vaultOption, decimals]);

  const vaultAccount = vaultAccounts[vaultOption];

  if (vaultAccount && !isPracticallyZero(vaultAccount.totalBalance, decimals)) {
    return (
      <BasicModal
        show={show}
        onClose={() => setShow(false)}
        height={500}
        theme={color}
      >
        <>
          {/* Logo */}
          <BaseModalContentColumn>
            <AssetCircleContainer size={96} color={color}>
              <Logo width={48} height={48} />
            </AssetCircleContainer>
          </BaseModalContentColumn>

          {/* Position Info */}
          <BaseModalContentColumn marginTop={16}>
            <Subtitle color={colors.text}>
              POSITION {getAssetDisplay(asset)}
            </Subtitle>
          </BaseModalContentColumn>
          <BaseModalContentColumn marginTop={8}>
            <PositionData>
              {formatBigNumber(vaultAccount.totalBalance, decimals)}
            </PositionData>
          </BaseModalContentColumn>
          <BaseModalContentColumn marginTop={8}>
            <Subtitle color={roi >= 0 ? colors.green : colors.red}>
              {`${roi >= 0 ? "+" : ""}${parseFloat(roi.toFixed(4))}%`}
            </Subtitle>
          </BaseModalContentColumn>
        </>
      </BasicModal>
    );
  }

  return <></>;
};

export default YourPositionModal;
