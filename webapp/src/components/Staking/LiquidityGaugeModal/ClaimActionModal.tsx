import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import moment from "moment";

import { VaultOptions } from "shared/lib/constants/constants";
import {
  BaseModalContentColumn,
  SecondaryText,
  Title,
} from "shared/lib/designSystem";
import { formatBigNumber } from "shared/lib/utils/math";
import { ActionButton } from "shared/lib/components/Common/buttons";
import { usePendingTransactions } from "shared/lib/hooks/pendingTransactionsContext";
import { useWeb3Context } from "shared/lib/hooks/web3Context";
import RBNClaimModalContent from "shared/lib/components/Common/RBNClaimModalContent";
import { getVaultColor } from "shared/lib/utils/vault";
import BasicModal from "shared/lib/components/Common/BasicModal";
import { LiquidityGaugeV5PoolResponse } from "shared/lib/models/staking";
import useLiquidityGaugeV5 from "shared/lib/hooks/useLiquidityGaugeV5";
import { useLiquidityGaugeV5PoolData } from "shared/lib/hooks/web3DataContext";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";

const LogoContainer = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 100px;
  background: ${(props) => props.color}29;
`;

const AssetTitle = styled(Title)`
  text-transform: none;
  font-size: 22px;
  line-height: 28px;
`;

const InfoColumn = styled(BaseModalContentColumn)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const InfoData = styled(Title)`
  text-transform: none;
`;

interface ClaimActionModalProps {
  show: boolean;
  onClose: () => void;
  logo: React.ReactNode;
  vaultOption: VaultOptions;
  stakingPoolData?: LiquidityGaugeV5PoolResponse;
}

const ClaimActionModal: React.FC<ClaimActionModalProps> = ({
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
  const { data: lg5Data, loading: lg5DataLoading } =
    useLiquidityGaugeV5PoolData(vaultOption);
  const contract = useLiquidityGaugeV5(vaultOption);
  const { addPendingTransaction } = usePendingTransactions();

  const loadingText = useTextAnimation(lg5DataLoading);

  const handleClose = useCallback(() => {
    onClose();
    if (step === "claim" || step === "claimed") {
      setStep("info");
    }
  }, [onClose, step]);

  const handleClaim = useCallback(async () => {
    if (!contract || !stakingPoolData) {
      return;
    }
    setStep("claim");

    try {
      const tx = await contract["claim_rewards()"]();

      setStep("claiming");

      const txhash = tx.hash;

      addPendingTransaction({
        txhash,
        type: "rewardClaim",
        amount: formatBigNumber(stakingPoolData.claimableRbn, 18),
        stakeAsset: vaultOption,
      });

      await provider.waitForTransaction(txhash, 5);
      setStep("claimed");
    } catch (err) {
      setStep("info");
    }
  }, [addPendingTransaction, provider, stakingPoolData, contract, vaultOption]);

  const timeTillNextRewardWeek = useMemo(() => {
    if (lg5DataLoading) {
      return loadingText;
    }

    if (!lg5Data) {
      return "---";
    }

    const endStakeReward = moment.unix(lg5Data.periodEndTime);

    if (endStakeReward.diff(moment()) <= 0) {
      return "Program Ended";
    }

    // Time till next stake reward date
    const startTime = moment.duration(
      endStakeReward.diff(moment()),
      "milliseconds"
    );

    return `${startTime.days()}D ${startTime.hours()}H ${startTime.minutes()}M`;
  }, [lg5Data, lg5DataLoading, loadingText]);

  const body = useMemo(() => {
    const color = getVaultColor(vaultOption);
    switch (step) {
      case "info":
        return (
          <>
            <BaseModalContentColumn>
              <LogoContainer color={color}>{logo}</LogoContainer>
            </BaseModalContentColumn>
            <BaseModalContentColumn marginTop={16}>
              <AssetTitle>{vaultOption}</AssetTitle>
            </BaseModalContentColumn>
            <InfoColumn marginTop={24}>
              <SecondaryText color={color}>Unclaimed RBN</SecondaryText>
              <InfoData color={color}>
                {stakingPoolData
                  ? formatBigNumber(stakingPoolData.claimableRbn, 18)
                  : 0}
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
              <InfoData>10000 RBN</InfoData>
            </InfoColumn>

            <BaseModalContentColumn>
              <ActionButton
                className="btn py-3 mb-2"
                onClick={handleClaim}
                color={color}
                disabled={
                  !stakingPoolData || stakingPoolData.claimableRbn.isZero()
                }
              >
                ClAIM REWARDS
              </ActionButton>
            </BaseModalContentColumn>
          </>
        );
      default:
        return <RBNClaimModalContent step={step} type="rbn" />;
    }
  }, [step, logo, vaultOption, stakingPoolData, handleClaim]);

  return (
    <BasicModal
      show={show}
      onClose={handleClose}
      height={step === "info" ? 436 : 580}
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

export default ClaimActionModal;
