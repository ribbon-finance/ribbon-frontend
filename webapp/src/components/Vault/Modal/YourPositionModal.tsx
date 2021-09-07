import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { formatUnits } from "ethers/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

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
  SecondaryText,
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
import SegmentControl from "shared/lib/components/Common/SegmentControl";
import { BigNumber } from "ethers";

const PositionData = styled(Title)`
  font-size: 40px;
  line-height: 40px;
`;

const ModalContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

interface YourPositionModalProps {
  vault: {
    vaultOption: VaultOptions;
    vaultVersion: VaultVersion;
  };
}

const ModeList = ["deposits", "staking"] as const;
type ModeType = typeof ModeList[number];

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
  const [mode, setMode] = useState<ModeType>(ModeList[0]);

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

  const [investedInStrategy, queuedAmount, yieldEarned] = useMemo(() => {
    switch (vaultVersion) {
      case "v1":
        if (!vaultAccount) {
          return [BigNumber.from(0), undefined, BigNumber.from(0)];
        }

        return [
          vaultAccount.totalBalance,
          undefined,
          vaultAccount.totalYieldEarned,
        ];
      case "v2":
        return [BigNumber.from(0), BigNumber.from(0), BigNumber.from(0)];
    }
  }, [vaultAccount, vaultVersion]);

  const body = useMemo(() => {
    if (!vaultAccount) {
      return <></>;
    }

    switch (mode) {
      case "deposits":
        return (
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

            {/* Secondary Info */}
            <BaseModalContentColumn>
              <div className="d-flex w-100 align-items-center justify-content-between">
                <SecondaryText>Invested in Strategy</SecondaryText>
                <Title>
                  {formatBigNumber(investedInStrategy, decimals)}{" "}
                  {getAssetDisplay(asset)}
                </Title>
              </div>
            </BaseModalContentColumn>
            {queuedAmount && (
              <BaseModalContentColumn>
                <div className="d-flex w-100 align-items-center justify-content-between">
                  <SecondaryText>Queued</SecondaryText>
                  <Title>
                    {formatBigNumber(queuedAmount, decimals)}{" "}
                    {getAssetDisplay(asset)}
                  </Title>
                </div>
              </BaseModalContentColumn>
            )}
            <BaseModalContentColumn>
              <div className="d-flex w-100 align-items-center justify-content-between">
                <SecondaryText>Yield Earned</SecondaryText>
                <Title>
                  {formatBigNumber(yieldEarned, decimals)}{" "}
                  {getAssetDisplay(asset)}
                </Title>
              </div>
            </BaseModalContentColumn>
          </>
        );
      case "staking":
        return <></>;
    }
  }, [
    Logo,
    asset,
    color,
    decimals,
    investedInStrategy,
    mode,
    queuedAmount,
    roi,
    vaultAccount,
    yieldEarned,
  ]);

  if (vaultAccount && !isPracticallyZero(vaultAccount.totalBalance, decimals)) {
    return (
      <BasicModal
        show={show}
        onClose={() => setShow(false)}
        height={500}
        theme={color}
      >
        <>
          <AnimatePresence initial={false} exitBeforeEnter>
            <ModalContent
              key={mode}
              initial={{
                x: mode === ModeList[0] ? -100 : 100,
                opacity: 0,
              }}
              animate={{
                x: 0,
                opacity: 1,
              }}
              exit={{
                x: mode === ModeList[0] ? -100 : 100,
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

          <BaseModalContentColumn marginTop="auto" className="mb-2">
            <SegmentControl
              segments={ModeList.map((mode) => ({
                value: mode,
                display: mode.toUpperCase(),
              }))}
              value={mode}
              onSelect={(value) => {
                setMode(value as ModeType);
              }}
              config={{
                theme: "outline",
                color: color,
                widthType: "fullWidth",
              }}
            />
          </BaseModalContentColumn>
        </>
      </BasicModal>
    );
  }

  return <></>;
};

export default YourPositionModal;
