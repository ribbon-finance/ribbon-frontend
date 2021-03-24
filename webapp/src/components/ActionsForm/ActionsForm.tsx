import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { Title } from "../../designSystem";
import WalletConnectModal from "../Wallet/WalletConnectModal";
import { formatSignificantDecimals } from "../../utils/math";
import YourPosition from "./YourPosition";

const { formatEther } = ethers.utils;

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
  padding: 24px 60px;
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
  font-size: 48px;
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

const BottomButton = styled.button`
  width: 100%;
  border-radius: 4px;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  text-transform: uppercase;
  outline: none !important;

  &:active,
  &:focus {
    outline: none !important;
    box-shadow: none !important;
  }
`;

const ActionButton = styled(BottomButton)`
  background: #fc0a54;
  color: #ffffff;

  &:hover {
    color: #ffffff;
  }
`;

const ConnectWalletButton = styled(BottomButton)`
  background: rgba(22, 206, 185, 0.08);
  color: #16ceb9;

  &:hover {
    color: #16ceb9;
  }
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

  const [isDeposit, setIsDeposit] = useState(true);
  const [inputAmount, setInputAmount] = useState("");
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [userBalance, setUserBalance] = useState(""); // store balances in string
  const { library, active, account } = useWeb3React();

  const connected = Boolean(active && account);

  const getAndSetBalance = useCallback(async () => {
    if (account) {
      const bal = await library.getBalance(account);
      setUserBalance(bal.toString());
    }
  }, [library, account]);

  const handleClickMax = () => {
    if (connected && userBalance) {
      setInputAmount(formatEther(userBalance));
    }
  };

  const switchToTab = (isDeposit: boolean) => {
    return () => {
      setIsDeposit(isDeposit);
      setInputAmount("");
    };
  };

  useEffect(() => {
    if (account) {
      getAndSetBalance();
    }
  }, [account, getAndSetBalance]);

  let walletText = "";

  if (isDeposit) {
    const position =
      account && userBalance
        ? formatSignificantDecimals(formatEther(userBalance))
        : "---";
    walletText = `Wallet Balance: ${position} ETH`;
  } else {
    const position =
      account && userBalance
        ? formatSignificantDecimals(formatEther(userBalance))
        : "---";
    walletText = `Your Position: ${position} ETH`;
  }

  return (
    <div>
      <FormContainer>
        <WalletConnectModal
          show={showConnectModal}
          onClose={() => setShowConnectModal(false)}
        />
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
            <MaxAccessory onClick={handleClickMax}>MAX</MaxAccessory>
          </FormInputContainer>

          {connected ? (
            <ActionButton type="button" className="btn py-3 mb-4">
              {isDeposit ? "Deposit ETH" : "Withdraw ETH"}
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
