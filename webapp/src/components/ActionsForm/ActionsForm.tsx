import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, ethers } from "ethers";
import { Title } from "../../designSystem";
import WalletConnectModal from "../Wallet/WalletConnectModal";
import { formatSignificantDecimals } from "../../utils/math";
import YourPosition from "./YourPosition";
import ActionModal from "../ActionModal/ActionModal";
import {
  ActionButton,
  ConnectWalletButton,
  ErrorButton,
} from "../Common/buttons";
import { GAS_LIMITS } from "../../constants/constants";
import useGasPrice from "../../hooks/useGasPrice";
import useVaultData from "../../hooks/useVaultData";
import useVault from "../../hooks/useVault";
import { ACTIONS, PreviewStepProps } from "../ActionModal/types";

const { parseEther, formatEther } = ethers.utils;

const Container = styled.div<ActionsFormProps>`
  ${(props) =>
    props.variant === "mobile" &&
    `
    height: 100%;
    display:flex;
    align-items: center;
    justify-content:center;
  `}
`;

const FormContainer = styled.div`
  font-family: VCR;
  color: #f3f3f3;
  width: 100%;
  border: 1px solid #2b2b2b;
  box-sizing: border-box;
  border-radius: 8px;
`;

const FormTitleDiv = styled.div<{ left: boolean; active: boolean }>`
  width: 100%;
  padding: 24px 0;
  background-color: ${(props) =>
    props.active ? "#151413" : "rgb(28, 26, 25,0.95)"};
  cursor: pointer;

  ${(props) =>
    props.left
      ? "border-top-left-radius: 8px;"
      : "border-top-right-radius: 8px;"}
`;

const FormTitle = styled(Title)<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  line-height: 24px;
  text-transform: uppercase;
  color: ${(props) => (props.active ? "#f3f3f3" : "rgba(243, 243, 243, 0.64)")};
`;

const InputGuide = styled.div`
  color: #ffffff;
  opacity: 0.4;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 1.5px;
`;

const ContentContainer = styled.div`
  background: #1c1a19;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
`;

const FormInputContainer = styled.div`
  width: 100%;
  height: 80px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 4px;
`;

const FormInput = styled.input`
  width: 80%;
  height: 100%;
  font-size: 40px;
  line-height: 64px;
  color: #ffffff;
  border: none;
  background: none;

  &:focus {
    color: #ffffff;
    background: none;
    border: none;
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
    border: rgba(255, 255, 255, 0);
  }
`;

const MaxAccessory = styled.div`
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  right: 0;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  padding: 8px;
  height: 32px;
  font-size: 11px;
  line-height: 16px;
  text-align: center;
  letter-spacing: 1.5px;
  cursor: pointer;
`;

const WalletBalance = styled.div<{ active: boolean }>`
  width: 100%;
  text-align: center;
  font-size: 14px;
  line-height: 20px;
  text-transform: uppercase;
  color: ${(props) => (props.active ? "#FFFFFF" : "rgba(255, 255, 255, 0.16)")};
`;

type ValidationErrors = "none" | "insufficient_balance";

export interface FormStepProps {
  onSubmit?: (previewStepProps: PreviewStepProps) => void;
}

interface ActionsFormProps extends FormStepProps {
  variant: "desktop" | "mobile";
}

const ActionsForm: React.FC<ActionsFormProps> = ({
  variant,
  onSubmit = () => {},
}) => {
  const DEPOSIT_TAB = true;
  const WITHDRAWAL_TAB = false;
  const isDesktop = variant === "desktop";

  const vault = useVault();
  const {
    status,
    userAssetBalance,
    vaultBalanceInAsset,
    maxWithdrawAmount,
  } = useVaultData();

  const isLoadingData = status === "loading";
  const [isDeposit, setIsDeposit] = useState(true);
  const [inputAmount, setInputAmount] = useState("");
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [error, setError] = useState<ValidationErrors>("none");
  const { active, account } = useWeb3React();
  const gasPrice = useGasPrice();

  const connected = Boolean(active && account);

  const handleClickMax = async () => {
    if (!isLoadingData && connected && vault && account) {
      if (isDeposit && gasPrice.fetched) {
        const gasLimit = isDeposit
          ? GAS_LIMITS.depositETH
          : GAS_LIMITS.withdrawETH;
        const gasFee = BigNumber.from(gasLimit.toString()).mul(gasPrice.fast);
        const total = BigNumber.from(userAssetBalance);
        const maxAmount = total.sub(gasFee);
        const actualMaxAmount = maxAmount.isNegative()
          ? BigNumber.from("0")
          : maxAmount;

        setInputAmount(formatEther(actualMaxAmount));
      }
      // Withdraw flow
      else {
        setInputAmount(formatEther(maxWithdrawAmount));
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = e.target.value;
    setInputAmount(rawInput); // Let's flush out the input changes first.

    // Make sure we schedule the error updates after the input updates
    requestAnimationFrame(() => {
      if (rawInput) {
        const amount = parseEther(rawInput);

        if (!isLoadingData && connected) {
          if (isDeposit && amount.gt(userAssetBalance)) {
            setError("insufficient_balance");
          } else if (!isDeposit && amount.gt(maxWithdrawAmount)) {
            setError("insufficient_balance");
          } else {
            // if nothing was hit, we reset to no error
            setError("none");
          }
        }
      } else {
        // If we do not have any input, we can safely assume there is no error
        setError("none");
      }
    });
  };
  const vaultBalanceStr = vaultBalanceInAsset.toString();

  const previewStepProps = useMemo(() => {
    const actionParams = isDeposit
      ? { action: ACTIONS.deposit, yield: 30 }
      : {
          action: ACTIONS.withdraw,
          withdrawalFee: 0.5,
        };

    return {
      actionType: isDeposit ? ACTIONS.deposit : ACTIONS.withdraw,
      amount: inputAmount ? parseEther(inputAmount) : BigNumber.from("0"),
      positionAmount: BigNumber.from(vaultBalanceStr),
      actionParams,
    };
  }, [isDeposit, inputAmount, vaultBalanceStr]);

  const handleClickActionButton = () => {
    isDesktop && inputAmount && connected && setShowActionModal(true);
    !isDesktop && inputAmount && connected && onSubmit(previewStepProps);
  };

  const onCloseActionsModal = () => {
    setShowActionModal(false);
  };

  const switchToTab = (switchingToDepositTab: boolean) => {
    // Resets the input amount if switching to a different tab
    return () => {
      if (
        (isDeposit && !switchingToDepositTab) ||
        (!isDeposit && switchingToDepositTab)
      ) {
        setIsDeposit(switchingToDepositTab);
        setInputAmount("");
        setError("none");
      }
    };
  };

  let walletText = "";

  if (isDeposit) {
    const position =
      account && !isLoadingData && userAssetBalance
        ? formatSignificantDecimals(formatEther(userAssetBalance))
        : "---";
    walletText = `Wallet Balance: ${position} ETH`;
  } else {
    const position =
      account && !isLoadingData && userAssetBalance
        ? formatSignificantDecimals(formatEther(vaultBalanceInAsset))
        : "---";
    walletText = `Your Position: ${position} ETH`;
  }

  let actionButtonText = "";
  if (isDeposit && inputAmount) {
    actionButtonText = "Preview Deposit";
  } else if (isDeposit) {
    actionButtonText = "Deposit ETH";
  } else if (!isDeposit && inputAmount) {
    actionButtonText = "Preview Withdrawal";
  } else {
    actionButtonText = "Withdraw ETH";
  }

  let button;

  if (error === "insufficient_balance") {
    button = (
      <ErrorButton className="py-3 mb-4">Insufficient Balance</ErrorButton>
    );
  } else {
    if (connected) {
      button = (
        <ActionButton onClick={handleClickActionButton} className="py-3 mb-4">
          {actionButtonText}
        </ActionButton>
      );
    } else {
      button = (
        <ConnectWalletButton
          onClick={() => setShowConnectModal(true)}
          type="button"
          className="btn py-3 mb-4"
        >
          Connect Wallet
        </ConnectWalletButton>
      );
    }
  }

  const desktopActionModal = useMemo(
    () => (
      <ActionModal
        variant={"desktop"}
        show={showActionModal}
        onClose={onCloseActionsModal}
        previewStepProps={previewStepProps}
      ></ActionModal>
    ),
    [showActionModal, previewStepProps]
  );

  return (
    <Container variant={variant}>
      {isDesktop && desktopActionModal}

      <WalletConnectModal
        show={showConnectModal}
        onClose={() => setShowConnectModal(false)}
      />

      <FormContainer>
        <div
          style={{ justifyContent: "space-evenly" }}
          className="d-flex flex-row align-items-center"
        >
          <FormTitleDiv
            left
            active={isDeposit}
            onClick={switchToTab(DEPOSIT_TAB)}
          >
            <FormTitle active={DEPOSIT_TAB}>Deposit</FormTitle>
          </FormTitleDiv>
          <FormTitleDiv
            left={false}
            active={!isDeposit}
            onClick={switchToTab(WITHDRAWAL_TAB)}
          >
            <FormTitle active={WITHDRAWAL_TAB}>Withdraw</FormTitle>
          </FormTitleDiv>
        </div>

        <ContentContainer className="px-4 py-4">
          <InputGuide>AMOUNT (ETH)</InputGuide>
          <FormInputContainer className="position-relative mt-2 mb-5 px-1">
            <FormInput
              type="number"
              className="form-control"
              aria-label="ETH"
              placeholder="0"
              value={inputAmount}
              onChange={handleChange}
            />
            {connected && (
              <MaxAccessory onClick={handleClickMax}>MAX</MaxAccessory>
            )}
          </FormInputContainer>

          {button}

          <WalletBalance active={connected}>{walletText}</WalletBalance>
        </ContentContainer>
      </FormContainer>

      {connected && isDesktop && <YourPosition></YourPosition>}
    </Container>
  );
};

export default ActionsForm;
