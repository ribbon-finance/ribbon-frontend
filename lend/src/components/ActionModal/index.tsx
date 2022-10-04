import React, { useCallback, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import colors from "shared/lib/designSystem/colors";
import styled, { keyframes } from "styled-components";
import { components } from "../../designSystem/components";
import { PrimaryText, SecondaryText, Title } from "../../designSystem";
import sizes from "../../designSystem/sizes";
import useWeb3Wallet from "shared/lib/hooks/useWeb3Wallet";
import {
  getEtherscanURI,
  VaultAddressMap,
  VaultDetailsMap,
  VaultOptions,
} from "../../constants/constants";
import { formatBigNumber } from "../../utils/math";
import { getAssetDecimals, getUtilizationDecimals } from "../../utils/asset";
import { CloseIcon } from "shared/lib/assets/icons/icons";
import { usePoolsAPR } from "../../hooks/usePoolsAPR";
import { ActionType } from "./types";
import { fadeIn } from "shared/lib/designSystem/keyframes";
import { css } from "styled-components";
import { getAssetLogo } from "../../utils/asset";
import { useMemo } from "react";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import {
  BaseInput,
  BaseInputContainer,
  BaseUnderlineLink,
} from "shared/lib/designSystem";
import { BigNumber } from "ethers";
import {
  useVaultsData,
  useAssetBalance,
  useVaultData,
} from "../../hooks/web3DataContext";
import useUSDC, { DepositSignature } from "../../hooks/useUSDC";
import useLoadingText from "shared/lib/hooks/useLoadingText";
import useLendContract from "../../hooks/useLendContract";
import { RibbonLendVault } from "../../codegen";
import { usePendingTransactions } from "../../hooks/pendingTransactionsContext";
import { useWeb3React } from "@web3-react/core";
import ExternalLinkIcon from "../Common/ExternalLinkIcon";
import HeroContent from "../HeroContent";
import { PoolValidationErrors } from "./types";
import UtilizationBar from "../Common/UtilizationBar";
import currency from "currency.js";
import { Button } from "../../designSystem";
import LendModal, { ModalContentEnum } from "../Common/LendModal";

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

const borderStyle = `1px solid ${colors.primaryText}1F`;

export const fadeInDisabled = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 0.64;
  }
`;

export const FixedContainer = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  background: black;
  z-index: 100;
  width: 100%;
  height: 100%;
`;

const HeroContainer = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;

  @media (max-width: ${sizes.lg}px) {
    width: 100%;
  }

  > .row {
    margin-left: 0 !important;
    width: 100%;
  }
`;

export const HeaderRow = styled(Row)`
  height: ${components.header}px;
  border-bottom: 1px solid ${colors.border};
  z-index: 1;
  margin-left: 0px;

  > * {
    padding: 0;

    &:not(:last-child) {
      border-right: 1px solid ${colors.border};
    }
  }
`;

export const FooterRow = styled(Row)`
  min-height: ${components.footer}px;
  border-top: 1px solid ${colors.border};
  box-sizing: content-box;
`;

export const HeaderContainer = styled.div`
  display: flex;
  margin: auto;
  width: 100%;
  justify-content: center;
  border-radius: 0;
  min-height: ${components.header}px;
  border-bottom: 1px solid ${colors.border};
  z-index: 1;
  color: ${colors.primaryText};

  > * {
    margin: auto 0;

    &:not(:last-child) {
      margin-right: 8px;
    }
  }
`;

export const HeaderText = styled(Title)`
  font-size: 16px;
  line-height: 20px;
`;

export const DetailContainer = styled.div<{ show?: boolean; delay?: number }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
  ${({ show, delay }) => {
    return (
      show &&
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
`;

export const Content = styled(Row)`
  height: calc(100% - ${components.header}px - ${components.footer}px);

  @media (max-width: ${sizes.lg}px) {
    height: 100%;
  }

  > *:not(:last-child) {
    border-right: 1px solid ${colors.border};
  }
`;

const CloseButton = styled.button`
  position: absolute;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  width: ${components.header}px;
  height: ${components.header}px;
  border-left: ${borderStyle};
`;

const DesktopOnly = styled.div`
  display: flex;
  width: 100%;
  > * {
    padding: 0;

    &:not(:last-child) {
      border-right: 1px solid ${colors.border};
    }
  }
  @media (max-width: ${sizes.lg}px) {
    display: none;
  }
`;

const MobileOnly = styled.div`
  display: none;
  width: 100%;
  > * {
    padding: 0;

    &:not(:last-child) {
      border-right: 1px solid ${colors.border};
    }
  }
  @media (max-width: ${sizes.lg}px) {
    display: flex;
  }
`;

export enum ActionModalEnum {
  PREVIEW,
  TRANSACTION_STEP,
}

interface ActionModalProps {
  show: boolean;
  actionType: ActionType;
  onHide: () => void;
  pool: VaultOptions;
}

const ActionModal: React.FC<ActionModalProps> = ({
  show,
  actionType,
  onHide,
  pool,
}) => {
  const [page, setPage] = useState<ActionModalEnum>(ActionModalEnum.PREVIEW);
  const [triggerAnimation, setTriggerAnimation] = useState<boolean>(true);

  // stop trigger animation on rerenders
  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    if (show) {
      timeout = setTimeout(() => {
        setTriggerAnimation(false);
      }, 1800);
    } else {
      clearTimeout(timeout!);
      setTriggerAnimation(true);
    }

    return () => {
      clearTimeout(timeout!);
    };
  }, [show]);

  const [txhash, setTxhashMain] = useState<string>();
  return show ? (
    <FixedContainer>
      <HeroContainer>
        <Header page={page} actionType={actionType}>
          <CloseButton onClick={() => onHide()}>
            <CloseIcon />
          </CloseButton>
        </Header>
        <Content>
          <Hero
            actionType={actionType}
            pool={pool}
            page={page}
            setPage={setPage}
            setTxhashMain={setTxhashMain}
            onHide={() => onHide()}
            show={show}
            triggerAnimation={triggerAnimation}
          />
        </Content>
        <Footer pool={pool} page={page} txhash={txhash} show={show} />
      </HeroContainer>
    </FixedContainer>
  ) : (
    <></>
  );
};

interface HeaderProps {
  actionType: ActionType;
  page: ActionModalEnum;
}

const Header: React.FC<HeaderProps> = ({ page, actionType, children }) => {
  return (
    <HeaderContainer>
      <HeaderText>
        {actionType === "deposit" &&
          (page === ActionModalEnum.PREVIEW ? "Deposit" : "Depositing")}
        {actionType === "withdraw" &&
          (page === ActionModalEnum.PREVIEW ? "Withdraw" : "Withdrawing")}{" "}
        USDC
      </HeaderText>
      {children}
    </HeaderContainer>
  );
};

const DetailTitle = styled.div`
  font-size: 12px;
  color: ${colors.primaryText}52;
  text-align: center;
`;

export const DetailText = styled(Title)`
  font-size: 14px;
  line-height: 20px;
`;

export const StyledPrimaryText = styled(PrimaryText)`
  font-size: 14px;
  line-height: 20px;
  text-decoration: underline;
  margin-right: 4px;
`;

export const TransactionContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
  width: 100%;
`;

const UnderlineLink = styled(BaseUnderlineLink)`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
`;
interface FooterProps {
  pool: VaultOptions;
  page: ActionModalEnum;
  show: boolean;
  txhash: string | undefined;
}

const Footer: React.FC<FooterProps> = ({ show, pool, page, txhash }) => {
  const vaultDatas = useVaultsData();
  const poolName = VaultDetailsMap[pool].name;
  const { aprs } = usePoolsAPR();
  const { chainId } = useWeb3React();
  const apr = aprs[pool];
  const utilizationDecimals = getUtilizationDecimals();
  const utilizationRate = vaultDatas.data[pool].utilizationRate;
  return (
    <>
      {page === ActionModalEnum.PREVIEW ? (
        <FooterRow>
          <DesktopOnly>
            <Col xs={3}>
              <DetailContainer show={show} delay={0.1}>
                <DetailTitle>Pool</DetailTitle>
                <DetailText>{poolName}</DetailText>
              </DetailContainer>
            </Col>
            <Col xs={3}>
              <DetailContainer show={show} delay={0.2}>
                <DetailTitle>Deposit Asset</DetailTitle>
                <DetailText>USDC</DetailText>
              </DetailContainer>
            </Col>
            <Col xs={3}>
              <DetailContainer show={show} delay={0.3}>
                <DetailTitle>Lending APR</DetailTitle>
                <DetailText>
                  {currency(apr.toFixed(2), { symbol: "" }).format()}%
                </DetailText>
              </DetailContainer>
            </Col>
            <Col xs={3}>
              <DetailContainer show={show} delay={0.4}>
                <DetailTitle>Pool Utilization</DetailTitle>
                <div className="d-flex">
                  <UtilizationBar
                    percent={parseFloat(
                      formatBigNumber(utilizationRate, utilizationDecimals)
                    )}
                    width={40}
                    color="white"
                  />
                  <DetailText>
                    {formatBigNumber(utilizationRate, utilizationDecimals)}%
                  </DetailText>
                </div>
              </DetailContainer>
            </Col>
          </DesktopOnly>
          <MobileOnly>
            <Col xs={6}>
              <DetailContainer show={show} delay={0.1}>
                <DetailTitle>Pool</DetailTitle>
                <DetailText>{poolName}</DetailText>
              </DetailContainer>
            </Col>
            <Col xs={6}>
              <DetailContainer show={show} delay={0.2}>
                <DetailTitle>Lending APR</DetailTitle>
                <DetailText>
                  {currency(apr.toFixed(2), { symbol: "" }).format()}%
                </DetailText>
              </DetailContainer>
            </Col>
          </MobileOnly>
        </FooterRow>
      ) : (
        <FooterRow>
          {chainId !== undefined && (
            <UnderlineLink
              to={`${getEtherscanURI(chainId)}/tx/${txhash}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              <StyledPrimaryText>View on Etherscan</StyledPrimaryText>
              <ExternalLinkIcon />
            </UnderlineLink>
          )}
        </FooterRow>
      )}
    </>
  );
};

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

export const BaseInputButton = styled.div`
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
    background: white;
  }
  &:focus {
    color: black;
    background: white;
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

export const Hero: React.FC<HeroProps> = ({
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
  const [waitingApproval, setWaitingApproval] = useState(false);
  const { active, account } = useWeb3Wallet();
  const Logo = getAssetLogo("USDC");
  const { vaultBalanceInAsset, currentExchangeRate, availableToWithdraw } =
    useVaultData(pool);
  const decimals = getAssetDecimals("USDC");
  const { balance: userAssetBalance } = useAssetBalance("USDC");
  const usdc = useUSDC();
  const loadingText = useLoadingText("permitting");
  const [signature, setSignature] = useState<DepositSignature>();
  const [txhash, setTxhash] = useState("");
  const lendPool = useLendContract(pool) as RibbonLendVault;
  const { pendingTransactions, addPendingTransaction } =
    usePendingTransactions();
  const [triggerWalletModal, setWalletModal] = useState<boolean>(false);

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
    decimals,
    inputAmount,
    isInputNonZero,
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
        setWaitingApproval(false);
        setSignature(depositSignature);
      }
    } catch (error) {
      setWaitingApproval(false);
      console.log(error);
    }
  }, [amountStr, pool, usdc]);

  const handleConfirm = async () => {
    if (lendPool !== null) {
      try {
        let res: any;
        switch (actionType) {
          case "deposit":
            if (!signature || !account) {
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
                  {signature !== undefined ? (
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
                        onClick={handleApprove}
                        disabled={Boolean(error) || !isInputNonZero}
                        className="btn py-3"
                      >
                        {waitingApproval ? loadingText : `PERMIT USDC`}
                      </FormButton>
                    </FormButtonFade>
                  )}
                  <FormButtonFade
                    show={show}
                    triggerAnimation={triggerAnimation}
                    delay={0.5}
                    className="mt-4 mb-3"
                  >
                    <ActionButton
                      onClick={handleConfirm}
                      disabled={Boolean(error) || signature === undefined}
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

export default ActionModal;
