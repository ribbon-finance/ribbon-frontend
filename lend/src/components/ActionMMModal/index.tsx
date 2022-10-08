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
import { formatBigNumber, isPracticallyZero } from "../../utils/math";
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
import useLoadingText, { LoadingText } from "shared/lib/hooks/useLoadingText";
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
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import SegmentControl from "./SegmentControl";
import useERC20Token, { getERC20Token } from "shared/lib/hooks/useERC20Token";
import { getERC20TokenNameFromVault } from "shared/lib/models/eth";
import useTokenAllowance from "shared/lib/hooks/useTokenAllowance";
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

interface ActionMMModalProps {
  show: boolean;
  onHide: () => void;
  pool: VaultOptions;
}

const ActionMMModal: React.FC<ActionMMModalProps> = ({
  show,
  onHide,
  pool,
}) => {
  const [page, setPage] = useState<ActionModalEnum>(ActionModalEnum.PREVIEW);
  const [triggerAnimation, setTriggerAnimation] = useState<boolean>(true);
  const [borrowAmount, setBorrowAmount] = useState<string>("");
  const [isBorrow, setIsBorrow] = useState<boolean>(true);
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
        <Header page={page} isBorrow={isBorrow}>
          <CloseButton onClick={() => onHide()}>
            <CloseIcon />
          </CloseButton>
        </Header>
        <Content>
          <Hero
            pool={pool}
            page={page}
            setPage={setPage}
            setTxhashMain={setTxhashMain}
            setIsBorrow={setIsBorrow}
            onHide={() => onHide()}
            show={show}
            triggerAnimation={triggerAnimation}
            setBorrowAmount={setBorrowAmount}
          />
        </Content>
        <Footer
          pool={pool}
          page={page}
          txhash={txhash}
          show={show}
          borrowAmount={borrowAmount}
          isBorrow={isBorrow}
        />
      </HeroContainer>
    </FixedContainer>
  ) : (
    <></>
  );
};

interface HeaderProps {
  page: ActionModalEnum;
  isBorrow: boolean;
}

const Header: React.FC<HeaderProps> = ({ page, isBorrow, children }) => {
  return (
    <HeaderContainer>
      <HeaderText>{isBorrow ? "BORROW" : "REPAY"} USDC</HeaderText>
      {children}
    </HeaderContainer>
  );
};

const DetailTitle = styled.div`
  font-size: 12px;
  color: ${colors.primaryText}52;
  text-align: center;
`;

export const DetailText = styled(Title)<{ color?: string }>`
  font-size: 14px;
  line-height: 20px;
  color: ${(props) => (props.color ? props.color : ``)};
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
  borrowAmount: string;
  isBorrow: boolean;
}

const Footer: React.FC<FooterProps> = ({
  show,
  pool,
  page,
  txhash,
  borrowAmount,
  isBorrow,
}) => {
  const vaultDatas = useVaultsData();
  const poolName = VaultDetailsMap[pool].name;
  const { aprs } = usePoolsAPR();
  const { chainId } = useWeb3React();
  const apr = aprs[pool];
  const utilizationDecimals = getUtilizationDecimals();
  const utilizationRate = vaultDatas.data[pool].utilizationRate;
  const poolSize = vaultDatas.data[pool].poolSize;
  const borrowAmountNum = parseInt(borrowAmount);
  const absoluteBorrowAmount = Math.abs(parseInt(borrowAmount));
  return (
    <>
      {page === ActionModalEnum.PREVIEW ? (
        <FooterRow>
          <DesktopOnly>
            <Col xs={3}>
              <DetailContainer show={show} delay={0.1}>
                <DetailTitle>Current Utilization</DetailTitle>
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
            <Col xs={3}>
              <DetailContainer show={show} delay={0.2}>
                <DetailTitle>Pool Size (USDC)</DetailTitle>
                <DetailText>
                  {currency(formatBigNumber(poolSize, 6), {
                    symbol: "",
                  }).format()}
                </DetailText>
              </DetailContainer>
            </Col>
            <Col xs={3}>
              <DetailContainer show={show} delay={0.3}>
                <DetailTitle>
                  {isBorrow ? "Borrow" : "Repay"} Amount
                </DetailTitle>
                <DetailText
                  color={
                    borrowAmountNum === 0
                      ? colors.primaryText
                      : borrowAmountNum > 0
                      ? colors.green
                      : colors.red
                  }
                >
                  {currency(
                    absoluteBorrowAmount
                      ? formatBigNumber(absoluteBorrowAmount, 6)
                      : "0.00",
                    {
                      symbol: "",
                    }
                  ).format()}
                </DetailText>
              </DetailContainer>
            </Col>
            <Col xs={3}>
              <DetailContainer show={show} delay={0.4}>
                <DetailTitle>Borrow APR</DetailTitle>
                <DetailText>
                  {currency(apr.toFixed(2), { symbol: "" }).format()}%
                </DetailText>
              </DetailContainer>
            </Col>
          </DesktopOnly>
          <MobileOnly>
            <Col xs={6}>
              <DetailContainer show={show} delay={0.1}>
                <DetailTitle>Current Utilization</DetailTitle>
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
            <Col xs={6}>
              <DetailContainer show={show} delay={0.2}>
                <DetailTitle>Borrow APR</DetailTitle>
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
  show?: boolean;
  delay?: number;
  triggerAnimation?: boolean;
}>`
  display: inline-block;
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
    border: none;
  }
  border: none;
  box-shadow: none;
  margin: 0;
  margin-top: 24px;
  padding: 0;
  width: fit-content !important;
  align-items: center;
  /* Firefox */

  input[type="number"] {
    background: black;
    width: fit-content !important;
    -moz-appearance: textfield;
    text-align: center;
  }
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
`;

const TitleContainer = styled.div`
  display: inline-block;
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
  margin-top: 16px;
  text-align: center;
  font-size: 12px;
  color: ${colors.red};
`;

const PercentageContainer = styled.div<{
  show?: boolean;
  delay?: number;
  triggerAnimation: boolean;
}>`
  text-align: center;
  font-size: 12px;
  margin-top: 24px;
  color: ${colors.red};
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

const SegmentControlContainer = styled.div<{
  show?: boolean;
  delay?: number;
  triggerAnimation: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 52px;
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
`;

const SliderContainer = styled.div<{
  show?: boolean;
  delay?: number;
  triggerAnimation: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 280px;
  margin-top: 32px;
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
`;

type Step = "slider" | "typing";

const StepList = ["slider", "typing"] as const;

interface HeroProps {
  pool: VaultOptions;
  page: ActionModalEnum;
  setPage: (page: ActionModalEnum) => void;
  setTxhashMain: (txhash: string) => void;
  setBorrowAmount: (borrowAmount: string) => void;
  setIsBorrow: (isBorrow: boolean) => void;
  onHide: () => void;
  show: boolean;
  triggerAnimation: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  pool,
  page,
  setPage,
  setTxhashMain,
  setIsBorrow,
  setBorrowAmount,
  onHide,
  show,
  triggerAnimation,
}) => {
  const vaultDatas = useVaultsData();
  const [inputAmount, setInputAmount] = useState<string>("");

  const [step, setStep] = useState<Step>("slider");
  const [waitingApproval, setWaitingApproval] = useState(false);
  const { active, account } = useWeb3Wallet();
  const Logo = getAssetLogo("USDC");
  const {
    vaultBalanceInAsset,
    currentExchangeRate,
    utilizationRate,
    availableToBorrow,
  } = useVaultData(pool);
  const decimals = getAssetDecimals("USDC");
  const { balance: userAssetBalance } = useAssetBalance("USDC");
  const usdc = useUSDC();
  const loadingText = useLoadingText("permitting");
  const [signature, setSignature] = useState<DepositSignature>();
  const [txhash, setTxhash] = useState("");
  const lendPool = useLendContract(pool) as RibbonLendVault;
  const utilizationPercentage = formatBigNumber(
    utilizationRate,
    getUtilizationDecimals()
  );
  const { pendingTransactions, addPendingTransaction } =
    usePendingTransactions();
  const [triggerWalletModal, setWalletModal] = useState<boolean>(false);
  const poolSize = vaultDatas.data[pool].poolSize;
  const borrows = vaultDatas.data[pool].borrows;

  const borrowAmount = useMemo(() => {
    if (inputAmount === "0") {
      return (-borrows).toString();
    }
    if (inputAmount === utilizationPercentage) {
      return "0";
    }
    const percentage = parseFloat(inputAmount) / 100;
    const finalBorrowAmount = parseFloat(poolSize.toString()) * percentage;
    return (finalBorrowAmount - parseFloat(borrows.toString())).toString();
  }, [borrows, inputAmount, poolSize, utilizationPercentage]);

  const isBorrow = useMemo(() => {
    if (inputAmount === "") {
      return true;
    }
    return parseFloat(inputAmount) >= parseFloat(utilizationPercentage);
  }, [inputAmount, utilizationPercentage]);

  const onSliderChange = useCallback(
    (value) => {
      setInputAmount(Number(value).toFixed(2));
      setBorrowAmount(borrowAmount);
    },
    [borrowAmount, setBorrowAmount]
  );

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
    // we check that the txhash and check if it had succeed
    // so we can dismiss the modal
    if (txhash !== "") {
      const pendingTx = pendingTransactions.find((tx) => tx.txhash === txhash);
      if (pendingTx && pendingTx.type === "approval" && pendingTx.status) {
        setWaitingApproval(false);
      }
    }
  }, [pendingTransactions, txhash]);

  useEffect(() => {
    setInputAmount(utilizationPercentage);
  }, [utilizationPercentage]);

  useEffect(() => {
    setIsBorrow(isBorrow);
  }, [isBorrow, setIsBorrow, utilizationPercentage]);

  useEffect(() => {
    setBorrowAmount(borrowAmount);
  }, [borrowAmount, setBorrowAmount]);

  const isInputNonZero = useMemo((): boolean => {
    return parseFloat(inputAmount) >= 0;
  }, [inputAmount]);

  const error = useMemo((): PoolValidationErrors | undefined => {
    try {
      /** Check block with input requirement */
      if (isInputNonZero && active && borrowAmount) {
        const amountBigNumber = parseUnits(
          parseFloat(borrowAmount).toFixed(0),
          0
        );
        if (amountBigNumber.gt(availableToBorrow)) {
          return "maxUtilizationPercentage";
        }
        if (amountBigNumber.gt(userAssetBalance)) {
          return "insufficientBalance";
        }
      }
    } catch (err) {
      // Assume no error because empty input unable to parse
    }

    return undefined;
  }, [
    active,
    availableToBorrow,
    borrowAmount,
    isInputNonZero,
    userAssetBalance,
  ]);

  const isButtonDisabled = useMemo((): boolean => {
    return (
      !isInputNonZero ||
      Boolean(error) ||
      parseFloat(inputAmount) === parseFloat(utilizationPercentage)
    );
  }, [error, inputAmount, isInputNonZero, utilizationPercentage]);

  const amountStr = useMemo(() => {
    try {
      const amount = parseUnits(parseFloat(inputAmount).toFixed(2), decimals);
      return amount.toString();
    } catch (err) {
      return "0";
    }
  }, [decimals, inputAmount]);

  const renderErrorText = useCallback((_error: PoolValidationErrors) => {
    switch (_error) {
      case "insufficientBalance":
        return "Insufficient balance";
      case "withdrawLimitExceeded":
        return "Available limit exceeded";
      case "insufficientPoolLiquidity":
        return "Insufficient pool liquidity";
      case "maxUtilizationPercentage":
        return "Max utilization percentage";
      case "maxAvailableBorrow":
        return "Max available borrow";
      default:
        return "";
    }
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawInput = e.target.value;
      setInputAmount(rawInput);
    },
    []
  );

  const tokenAllowance = useTokenAllowance("usdc", VaultAddressMap[pool].lend);

  /**
   * Check if approval needed
   */
  const showTokenApproval = useMemo(() => {
    return tokenAllowance && isPracticallyZero(tokenAllowance, decimals);
  }, [decimals, tokenAllowance]);
  const tokenContract = useERC20Token("usdc");

  const renderButtonText = useCallback(() => {
    if (isBorrow) {
      return "Borrow";
    } else {
      if (showTokenApproval) {
        if (waitingApproval) {
          return <LoadingText>APPROVING</LoadingText>;
        } else {
          return "Approve";
        }
      } else {
        return "Repay";
      }
    }
  }, [isBorrow, showTokenApproval, waitingApproval]);

  const handleConfirm = async () => {
    if (lendPool !== null || !account) {
      try {
        let res: any;
        if (!account) {
          return;
        }
        if (isBorrow) {
          res = await lendPool.borrow(
            parseUnits(parseFloat(borrowAmount).toFixed(0), 0),
            account
          );

          addPendingTransaction({
            txhash: res.hash,
            type: "borrow",
            amount: amountStr,
            vault: pool,
            asset: "USDC",
          });

          setTxhash(res.hash);
          setTxhashMain(res.hash);
          setPage(ActionModalEnum.TRANSACTION_STEP);
        } else {
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
          } else {
            res = await lendPool.repay(
              parseUnits(Math.abs(parseFloat(borrowAmount)).toFixed(0), 0),
              false
            );

            addPendingTransaction({
              txhash: res.hash,
              type: "repay",
              amount: amountStr,
              vault: pool,
              asset: "USDC",
            });

            setTxhash(res.hash);
            setTxhashMain(res.hash);
            setPage(ActionModalEnum.TRANSACTION_STEP);
          }
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
            <BalanceTitle delay={0.1}>Utilization (%)</BalanceTitle>
            {step === "slider" ? (
              <>
                <PercentageContainer
                  show={show}
                  delay={0.2}
                  triggerAnimation={triggerAnimation}
                >
                  <Title>{inputAmount}</Title>
                </PercentageContainer>
                <SliderContainer
                  show={show}
                  delay={0.3}
                  triggerAnimation={triggerAnimation}
                >
                  <Slider
                    defaultValue={parseFloat(utilizationPercentage)}
                    handleStyle={{
                      height: 16,
                      width: 16,
                      backgroundColor: "white",
                      border: 0,
                      boxShadow: "none",
                      opacity: 1,
                      top: 3,
                    }}
                    trackStyle={{
                      height: 2,
                      backgroundColor: colors.green,
                    }}
                    railStyle={{
                      height: 2,
                      backgroundColor: colors.buttons.secondaryBackground2,
                    }}
                    onChange={(value) => {
                      onSliderChange(value);
                    }}
                    step={0.01}
                  />
                </SliderContainer>
              </>
            ) : (
              <div className="d-flex flex-row justify-content-center align-items-center">
                <InputContainer className="mb-2">
                  <StyledBaseInput
                    type="number"
                    className="form-control"
                    placeholder={utilizationPercentage}
                    value={inputAmount}
                    onChange={handleInputChange}
                    step={"0.000001"}
                  />
                </InputContainer>
              </div>
            )}
            {error && <ErrorText>{renderErrorText(error)}</ErrorText>}
            <SegmentControlContainer
              show={show}
              delay={0.4}
              triggerAnimation={triggerAnimation}
            >
              <SegmentControl
                segments={StepList.map((item) => ({
                  value: item,
                  display: item,
                }))}
                value={step}
                onSelect={(page) => setStep(page as Step)}
                config={{
                  theme: "outline",
                  widthType: "fullWidth",
                  backgroundColor: "rgba(22, 206, 185, 0.08)",
                  color: "#16CEB9",
                }}
              />
            </SegmentControlContainer>
            <FormButtonFade
              show={show}
              triggerAnimation={triggerAnimation}
              delay={0.5}
              className="mt-4 mb-3"
            >
              <FormButton
                onClick={handleConfirm}
                disabled={isButtonDisabled || waitingApproval}
                className="btn py-3"
              >
                {renderButtonText()}
              </FormButton>
            </FormButtonFade>
            <BalanceContainer delay={0.6}>
              <BalanceLabel>USDC Wallet Balance: </BalanceLabel>
              <BalanceValue
                error={Boolean(
                  error === "insufficientBalance" ||
                    error === "withdrawLimitExceeded"
                )}
              >
                {!account
                  ? "---"
                  : formatBigNumber(userAssetBalance, decimals, 2)}
              </BalanceValue>
            </BalanceContainer>
          </>
        ) : (
          <>
            <FrameBar color={colors.asset.USDC} position="top" height={4} />
            <HeroContent
              word={isBorrow ? "borrowing" : "repaying"}
            ></HeroContent>
            <FrameBar color={colors.asset.USDC} position="bottom" height={4} />
          </>
        )}
      </ModalContainer>
    </>
  );
};

export default ActionMMModal;
