import React, { useState } from "react";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, ethers } from "ethers";
import { Title } from "../../designSystem";
import WalletConnectModal from "../Wallet/WalletConnectModal";
import { formatSignificantDecimals } from "../../utils/math";
import YourPosition from "./YourPosition";
import ActionModal from "../ActionModal/ActionModal";
import { ACTIONS } from "../ActionModal/types";
import { ActionButton, ConnectWalletButton } from "../Common/buttons";
import { GAS_LIMITS } from "../../constants/constants";
import useGasPrice from "../../hooks/useGasPrice";
import useVaultData from "../../hooks/useVaultData";

const { parseEther, formatEther } = ethers.utils;

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
    props.active ? "#151413" : "rgba(255, 255, 255, 0.04)"};
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

const ActionsForm = () => {
  const DEPOSIT_TAB = true;
  const WITHDRAWAL_TAB = false;

  const { status, userAssetBalance, vaultBalanceInAsset } = useVaultData();
  const isLoadingData = status === "loading";
  const [isDeposit, setIsDeposit] = useState(true);
  const [inputAmount, setInputAmount] = useState("");
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const { active, account } = useWeb3React();
  const gasPrice = useGasPrice();

  const connected = Boolean(active && account);

  const handleClickMax = () => {
    if (
      !isLoadingData &&
      connected &&
      userAssetBalance.isZero() &&
      gasPrice.fetched
    ) {
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
  };

  const switchToTab = (isDeposit: boolean) => {
    return () => {
      setIsDeposit(isDeposit);
      setInputAmount("");
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

  return (
    <div>
      <FormContainer>
        <WalletConnectModal
          show={showConnectModal}
          onClose={() => setShowConnectModal(false)}
        />
        <ActionModal
          actionType={isDeposit ? ACTIONS.deposit : ACTIONS.withdraw}
          show={showActionModal}
          amount={inputAmount ? parseEther(inputAmount) : BigNumber.from("0")}
          positionAmount={BigNumber.from("0")}
          actionParams={
            isDeposit
              ? { action: ACTIONS.deposit, yield: 30 }
              : {
                  action: ACTIONS.withdraw,
                  withdrawalFee: 0.5,
                }
          }
          onClose={() => setShowActionModal(false)}
        ></ActionModal>
        <div
          style={{ justifyContent: "space-evenly" }}
          className="d-flex flex-row align-items-center"
        >
          <FormTitleDiv
            left
            active={isDeposit}
            onClick={() => setIsDeposit(DEPOSIT_TAB)}
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
              onChange={(e) => setInputAmount(e.target.value)}
            />
            {connected && (
              <MaxAccessory onClick={handleClickMax}>MAX</MaxAccessory>
            )}
          </FormInputContainer>

          {connected ? (
            <ActionButton
              onClick={() =>
                inputAmount && connected && setShowActionModal(true)
              }
              className="py-3 mb-4"
            >
              {actionButtonText}
            </ActionButton>
          ) : (
            <ConnectWalletButton
              onClick={() => setShowConnectModal(true)}
              type="button"
              className="btn py-3 mb-4"
            >
              Connect Wallet
            </ConnectWalletButton>
          )}

          <WalletBalance active={connected}>{walletText}</WalletBalance>
        </ContentContainer>
      </FormContainer>

      {connected && <YourPosition></YourPosition>}
    </div>
  );
};

export default ActionsForm;
