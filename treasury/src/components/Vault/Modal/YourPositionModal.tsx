import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { formatUnits } from "ethers/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

import {
  getAssets,
  getDisplayAssets,
  VaultList,
} from "../../../constants/constants";
import BasicModal from "shared/lib/components/Common/BasicModal";
import { getVaultColor } from "../../../utils/vault";
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
} from "../../../utils/asset";
import colors from "shared/lib/designSystem/colors";
import useVaultAccounts from "../../../hooks/useVaultAccounts";

import { formatBigNumber, isPracticallyZero } from "shared/lib/utils/math";
import SegmentControl from "shared/lib/components/Common/SegmentControl";
import { BigNumber } from "ethers";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import HelpInfo from "shared/lib/components/Common/HelpInfo";
import CapBar from "shared/lib/components/Deposit/CapBar";
import { useStakingPoolData } from "shared/lib/hooks/web3DataContext";
import { useGlobalState } from "../../../store/store";
import useVaultActivity from "../../../hooks/useVaultActivity";

const ModalContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const InfoLabel = styled(SecondaryText)`
  line-height: 16px;
`;

const ModeList = ["deposits", "staking"] as const;
type ModeType = typeof ModeList[number];

const YourPositionModal: React.FC = () => {
  const [vaultPositionModal, setVaultPositionModal] =
    useGlobalState("vaultPositionModal");
  const vaultOption = vaultPositionModal.vaultOption || VaultList[0];
  const vaultVersion = vaultPositionModal.vaultVersion;
  const premiumDecimals = getAssetDecimals("USDC");
  const activities = useVaultActivity(vaultOption!, vaultVersion);

  const totalYields = activities.activities.map((activity) => {
    return (activity.type == "sales")
      ? Number(activity.premium)
      :0
  }).reduce((totalYield, roundlyYield) => totalYield + roundlyYield, 0) 
  / (10 ** premiumDecimals)  

  const color = getVaultColor(vaultOption);
  const asset = getAssets(vaultOption);
  const decimals = getAssetDecimals(asset);
  const Logo = getAssetLogo(getDisplayAssets(vaultOption));

  const { vaultAccounts } = useVaultAccounts(vaultVersion);

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
        if (!vaultAccount) {
          return [BigNumber.from(0), BigNumber.from(0), BigNumber.from(0)];
        }
        return [
          vaultAccount.totalBalance.sub(vaultAccount.totalPendingDeposit),
          vaultAccount.totalPendingDeposit,
          vaultAccount.totalYieldEarned,
        ];
    }
  }, [vaultAccount, vaultVersion]);

  const body = useMemo(() => {
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
              <Title fontSize={40} lineHeight={40}>
                {vaultAccount
                  ? formatBigNumber(vaultAccount.totalBalance, decimals)
                  : "0.00"} 
              </Title>
            </BaseModalContentColumn>
            <BaseModalContentColumn marginTop={8}>
              {/* <Subtitle color={roi >= 0 ? colors.green : colors.red}>
                {`${roi >= 0 ? "+" : ""}${parseFloat(roi.toFixed(4))}%`}
              </Subtitle> */}
            </BaseModalContentColumn>

            {/* Secondary Info */}
            <BaseModalContentColumn>
              <div className="d-flex w-100 align-items-center ">
                <SecondaryText>Invested</SecondaryText>
                <TooltipExplanation
                  title="INVESTED"
                  explanation="The amount that is currently invested in the vault's strategy."
                  renderContent={({ ref, ...triggerHandler }) => (
                    <HelpInfo containerRef={ref} {...triggerHandler}>
                      i
                    </HelpInfo>
                  )}
                />
                <Title className="ml-auto">
                  {formatBigNumber(investedInStrategy, decimals)}{" "}
                  {getAssetDisplay(asset)}
                </Title>
              </div>
            </BaseModalContentColumn>
            {queuedAmount && (
              <BaseModalContentColumn>
                <div className="d-flex w-100 align-items-center ">
                  <SecondaryText>Queued</SecondaryText>
                  <TooltipExplanation
                    title="QUEUED"
                    explanation="The amount that has been queued for investment in the vault's strategy. Queued funds will automatically be invested in the vault's next weekly strategy on Friday at 11am UTC."
                    renderContent={({ ref, ...triggerHandler }) => (
                      <HelpInfo containerRef={ref} {...triggerHandler}>
                        i
                      </HelpInfo>
                    )}
                  />
                  <Title className="ml-auto">
                    {formatBigNumber(queuedAmount, decimals)}{" "}
                    {getAssetDisplay(asset)}
                  </Title>
                </div>
              </BaseModalContentColumn>
            )}
            <BaseModalContentColumn>
              <div className="d-flex w-100 align-items-center ">
                <SecondaryText>Yield Earned</SecondaryText>
                <Title className="ml-auto">
                  {totalYields.toFixed(2)}{" "}
                  {getAssetDisplay("USDC")}
                </Title>
              </div>
            </BaseModalContentColumn>
          </>
        );
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
    vaultVersion,
    yieldEarned,
  ]);

  return (
    <BasicModal
      show={vaultPositionModal.show}
      onClose={() =>
        setVaultPositionModal((prev) => ({ ...prev, show: false }))
      }
      height={400}
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

        {/* <BaseModalContentColumn marginTop="auto" className="mb-2">
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
        </BaseModalContentColumn> */}
      </>
    </BasicModal>
  );
};

export default YourPositionModal;
