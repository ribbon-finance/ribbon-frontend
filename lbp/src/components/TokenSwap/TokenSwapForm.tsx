import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import { BigNumber } from "ethers";
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
import useLBPPool from "../../hooks/useLBPPool";
import { parseUnits } from "ethers/lib/utils";
import { getAssetDecimals } from "shared/lib/utils/asset";
import { LBPPoolUSDC } from "../../constants/constants";
import { RibbonTokenAddress } from "shared/lib/constants/constants";
import useConnectWalletModal from "shared/lib/hooks/useConnectWalletModal";

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
}

const TokenSwapForm: React.FC<TokenSwapFormProps> = ({
  swapAmount,
  receiveAmount,
  exchangeRate,
  onSwapAmountChange,
}) => {
  const { active } = useWeb3React();
  const [, setShowConnectModal] = useConnectWalletModal();
  const [swapModal, setSwapModal] = useLBPGlobalState("swapModal");
  const contract = useLBPPool();

  const renderAssetLogo = useCallback((asset: "RBN" | "USDC") => {
    switch (asset) {
      case "RBN":
        return <Logo height={40} width={40} />;
      case "USDC":
        return <USDCLogo height={40} width={40} />;
    }
  }, []);

  const exchangeRateText = useMemo(() => {
    if (!swapAmount || !receiveAmount) {
      return `1 ${swapModal.offerToken} = ${handleSmallNumber(exchangeRate)} ${
        swapModal.receiveToken
      }`;
    }

    return `1 ${swapModal.offerToken} = ${handleSmallNumber(
      receiveAmount / swapAmount
    )} ${swapModal.receiveToken}`;
  }, [
    exchangeRate,
    receiveAmount,
    swapAmount,
    swapModal.offerToken,
    swapModal.receiveToken,
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
                <Title className="ml-2">{swapModal.offerToken}</Title>
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
                <Title className="ml-2">{swapModal.receiveToken}</Title>
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
      <BaseModalContentColumn>
        {active ? (
          <ActionButton
            className="py-3"
            color={colors.products.yield}
            disabled={!receiveAmount}
            onClick={async () => {
              if (!swapAmount) {
                return;
              }

              const offerTokenAddress =
                swapModal.offerToken === "USDC"
                  ? LBPPoolUSDC
                  : RibbonTokenAddress;
              const receiveTokenAddress =
                swapModal.receiveToken === "USDC"
                  ? LBPPoolUSDC
                  : RibbonTokenAddress;
              try {
                const offerBigNumber = parseUnits(
                  swapAmount.toString(),
                  getAssetDecimals(swapModal.offerToken)
                );
                const receiveBigNumber = parseUnits(
                  receiveAmount.toString(),
                  getAssetDecimals(swapModal.receiveToken)
                );

                /** Assume 1% slippage */
                await contract.swapExactAmountIn(
                  offerTokenAddress,
                  offerBigNumber,
                  receiveTokenAddress,
                  receiveBigNumber.mul(99).div(100),
                  offerBigNumber
                    .mul(BigNumber.from(10).pow(18))
                    .div(receiveBigNumber)
                    .mul(101)
                    .div(100)
                );
              } catch (err) {
                console.log(err);
              }
            }}
          >
            PREVIEW SWAP
          </ActionButton>
        ) : (
          <ActionButton
            className="py-3"
            color={colors.green}
            onClick={() => setShowConnectModal(true)}
          >
            Connect Wallet
          </ActionButton>
        )}
      </BaseModalContentColumn>

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
