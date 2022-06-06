import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { formatUnits } from "ethers/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { isStakingEnabledForChainId } from "shared/lib/utils/env";
import {
  getAssets,
  getDisplayAssets,
  VaultList,
} from "shared/lib/constants/constants";
import BasicModal from "shared/lib/components/Common/BasicModal";
import { getVaultColor } from "shared/lib/utils/vault";
import {
  BaseModalContentColumn,
  SecondaryText,
  Title,
} from "shared/lib/designSystem";
import {
  getAssetDecimals,
  getAssetDisplay,
  getAssetLogo,
} from "shared/lib/utils/asset";
import useVaultAccounts from "shared/lib/hooks/useVaultAccounts";
import theme from "shared/lib/designSystem/theme";
import { formatBigNumber, isPracticallyZero } from "shared/lib/utils/math";
import { BigNumber } from "ethers";
import { useLiquidityMiningPoolData } from "shared/lib/hooks/web3DataContext";
import { useGlobalState } from "shared/lib/store/store";
import { useWeb3Wallet } from "shared/lib/hooks/useWeb3Wallet";
import { PauseIcon } from "shared/lib/assets/icons/icons";
import { ActionButton } from "shared/lib/components/Common/buttons";
const ActionLogoContainer = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 1000px;
  background: ${(props) => props.color}14;
`;

const TextContainer = styled.div`
  border-radius: 4px;
  background: #1c1c22;
  padding: 16px 16px 16px 16px;
`;

const FormTitle = styled(Title)`
  font-size: 22px;
  line-height: 28px;
`;

const PausePositionModal: React.FC = () => {
  const [vaultPauseModal, setVaultPauseModal] =
    useGlobalState("vaultPauseModal");
  const vaultOption = vaultPauseModal.vaultOption || VaultList[0];
  const vaultVersion = vaultPauseModal.vaultVersion;

  const color = getVaultColor(vaultOption);
  const asset = getAssets(vaultOption);
  const decimals = getAssetDecimals(asset);

  const { chainId } = useWeb3Wallet();
  const { vaultAccounts } = useVaultAccounts(vaultVersion);

  const vaultAccount = vaultAccounts[vaultOption];
  const { t } = useTranslation();
  const body = useMemo(() => {
    return (
      <>
        {/* Logo */}
        <BaseModalContentColumn>
          <ActionLogoContainer color={color}>
            <PauseIcon color={color} width={64} />
          </ActionLogoContainer>
        </BaseModalContentColumn>
        {/* Position Info */}
        <BaseModalContentColumn marginTop={8}>
          {/* Title */}
          <FormTitle className="mt-2 text-center">PAUSE POSITION</FormTitle>
        </BaseModalContentColumn>
        <div className="pl-2 pr-2">
          <BaseModalContentColumn marginTop={8}>
            {/* Description */}
            <SecondaryText className=" text-center">
              {t("shared:ProductCopies:Pause:explanation")}
            </SecondaryText>
          </BaseModalContentColumn>
        </div>
        {/* Secondary Info */}
        <div className="mt-4">
          <TextContainer>
            <BaseModalContentColumn marginTop={0}>
              <div className="d-flex w-100 align-items-center ">
                <SecondaryText fontWeight={500} color="#FFFFFF7A">
                  Position
                </SecondaryText>
                <Title fontSize={14} className="ml-auto">
                  16.00{/*placeholder*/} {getAssetDisplay(asset)}
                </Title>
              </div>
            </BaseModalContentColumn>
            <BaseModalContentColumn marginTop={16}>
              <div className="d-flex w-100 align-items-center ">
                <SecondaryText fontWeight={500} color="#FFFFFF7A">
                  Paused From
                </SecondaryText>
                <Title fontSize={14} className="ml-auto">
                  03 MAY, 2022{/*placeholder*/}
                </Title>
              </div>
            </BaseModalContentColumn>
          </TextContainer>
        </div>
        <div className="mt-4">
          {/* Button */}
          <ActionButton className="btn py-3 mb-4" color={color}>
            Confirm
          </ActionButton>
        </div>
      </>
    );
  }, [t, asset, color]);

  return (
    <BasicModal
      show={vaultPauseModal.show}
      onClose={() => setVaultPauseModal((prev) => ({ ...prev, show: false }))}
      height={495}
    >
      {body}
    </BasicModal>
  );
};

export default PausePositionModal;
