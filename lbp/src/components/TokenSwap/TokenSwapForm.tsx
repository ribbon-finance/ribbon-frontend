import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { BigNumber } from "ethers";

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
import useLBPPool from "../../hooks/useLBPPool";
import { LBPPoolUSDC } from "../../constants/constants";
import { RibbonTokenAddress } from "shared/lib/constants/constants";
import { handleSmallNumber } from "shared/lib/utils/math";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";
import { formatUnits } from "ethers/lib/utils";

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
  onSwapAmountChange: (amount: string) => void;
}

const TokenSwapForm: React.FC<TokenSwapFormProps> = ({
  swapAmount,
  onSwapAmountChange,
}) => {
  const [swapModal, setSwapModal] = useLBPGlobalState("swapModal");
  const [exchangeRate, setExchangeRate] = useState<BigNumber>();
  const [loading, setLoading] = useState(false);
  const loadingText = useTextAnimation(
    ["Loading", "Loading .", "Loading ..", "Loading ..."],
    250,
    loading
  );
  const contract = useLBPPool();

  const renderAssetLogo = useCallback((asset: "RBN" | "USDC") => {
    switch (asset) {
      case "RBN":
        return <Logo height={40} width={40} />;
      case "USDC":
        return <USDCLogo height={40} width={40} />;
    }
  }, []);

  useEffect(() => {
    if (!contract) {
      return;
    }
    (async () => {
      setLoading(true);
      const offerTokenAddress =
        swapModal.offerToken === "USDC" ? LBPPoolUSDC : RibbonTokenAddress;
      const receiveTokenAddress =
        swapModal.receiveToken === "USDC" ? LBPPoolUSDC : RibbonTokenAddress;

      setExchangeRate(
        await contract.getSpotPrice(offerTokenAddress, receiveTokenAddress)
      );
      setLoading(false);
    })();
  }, [contract, swapModal.offerToken, swapModal.receiveToken]);

  const exchangeRateText = useMemo(() => {
    if (loading) {
      return loadingText;
    }

    if (!exchangeRate) {
      return "---";
    }

    return `1 ${swapModal.offerToken} = ${handleSmallNumber(
      1 /
        parseFloat(
          formatUnits(exchangeRate, swapModal.offerToken === "USDC" ? 6 : 18)
        )
    )} ${swapModal.receiveToken}`;
  }, [
    exchangeRate,
    loading,
    loadingText,
    swapModal.offerToken,
    swapModal.receiveToken,
  ]);

  const renderReceiveTokenAmount = useCallback(() => {
    if (loading) {
      return loadingText;
    }

    if (!exchangeRate) {
      return "---";
    }

    return handleSmallNumber(
      (swapAmount ? swapAmount : 0) /
        parseFloat(
          formatUnits(exchangeRate, swapModal.offerToken === "USDC" ? 6 : 18)
        )
    );
  }, [exchangeRate, loading, loadingText, swapAmount, swapModal.offerToken]);

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
            setSwapModal((current) => ({
              ...current,
              offerToken: current.receiveToken,
              receiveToken: current.offerToken,
            }));
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
                value={renderReceiveTokenAmount()}
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
        <ActionButton className="py-3" color={colors.products.yield} disabled>
          PREVIEW SWAP
        </ActionButton>
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
