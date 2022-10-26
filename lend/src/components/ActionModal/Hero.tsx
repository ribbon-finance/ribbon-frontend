import React, { useCallback, useEffect, useState } from "react";
import colors from "shared/lib/designSystem/colors";
import styled, { keyframes } from "styled-components";
import { SecondaryText } from "../../designSystem";
import useWeb3Wallet from "../../hooks/useWeb3Wallet";
import {
  VaultAddressMap,
  VaultDetailsMap,
  VaultOptions,
} from "../../constants/constants";
import { formatBigNumber, isPracticallyZero } from "../../utils/math";
import { getAssetDecimals } from "../../utils/asset";
import { ActionType } from "./types";
import { fadeIn } from "shared/lib/designSystem/keyframes";
import { css } from "styled-components";
import { getAssetLogo } from "../../utils/asset";
import { useMemo } from "react";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { BaseInput, BaseInputContainer } from "shared/lib/designSystem";
import { BigNumber } from "ethers";
import { useAssetBalance, useVaultData } from "../../hooks/web3DataContext";
import useUSDC, { DepositSignature } from "../../hooks/useUSDC";
import useLoadingText from "shared/lib/hooks/useLoadingText";
import useLendContract from "../../hooks/useLendContract";
import { RibbonLendVault } from "../../codegen";
import { usePendingTransactions } from "../../hooks/pendingTransactionsContext";
import HeroContent from "../HeroContent";
import { PoolValidationErrors } from "./types";
import { Button } from "../../designSystem";
import LendModal, { ModalContentEnum } from "../Common/LendModal";
import useTokenAllowance from "shared/lib/hooks/useTokenAllowance";
import useERC20Token from "shared/lib/hooks/useERC20Token";
import { EthereumWallet } from "shared/lib/models/wallets";
import { isVaultFull } from "../../utils/vault";

const livelyAnimation = (position: "top" | "bottom") => keyframes`
  0% {
    background-position-x: ${position === "top" ? 0 : 100}%;
  }

  50% {
    background-position-x: ${position === "top" ? 100 : 0}%; 
  }

  100% {
    background-position-x: ${position === "top" ? 0 : 100}%;
  }
`;

const FrameBar = styled.div<{
  color: string;
  position: "top" | "bottom";
  height: number;
}>`
  display: flex;
  width: 100%;
  height: ${(props) => props.height}px;
  background: ${(props) => `linear-gradient(
    270deg,
    ${props.color}00 8%,
    ${props.color} 50%,
    ${props.color}00 92%
  )`};

  box-shadow: 4px 8px 80px 4px rgba(62, 115, 196, 0.43);
  background-size: 200%;
  animation: 10s ${(props) => livelyAnimation(props.position)} linear infinite;
`;

export enum ActionModalEnum {
  PREVIEW,
  TRANSACTION_STEP,
}

const delayedFade = css<{ delay?: number }>`
  opacity: 0;
  animation: ${fadeIn} 1s ease-in-out forwards;
  animation-delay: ${({ delay }) => `${delay || 0}s`};
`;

const ModalContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-width: 240px;
  margin: auto;
  overflow: hidden;
`;

const ProductAssetLogoContainer = styled.div<{ delay?: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  width: 64px;
  background-color: ${colors.background.one};
  border-radius: 50%;
  position: relative;
  ${delayedFade}
`;

const BalanceTitle = styled.div<{ delay?: number }>`
  font-size: 14px;
  font-family: VCR;
  text-transform: uppercase;
  text-align: center;
  letter-spacing: 1px;
  color: ${colors.primaryText}7A;
  margin-top: 24px;
  ${delayedFade}
`;

const BalanceContainer = styled.div<{ delay?: number }>`
  display: flex;
  margin-top: 8px;
  margin-bottom: 8px;
  font-size: 12px;
  ${delayedFade}
`;

const BalanceLabel = styled.span`
  color: ${colors.tertiaryText};
  line-height: 20px;
  margin-right: 8px;
`;

const BalanceValue = styled.span<{ error: boolean }>`
  font-size: 14px;
  color: ${(props) => (props.error ? colors.red : "white")};
  font-family: VCR;
`;

const BaseInputButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${colors.primaryText};
  border-radius: 4px;
  border: 1px solid ${colors.primaryText};
  width: 54px;
  height: 40px;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  letter-spacing: 1px;
  cursor: pointer;
  font-family: VCR, sans-serif;
  &:hover {
    color: black;
    background: ${colors.primaryText};
  }
  &:focus {
    color: black;
    background: ${colors.primaryText};
  }
  tab-index: 1;
`;

const StyledBaseInput = styled(BaseInput)`
  font-size: 72px;
`;

const InputContainer = styled(BaseInputContainer)<{
  delay?: number;
}>`
  display: flex;
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
    border: none;
  }
  border: none;
  box-shadow: none;
  margin: 0;
  padding: 0;
  max-width: 700px;
  align-items: center;
  /* Firefox */

  input[type="number"] {
    background: black;
    width: 100%;
    -moz-appearance: textfield;
    text-align: center;
  }
  ${delayedFade}
`;

const PercentagesContainer = styled.div<{
  delay?: number;
}>`
  display: flex;
  flex-direction: row;
  width: 240px;
  justify-content: space-between;
  margin-top: 32px;
  ${delayedFade}
`;

const ApprovedButton = styled(Button)`
  height: 64px;
  width: 240px;
  border-radius: 0;
  border-style: none;
  pointer-events: none;
  font-size: 14px;
  color: ${colors.green};
  background-color: ${colors.background.one};
`;

const FormButton = styled(Button)`
  background-color: ${colors.primaryText};
  color: #000000;
  height: 64px;
  width: 240px;
  border-radius: 0;
  font-size: 14px;
  border: none;
  &:disabled {
    pointer-events: none;
    opacity: 1;
    background-color: ${colors.primaryText}66;
  }
`;

const ActionButton = styled(Button)`
  background-color: ${colors.primaryText};
  color: #000000;
  height: 64px;
  width: 240px;
  border-radius: 0;
  font-size: 14px;
  border: none;
  &:disabled {
    color: ${colors.tertiaryText};
    background: ${colors.background.one};
    border: 2px solid ${colors.tertiaryText};
    pointer-events: none;
  }
`;

const FormButtonFade = styled.div<{
  show?: boolean;
  delay?: number;
  triggerAnimation: boolean;
}>`
  ${({ show, delay, triggerAnimation }) => {
    return (
      show &&
      triggerAnimation &&
      css`
        opacity: 0;

        &:disabled {
          opacity: 0;
        }

        animation: ${fadeIn} 1s ease-in-out forwards;
        animation-delay: ${delay || 0}s;
      `
    );
  }}
  display: flex;
`;

const ErrorText = styled(SecondaryText)`
  text-align: center;
  font-size: 12px;
  color: ${colors.red};
`;

const ConnectButton = styled(Button)`
  background: ${colors.buttons.secondaryBackground};
  color: ${colors.buttons.secondaryText};
  border: none;
  width: 240px;
  padding: 12px 30px;
  height: 64px;
  border-radius: 0;

  &:disabled {
    opacity: 0.6 !important;
    cursor: default !important;
  }
`;

interface HeroProps {
  actionType: ActionType;
  pool: VaultOptions;
  page: ActionModalEnum;
  setPage: (page: ActionModalEnum) => void;
  setTxhashMain: (txhash: string) => void;
  onHide: () => void;
  show: boolean;
  triggerAnimation: boolean;
}

const Hero: React.FC<HeroProps> = ({
  actionType,
  pool,
  page,
  setPage,
  setTxhashMain,
  onHide,
  show,
  triggerAnimation,
}) => {
  const [inputAmount, setInputAmount] = useState<string>("");
  const [waitingPermit, setWaitingPermit] = useState(false);
  const [waitingApproval, setWaitingApproval] = useState(false);
  const { active, account, connectedWallet } = useWeb3Wallet();
  const Logo = getAssetLogo("USDC");
  const {
    vaultBalanceInAsset,
    currentExchangeRate,
    availableToWithdraw,
    poolSize,
  } = useVaultData(pool);
  const decimals = getAssetDecimals("USDC");
  const { balance: userAssetBalance } = useAssetBalance("USDC");
  const usdc = useUSDC();
  const loadingTextPermit = useLoadingText("permitting");
  const loadingTextApprove = useLoadingText("approving");
  const [signature, setSignature] = useState<DepositSignature>();
  const [txhash, setTxhash] = useState("");
  const lendPool = useLendContract(pool) as RibbonLendVault;
  const { pendingTransactions, addPendingTransaction } =
    usePendingTransactions();
  const [triggerWalletModal, setWalletModal] = useState<boolean>(false);
  const tokenAllowance = useTokenAllowance("usdc", VaultAddressMap[pool].lend);

  const cap = VaultDetailsMap[pool].borrowCap;

  const depositLimit = useMemo(() => {
    if (!cap) {
      return undefined;
    }
    const currentCapacity = cap.sub(poolSize);
    return currentCapacity.gt(BigNumber.from("0"))
      ? currentCapacity
      : BigNumber.from("0");
  }, [cap, poolSize]);

  // Check if approval needed
  const showTokenApproval = useMemo(() => {
    return tokenAllowance && isPracticallyZero(tokenAllowance, decimals);
  }, [decimals, tokenAllowance]);
  const tokenContract = useERC20Token("usdc");

  useEffect(() => {
    // we check that the txhash and check if it had succeed
    // so we can dismiss the modal
    if (page === ActionModalEnum.TRANSACTION_STEP && txhash !== "") {
      const pendingTx = pendingTransactions.find((tx) => tx.txhash === txhash);
      if (pendingTx && pendingTx.status) {
        setTimeout(() => {
          onHide();
          setPage(ActionModalEnum.PREVIEW);
        }, 1500);
      }
    }
  }, [pendingTransactions, txhash, onHide, page, setPage]);

  useEffect(() => {
    // check for approve transaction to finish
    if (txhash !== "") {
      const pendingTx = pendingTransactions.find((tx) => tx.txhash === txhash);
      if (pendingTx && pendingTx.type === "approval" && pendingTx.status) {
        setWaitingApproval(false);
      }
    }
  }, [pendingTransactions, txhash]);

  const isInputNonZero = useMemo((): boolean => {
    return parseFloat(inputAmount) > 0;
  }, [inputAmount]);

  const amountStr = useMemo(() => {
    try {
      const amount = parseUnits(
        parseFloat(inputAmount).toFixed(decimals),
        decimals
      );
      return amount.toString();
    } catch (err) {
      return "0";
    }
  }, [decimals, inputAmount]);

  const error = useMemo((): PoolValidationErrors | undefined => {
    try {
      /** Check block with input requirement */
      if (isInputNonZero && active) {
        const amountBigNumber = parseUnits(
          parseFloat(inputAmount).toFixed(decimals),
          decimals
        );
        switch (actionType) {
          case "deposit":
            if (amountBigNumber.gt(userAssetBalance)) {
              return "insufficientBalance";
            }
            if (cap) {
              if (isVaultFull(poolSize.add(amountBigNumber), cap, 8)) {
                return "poolMaxCapacity";
              }
            }
            break;
          case "withdraw":
            if (amountBigNumber.gt(vaultBalanceInAsset)) {
              return "withdrawLimitExceeded";
            }
            if (amountBigNumber.gt(availableToWithdraw)) {
              return "insufficientPoolLiquidity";
            }
        }
      }
    } catch (err) {
      // Assume no error because empty input unable to parse
    }

    return undefined;
  }, [
    actionType,
    active,
    availableToWithdraw,
    cap,
    decimals,
    inputAmount,
    isInputNonZero,
    poolSize,
    userAssetBalance,
    vaultBalanceInAsset,
  ]);

  const renderErrorText = useCallback((_error: PoolValidationErrors) => {
    switch (_error) {
      case "insufficientBalance":
        return "Insufficient balance";
      case "withdrawLimitExceeded":
        return "Available limit exceeded";
      case "insufficientPoolLiquidity":
        return "Insufficient pool liquidity";
      case "poolMaxCapacity":
        return "Pool has reached max capacity";
      default:
        return "";
    }
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawInput = e.target.value;
      const previousInput = inputAmount;
      setInputAmount(rawInput);
      if (previousInput !== rawInput) {
        setSignature(undefined);
      }
    },
    [inputAmount]
  );

  const handlePercentageClick = useCallback(
    (percentage: number) => {
      let input: string = "";
      const maxAmount =
        actionType === "deposit" ? userAssetBalance : vaultBalanceInAsset;
      switch (percentage) {
        case 0.25:
          input = formatUnits(maxAmount.div(BigNumber.from(4)), decimals);
          break;
        case 0.5:
          input = formatUnits(maxAmount.div(BigNumber.from(2)), decimals);
          break;
        case 0.75:
          input = formatUnits(
            maxAmount.div(BigNumber.from(4)).mul(BigNumber.from(3)),
            decimals
          );
          break;
        case 1:
          input = formatUnits(maxAmount, decimals);
          break;
        default:
          return;
      }
      setInputAmount(input);
      setSignature(undefined);
    },
    [actionType, decimals, userAssetBalance, vaultBalanceInAsset]
  );

  const handleApprove = useCallback(async () => {
    setWaitingApproval(true);
    try {
      if (showTokenApproval) {
        const approveToAddress = VaultAddressMap[pool]["lend"];
        if (tokenContract && approveToAddress) {
          setWaitingApproval(true);
          const amount =
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
          const tx = await tokenContract.approve(approveToAddress, amount);

          const txhash = tx.hash;

          addPendingTransaction({
            txhash,
            type: "approval",
            amount: amount,
            vault: pool,
            asset: "USDC",
          });
          setTxhash(txhash);
          setWaitingApproval(true);
        }
      }
    } catch (error) {
      setWaitingApproval(false);
      console.log(error);
    }
  }, [addPendingTransaction, pool, showTokenApproval, tokenContract]);

  const handlePermit = useCallback(async () => {
    setWaitingPermit(true);
    try {
      const approveToAddress = VaultAddressMap[pool]["lend"];
      if (!approveToAddress) {
        return;
      }
      const deadline = Math.round(Date.now() / 1000 + 60 * 60);
      const signature = await usdc.showApproveAssetSignature(
        approveToAddress,
        amountStr,
        deadline
      );
      if (signature) {
        const depositSignature = {
          deadline: deadline,
          v: signature.v,
          r: signature.r,
          s: signature.s,
        };
        setWaitingPermit(false);
        setSignature(depositSignature);
      }
    } catch (error) {
      setWaitingPermit(false);
      console.log(error);
    }
  }, [amountStr, pool, usdc]);

  const handleConfirm = async () => {
    if (lendPool !== null) {
      try {
        let res: any;
        switch (actionType) {
          case "deposit":
            if (!account) {
              return;
            }
            if (connectedWallet !== EthereumWallet.WalletConnect) {
              if (!signature) {
                return;
              }
              res = await lendPool.provideWithPermit(
                amountStr,
                account,
                signature.deadline,
                signature.v,
                signature.r,
                signature.s
              );
            } else {
              res = await lendPool.provide(amountStr, account);
            }

            addPendingTransaction({
              txhash: res.hash,
              type: "deposit",
              amount: amountStr,
              vault: pool,
              asset: "USDC",
            });

            setTxhash(res.hash);
            setTxhashMain(res.hash);
            setPage(ActionModalEnum.TRANSACTION_STEP);
            break;
          case "withdraw":
            const amountInShares = BigNumber.from(amountStr)
              .mul(BigNumber.from(10).pow(18))
              .div(currentExchangeRate)
              .toString();
            res = await lendPool.redeem(amountInShares);
            addPendingTransaction({
              txhash: res.hash,
              type: "withdraw",
              amount: amountInShares,
              vault: pool,
            });

            setTxhash(res.hash);
            setTxhashMain(res.hash);
            setPage(ActionModalEnum.TRANSACTION_STEP);
            break;
        }
      } catch (e) {
        console.error(e);
        onHide();
      }
    }
  };

  const renderApproveButton = useCallback(() => {
    return connectedWallet !== EthereumWallet.WalletConnect ? (
      signature !== undefined ? (
        <FormButtonFade
          show={show}
          triggerAnimation={triggerAnimation}
          delay={0.4}
          className="mt-4 mb-3"
        >
          <ApprovedButton className="btn py-3">
            USDC READY TO DEPOSIT
          </ApprovedButton>
        </FormButtonFade>
      ) : (
        <FormButtonFade
          show={show}
          triggerAnimation={triggerAnimation}
          delay={0.4}
          className="mt-4 mb-3"
        >
          <FormButton
            onClick={handlePermit}
            disabled={Boolean(error) || !isInputNonZero}
            className="btn py-3"
          >
            {waitingPermit ? loadingTextPermit : `PERMIT USDC`}
          </FormButton>
        </FormButtonFade>
      )
    ) : !waitingApproval && !showTokenApproval ? (
      <FormButtonFade
        show={show}
        triggerAnimation={triggerAnimation}
        delay={0.4}
        className="mt-4 mb-3"
      >
        <ApprovedButton className="btn py-3">USDC APPROVED</ApprovedButton>
      </FormButtonFade>
    ) : (
      <FormButtonFade
        show={show}
        triggerAnimation={triggerAnimation}
        delay={0.4}
        className="mt-4 mb-3"
      >
        <FormButton
          onClick={handleApprove}
          disabled={Boolean(error)}
          className="btn py-3"
        >
          {waitingApproval ? loadingTextApprove : `APPROVE USDC`}
        </FormButton>
      </FormButtonFade>
    );
  }, [
    connectedWallet,
    error,
    handleApprove,
    handlePermit,
    isInputNonZero,
    loadingTextApprove,
    loadingTextPermit,
    show,
    showTokenApproval,
    signature,
    triggerAnimation,
    waitingApproval,
    waitingPermit,
  ]);

  return (
    <>
      <LendModal
        show={Boolean(triggerWalletModal)}
        onHide={() => setWalletModal(false)}
        content={ModalContentEnum.WALLET}
      />
      <ModalContainer>
        {page === ActionModalEnum.PREVIEW ? (
          <>
            <ProductAssetLogoContainer color={"white"} delay={0.1}>
              <Logo height="100%" />
            </ProductAssetLogoContainer>
            <BalanceTitle delay={0.1}>Enter {actionType} Amount</BalanceTitle>
            <InputContainer delay={0.2} className="mt-3 mb-2">
              <StyledBaseInput
                type="number"
                className="form-control"
                placeholder="0"
                value={inputAmount}
                onChange={handleInputChange}
                step={"0.000001"}
              />
            </InputContainer>
            {error && <ErrorText>{renderErrorText(error)}</ErrorText>}
            <PercentagesContainer delay={0.3}>
              <BaseInputButton onClick={() => handlePercentageClick(0.25)}>
                25%
              </BaseInputButton>
              <BaseInputButton onClick={() => handlePercentageClick(0.5)}>
                50%
              </BaseInputButton>
              <BaseInputButton onClick={() => handlePercentageClick(0.75)}>
                75%
              </BaseInputButton>
              <BaseInputButton onClick={() => handlePercentageClick(1)}>
                MAX
              </BaseInputButton>
            </PercentagesContainer>
            {account &&
              (actionType === "deposit" ? (
                <div className="justify-content-center">
                  {renderApproveButton()}
                  <FormButtonFade
                    show={show}
                    triggerAnimation={triggerAnimation}
                    delay={0.5}
                    className="mt-4 mb-3"
                  >
                    <ActionButton
                      onClick={handleConfirm}
                      disabled={
                        Boolean(error) ||
                        !isInputNonZero ||
                        (connectedWallet !== EthereumWallet.WalletConnect
                          ? signature === undefined
                          : showTokenApproval || waitingApproval)
                      }
                      className="btn py-3"
                    >
                      {actionType}
                    </ActionButton>
                  </FormButtonFade>
                </div>
              ) : (
                <>
                  <FormButtonFade
                    show={show}
                    triggerAnimation={triggerAnimation}
                    delay={0.4}
                    className="mt-4 mb-3"
                  >
                    <FormButton
                      onClick={handleConfirm}
                      disabled={!isInputNonZero}
                      className="btn py-3"
                    >
                      {actionType}
                    </FormButton>
                  </FormButtonFade>
                </>
              ))}
            {!account && (
              <FormButtonFade
                show={show}
                triggerAnimation={triggerAnimation}
                delay={0.4}
                className="mt-4 mb-3"
              >
                <ConnectButton onClick={() => setWalletModal(true)}>
                  CONNECT WALLET
                </ConnectButton>
              </FormButtonFade>
            )}
            <BalanceContainer delay={actionType === "deposit" ? 0.6 : 0.5}>
              <BalanceLabel>
                {actionType === "deposit"
                  ? "USDC Wallet Balance:"
                  : "Your Pool Balance:"}{" "}
              </BalanceLabel>
              <BalanceValue
                error={Boolean(
                  error === "insufficientBalance" ||
                    error === "withdrawLimitExceeded"
                )}
              >
                {!account
                  ? "---"
                  : actionType === "deposit"
                  ? formatBigNumber(userAssetBalance, decimals, 2)
                  : formatBigNumber(vaultBalanceInAsset, decimals, 2)}
              </BalanceValue>
            </BalanceContainer>
            {actionType === "deposit" && depositLimit && (
              <BalanceContainer delay={0.6}>
                <BalanceLabel>Pool Available Capacity</BalanceLabel>
                <BalanceValue error={Boolean(error === "poolMaxCapacity")}>
                  {formatBigNumber(depositLimit, decimals, 2)}
                </BalanceValue>
              </BalanceContainer>
            )}
            {actionType === "withdraw" && (
              <BalanceContainer delay={0.6}>
                <BalanceLabel>Pool Max Withdraw Amount</BalanceLabel>
                <BalanceValue
                  error={Boolean(error === "insufficientPoolLiquidity")}
                >
                  {formatBigNumber(availableToWithdraw, decimals, 2)}
                </BalanceValue>
              </BalanceContainer>
            )}
          </>
        ) : (
          <>
            <FrameBar color={colors.asset.USDC} position="top" height={4} />
            <HeroContent
              word={actionType === "deposit" ? "depositing" : "withdrawing"}
            ></HeroContent>
            <FrameBar color={colors.asset.USDC} position="bottom" height={4} />
          </>
        )}
      </ModalContainer>
    </>
  );
};

export default Hero;
