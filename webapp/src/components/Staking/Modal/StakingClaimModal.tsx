import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";

import { VaultOptions } from "shared/lib/constants/constants";
import {
  BaseUnderlineLink,
  BaseModal,
  BaseModalHeader,
  SecondaryText,
  Title,
  PrimaryText,
} from "shared/lib/designSystem";
import { StakingPoolData } from "../../../models/staking";
import { Modal } from "react-bootstrap";
import theme from "shared/lib/designSystem/theme";
import colors from "shared/lib/designSystem/colors";
import MenuButton from "../../Header/MenuButton";
import { formatBigNumber } from "shared/lib/utils/math";
import { BigNumber } from "@ethersproject/bignumber";
import moment from "moment";
import { isDevelopment } from "shared/lib/utils/env";
import { ExternalIcon } from "shared/lib/assets/icons/icons";
import { ActionButton } from "shared/lib/components/Common/buttons";
import useStakingReward from "../../../hooks/useStakingReward";
import usePendingTransactions from "../../../hooks/usePendingTransactions";
import { useWeb3Context } from "shared/lib/hooks/web3Context";
import RBNClaimModalContent from "../../Common/RBNClaimModalContent";
import { getVaultColor } from "shared/lib/utils/vault";
import ModalContentExtra from "../../Common/ModalContentExtra";

const StyledModal = styled(BaseModal)`
  .modal-dialog {
    max-width: 343px;
    margin-left: auto;
    margin-right: auto;
  }

  .modal-content {
    min-height: 580px;
    overflow: hidden;
  }
`;

const ModalContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  padding: 16px;
`;

const CloseButton = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: 48px;
  color: ${colors.text};
  z-index: 2;
`;

const ContentColumn = styled.div<{ marginTop?: number | "auto" }>`
  display: flex;
  justify-content: center;
  z-index: 1;
  margin-top: ${(props) =>
    props.marginTop === "auto"
      ? props.marginTop
      : `${props.marginTop || 24}px`};
`;

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

const InfoColumn = styled(ContentColumn)`
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
  vaultOption: VaultOptions;
  stakingPoolData: StakingPoolData;
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
  const [, setPendingTransactions] = usePendingTransactions();

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
      const tx = await stakingReward.getReward();

      setStep("claiming");

      const txhash = tx.hash;

      setPendingTransactions((pendingTransactions) => [
        ...pendingTransactions,
        {
          txhash,
          type: "rewardClaim",
          amount: formatBigNumber(stakingPoolData.claimableRbn, 2, 18),
          stakeAsset: vaultOption,
        },
      ]);

      await provider.waitForTransaction(txhash);
      setStep("claimed");
    } catch (err) {
      setStep("info");
    }
  }, [
    provider,
    setPendingTransactions,
    stakingPoolData,
    stakingReward,
    vaultOption,
  ]);

  const body = useMemo(() => {
    const color = getVaultColor(vaultOption);
    switch (step) {
      case "info":
        /**
         * Development: 100 seconds from last reward
         * Production: 7 days from last reward
         */
        const toNextRewardDuration = stakingPoolData.lastTimeRewardApplicable
          ? moment.duration(
              moment(stakingPoolData.lastTimeRewardApplicable, "X")
                .add(
                  isDevelopment() ? 100 : 7,
                  isDevelopment() ? "seconds" : "days"
                )
                .diff(moment()),
              "milliseconds"
            )
          : undefined;
        const periodFinish = stakingPoolData.periodFinish
          ? moment(stakingPoolData.periodFinish, "X")
          : undefined;
        return (
          <>
            <ContentColumn marginTop={-8}>
              <LogoContainer color={color}>{logo}</LogoContainer>
            </ContentColumn>
            <ContentColumn marginTop={8}>
              <AssetTitle str={vaultOption}>{vaultOption}</AssetTitle>
            </ContentColumn>
            <InfoColumn marginTop={40}>
              <SecondaryText>Unclaimed $RBN</SecondaryText>
              <InfoData>
                {formatBigNumber(stakingPoolData.claimableRbn, 2, 18)}
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
                  2,
                  18
                )}
              </InfoData>
            </InfoColumn>
            <InfoColumn>
              <SecondaryText>Time till next reward</SecondaryText>
              <InfoData>
                {toNextRewardDuration &&
                toNextRewardDuration.asMilliseconds() > 0
                  ? `${toNextRewardDuration.days()}D ${toNextRewardDuration.hours()}H ${toNextRewardDuration.minutes()}M`
                  : "---"}
              </InfoData>
            </InfoColumn>
            <InfoColumn>
              <div className="d-flex align-items-center">
                <SecondaryText>Pool rewards</SecondaryText>
              </div>
              <InfoData>
                {formatBigNumber(stakingPoolData.poolRewardForDuration, 6, 18)}{" "}
                RBN
              </InfoData>
            </InfoColumn>
            <ContentColumn marginTop="auto">
              <BaseUnderlineLink
                to="https://ribbonfinance.medium.com/rbn-airdrop-distribution-70b6cb0b870c"
                target="_blank"
                rel="noreferrer noopener"
                className="d-flex align-items-center"
              >
                <SecondaryText>Read about $RBN</SecondaryText>
                <ExternalIcon className="ml-1" />
              </BaseUnderlineLink>
            </ContentColumn>
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
              <ContentColumn>
                <ActionButton
                  className="btn py-3 mb-2"
                  onClick={handleClaim}
                  color={color}
                  disabled={stakingPoolData.claimableRbn.isZero()}
                >
                  Claim $RBN
                </ActionButton>
              </ContentColumn>
            )}
          </>
        );
      default:
        return <RBNClaimModalContent step={step} setStep={setStep} />;
    }
  }, [step, logo, vaultOption, stakingPoolData, handleClaim]);

  return (
    <StyledModal show={show} onHide={handleClose} centered backdrop={true}>
      <BaseModalHeader>
        <CloseButton role="button" onClick={handleClose}>
          <MenuButton
            isOpen={true}
            onToggle={handleClose}
            size={20}
            color={"#FFFFFFA3"}
          />
        </CloseButton>
      </BaseModalHeader>
      <Modal.Body>
        <AnimatePresence initial={false}>
          <ModalContent
            key={step}
            transition={{
              duration: 0.25,
              type: "keyframes",
              ease: "easeInOut",
            }}
            initial={
              step === "info" || step === "claim"
                ? {
                    x: 50,
                    opacity: 0,
                  }
                : {}
            }
            animate={
              step === "info" || step === "claim"
                ? {
                    x: 0,
                    opacity: 1,
                  }
                : {}
            }
            exit={
              step === "info"
                ? {
                    x: -50,
                    opacity: 0,
                  }
                : {}
            }
          >
            {body}
          </ModalContent>
        </AnimatePresence>
      </Modal.Body>
    </StyledModal>
  );
};

export default StakingClaimModal;
