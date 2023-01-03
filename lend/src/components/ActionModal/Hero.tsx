import React, { useCallback, useEffect, useState } from "react";
import colors from "shared/lib/designSystem/colors";
import styled, { keyframes } from "styled-components";
import { Title } from "../../designSystem";
import { SecondaryText } from "shared/lib/designSystem";
import useWeb3Wallet from "../../hooks/useWeb3Wallet";
import {
  PoolAddressMap,
  PoolOptions,
} from "shared/lib/constants/lendConstants";
import { formatBigNumber, isPracticallyZero } from "shared/lib/utils/math";
import {
  getAssetColor,
  getAssetDecimals,
  getAssetDisplay,
} from "../../utils/asset";
import { ActionType } from "./types";
import { fadeIn } from "shared/lib/designSystem/keyframes";
import { css } from "styled-components";
import { getAssetLogo } from "../../utils/asset";
import { useMemo } from "react";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import {
  BaseInput,
  BaseInputContainer,
  BaseLink,
  PrimaryText,
} from "shared/lib/designSystem";
import { useAssetBalance, usePoolData } from "../../hooks/web3DataContext";
import usePermit, { DepositSignature } from "../../hooks/usePermit";
import useLoadingText from "shared/lib/hooks/useLoadingText";
import useLendContract from "../../hooks/useLendContract";
import useLendPoolHelperContract from "../../hooks/useLendPoolHelperContract";
import { RibbonLendPool } from "../../codegen";
import { usePendingTransactions } from "../../hooks/pendingTransactionsContext";
import HeroContent from "../HeroContent";
import { PoolValidationErrors } from "./types";
import { Button } from "../../designSystem";
import LendModal, { ModalContentEnum } from "../Common/LendModal";
import useTokenAllowance from "shared/lib/hooks/useTokenAllowance";
import useERC20Token from "shared/lib/hooks/useERC20Token";
import { EthereumWallet } from "shared/lib/models/wallets";
import { Assets } from "../../store/types";
import theme from "../../designSystem/theme";
import { AnimatePresence, motion } from "framer";
import {
  convertToUSDCAssets,
  depositAssets,
  getERC20TokenAddress,
  permitAssets,
} from "../../constants/constants";
import ButtonArrow from "shared/lib/components/Common/ButtonArrow";
import { ERC20Token } from "shared/lib/models/eth";
import { BigNumber } from "ethers/lib/ethers";
import deployment from "../../constants/deployments.json";
import useCurvePool from "../../hooks/useCurvePool";
import { URLS } from "shared/lib/constants/constants";

const assetPillWidth = 120;
const padding = 8;
const dropdownMenuWidth = assetPillWidth * 2 + padding * 3;

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

const ActionButton = styled(Button)<{ delay?: number }>`
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
  ${delayedFade}
`;

const FormButtonFade = styled.div<{
  show?: boolean;
  delay?: number;
  triggerAnimation: boolean;
}>`
  ${delayedFade}
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

const DepositAssetSwitchContainer = styled.div<{
  delay?: number;
  color: string;
}>`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  background: ${colors.background.two};
  border-radius: 100px;
  border: 1px solid ${(props) => props.color};
  padding: 8px;
  z-index: 2;
  ${delayedFade}
`;

const DepositAssetSwitchContainerLogo = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  height: 44px;
  width: 44px;
  &:before {
    position: absolute;
    content: " ";
    width: 100%;
    height: 100%;
    border-radius: 100px;
  }
`;

const DepositAssetsSwitchDropdown = styled(motion.div)<{
  isOpen: boolean;
}>`
  ${(props) =>
    props.isOpen
      ? `
          display: flex;
          flex-direction: row;
          width: ${dropdownMenuWidth}px;
          flex-wrap: wrap;
          align-items: left;
          justify-content: center;
          position: absolute;
          z-index: 2000;
          padding: 8px;
          padding-bottom: 0px;
          background-color: ${colors.background.two};
          border-radius: ${theme.border.radius};
          top: 72px;
        `
      : `
          display: none;
        `}
`;

const DepositAssetsSwitchDropdownItem = styled.div<{
  color: string;
  active: boolean;
  evenIndex: boolean;
}>`
  display: flex;
  align-items: center;
  padding: 8px;
  opacity: 0.48;
  border-radius: 100px;
  background: ${(props) => `${props.color}14`};
  margin-bottom: 8px;
  margin-right: ${(props) => (props.evenIndex ? `8` : `0`)}px;
  width: ${assetPillWidth}px;
  border: ${theme.border.width} ${theme.border.style} transparent;
  transition: border 150ms;
  ${(props) => {
    if (props.active) {
      return `
        opacity: 1;
        background: ${colors.background.two};
        border-radius: 100px;
        border: 1px solid ${props.color};
      `;
    }
    return `
      &:hover {
        opacity: 1;
      }
    `;
  }}
`;

const StyledTitle = styled(Title)`
  font-size: 16px;
  line-height: 20px;
`;

const ApprovalDescription = styled(PrimaryText)<{ delay?: number }>`
  display: block;
  width: 332px;
  text-align: center;
  margin-top: 48px;
  ${delayedFade}
`;

const ApprovalHelp = styled(BaseLink)<{ delay?: number }>`
  display: flex;
  justify-content: center;
  margin-top: 16px;
  margin-bottom: 40px;
  ${delayedFade}
`;

const StyledSecondaryText = styled(SecondaryText)`
  text-decoration: underline ${colors.text};
  &:hover {
    text-decoration: underline ${colors.text}A3;
    color: ${colors.text}A3;
  }
`;

interface HeroProps {
  actionType: ActionType;
  pool: PoolOptions;
  page: ActionModalEnum;
  setPage: (page: ActionModalEnum) => void;
  setTxhashMain: (txhash: string) => void;
  onHide: () => void;
  show: boolean;
  triggerAnimation: boolean;
  setGlobalDepositAsset: (asset: Assets) => void;
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
  setGlobalDepositAsset,
}) => {
  const [inputAmount, setInputAmount] = useState<string>("");
  const [waitingPermit, setWaitingPermit] = useState(false);
  const [waitingApproval, setWaitingApproval] = useState(false);
  const [triggerWalletModal, setWalletModal] = useState<boolean>(false);
  const [depositAsset, setDepositAsset] = useState<Assets>("USDC");
  const [depositAssetMenuOpen, setDepositAssetMenuOpen] = useState(false);

  const { active, account, connectedWallet } = useWeb3Wallet();
  const Logo = getAssetLogo(depositAsset);
  const { poolBalanceInAsset, currentExchangeRate, availableToWithdraw } =
    usePoolData(pool);
  const decimals = getAssetDecimals(depositAsset);
  const { balance: userAssetBalance } = useAssetBalance(depositAsset);
  const permit = usePermit(depositAsset);
  const loadingTextPermit = useLoadingText("permitting");
  const loadingTextApprove = useLoadingText("approving");
  const [signature, setSignature] = useState<DepositSignature>();
  const [txhash, setTxhash] = useState<string>();
  const lendPool = useLendContract(pool) as RibbonLendPool;
  const lendPoolHelper = useLendPoolHelperContract();
  const lendPoolHelperAddress = deployment.mainnet.lendpoolhelper;
  const poolAddress = PoolAddressMap[pool].lend;
  const { pendingTransactions, addPendingTransaction } =
    usePendingTransactions();
  const { getMinUSDCAmount } = useCurvePool(depositAsset);
  const [minUSDCAmount, setMinUSDCAmount] = useState<BigNumber | undefined>();
  const assetColor = getAssetColor(depositAsset);
  const tokenAllowance = useTokenAllowance(
    depositAsset.toLowerCase() as ERC20Token,
    PoolAddressMap[pool].lend
  );
  // Check if approval needed
  // Do not need approval if asset uses permit and user is not using wallet connect
  const showTokenApproval = useMemo(() => {
    if (
      permitAssets.includes(depositAsset) &&
      connectedWallet !== EthereumWallet.WalletConnect
    ) {
      return false;
    }

    return tokenAllowance && isPracticallyZero(tokenAllowance, decimals);
  }, [connectedWallet, decimals, depositAsset, tokenAllowance]);

  const tokenContract = useERC20Token(depositAsset.toLowerCase() as ERC20Token);
  const [amount, amountStr] = useMemo(() => {
    try {
      const amount = parseUnits(inputAmount, decimals);
      return [amount, amount.toString()];
    } catch (err) {
      return [BigNumber.from("0"), "0"];
    }
  }, [decimals, inputAmount]);

  const isInputNonZero = useMemo((): boolean => {
    return parseFloat(inputAmount) > 0;
  }, [inputAmount]);

  const cleanupEffects = useCallback(() => {
    setTxhash(undefined);
    setInputAmount("");
    setDepositAsset("USDC");
  }, []);

  const handleClose = useCallback(() => {
    cleanupEffects();
    onHide();
  }, [cleanupEffects, onHide]);

  useEffect(() => {
    // Fetch USDC rate
    if (depositAsset !== "USDC") {
      if (isInputNonZero) {
        setMinUSDCAmount(undefined);
        getMinUSDCAmount(amount).then((amt) => {
          setMinUSDCAmount(amt);
        });
        return;
      }
      setMinUSDCAmount(BigNumber.from(0));
    }
  }, [amount, depositAsset, getMinUSDCAmount, inputAmount, isInputNonZero]);

  useEffect(() => {
    // we check that the txhash and check if it had succeed
    // so we can dismiss the modal
    if (page === ActionModalEnum.TRANSACTION_STEP && txhash !== "") {
      const pendingTx = pendingTransactions.find((tx) => tx.txhash === txhash);
      if (pendingTx && pendingTx.status) {
        setTimeout(() => {
          handleClose();
          setPage(ActionModalEnum.PREVIEW);
        }, 1500);
      }
    }
  }, [pendingTransactions, txhash, onHide, page, setPage, handleClose]);

  useEffect(() => {
    // check for approve transaction to finish
    if (txhash !== "") {
      const pendingTx = pendingTransactions.find((tx) => tx.txhash === txhash);
      if (pendingTx && pendingTx.type === "approval" && pendingTx.status) {
        setWaitingApproval(false);
      }
    }
  }, [pendingTransactions, txhash]);

  const error = useMemo((): PoolValidationErrors | undefined => {
    try {
      /** Check block with input requirement */
      if (isInputNonZero && active) {
        const amountBigNumber = parseUnits(inputAmount, decimals);
        switch (actionType) {
          case "deposit":
            if (amountBigNumber.gt(userAssetBalance)) {
              return "insufficientBalance";
            }
            break;
          case "withdraw":
            if (amountBigNumber.gt(poolBalanceInAsset)) {
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
    decimals,
    inputAmount,
    isInputNonZero,
    userAssetBalance,
    poolBalanceInAsset,
  ]);

  const renderErrorText = useCallback((_error: PoolValidationErrors) => {
    switch (_error) {
      case "insufficientBalance":
        return "Insufficient balance";
      case "withdrawLimitExceeded":
        return "Available limit exceeded";
      case "insufficientPoolLiquidity":
        return "Insufficient pool liquidity";
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
        actionType === "deposit" ? userAssetBalance : poolBalanceInAsset;
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
    [actionType, decimals, userAssetBalance, poolBalanceInAsset]
  );

  const handleApprove = useCallback(async () => {
    setWaitingApproval(true);
    try {
      if (showTokenApproval) {
        const approveToAddress = PoolAddressMap[pool]["lend"];
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
            pool: pool,
            asset: depositAsset,
          });
          setTxhash(txhash);
          setWaitingApproval(true);
        }
      }
    } catch (error) {
      setWaitingApproval(false);
      console.log(error);
    }
  }, [
    addPendingTransaction,
    depositAsset,
    pool,
    showTokenApproval,
    tokenContract,
  ]);

  const handlePermit = useCallback(async () => {
    setWaitingPermit(true);
    try {
      const approveToAddress =
        depositAsset === "USDC"
          ? PoolAddressMap[pool]["lend"]
          : lendPoolHelperAddress;
      if (!approveToAddress || !permit) {
        return;
      }
      const deadline = Math.round(Date.now() / 1000 + 60 * 60);
      const signature = await permit.showApproveAssetSignature(
        approveToAddress,
        amountStr,
        deadline
      );
      if (signature) {
        const depositSignature = {
          deadline: deadline,
          nonce: signature.nonce,
          v: signature.splitted.v,
          r: signature.splitted.r,
          s: signature.splitted.s,
        };
        setWaitingPermit(false);
        setSignature(depositSignature);
      }
    } catch (error) {
      setWaitingPermit(false);
      console.log(error);
    }
  }, [amountStr, depositAsset, lendPoolHelperAddress, permit, pool]);

  const handleConfirm = async () => {
    if (lendPool !== null) {
      try {
        let res: any;
        switch (actionType) {
          case "deposit":
            if (!account) {
              return;
            }
            // cases:
            // 1) if the asset allows permit deposits and not using wallet connect
            // 2) if deposit asset is not usdc and using wallet connect
            // 3) if usdc and using wallet connect
            if (
              permitAssets.includes(depositAsset) &&
              connectedWallet !== EthereumWallet.WalletConnect
            ) {
              if (!signature) {
                return;
              }
              if (depositAsset === "USDC") {
                res = await lendPool.provideWithPermit(
                  amountStr,
                  account,
                  signature.deadline,
                  signature.v,
                  signature.r,
                  signature.s
                );
              } else {
                if (!lendPoolHelper || !minUSDCAmount) {
                  return;
                }

                res = await lendPoolHelper.depositDAIWithPermit(
                  amountStr,
                  minUSDCAmount,
                  poolAddress,
                  signature.nonce,
                  signature.deadline,
                  true,
                  signature.v,
                  signature.r,
                  signature.s
                );
              }
            } else if (convertToUSDCAssets.includes(depositAsset)) {
              if (!lendPoolHelper || !minUSDCAmount) {
                return;
              }
              const depositAssetAddress = getERC20TokenAddress(
                depositAsset.toLowerCase() as ERC20Token,
                1
              );
              res = await lendPoolHelper.deposit(
                amountStr,
                depositAssetAddress,
                minUSDCAmount,
                poolAddress
              );
            } else {
              res = await lendPool.provide(amountStr, account);
            }

            addPendingTransaction({
              txhash: res.hash,
              type: "deposit",
              amount: amountStr,
              pool: pool,
              asset: depositAsset,
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
              pool: pool,
            });

            setTxhash(res.hash);
            setTxhashMain(res.hash);
            setPage(ActionModalEnum.TRANSACTION_STEP);
            break;
        }
      } catch (e) {
        console.error(e);
        handleClose();
      }
    }
  };

  const renderApproveButton = useCallback(() => {
    if (
      connectedWallet !== EthereumWallet.WalletConnect &&
      permitAssets.includes(depositAsset)
    ) {
      return signature !== undefined ? (
        <FormButtonFade
          show={show}
          triggerAnimation={triggerAnimation}
          delay={0.4}
          className="mt-4 mb-3"
        >
          <ApprovedButton className="btn py-3">
            {depositAsset} READY TO DEPOSIT
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
            {waitingPermit ? loadingTextPermit : `PERMIT ${depositAsset}`}
          </FormButton>
        </FormButtonFade>
      );
    }
    return (
      <FormButtonFade
        show={show}
        triggerAnimation={triggerAnimation}
        delay={0.4}
        className="mt-4 mb-3"
      >
        <ApprovedButton className="btn py-3">
          {depositAsset} APPROVED
        </ApprovedButton>
      </FormButtonFade>
    );
  }, [
    connectedWallet,
    depositAsset,
    error,
    handlePermit,
    isInputNonZero,
    loadingTextPermit,
    show,
    signature,
    triggerAnimation,
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
            {actionType !== "deposit" && (
              <ProductAssetLogoContainer color="white" delay={0.1}>
                <Logo height="100%" />
              </ProductAssetLogoContainer>
            )}
            {actionType === "deposit" && (
              <DepositAssetSwitchContainer
                role="button"
                color={assetColor}
                delay={0.1}
                onClick={() => setDepositAssetMenuOpen((show) => !show)}
              >
                <DepositAssetSwitchContainerLogo>
                  <Logo height={40} width={40} />
                </DepositAssetSwitchContainerLogo>
                <StyledTitle className="ml-1">{depositAsset}</StyledTitle>
                <ButtonArrow
                  isOpen={depositAssetMenuOpen}
                  className="ml-3 mr-2"
                  color="white"
                />
                <AnimatePresence>
                  <DepositAssetsSwitchDropdown
                    key={depositAssetMenuOpen.toString()}
                    isOpen={depositAssetMenuOpen}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: 20,
                    }}
                    transition={{
                      type: "keyframes",
                      duration: 0.2,
                    }}
                  >
                    {depositAssets.map((assetOption, index) => {
                      const Logo = getAssetLogo(assetOption);
                      return (
                        <DepositAssetsSwitchDropdownItem
                          color={getAssetColor(assetOption)}
                          active={assetOption === depositAsset}
                          evenIndex={index % 2 === 0}
                          onClick={() => {
                            setDepositAsset(assetOption);
                            setGlobalDepositAsset(assetOption);
                            setInputAmount("");
                            setSignature(undefined);
                          }}
                        >
                          <DepositAssetSwitchContainerLogo
                            color={getAssetColor(assetOption)}
                          >
                            <Logo height={40} width={40} />
                          </DepositAssetSwitchContainerLogo>
                          <StyledTitle className="ml-2 mr-4">
                            {getAssetDisplay(assetOption)}
                          </StyledTitle>
                        </DepositAssetsSwitchDropdownItem>
                      );
                    })}
                  </DepositAssetsSwitchDropdown>
                </AnimatePresence>
              </DepositAssetSwitchContainer>
            )}
            {showTokenApproval ? (
              <>
                <ApprovalDescription delay={0.1}>
                  Before you deposit, the vault needs your permission to invest
                  your {getAssetDisplay(depositAsset)} in the vault’s strategy.
                </ApprovalDescription>
                <ApprovalHelp
                  delay={0.2}
                  to={URLS.docsFaq}
                  target="__blank"
                  rel="noreferrer noopener"
                >
                  <StyledSecondaryText>
                    Why do I have to do this?
                  </StyledSecondaryText>
                </ApprovalHelp>
                <ActionButton
                  delay={0.3}
                  onClick={handleApprove}
                  className="py-3 mb-4"
                  color="white"
                >
                  {waitingApproval
                    ? loadingTextApprove
                    : `Approve ${getAssetDisplay(depositAsset)}`}
                </ActionButton>
              </>
            ) : (
              <>
                <BalanceTitle delay={0.1}>
                  Enter {actionType} Amount
                </BalanceTitle>
                <InputContainer delay={0.2} className="mt-3 mb-2">
                  <StyledBaseInput
                    type="number"
                    className="form-control"
                    placeholder="0"
                    value={inputAmount}
                    onChange={handleInputChange}
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
                            (connectedWallet !== EthereumWallet.WalletConnect &&
                            permitAssets.includes(depositAsset)
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
                      ? `${depositAsset} Wallet Balance:`
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
                      : formatBigNumber(poolBalanceInAsset, decimals, 2)}
                  </BalanceValue>
                </BalanceContainer>
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
            )}
          </>
        ) : (
          <>
            <FrameBar color={assetColor} position="top" height={4} />
            <HeroContent
              word={actionType === "deposit" ? "depositing" : "withdrawing"}
            ></HeroContent>
            <FrameBar color={assetColor} position="bottom" height={4} />
          </>
        )}
      </ModalContainer>
    </>
  );
};

export default Hero;
