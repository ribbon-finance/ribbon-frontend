import { BigNumber } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import React, { useState, useCallback, useEffect, useMemo } from "react";
import BigNumberJS from "bignumber.js";
import styled from "styled-components";

import BasicModal from "shared/lib/components/Common/BasicModal";
import {
  getERC20TokenAddress,
  getEtherscanURI,
} from "shared/lib/constants/constants";
import { useLBPSor } from "../../hooks/useLBPSor";
import { useLBPGlobalState } from "../../store/store";
import {
  BigNumberJSToBigNumber,
  BigNumberToBigNumberJS,
} from "../../utils/bignumber";
import TokenSwapForm from "./TokenSwapForm";
import { getERC20TokenDecimals } from "shared/lib/models/eth";
import {
  SlippageConfig,
  SlippageOptionsList,
  SwapStep,
  SwapStepList,
} from "./types";
import TokenSwapPreview from "./TokenSwapPreview";
import useLBPPool from "../../hooks/useLBPPool";
import { useWeb3Context } from "shared/lib/hooks/web3Context";
import {
  BaseModalContentColumn,
  BaseUnderlineLink,
  PrimaryText,
  Title,
} from "shared/lib/designSystem";
import TrafficLight from "shared/lib/components/Common/TrafficLight";

const ModalTitle = styled(Title)`
  z-index: 2;
`;

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

const TokenSwapModal = () => {
  const contract = useLBPPool();
  const { provider } = useWeb3Context();
  const [swapModal, setSwapModal] = useLBPGlobalState("swapModal");
  const [swapAmount, setSwapAmount] = useState<string>("");
  const [receiveAmount, setReceiveAmount] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [exchangeInfo, setExchangeInfo] = useState({ rate: 0, slippage: 0 });
  const [step, setStep] = useState<SwapStep>(SwapStepList[0]);
  const [txId, setTxId] = useState("");
  const [slippageConfig, setSlippageConfig] = useState<SlippageConfig>({
    name: SlippageOptionsList[0],
    value: SlippageOptionsList[0],
  });

  const { sor, fetchCounter: sorFetchCounter } = useLBPSor();

  useEffect(() => {
    (async () => {
      const offerTokenAddress = getERC20TokenAddress(swapModal.offerToken);
      const receiveTokenAddress = getERC20TokenAddress(swapModal.receiveToken);

      if (!sor.hasDataForPair(offerTokenAddress, receiveTokenAddress)) {
        return;
      }

      const amountInBigNumberJS = BigNumberToBigNumberJS(
        parseUnits(
          swapAmount ? swapAmount.toString() : "0",
          getERC20TokenDecimals(swapModal.offerToken)
        )
      );

      const [, tradeAmount, spotPrice] = await sor.getSwaps(
        offerTokenAddress,
        receiveTokenAddress,
        "swapExactIn",
        amountInBigNumberJS
      );

      const calculatedPrice = amountInBigNumberJS
        .div(tradeAmount)
        .times("1e18");
      const slippageNumber = calculatedPrice.div(spotPrice).minus(1);

      setReceiveAmount(BigNumberJSToBigNumber(tradeAmount));
      setExchangeInfo({
        rate: parseFloat(
          new BigNumberJS("1e18")
            .div(spotPrice)
            .times(
              `1e${
                getERC20TokenDecimals(swapModal.offerToken) -
                getERC20TokenDecimals(swapModal.receiveToken)
              }`
            )
            .toString()
        ),
        slippage: slippageNumber.isNegative()
          ? 0
          : parseFloat(slippageNumber.toString()),
      });
    })();
  }, [
    swapAmount,
    swapModal.offerToken,
    swapModal.receiveToken,
    sor,
    sorFetchCounter,
  ]);

  /**
   * Reset modal when closed
   */
  useEffect(() => {
    // TODO: Make sure nothing is ongoing
    if (!swapModal.show) {
      setSwapAmount("");
      setStep(SwapStepList[0]);
    }
  }, [swapModal.show]);

  const handleSwapAmountChange = useCallback((amount) => {
    const parsedInput = parseFloat(amount);
    setSwapAmount(
      isNaN(parsedInput) || parsedInput < 0 ? "" : `${parsedInput}`
    );
  }, []);

  const handleClose = useCallback(() => {
    setSwapModal((currentSwapModal) => ({
      ...currentSwapModal,
      show: false,
    }));
  }, [setSwapModal]);

  const handleSwap = useCallback(async () => {
    setStep("walletAction");

    try {
      const swapAmountBigNumber = parseUnits(
        swapAmount,
        getERC20TokenDecimals(swapModal.offerToken)
      );

      const tx = await contract.swapExactAmountIn(
        getERC20TokenAddress(swapModal.offerToken),
        swapAmountBigNumber,
        getERC20TokenAddress(swapModal.receiveToken),
        receiveAmount.mul(100 - slippageConfig.value).div(100),
        swapAmountBigNumber
          .mul(BigNumber.from(10).pow(18))
          .div(receiveAmount)
          .mul(100 + slippageConfig.value)
          .div(100)
      );

      setStep("processing");

      const txhash = tx.hash;

      /** TODO: Add pending transactions */
      setTxId(txhash);
      // Wait for transaction to be approved
      await provider.waitForTransaction(txhash);

      setSwapAmount("");
      setStep(SwapStepList[0]);
      handleClose();
    } catch (err) {
      setStep("preview");
    }
  }, [
    contract,
    handleClose,
    provider,
    receiveAmount,
    slippageConfig,
    swapAmount,
    swapModal.offerToken,
    swapModal.receiveToken,
  ]);

  const body = useMemo(() => {
    switch (step) {
      case SwapStepList[0]:
        return (
          <TokenSwapForm
            swapAmount={parseFloat(swapAmount)}
            receiveAmount={parseFloat(
              formatUnits(
                receiveAmount,
                getERC20TokenDecimals(swapModal.receiveToken)
              )
            )}
            exchangeInfo={exchangeInfo}
            onSwapAmountChange={handleSwapAmountChange}
            onPreview={() => {
              if (!receiveAmount) {
                return;
              }

              setStep("preview");
            }}
            slippageConfig={slippageConfig}
            setSlippageConfig={setSlippageConfig}
          />
        );
      case SwapStepList[1]:
        return (
          <TokenSwapPreview
            swapAmount={parseUnits(
              swapAmount,
              getERC20TokenDecimals(swapModal.offerToken)
            )}
            receiveAmount={receiveAmount}
            handleSwap={handleSwap}
          />
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
                <BaseUnderlineLink
                  to={`${getEtherscanURI()}/tx/${txId}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="d-flex"
                >
                  <PrimaryText className="mb-2">View on Etherscan</PrimaryText>
                </BaseUnderlineLink>
              </BaseModalContentColumn>
            )}
          </>
        );
      default:
        return <></>;
    }
  }, [
    exchangeInfo,
    handleSwap,
    handleSwapAmountChange,
    receiveAmount,
    slippageConfig,
    step,
    swapAmount,
    swapModal.offerToken,
    swapModal.receiveToken,
    txId,
  ]);

  const modalHeight = useMemo(() => {
    switch (step) {
      case SwapStepList[0]:
        return 564;
      case SwapStepList[1]:
        return 516;
      default:
        return 424;
    }
  }, [step]);

  return (
    <BasicModal
      show={swapModal.show}
      onClose={handleClose}
      height={modalHeight}
      headerBackground
      backButton={
        step === "preview"
          ? {
              onClick: () => {
                setStep("form");
              },
            }
          : undefined
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
    >
      {body}
    </BasicModal>
  );
};

export default TokenSwapModal;
