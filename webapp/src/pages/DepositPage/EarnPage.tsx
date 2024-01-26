import { useEffect, useMemo, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { useWeb3Wallet } from "shared/lib/hooks/useWeb3Wallet";
import styled, { css } from "styled-components";
import { Redirect } from "react-router-dom";
import { SecondaryText, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import { AnimatePresence, motion } from "framer-motion";
import { useV2VaultData, useVaultData } from "shared/lib/hooks/web3DataContext";
import {
  formatAmount,
  formatBigNumber,
  formatSignificantDecimals,
  isPracticallyZero,
} from "shared/lib/utils/math";
import usePullUp from "../../hooks/usePullUp";
import {
  isEarnVault,
  VaultList,
  VaultOptions,
} from "shared/lib/constants/constants";
import { Subtitle } from "shared/lib/designSystem";
import useVaultOption from "../../hooks/useVaultOption";
import {
  getEarnVaultFeColorMatrix,
  getVaultColor,
} from "shared/lib/utils/vault";
import {
  getAssetDefaultSignificantDecimals,
  getAssetLogo,
  getChainByVaultOption,
} from "shared/lib/utils/asset";
import useRedirectOnSwitchChain from "../../hooks/useRedirectOnSwitchChain";
import useRedirectOnWrongChain from "../../hooks/useRedirectOnWrongChain";
import EarnStrategyExplainer from "../../components/Earn/EarnStrategyExplainer";
import { useGlobalState } from "shared/lib/store/store";
import useVaultAccounts from "shared/lib/hooks/useVaultAccounts";
import { ActionButton } from "shared/lib/components/Common/buttons";
import useConnectWalletModal from "shared/lib/hooks/useConnectWalletModal";
import EarnDetailsModal from "../../components/Earn/Modal/EarnDetailsModal";
import {
  EarnInnerRing,
  EarnMiddleRing,
  EarnOuterRing,
} from "shared/lib/assets/icons/icons";
import ActionModal from "../../components/Vault/VaultActionsForm/EarnModal/ActionModal";
import { usePendingTransactions } from "shared/lib/hooks/pendingTransactionsContext";
import { useEarnStrategyTime } from "../../constants/constants";
import useLoadingText, { LoadingText } from "shared/lib/hooks/useLoadingText";
import { ACTIONS } from "../../components/Vault/VaultActionsForm/EarnModal/types";
import {
  fadeIn,
  fadeOut,
  rotateClockwise,
  rotateAnticlockwise,
} from "shared/lib/designSystem/keyframes";
import {
  REarnGeofenceCountry,
  useREarnGeofence,
} from "shared/lib/hooks/useGeofence";
import TextPreview from "shared/lib/components/TextPreview/TextPreview";
import Geoblocked from "shared/lib/components/Geoblocked/Geoblocked";
import Banner from "shared/lib/components/Banner/Banner";

const delayedFade = css<{ delay?: number }>`
  opacity: 0;
  animation: ${fadeIn} 1s ease-in-out forwards;
  animation-delay: ${({ delay }) => `${delay || 0}s`};
`;

const AbsoluteContainer = styled.div`
  position: absolute;
  width: 100%;
  top: 0;
`;

const { formatUnits } = ethers.utils;

const PendingOrLogoContainer = styled.div<{ delay?: number }>`
  display: flex;
  ${delayedFade}
`;

const PendingDepositsContainer = styled.div<{ delay?: number; color: string }>`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  text-align: left;
  font-size: 12px;
  padding: 8px;
  height: 64px;
  width: 232px;
  border-radius: 100px;
  position: relative;
  background: ${(props) => props.color}14;
  backdrop-filter: blur(16px);
`;

const EarnCapacityText = styled(Title)<{ delay?: number }>`
  color: ${colors.tertiaryText};
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  margin-top: 32px;
  height: 20px;
  ${delayedFade}
`;

const TextContainer = styled.div`
  height: 32px;
  width: 164px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-self: center;
  color: rgba(255, 255, 255, 0.64);
  margin-left: 8px;
`;

const ProductAssetLogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  width: 48px;
  background-color: ${colors.background.one};
  border-radius: 50%;
  position: relative;
`;

const CirclesContainer = styled.div<{ offset: number }>`
  position: absolute;
  width: 100%;
  height: calc(100% - ${({ offset }) => offset}px);
  display: flex;
  overflow: hidden;
  align-items: center;
  justify-content: center;
`;

const FadeDiv = styled.div<{
  delaySeconds?: number;
  show?: boolean;
  fadeSeconds?: number;
}>`
  position: absolute;
  ${(props) => {
    if (props.show !== false) {
      return css`
        opacity: 0;
      `;
    }
  }}
  ${(props) => {
    if (props.show === undefined) {
      return ``;
    }
    if (props.show) {
      return css`
        animation: ${fadeIn} 4s ease-in-out forwards;
      `;
    }
    return css`
      animation: ${fadeOut} 4s ease-in-out forwards;
    `;
  }}
  animation-delay: ${({ delaySeconds }) => `${delaySeconds || 0}s`};
`;

const StyledEarnInnerRing = styled(EarnInnerRing)<{ color: string }>`
  color: ${(props) => props.color};
  animation: ${rotateClockwise} 60s linear infinite;
  @media (max-width: 700px) {
    display: none;
  }
`;

const StyledEarnMiddleRing = styled(EarnMiddleRing)<{ color: string }>`
  color: ${(props) => props.color};
  animation: ${rotateAnticlockwise} 60s linear infinite;
  @media (max-width: 700px) {
    height: 500px;
  }
`;

const StyledEarnOuterRing = styled(EarnOuterRing)<{ color: string }>`
  color: ${(props) => props.color};
  animation: ${rotateClockwise} 60s linear infinite;
  @media (max-width: 700px) {
    height: 650px;
  }
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

const PageContainer = styled.div<{ offset: number }>`
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: auto;
  overflow: hidden;
  height: calc(100vh - ${({ offset }) => offset}px);
`;

const VaultContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-width: 240px;
`;

const VaultFullText = styled(SecondaryText)`
  color: ${colors.red};
  text-transform: none;
`;

const HeroText = styled(Title)<{ delay?: number }>`
  font-size: 56px;
  line-height: 64px;
  margin-bottom: 16px;
  ${delayedFade}
`;

const HeroSubtitle = styled(Subtitle)<{ delay?: number }>`
  ${delayedFade}
`;

const ViewDetailsButton = styled.div<{ delay?: number }>`
  display: flex;
  flex-direction: column;
  width: 136px;
  height: 40px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 100px;
  justify-content: center;
  text-align: center;
  color: #ffffff;
  border-radius: 100px;
  margin-right: auto;
  margin-left: auto;
  margin-top: 24px;
  &:hover {
    opacity: 1;
  }
  gap: 8px;
  line-height: 20px;
  font-size: 12px;
  z-index: 1;
  ${delayedFade}
`;

const ButtonContainer = styled.div<{ delay?: number }>`
  z-index: 1;
  width: 240px;
  ${delayedFade}
`;
const StyledActionButton = styled(ActionButton)`
  font-size: 14px;
  z-index: 1;
  letter-spacing: 1px;
`;

const CompleteWithdrawButton = styled(ActionButton)`
  font-size: 14px;
  max-height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
  color: ${colors.primaryText};
  z-index: 1;
  text-transform: none;
`;

const Marker = styled.div<{
  color: string;
  marginLeft?: number;
}>`
  width: 8px;
  height: 8px;
  background: ${(props) => props.color};
  border-radius: 1000px;
  margin-right: 8px;
`;

const GeofenceAbsoluteContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const EarnPage = () => {
  const { vaultOption, vaultVersion } = useVaultOption();
  const { active, account, chainId } = useWeb3Wallet();
  const loadingText = useLoadingText();
  const { strategyStartTime } = useEarnStrategyTime(vaultOption ?? "rEARN");
  const { loading: geofenceLoading, rejected } = useREarnGeofence(
    Object.values(REarnGeofenceCountry)
  );

  useRedirectOnWrongChain(vaultOption, chainId);
  usePullUp();

  const [showVault] = useGlobalState("showEarnVault");
  const [, setShowConnectModal] = useConnectWalletModal();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const { pendingTransactions } = usePendingTransactions();
  const [isDepositSuccess, setDepositSuccess] = useState<boolean>();

  useEffect(() => {
    if (
      pendingTransactions.some((transaction) => {
        return (
          transaction.status === "success" &&
          (transaction.type === "deposit" ||
            transaction.type === "withdraw" ||
            transaction.type === "withdrawInitiation") &&
          transaction.vault === vaultOption
        );
      })
    ) {
      setDepositSuccess(true);
      setTimeout(function () {
        setDepositSuccess(false);
      }, 9000);
    }
  }, [pendingTransactions, vaultOption]);
  const [componentRefs] = useGlobalState("componentRefs");
  const { status } = useVaultData(vaultOption || VaultList[0]);
  const {
    data: {
      asset,
      decimals,
      totalBalance: v2Deposits,
      cap: v2VaultLimit,
      withdrawals,
      round,
    },
    loading,
  } = useV2VaultData(vaultOption || VaultList[0]);

  const { vaultAccounts } = useVaultAccounts(vaultVersion);
  const vaultAccount = vaultAccounts[vaultOption || VaultList[0]];
  const Logo = getAssetLogo(asset);
  const isLoading = status === "loading" || loading;
  useRedirectOnSwitchChain(getChainByVaultOption(vaultOption as VaultOptions));
  const decimalPlaces = getAssetDefaultSignificantDecimals(asset);
  const logo = <Logo height="100%" />;
  const feColorMatrix = getEarnVaultFeColorMatrix(vaultOption as VaultOptions);

  const color = useMemo(() => {
    if (vaultOption) {
      return getVaultColor(vaultOption);
    }
    return colors.primaryText;
  }, [vaultOption]);

  const [investedInStrategy] = useMemo(() => {
    if (!vaultAccount) {
      return [BigNumber.from(0.0)];
    }
    return [vaultAccount.totalBalance];
  }, [vaultAccount]);

  const isVaultMaxCapacity = useMemo(() => {
    if (isLoading || (vaultOption && !isEarnVault(vaultOption))) {
      return undefined;
    }
    return isPracticallyZero(v2VaultLimit.sub(v2Deposits), decimals);
  }, [decimals, isLoading, v2Deposits, v2VaultLimit, vaultOption]);

  const [totalDepositStr, depositLimitStr] = useMemo(() => {
    return [
      parseFloat(
        formatSignificantDecimals(
          formatUnits(v2Deposits, decimals),
          decimalPlaces
        )
      ),
      parseFloat(
        formatSignificantDecimals(formatUnits(v2VaultLimit, decimals))
      ),
    ];
  }, [decimalPlaces, decimals, v2Deposits, v2VaultLimit]);

  const [hasPendingDeposits, hasLockedBalanceInAsset] = useMemo(() => {
    if (!vaultAccount) {
      return [false, false];
    }
    return [
      !isPracticallyZero(vaultAccount.totalPendingDeposit, decimals),
      !isPracticallyZero(
        vaultAccount.totalBalance.sub(vaultAccount.totalPendingDeposit),
        decimals
      ),
    ];
  }, [vaultAccount, decimals]);

  const [roi, yieldColor] = useMemo(() => {
    if (
      !vaultAccount ||
      isPracticallyZero(vaultAccount.totalDeposits, decimals)
    ) {
      return [0.0, colors.green];
    }

    const roiTemp =
      (parseFloat(
        formatBigNumber(
          vaultAccount.totalBalance.sub(vaultAccount.totalDeposits),
          decimals,
          2
        )
      ) /
        parseFloat(formatUnits(vaultAccount.totalDeposits, decimals))) *
      100;

    const roiColor = roiTemp >= 0 ? colors.green : colors.red;
    return [
      (parseFloat(
        formatBigNumber(
          vaultAccount.totalBalance.sub(vaultAccount.totalDeposits),
          decimals,
          decimalPlaces
        )
      ) /
        parseFloat(formatUnits(vaultAccount.totalDeposits, decimals))) *
        100,
      roiColor,
    ];
  }, [vaultAccount, decimals, decimalPlaces]);

  const showInitiateWithdraw = useMemo(() => {
    return (
      !withdrawals.shares.isZero() ||
      hasLockedBalanceInAsset ||
      hasPendingDeposits
    );
  }, [hasLockedBalanceInAsset, hasPendingDeposits, withdrawals.shares]);

  const showCompleteWithdraw = useMemo(() => {
    return !withdrawals.shares.isZero() && withdrawals.round !== round;
  }, [round, withdrawals]);

  const pageOffset = useMemo(() => {
    return (
      (componentRefs.header?.offsetHeight || 0) +
      (componentRefs.footer?.offsetHeight || 0)
    );
  }, [componentRefs.header?.offsetHeight, componentRefs.footer?.offsetHeight]);

  if (vaultOption === "rEARN") {
    if (geofenceLoading) {
      return (
        <GeofenceAbsoluteContainer>
          <TextPreview>
            <LoadingText>Ribbon Finance</LoadingText>
          </TextPreview>
        </GeofenceAbsoluteContainer>
      );
    } else if (rejected) {
      return (
        <GeofenceAbsoluteContainer>
          <Geoblocked text="You are not allowed to deposit into Ribbon Earn USDC due to the restricted jurisdiction." />
        </GeofenceAbsoluteContainer>
      );
    }
  }

  /**
   * Redirect to homepage if no clear vault is chosen
   */

  if (!vaultOption) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <CirclesContainer offset={pageOffset}>
        <FadeDiv delaySeconds={0.3} show={!isDepositSuccess}>
          <StyledEarnOuterRing
            feColorMatrix={feColorMatrix}
            type={color}
            color={color}
          />
        </FadeDiv>
        <FadeDiv delaySeconds={0.3} show={isDepositSuccess}>
          <StyledEarnOuterRing color={colors.green} />
        </FadeDiv>
        <FadeDiv delaySeconds={0.2} show={!isDepositSuccess}>
          <StyledEarnMiddleRing type={color} color={color} />
        </FadeDiv>
        <FadeDiv delaySeconds={0.2} show={isDepositSuccess}>
          <StyledEarnMiddleRing color={colors.green} />
        </FadeDiv>
        <FadeDiv delaySeconds={0.1} show={!isDepositSuccess}>
          <StyledEarnInnerRing type={color} color={color} />
        </FadeDiv>
        <FadeDiv delaySeconds={0.1} show={isDepositSuccess}>
          <StyledEarnInnerRing color={colors.green} />
        </FadeDiv>
      </CirclesContainer>
      <div style={{ position: "relative", width: "100%" }}>
        <AbsoluteContainer>
          <Banner
            color={color}
            message={"R-EARN vault is now inactive and does not accept deposits"}
          ></Banner>
        </AbsoluteContainer>
        <PageContainer offset={pageOffset}>
          <AnimatePresence exitBeforeEnter>
            {showVault.show ? (
              <motion.div
                key={"showVault"}
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={{
                  duration: 0.25,
                  type: "keyframes",
                  ease: "easeInOut",
                }}
              >
                <VaultContainer>
                  <PendingOrLogoContainer delay={0.1}>
                    {hasPendingDeposits ? (
                      <PendingDepositsContainer color={color}>
                        <ProductAssetLogoContainer color={color}>
                          {logo}
                        </ProductAssetLogoContainer>
                        <TextContainer>
                          <p>
                            Your deposit will deployed in the vault in{" "}
                            <span style={{ color: colors.primaryText }}>
                              {strategyStartTime}
                            </span>
                          </p>
                        </TextContainer>
                      </PendingDepositsContainer>
                    ) : (
                      <ProductAssetLogoContainer color={color}>
                        {logo}
                      </ProductAssetLogoContainer>
                    )}
                  </PendingOrLogoContainer>
                  <BalanceTitle delay={0.2}>
                    Your Balance ({asset})
                  </BalanceTitle>
                  <HeroText delay={0.3}>
                    {isLoading || !account
                      ? "---"
                      : formatBigNumber(
                          BigNumber.from(investedInStrategy),
                          decimals,
                          decimalPlaces
                        )}
                  </HeroText>
                  <HeroSubtitle color={yieldColor} delay={0.4}>
                    {roi > 0 && "+"}
                    {isLoading || roi === 0 ? "0.00" : roi.toFixed(4)}%
                  </HeroSubtitle>
                  <ViewDetailsButton
                    role="button"
                    onClick={() => {
                      setShowDetailsModal(true);
                    }}
                    delay={0.5}
                  >
                    View Details
                  </ViewDetailsButton>
                  <ButtonContainer delay={0.6}>
                    {active && account ? (
                      <>
                        <StyledActionButton
                          className={`mt-5 py-3 mb-0 w-100`}
                          color={color}
                          onClick={() => {
                            setShowDepositModal(true);
                          }}
                          disabled
                        >
                          Deposit
                        </StyledActionButton>
                        <StyledActionButton
                          className={`py-3 mb-1 w-100`}
                          color={"white"}
                          disabled={!showInitiateWithdraw}
                          onClick={() => {
                            setShowWithdrawModal(true);
                          }}
                        >
                          Withdraw
                        </StyledActionButton>
                        {showCompleteWithdraw && (
                          <CompleteWithdrawButton
                            className={`py-3 mb-1 w-100`}
                            color={color}
                            onClick={() => {
                              setShowCompleteModal(true);
                            }}
                          >
                            <div className="d-flex flex-row justify-content-around align-items-center">
                              <Marker color={color} />
                              <SecondaryText>
                                Complete your withdrawals
                              </SecondaryText>
                            </div>
                          </CompleteWithdrawButton>
                        )}
                      </>
                    ) : (
                      <StyledActionButton
                        className={`mt-5 py-3 w-100`}
                        color={color}
                        onClick={() => setShowConnectModal(true)}
                      >
                        Connect Wallet
                      </StyledActionButton>
                    )}
                  </ButtonContainer>
                  <EarnCapacityText delay={0.7}>
                    {isLoading || isVaultMaxCapacity === undefined ? (
                      loadingText
                    ) : isVaultMaxCapacity ? (
                      <VaultFullText>Vault is currently full</VaultFullText>
                    ) : (
                      formatAmount(totalDepositStr) +
                      " " +
                      asset +
                      " / " +
                      formatAmount(depositLimitStr) +
                      " " +
                      asset
                    )}
                  </EarnCapacityText>
                </VaultContainer>
              </motion.div>
            ) : (
              <motion.div
                key={"showIntro"}
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={{
                  duration: 0.25,
                  type: "keyframes",
                  ease: "easeInOut",
                }}
              >
                <EarnStrategyExplainer vaultOption={vaultOption} />
              </motion.div>
            )}
          </AnimatePresence>
        </PageContainer>
      </div>
      <EarnDetailsModal
        show={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        vaultOption={vaultOption}
      />
      <ActionModal
        vault={{
          vaultOption: vaultOption,
          vaultVersion: vaultVersion,
        }}
        variant={"desktop"}
        show={showDepositModal}
        actionType={ACTIONS.deposit}
        withdrawOption={"standard"}
        onClose={() => setShowDepositModal(false)}
      />
      <ActionModal
        vault={{
          vaultOption: vaultOption,
          vaultVersion: vaultVersion,
        }}
        variant={"desktop"}
        show={showWithdrawModal}
        actionType={ACTIONS.withdraw}
        withdrawOption={"standard"}
        onClose={() => setShowWithdrawModal(false)}
      />
      <ActionModal
        vault={{
          vaultOption: vaultOption,
          vaultVersion: vaultVersion,
        }}
        variant={"desktop"}
        show={showCompleteModal}
        actionType={ACTIONS.withdraw}
        withdrawOption={"complete"}
        onClose={() => setShowCompleteModal(false)}
      />
    </>
  );
};

export default EarnPage;
