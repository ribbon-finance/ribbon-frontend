import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";

import {
  BaseInput,
  BaseInputContianer,
  BaseInputLabel,
  BaseModalContentColumn,
  BaseUnderlineLink,
  PrimaryText,
  SecondaryText,
  Title,
} from "shared/lib/designSystem";
import theme from "shared/lib/designSystem/theme";
import colors from "shared/lib/designSystem/colors";
import { ActionButton } from "shared/lib/components/Common/buttons";
import { ExternalIcon } from "shared/lib/assets/icons/icons";
import { useLBPGlobalState } from "../../store/store";
import Logo from "shared/lib/assets/icons/logo";
import { USDCLogo } from "shared/lib/assets/icons/erc20Assets";
import { handleSmallNumber } from "shared/lib/utils/math";
import { parseUnits } from "ethers/lib/utils";
import useConnectWalletModal from "shared/lib/hooks/useConnectWalletModal";
import {
  ERC20Token,
  getERC20TokenDecimals,
  getERC20TokenDisplay,
} from "shared/lib/models/eth";
import { RibbonTokenBalancerPoolAddress } from "shared/lib/constants/constants";
import useTokenAllowance from "shared/lib/hooks/useTokenAllowance";
import useERC20Token from "shared/lib/hooks/useERC20Token";
import { useWeb3Context } from "shared/lib/hooks/web3Context";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";

const PrimaryInputLabel = styled(BaseInputLabel)`
  font-family: VCR;
  letter-spacing: 1px;
`;

const SecondaryInfoLabel = styled(SecondaryText)`
  font-size: 12px;
  line-height: 16px;
`;

const TokenSwapInputAssetContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 8px;
`;

const TokenSwapInput = styled(BaseInput)`
  width: 100%;
  text-align: right;
  font-size: 20px;

  &:disabled {
    background-color: unset;
  }
`;

const ArrowContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: 20px;

  i {
    color: ${colors.primaryText};
  }
`;

const BalancerReadMoreLink = styled(BaseUnderlineLink)`
  color: ${colors.primaryText};
`;

interface TokenSwapFormProps {
  swapAmount?: number;
  receiveAmount: number;
  exchangeRate: number;
  onSwapAmountChange: (amount: string) => void;
  onPreview: () => void;
}

const TokenSwapForm: React.FC<TokenSwapFormProps> = ({
  swapAmount,
  receiveAmount,
  exchangeRate,
  onSwapAmountChange,
  onPreview,
}) => {
  const { active } = useWeb3React();
  const { provider } = useWeb3Context();
  const [, setShowConnectModal] = useConnectWalletModal();
  const [swapModal, setSwapModal] = useLBPGlobalState("swapModal");
  const allowance = useTokenAllowance(
    swapModal.offerToken,
    RibbonTokenBalancerPoolAddress
  );
  const tokenContract = useERC20Token(swapModal.offerToken);
  const [waitingApproval, setWaitingApproval] = useState(false);
  const approvingAnimatedText = useTextAnimation(
    ["Approving", "Approving .", "Approving ..", "Approving ..."],
    250,
    waitingApproval
  );

  const renderAssetLogo = useCallback((asset: ERC20Token) => {
    switch (asset) {
      case "rbn":
        return <Logo height={40} width={40} />;
      case "usdc":
        return <USDCLogo height={40} width={40} />;
      default:
        return <></>;
    }
  }, []);

  const needTokenApprove = useMemo(() => {
    if (!allowance || !swapAmount) {
      return true;
    }

    return allowance.lt(
      parseUnits(
        swapAmount.toString(),
        getERC20TokenDecimals(swapModal.offerToken)
      )
    );
  }, [allowance, swapAmount, swapModal.offerToken]);

  const exchangeRateText = useMemo(() => {
    let effectiveExchangeRate = exchangeRate;

    if (swapAmount && receiveAmount) {
      effectiveExchangeRate = receiveAmount / swapAmount;
    }

    return `1 ${getERC20TokenDisplay(
      swapModal.offerToken
    )} = ${handleSmallNumber(effectiveExchangeRate)} ${getERC20TokenDisplay(
      swapModal.receiveToken
    )}`;
  }, [
    exchangeRate,
    receiveAmount,
    swapAmount,
    swapModal.offerToken,
    swapModal.receiveToken,
  ]);

  const actionButton = useMemo(() => {
    if (!active) {
      <ActionButton
        className="py-3"
        color={colors.green}
        onClick={() => setShowConnectModal(true)}
      >
        Connect Wallet
      </ActionButton>;
    }

    if (swapAmount && needTokenApprove) {
      return (
        <ActionButton
          className="py-3"
          color={colors.products.yield}
          disabled={!receiveAmount}
          onClick={async () => {
            setWaitingApproval(true);
            const amount =
              "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

            try {
              const tx = await tokenContract.approve(
                RibbonTokenBalancerPoolAddress,
                amount
              );

              const txhash = tx.hash;

              /** TODO: Add pending transactions */
              // setPendingTransactions((pendingTransactions) => [
              //   ...pendingTransactions,
              //   {
              //     txhash,
              //     type: "approval",
              //     amount: amount,
              //     vault: vaultOption,
              //   },
              // ]);

              // Wait for transaction to be approved
              await provider.waitForTransaction(txhash, 5);
            } catch (err) {
              setWaitingApproval(false);
            }
          }}
        >
          {waitingApproval
            ? approvingAnimatedText
            : `APPROVE ${getERC20TokenDisplay(swapModal.offerToken)}`}
        </ActionButton>
      );
    }

    return (
      <ActionButton
        className="py-3"
        color={colors.products.yield}
        disabled={!receiveAmount || needTokenApprove}
        onClick={onPreview}
      >
        PREVIEW SWAP
      </ActionButton>
    );
  }, [
    active,
    approvingAnimatedText,
    needTokenApprove,
    onPreview,
    provider,
    receiveAmount,
    setShowConnectModal,
    swapAmount,
    swapModal.offerToken,
    tokenContract,
    waitingApproval,
  ]);

  return (
    <>
      {/* Title */}
      <BaseModalContentColumn marginTop={8}>
        <Title>SWAP TOKENS</Title>
      </BaseModalContentColumn>

      {/* Pay input */}
      <BaseModalContentColumn marginTop={24 + 16}>
        <div className="d-flex w-100 flex-wrap">
          <div className="d-flex w-100 align-items-center">
            <PrimaryInputLabel>YOU PAY</PrimaryInputLabel>
            <SecondaryInfoLabel className="ml-auto">
              Max 25,000 USDC
            </SecondaryInfoLabel>
          </div>
          <BaseInputContianer>
            <div className="d-flex w-100 h-100">
              <TokenSwapInputAssetContainer>
                {renderAssetLogo(swapModal.offerToken)}
                <Title className="ml-2">
                  {getERC20TokenDisplay(swapModal.offerToken)}
                </Title>
              </TokenSwapInputAssetContainer>
              <TokenSwapInput
                type="number"
                className="form-control"
                placeholder="0"
                value={swapAmount}
                onChange={(e) => onSwapAmountChange(e.target.value)}
              />
            </div>
          </BaseInputContianer>
        </div>
      </BaseModalContentColumn>

      {/* Arrow */}
      <BaseModalContentColumn marginTop={16}>
        <ArrowContainer
          role="button"
          onClick={() => {
            /** Swap token */
            setSwapModal((current) => ({
              ...current,
              offerToken: current.receiveToken,
              receiveToken: current.offerToken,
            }));
            /** Swap amount */
            if (receiveAmount) {
              onSwapAmountChange(receiveAmount.toFixed(4));
            }
          }}
        >
          <i className="fas fa-arrow-down" />
        </ArrowContainer>
      </BaseModalContentColumn>

      {/* Receive input */}
      <BaseModalContentColumn marginTop={-8}>
        <div className="d-flex w-100 flex-wrap">
          <PrimaryInputLabel>YOU RECEIVE</PrimaryInputLabel>
          <BaseInputContianer className="position-relative">
            <div className="d-flex w-100 h-100">
              <TokenSwapInputAssetContainer>
                {renderAssetLogo(swapModal.receiveToken)}
                <Title className="ml-2">
                  {getERC20TokenDisplay(swapModal.receiveToken)}
                </Title>
              </TokenSwapInputAssetContainer>
              <TokenSwapInput
                type="number"
                className="form-control"
                value={handleSmallNumber(receiveAmount)}
                disabled
              />
            </div>
          </BaseInputContianer>
        </div>
      </BaseModalContentColumn>

      {/* Conversion rate */}
      <BaseModalContentColumn marginTop={16}>
        <SecondaryInfoLabel>{exchangeRateText}</SecondaryInfoLabel>
      </BaseModalContentColumn>

      {/* Swap button */}
      <BaseModalContentColumn>{actionButton}</BaseModalContentColumn>

      <BaseModalContentColumn>
        <BalancerReadMoreLink
          to="https://ribbonfinance.medium.com/rbn-airdrop-distribution-70b6cb0b870c"
          target="_blank"
          rel="noreferrer noopener"
          className="d-flex align-items-center"
        >
          <PrimaryText>Swap tokens on Balancer</PrimaryText>
          <ExternalIcon className="ml-1" color={colors.primaryText} />
        </BalancerReadMoreLink>
      </BaseModalContentColumn>
    </>
  );
};

export default TokenSwapForm;
