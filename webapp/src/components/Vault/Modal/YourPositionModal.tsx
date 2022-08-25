import React, { useMemo, useState, useEffect } from "react";
import styled from "styled-components";
import { formatUnits } from "ethers/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

import { isStakingEnabledForChainId } from "shared/lib/utils/env";
import {
  getDisplayAssets,
  VaultList,
  VaultAddressMap,
  isSolanaVault,
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
import { getAssetDisplay, getAssetLogo } from "shared/lib/utils/asset";
import colors from "shared/lib/designSystem/colors";
import useVaultAccounts from "shared/lib/hooks/useVaultAccounts";

import { formatBigNumber, isPracticallyZero } from "shared/lib/utils/math";
import SegmentControl from "shared/lib/components/Common/SegmentControl";
import { BigNumber } from "ethers";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import HelpInfo from "shared/lib/components/Common/HelpInfo";
import CapBar from "shared/lib/components/Deposit/CapBar";
import {
  useLiquidityMiningPoolData,
  useV2VaultData,
} from "shared/lib/hooks/web3DataContext";
import { useGlobalState } from "shared/lib/store/store";
import { useWeb3Wallet } from "shared/lib/hooks/useWeb3Wallet";
import { RibbonVaultPauser } from "shared/lib/codegen";
import useVaultPauser from "shared/lib/hooks/useV2VaultPauserContract";
const ModalContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const InfoLabel = styled(SecondaryText)`
  line-height: 16px;
`;

const YourPositionModal: React.FC = () => {
  const [vaultPositionModal, setVaultPositionModal] =
    useGlobalState("vaultPositionModal");
  const [pausedAmount, setPausedAmount] = useState(BigNumber.from(0));
  const { account, chainId } = useWeb3Wallet();
  const contract = useVaultPauser(chainId || 1) as RibbonVaultPauser;
  const vaultOption = vaultPositionModal.vaultOption || VaultList[0];
  const vaultVersion = vaultPositionModal.vaultVersion;
  const vaultAddress = VaultAddressMap[vaultOption][vaultVersion];
  const color = getVaultColor(vaultOption);
  const Logo = getAssetLogo(getDisplayAssets(vaultOption));

  const { vaultAccounts } = useVaultAccounts(vaultVersion);
  const { data: stakingPoolData } = useLiquidityMiningPoolData(vaultOption);
  const {
    data: { asset, decimals, depositBalanceInAsset },
  } = useV2VaultData(vaultOption);

  useEffect(() => {
    if (contract && vaultAddress && account && !isSolanaVault(vaultOption)) {
      contract
        .getPausePosition(vaultAddress, account)
        .then(([, pauseAmount]) => {
          setPausedAmount(pauseAmount);
        });
    }
  }, [contract, vaultAddress, account, decimals, vaultOption]);

  const ModeList: string[] = isStakingEnabledForChainId(chainId)
    ? ["deposits", "staking"]
    : ["deposits"];

  const [mode, setMode] = useState<string>(ModeList[0]);

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
          vaultAccount.totalBalance
            .add(pausedAmount)
            .sub(vaultAccount.totalDeposits),
          decimals
        )
      ) /
        parseFloat(
          formatUnits(vaultAccount.totalDeposits.add(pausedAmount), decimals)
        )) *
      100
    );
  }, [pausedAmount, vaultAccounts, vaultOption, decimals]);

  const vaultAccount = vaultAccounts[vaultOption];

  const [investedInStrategy, queuedAmount, yieldEarned] = useMemo(() => {
    switch (vaultVersion) {
      case "v1":
        if (!vaultAccount) {
          return [BigNumber.from(0), BigNumber.from(0), BigNumber.from(0)];
        }
        return [
          vaultAccount.totalBalance,
          BigNumber.from(0),
          vaultAccount.totalYieldEarned,
        ];
      case "earn":
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
                <Logo width={"100%"} height={"100%"} />
              </AssetCircleContainer>
            </BaseModalContentColumn>

            {/* Position Info */}
            <BaseModalContentColumn marginTop={16}>
              <Subtitle color={colors.text}>
                POSITION ({getAssetDisplay(asset)})
              </Subtitle>
            </BaseModalContentColumn>
            <BaseModalContentColumn marginTop={8}>
              <Title fontSize={40} lineHeight={40}>
                {vaultAccount
                  ? formatBigNumber(
                      vaultAccount.totalBalance.add(pausedAmount),
                      decimals
                    )
                  : "0.00"}
              </Title>
            </BaseModalContentColumn>
            <BaseModalContentColumn marginTop={8}>
              <Subtitle color={roi >= 0 ? colors.green : colors.red}>
                {`${roi >= 0 ? "+" : ""}${parseFloat(roi.toFixed(4))}%`}
              </Subtitle>
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
                    {formatBigNumber(depositBalanceInAsset, decimals)}{" "}
                    {getAssetDisplay(asset)}
                  </Title>
                </div>
              </BaseModalContentColumn>
            )}
            <BaseModalContentColumn>
              <div className="d-flex w-100 align-items-center ">
                <SecondaryText>Paused</SecondaryText>
                <TooltipExplanation
                  title="PAUSED"
                  explanation="The amount that is currently paused and not invested in the vault's strategy."
                  renderContent={({ ref, ...triggerHandler }) => (
                    <HelpInfo containerRef={ref} {...triggerHandler}>
                      i
                    </HelpInfo>
                  )}
                />
                <Title className="ml-auto">
                  {formatBigNumber(pausedAmount, decimals)}{" "}
                  {getAssetDisplay(asset)}
                </Title>
              </div>
            </BaseModalContentColumn>
            <BaseModalContentColumn>
              <div className="d-flex w-100 align-items-center ">
                <SecondaryText>Yield Earned</SecondaryText>
                <Title className="ml-auto">
                  {formatBigNumber(yieldEarned, decimals)}{" "}
                  {getAssetDisplay(asset)}
                </Title>
              </div>
            </BaseModalContentColumn>
          </>
        );
      case "staking":
        return (
          <>
            {/* Logo */}
            <BaseModalContentColumn className="mb-4">
              <AssetCircleContainer size={96} color={color}>
                <Logo width={48} height={48} />
              </AssetCircleContainer>
            </BaseModalContentColumn>

            <CapBar
              loading={false}
              current={
                vaultAccount
                  ? parseFloat(
                      formatUnits(vaultAccount.totalStakedBalance, decimals)
                    )
                  : 0
              }
              cap={
                vaultAccount
                  ? parseFloat(formatUnits(vaultAccount.totalBalance, decimals))
                  : 0
              }
              copies={{
                current: "Staked",
                cap: "Position",
              }}
              labelConfig={{
                fontSize: 14,
              }}
              statsConfig={{
                fontSize: 14,
              }}
              barConfig={{
                height: 4,
                extraClassNames: "my-3",
                radius: 2,
              }}
              asset={asset}
            />

            <BaseModalContentColumn>
              <div className="d-flex w-100 align-items-center ">
                <InfoLabel>RBN Earned</InfoLabel>
                <Title
                  fontSize={14}
                  lineHeight={16}
                  className="ml-auto"
                  color={colors.products.yield}
                >
                  {formatBigNumber(
                    vaultVersion === "v1"
                      ? stakingPoolData.claimableRbn
                      : BigNumber.from(0),
                    18,
                    2
                  )}{" "}
                  RBN
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
    depositBalanceInAsset,
    mode,
    queuedAmount,
    pausedAmount,
    roi,
    stakingPoolData.claimableRbn,
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
      height={ModeList.length > 1 ? 550 : 470}
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

        {ModeList.length > 1 && (
          <BaseModalContentColumn marginTop="auto" className="mb-2">
            <SegmentControl
              segments={ModeList.map((mode) => ({
                value: mode,
                display: mode.toUpperCase(),
              }))}
              value={mode}
              onSelect={(value) => {
                setMode(value);
              }}
              config={{
                theme: "outline",
                color: color,
                widthType: "fullWidth",
              }}
            />
          </BaseModalContentColumn>
        )}
      </>
    </BasicModal>
  );
};

export default YourPositionModal;
