import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { BigNumber } from "@ethersproject/bignumber";

import {
  BLOCKCHAIN_EXPLORER_NAME,
  getEtherscanURI,
  VaultOptions,
} from "shared/lib/constants/constants";
import { useWeb3Wallet } from "shared/lib/hooks/useWeb3Wallet";
import { LiquidityGaugeV5PoolResponse } from "shared/lib/models/staking";
import {
  BaseInput,
  BaseInputButton,
  BaseInputContainer,
  BaseInputLabel,
  BaseUnderlineLink,
  PrimaryText,
  SecondaryText,
  BaseModalContentColumn,
  Title,
} from "shared/lib/designSystem";
import { useWeb3Context } from "shared/lib/hooks/web3Context";
import colors from "shared/lib/designSystem/colors";
import { usePendingTransactions } from "shared/lib/hooks/pendingTransactionsContext";
import { getVaultColor } from "shared/lib/utils/vault";
import { calculateBoostedRewards } from "shared/lib/utils/governanceMath";
import { formatBigNumber } from "shared/lib/utils/math";
import { ActionButton } from "shared/lib/components/Common/buttons";
import TrafficLight from "shared/lib/components/Common/TrafficLight";
import BasicModal from "shared/lib/components/Common/BasicModal";
import { useV2VaultData } from "shared/lib/hooks/web3DataContext";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";
import useV2Vault from "shared/lib/hooks/useV2Vault";
import useVotingEscrow from "shared/lib/hooks/useVotingEscrow";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import HelpInfo from "shared/lib/components/Common/HelpInfo";

const FloatingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0 16px;
`;

const ModalTitle = styled(Title)`
  z-index: 2;
`;

const LogoContainer = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 100px;
  background: ${(props) => props.color}29;
  color: ${(props) => props.color};
  font-size: 40px;
`;

const AssetTitle = styled(Title)`
  text-transform: none;
  font-size: 22px;
  line-height: 28px;
`;

const ContainerWithTooltip = styled.div`
  display: flex;
  align-items: center;
`;

const InfoColumn = styled(BaseModalContentColumn)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const InfoData = styled(Title)<{ error?: boolean }>`
  text-transform: none;
  ${(props) => {
    if (props.error) {
      return `
        color: ${colors.red};
      `;
    }
    return ``;
  }}
`;

interface StakingActionModalProps {
  show: boolean;
  onClose: () => void;
  logo: React.ReactNode;
  vaultOption: VaultOptions;
  stakingPoolData?: LiquidityGaugeV5PoolResponse;

  // APYs
  apysLoading?: boolean;
  baseAPY: number;
  calculateBoostedMultipler: (stakedAmount: BigNumber) => number;
}

const StakingActionModal: React.FC<StakingActionModalProps> = ({
  show,
  onClose,
  logo,
  vaultOption,
  stakingPoolData,

  apysLoading,
  baseAPY,
  calculateBoostedMultipler,
}) => {
  const [step, setStep] = useState<
    "form" | "preview" | "walletAction" | "processing"
  >("form");
  const [input, setInput] = useState("");
  const { chainId } = useWeb3Wallet();
  const { provider } = useWeb3Context();
  const votingEscrowContract = useVotingEscrow();
  const {
    data: { decimals },
    loading: vaultDataLoading,
  } = useV2VaultData(vaultOption);

  const loadingText = useTextAnimation(vaultDataLoading);
  const { addPendingTransaction } = usePendingTransactions();

  const [error, setError] = useState<"insufficient_balance">();
  const [txId, setTxId] = useState("");
  const [totalVeRBN, setTotalVeRBN] = useState<BigNumber>();

  const vaultContract = useV2Vault(vaultOption);
  const color = getVaultColor(vaultOption);

  // APY, base rewards, and boosted rewards
  const apys: {
    totalApy: string;
    baseRewards: string;
    boostedMultiplier: string;
    boostedRewards: string;
  } = useMemo(() => {
    if (apysLoading) {
      return {
        totalApy: loadingText,
        baseRewards: loadingText,
        boostedMultiplier: loadingText,
        boostedRewards: loadingText,
      };
    }

    if (error) {
      return {
        totalApy: "---",
        baseRewards: "---",
        boostedMultiplier: "",
        boostedRewards: "---",
      };
    }

    const boostedMultiplier = calculateBoostedMultipler(
      parseUnits(input || "0", decimals)
    );
    const boostedRewards = calculateBoostedRewards(baseAPY, boostedMultiplier);

    return {
      totalApy: `${(baseAPY + boostedRewards).toFixed(2)}%`,
      baseRewards: `${baseAPY.toFixed(2)}%`,
      boostedMultiplier: boostedMultiplier
        ? `(${boostedMultiplier.toFixed(2)}X)`
        : "",
      boostedRewards: `${boostedRewards.toFixed(2)}%`,
    };
  }, [
    apysLoading,
    baseAPY,
    calculateBoostedMultipler,
    decimals,
    loadingText,
    error,
    input,
  ]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawInput = e.target.value;

      // Do not allow user to enter smaller than 0
      if (rawInput && parseFloat(rawInput) < 0) {
        setInput("");
        return;
      }

      setInput(rawInput); // Let's flush out the input changes first.
    },
    []
  );

  const handleMaxPressed = useCallback(() => {
    if (stakingPoolData) {
      setInput(formatUnits(stakingPoolData.unstakedBalance, decimals));
    }
  }, [decimals, stakingPoolData]);

  const handleClose = useCallback(() => {
    onClose();
    if (step === "preview" || step === "walletAction") {
      setStep("form");
    }
    if (step !== "processing") {
      setInput("");
    }
  }, [step, onClose]);

  const handleActionPressed = useCallback(async () => {
    if (!vaultContract) {
      return;
    }
    setStep("walletAction");

    try {
      const tx = await vaultContract.stake(parseUnits(input, decimals));

      setStep("processing");

      const txhash = tx.hash;

      setTxId(txhash);
      addPendingTransaction({
        txhash,
        type: "unstake",
        amount: input,
        stakeAsset: vaultOption,
      });

      await provider.waitForTransaction(txhash, 5);
      setStep("form");
      setTxId("");
      setInput("");
      onClose();
    } catch (err) {
      console.log(err);
      setStep("preview");
    }
  }, [
    addPendingTransaction,
    decimals,
    input,
    provider,
    vaultContract,
    onClose,
    vaultOption,
  ]);

  // Fetch totalverbn
  useEffect(() => {
    if (votingEscrowContract && !totalVeRBN) {
      votingEscrowContract["totalSupply()"]().then((totalSupply: BigNumber) => {
        setTotalVeRBN(totalSupply);
      });
    }
  }, [votingEscrowContract, totalVeRBN]);

  /**
   * Input Validation
   */
  useEffect(() => {
    setError(undefined);

    /** Skip when there is no input */
    if (!input) {
      return;
    }

    if (
      !stakingPoolData ||
      !stakingPoolData.unstakedBalance.gte(
        BigNumber.from(parseUnits(input, decimals))
      )
    ) {
      setError("insufficient_balance");
    }
  }, [decimals, input, stakingPoolData]);

  const renderActionButtonText = useCallback(() => {
    switch (error) {
      case "insufficient_balance":
        return "INSUFFICIENT BALANCE";
      default:
        return "STAKE PREVIEW";
    }
  }, [error]);

  const body = useMemo(() => {
    switch (step) {
      case "form":
        return (
          <>
            <BaseModalContentColumn>
              <LogoContainer color={color}>{logo}</LogoContainer>
            </BaseModalContentColumn>
            <BaseModalContentColumn marginTop={16}>
              <AssetTitle>{vaultOption}</AssetTitle>
            </BaseModalContentColumn>
            <BaseModalContentColumn>
              <div className="d-flex w-100 flex-wrap">
                <BaseInputLabel>AMOUNT ({vaultOption})</BaseInputLabel>
                <BaseInputContainer>
                  <BaseInput
                    type="number"
                    className="form-control"
                    placeholder="0"
                    value={input}
                    onChange={handleInputChange}
                  />
                  <BaseInputButton onClick={handleMaxPressed}>
                    MAX
                  </BaseInputButton>
                </BaseInputContainer>
              </div>
            </BaseModalContentColumn>

            <InfoColumn>
              <SecondaryText>Unstaked Balance</SecondaryText>
              <InfoData error={Boolean(error)}>
                {stakingPoolData
                  ? formatBigNumber(stakingPoolData.unstakedBalance, decimals)
                  : 0}
              </InfoData>
            </InfoColumn>

            <InfoColumn marginTop={16}>
              <SecondaryText>Current Staked Balance</SecondaryText>
              <InfoData>
                {stakingPoolData
                  ? formatBigNumber(stakingPoolData.currentStake, decimals)
                  : 0}
              </InfoData>
            </InfoColumn>

            {/* APY */}
            <InfoColumn marginTop={16}>
              <SecondaryText color={color}>APY</SecondaryText>
              <InfoData color={color}>{apys.totalApy}</InfoData>
            </InfoColumn>
            <InfoColumn marginTop={4}>
              <ContainerWithTooltip>
                <SecondaryText className="ml-2" fontSize={12}>
                  Base Rewards
                </SecondaryText>
                <TooltipExplanation
                  title="Base Rewards"
                  explanation="The rewards for staking rTokens."
                  renderContent={({ ref, ...triggerHandler }) => (
                    <HelpInfo containerRef={ref} {...triggerHandler}>
                      i
                    </HelpInfo>
                  )}
                />
              </ContainerWithTooltip>
              <InfoData color={colors.text} fontSize={14}>
                {apys.baseRewards}
              </InfoData>
            </InfoColumn>
            <InfoColumn marginTop={4}>
              <ContainerWithTooltip>
                <SecondaryText className="ml-2" fontSize={12}>
                  Boosted Rewards {apys.boostedMultiplier}
                </SecondaryText>
                <TooltipExplanation
                  title="Boosted Rewards"
                  explanation="The additional rewards veRBN holders earn for staking their rTokens. Base rewards can be boosted by up to 2.5X."
                  renderContent={({ ref, ...triggerHandler }) => (
                    <HelpInfo containerRef={ref} {...triggerHandler}>
                      i
                    </HelpInfo>
                  )}
                />
              </ContainerWithTooltip>
              <InfoData color={colors.text} fontSize={14}>
                {apys.boostedRewards}
              </InfoData>
            </InfoColumn>

            <BaseModalContentColumn>
              <ActionButton
                className="btn py-3"
                color={color}
                error={Boolean(error)}
                disabled={
                  Boolean(error) || !(Boolean(input) && parseFloat(input) > 0)
                }
                onClick={() => setStep("preview")}
              >
                {renderActionButtonText()}
              </ActionButton>
            </BaseModalContentColumn>
          </>
        );
      case "preview":
        return (
          <>
            <BaseModalContentColumn>
              <LogoContainer color={color}>{logo}</LogoContainer>
            </BaseModalContentColumn>
            <BaseModalContentColumn marginTop={16}>
              <AssetTitle>STAKE PREVIEW</AssetTitle>
            </BaseModalContentColumn>
            <InfoColumn>
              <SecondaryText>Pool</SecondaryText>
              <InfoData>{vaultOption}</InfoData>
            </InfoColumn>
            <InfoColumn marginTop={16}>
              <SecondaryText>Stake Amount</SecondaryText>
              <InfoData>{parseFloat(parseFloat(input).toFixed(4))}</InfoData>
            </InfoColumn>

            {/* APY */}
            <InfoColumn marginTop={16}>
              <SecondaryText color={color}>APY</SecondaryText>
              <InfoData color={color}>{apys.totalApy}</InfoData>
            </InfoColumn>
            <InfoColumn marginTop={4}>
              <SecondaryText className="ml-2" fontSize={12}>
                Base Rewards
              </SecondaryText>
              <InfoData color={colors.text} fontSize={14}>
                {apys.baseRewards}
              </InfoData>
            </InfoColumn>
            <InfoColumn marginTop={4}>
              <SecondaryText className="ml-2" fontSize={12}>
                Boosted Rewards ({apys.boostedMultiplier})
              </SecondaryText>
              <InfoData color={colors.text} fontSize={14}>
                {apys.boostedRewards}
              </InfoData>
            </InfoColumn>

            <BaseModalContentColumn marginTop="auto">
              <ActionButton
                className="btn py-3 mb-2"
                onClick={handleActionPressed}
                color={color}
              >
                STAKE NOW
              </ActionButton>
            </BaseModalContentColumn>
          </>
        );
      case "walletAction":
      case "processing":
        return (
          <>
            <BaseModalContentColumn marginTop={8}>
              <ModalTitle>
                {step === "walletAction"
                  ? "CONFIRM Transaction"
                  : "TRANSACTION PENDING"}
              </ModalTitle>
            </BaseModalContentColumn>
            <FloatingContainer>
              <TrafficLight active={step === "processing"} />
            </FloatingContainer>
            {step === "walletAction" ? (
              <BaseModalContentColumn marginTop="auto">
                <PrimaryText className="mb-2">
                  Confirm this transaction in your wallet
                </PrimaryText>
              </BaseModalContentColumn>
            ) : (
              <BaseModalContentColumn marginTop="auto">
                {chainId && (
                  <BaseUnderlineLink
                    to={`${getEtherscanURI(chainId)}/tx/${txId}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="d-flex"
                  >
                    <PrimaryText className="mb-2">
                      View on {BLOCKCHAIN_EXPLORER_NAME[chainId]}
                    </PrimaryText>
                  </BaseUnderlineLink>
                )}
              </BaseModalContentColumn>
            )}
          </>
        );
    }
  }, [
    apys,
    chainId,
    color,
    decimals,
    error,
    handleInputChange,
    handleMaxPressed,
    handleActionPressed,
    input,
    step,
    logo,
    txId,
    vaultOption,
    stakingPoolData,
    renderActionButtonText,
  ]);

  const modalHeight = useMemo(() => {
    switch (step) {
      case "form":
        return 554;
      case "preview":
        return 436;
      default:
        return 424;
    }
  }, [step]);

  return (
    <BasicModal
      show={show}
      onClose={handleClose}
      height={modalHeight}
      backButton={
        step === "preview" ? { onClick: () => setStep("form") } : undefined
      }
      animationProps={{
        key: step,
        transition: {
          duration: 0.25,
          type: "keyframes",
          ease: "easeInOut",
        },
        initial:
          step !== "processing"
            ? {
                y: -200,
                opacity: 0,
              }
            : {},
        animate:
          step !== "processing"
            ? {
                y: 0,
                opacity: 1,
              }
            : {},
        exit:
          step === "form" || step === "preview"
            ? {
                y: 200,
                opacity: 0,
              }
            : {},
      }}
      headerBackground={step !== "form" && step !== "preview"}
    >
      {body}
    </BasicModal>
  );
};

export default StakingActionModal;
