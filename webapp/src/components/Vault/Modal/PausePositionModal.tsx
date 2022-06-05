import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { formatUnits } from "ethers/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

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
  Subtitle,
  Title,
} from "shared/lib/designSystem";
import AssetCircleContainer from "shared/lib/components/Common/AssetCircleContainer";
import {
  getAssetDecimals,
  getAssetDisplay,
  getAssetLogo,
} from "shared/lib/utils/asset";
import colors from "shared/lib/designSystem/colors";
import useVaultAccounts from "shared/lib/hooks/useVaultAccounts";

import { formatBigNumber, isPracticallyZero } from "shared/lib/utils/math";
import SegmentControl from "shared/lib/components/Common/SegmentControl";
import { BigNumber } from "ethers";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import HelpInfo from "shared/lib/components/Common/HelpInfo";
import CapBar from "shared/lib/components/Deposit/CapBar";
import { useLiquidityMiningPoolData } from "shared/lib/hooks/web3DataContext";
import { useGlobalState } from "shared/lib/store/store";
import { useWeb3Wallet } from "shared/lib/hooks/useWeb3Wallet";

const ModalContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const InfoLabel = styled(SecondaryText)`
  line-height: 16px;
`;

const PausePositionModal: React.FC = () => {
  const [vaultPauseModal, setVaultPauseModal] =
    useGlobalState("vaultPauseModal");
  const body = useMemo(() => {
    return (
      <>
        {/* Logo */}
        <BaseModalContentColumn></BaseModalContentColumn>

        {/* Position Info */}
        <BaseModalContentColumn marginTop={16}>
          <Subtitle color={colors.text}>Placeholder Modal</Subtitle>
        </BaseModalContentColumn>
        <BaseModalContentColumn marginTop={8}>
          <Title fontSize={40} lineHeight={40}></Title>
        </BaseModalContentColumn>
        <BaseModalContentColumn marginTop={8}></BaseModalContentColumn>

        {/* Secondary Info */}
        <BaseModalContentColumn>
          <div className="d-flex w-100 align-items-center ">
            <SecondaryText></SecondaryText>
            <Title className="ml-auto"></Title>
          </div>
        </BaseModalContentColumn>
        <BaseModalContentColumn>
          <div className="d-flex w-100 align-items-center ">
            <SecondaryText></SecondaryText>
            <Title className="ml-auto"></Title>
          </div>
        </BaseModalContentColumn>
      </>
    );
  }, []);

  return (
    <BasicModal
      show={vaultPauseModal.show}
      onClose={() => setVaultPauseModal((prev) => ({ ...prev, show: false }))}
      height={500}
    >
      <>
        <AnimatePresence initial={false} exitBeforeEnter>
          <ModalContent
            initial={{
              x: 100,
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            exit={{
              x: 100,
              opacity: 0,
            }}
            transition={{
              duration: 0.15,
              type: "keyframes",
              ease: "easeOut",
            }}
          >
            {body}
          </ModalContent>
        </AnimatePresence>

        <BaseModalContentColumn
          marginTop="auto"
          className="mb-2"
        ></BaseModalContentColumn>
      </>
    </BasicModal>
  );
};

export default PausePositionModal;
