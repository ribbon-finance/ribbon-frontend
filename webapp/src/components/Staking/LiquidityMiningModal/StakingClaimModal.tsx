import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";

import { StakingVaultOptions } from "shared/lib/constants/constants";
import {
  BaseUnderlineLink,
  BaseModalContentColumn,
  SecondaryText,
  Title,
  PrimaryText,
} from "shared/lib/designSystem";
import { LiquidityMiningPoolResponse } from "shared/lib/models/staking";
import { formatBigNumber } from "shared/lib/utils/math";
import { BigNumber } from "@ethersproject/bignumber";
import moment from "moment";
import { ExternalIcon } from "shared/lib/assets/icons/icons";
import { ActionButton } from "shared/lib/components/Common/buttons";
import useStakingReward from "shared/lib/hooks/useStakingReward";
import { usePendingTransactions } from "shared/lib/hooks/pendingTransactionsContext";
import { useWeb3Context } from "shared/lib/hooks/web3Context";
import RBNClaimModalContent from "shared/lib/components/Common/RBNClaimModalContent";
import { getVaultColor } from "shared/lib/utils/vault";
import ModalContentExtra from "shared/lib/components/Common/ModalContentExtra";
import BasicModal from "shared/lib/components/Common/BasicModal";

const LogoContainer = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 100px;
  background: ${(props) => props.color}29;
`;

const AssetTitle = styled(Title)<{ str: string }>`
  text-transform: none;

  ${(props) =>
    props.str.length > 12
      ? `
    font-size: 24px;
    line-height: 36px;
  `
      : `
    font-size: 40px;
    line-height: 52px;
  `}
`;

const InfoColumn = styled(BaseModalContentColumn)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const InfoData = styled(Title)`
  text-transform: none;
`;

const WarningText = styled(PrimaryText)<{ color: string }>`
  display: flex;
  color: ${(props) => props.color};
  font-size: 14px;
  line-height: 20px;
  text-align: center;
`;

interface StakingClaimModalProps {
  show: boolean;
  onClose: () => void;
  logo: React.ReactNode;
  vaultOption: StakingVaultOptions;
  stakingPoolData: LiquidityMiningPoolResponse;
}

const StakingClaimModal: React.FC<StakingClaimModalProps> = ({
  show,
  onClose,
  logo,
  vaultOption,
  stakingPoolData,
}) => {
  const { provider } = useWeb3Context();
  const [step, setStep] = useState<"info" | "claim" | "claiming" | "claimed">(
    "info"
  );
  const stakingReward = useStakingReward(vaultOption);
  const { addPendingTransaction } = usePendingTransactions();

  const handleClose = useCallback(() => {
    onClose();
    if (step === "claim" || step === "claimed") {
      setStep("info");
    }
  }, [onClose, step]);

  const handleClaim = useCallback(async () => {
    if (!stakingReward) {
      return;
    }
    setStep("claim");

    try {
      const tx = await stakingReward.exit();

      setStep("claiming");

      const txhash = tx.hash;

      addPendingTransaction({
        txhash,
        type: "rewardClaim",
        amount: formatBigNumber(stakingPoolData.claimableRbn, 18),
        stakeAsset: vaultOption,
      });

      await provider.waitForTransaction(txhash, 2);
      setStep("claimed");
    } catch (err) {
      setStep("info");
    }
  }, [
    addPendingTransaction,
    provider,
    stakingPoolData,
    stakingReward,
    vaultOption,
  ]);

  const timeTillNextRewardWeek = useMemo(() => {
    const startDate = moment
      .utc("2021-06-18")
      .set("hour", 10)
      .set("minute", 30);

    let weekCount;

    if (moment().diff(startDate) < 0) {
      weekCount = 1;
    } else {
      weekCount = moment().diff(startDate, "weeks") + 2;
    }

    // Next stake reward date
    const nextStakeReward = startDate.add(weekCount - 1, "weeks");

    const endStakeReward = moment
      .utc("2021-07-16")
      .set("hour", 10)
      .set("minute", 30);

    if (endStakeReward.diff(moment()) <= 0) {
      return "Program Ended";
    }

    // Time till next stake reward date
    const startTime = moment.duration(
      nextStakeReward.diff(moment()),
      "milliseconds"
    );

    return `${startTime.days()}D ${startTime.hours()}H ${startTime.minutes()}M`;
  }, []);

  const body = useMemo(() => {
    const color = getVaultColor(vaultOption);
    switch (step) {
      case "info":
        const periodFinish = stakingPoolData.periodFinish
          ? moment(stakingPoolData.periodFinish, "X")
          : undefined;
        return (
          <>
            <BaseModalContentColumn>
              <LogoContainer color={color}>{logo}</LogoContainer>
            </BaseModalContentColumn>
            <BaseModalContentColumn marginTop={8}>
              <AssetTitle str={vaultOption}>{vaultOption}</AssetTitle>
            </BaseModalContentColumn>
            <InfoColumn marginTop={40}>
              <SecondaryText>Unclaimed $RBN</SecondaryText>
              <InfoData>
                {formatBigNumber(stakingPoolData.claimableRbn, 18)}
              </InfoData>
            </InfoColumn>
            <InfoColumn>
              <SecondaryText>Claimed $RBN</SecondaryText>
              <InfoData>
                {formatBigNumber(
                  stakingPoolData.claimHistory.reduce(
                    (acc, curr) => acc.add(curr.amount),
                    BigNumber.from(0)
                  ),
                  18
                )}
              </InfoData>
            </InfoColumn>
            <InfoColumn>
              <SecondaryText>Time till next reward</SecondaryText>
              <InfoData>{timeTillNextRewardWeek}</InfoData>
            </InfoColumn>
            <InfoColumn>
              <div className="d-flex align-items-center">
                <SecondaryText>Pool rewards</SecondaryText>
              </div>
              <InfoData>
                {formatBigNumber(stakingPoolData.poolRewardForDuration, 18)} RBN
              </InfoData>
            </InfoColumn>
            <BaseModalContentColumn marginTop="auto">
              <BaseUnderlineLink
                to="https://ribbonfinance.medium.com/rbn-airdrop-distribution-70b6cb0b870c"
                target="_blank"
                rel="noreferrer noopener"
                className="d-flex align-items-center"
              >
                <SecondaryText>Read about $RBN</SecondaryText>
                <ExternalIcon className="ml-1" />
              </BaseUnderlineLink>
            </BaseModalContentColumn>
            {periodFinish && periodFinish.diff(moment()) > 0 ? (
              <ModalContentExtra>
                <WarningText color={color}>
                  In order to claim your RBN rewards you must remain staked
                  until the end of the liquidity mining program (
                  {periodFinish.format("MMM Do, YYYY")}
                  ).
                </WarningText>
              </ModalContentExtra>
            ) : (
              <BaseModalContentColumn>
                <ActionButton
                  className="btn py-3 mb-2"
                  onClick={handleClaim}
                  color={color}
                  disabled={stakingPoolData.claimableRbn.isZero()}
                >
                  {"Unstake & Claim"}
                </ActionButton>
              </BaseModalContentColumn>
            )}
          </>
        );
      default:
        return <RBNClaimModalContent step={step} type="rbn" />;
    }
  }, [
    step,
    logo,
    vaultOption,
    stakingPoolData,
    handleClaim,
    timeTillNextRewardWeek,
  ]);

  return (
    <BasicModal
      show={show}
      onClose={handleClose}
      height={580}
      animationProps={{
        key: step,
        transition: {
          duration: 0.25,
          type: "keyframes",
          ease: "easeInOut",
        },
        initial:
          step === "info" || step === "claim"
            ? {
                x: 50,
                opacity: 0,
              }
            : {},
        animate:
          step === "info" || step === "claim"
            ? {
                x: 0,
                opacity: 1,
              }
            : {},
        exit:
          step === "info"
            ? {
                x: -50,
                opacity: 0,
              }
            : {},
      }}
    >
      {body}
    </BasicModal>
  );
};

export default StakingClaimModal;
