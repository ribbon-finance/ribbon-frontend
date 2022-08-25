
import { useEffect, useMemo, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { useWeb3Wallet } from "shared/lib/hooks/useWeb3Wallet";
import styled, { css, keyframes } from "styled-components";
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
import { VaultList, VaultOptions } from "shared/lib/constants/constants";
import { Subtitle } from "shared/lib/designSystem";
import useVaultOption from "../../hooks/useVaultOption";
import { getVaultColor } from "shared/lib/utils/vault";
import { getAssetLogo, getChainByVaultOption } from "shared/lib/utils/asset";
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

import { useAirtable } from "shared/lib/hooks/useAirtable";
import ActionModal from "../../components/Vault/VaultActionsForm/EarnModal/ActionModal";
import { usePendingTransactions } from "shared/lib/hooks/pendingTransactionsContext";
import useEarnStrategyTime from "../../hooks/useEarnStrategyTime";
import useLoadingText from "shared/lib/hooks/useLoadingText";
import { ACTIONS } from "../../components/Vault/VaultActionsForm/EarnModal/types";
import {
  fadeIn,
  fadeOut,
  rotateClockwise,
  rotateAnticlockwise,
} from "shared/lib/designSystem/keyframes";

const { formatUnits } = ethers.utils;


const PendingDepositsContainer = styled.div`
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
  background: rgba(62, 115, 196, 0.08);
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
  opacity: 0;
  animation: ${fadeIn} 1s ease-in-out forwards;
  animation-delay: ${({ delay }) => `${delay || 0}s`};
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

const ProductAssetLogoContainer = styled.div<{ delay?: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  width: 48px;
  background-color: ${colors.background.one};
  border-radius: 50%;
  position: relative;
  opacity: 0;
  animation: ${fadeIn} 1s ease-in-out forwards;
  animation-delay: ${({ delay }) => `${delay || 0}s`};
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

const StyledEarnInnerRing = styled(EarnInnerRing)`
  animation: ${rotateClockwise} 60s linear infinite;
  @media (max-width: 700px) {
    display: none;
  }
`;

const StyledEarnMiddleRing = styled(EarnMiddleRing)`
  animation: ${rotateAnticlockwise} 60s linear infinite;
  @media (max-width: 700px) {
    height: 500px;
  }
`;

const StyledEarnOuterRing = styled(EarnOuterRing)`
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
  opacity: 0;
  animation: ${fadeIn} 1s ease-in-out forwards;
  animation-delay: ${({ delay }) => `${delay || 0}s`};
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
  opacity: 0;
  animation: ${fadeIn} 1s ease-in-out forwards;
  animation-delay: ${({ delay }) => `${delay || 0}s`};
`;

const HeroSubtitle = styled(Subtitle)<{ delay?: number }>`
  opacity: 0;
  animation: ${fadeIn} 1s ease-in-out forwards;
  animation-delay: ${({ delay }) => `${delay || 0}s`};
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
  opacity: 0.8;
  &:hover {
    opacity: 1;
  }
  gap: 8px;
  line-height: 20px;
  font-size: 12px;
  z-index: 1;
`;

const ButtonContainer = styled.div<{ delay?: number }>`
  z-index: 1;
  width: 240px;
  opacity: 0;
  animation: ${fadeIn} 1s ease-in-out forwards;
  animation-delay: ${({ delay }) => `${delay || 0}s`};
>>>>>>> master
`;
const StyledActionButton = styled(ActionButton)`
  font-size: 14px;
  z-index: 1;
  letter-spacing: 1px;
`;
const EarnPage = () => {
  const { vaultOption, vaultVersion } = useVaultOption();
  const { active, account, chainId } = useWeb3Wallet();
  const loadingText = useLoadingText();
  const { maxYield } = useAirtable();
  const { strategyStartTime } = useEarnStrategyTime();

  useRedirectOnWrongChain(vaultOption, chainId);
  usePullUp();

  const [showVault] = useGlobalState("showEarnVault");
  const [, setShowConnectModal] = useConnectWalletModal();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const { pendingTransactions } = usePendingTransactions();
  const [isDepositSuccess, setDepositSuccess] = useState<boolean>();

  useEffect(() => {
    if (
      pendingTransactions.some((transaction) => {
        return (
          transaction.status === "success" &&
          transaction.type === "deposit" &&
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
    data: { asset, decimals, totalBalance: v2Deposits, cap: v2VaultLimit },
    loading,
  } = useV2VaultData(vaultOption || VaultList[0]);

  const { vaultAccounts } = useVaultAccounts(vaultVersion);
  const vaultAccount = vaultAccounts[vaultOption || VaultList[0]];
  const Logo = getAssetLogo(asset);

  const isLoading = status === "loading" || loading;
  useRedirectOnSwitchChain(getChainByVaultOption(vaultOption as VaultOptions));

  let logo = <Logo height="100%" />;

  const color = useMemo(() => {
    if (vaultOption) {
      return getVaultColor(vaultOption);
    }
    return undefined;
  }, [vaultOption]);

  const [investedInStrategy] = useMemo(() => {
    if (!vaultAccount) {
      return [BigNumber.from(0.0)];
    }
    return [vaultAccount.totalBalance];
  }, [vaultAccount]);

  const isVaultMaxCapacity = useMemo(() => {
    if (isLoading || vaultOption !== "rEARN") {
      return undefined;
    }
    return isPracticallyZero(v2VaultLimit.sub(v2Deposits), 6);
  }, [isLoading, v2Deposits, v2VaultLimit, vaultOption]);

  const [totalDepositStr, depositLimitStr] = useMemo(() => {
    return [
      parseFloat(
        formatSignificantDecimals(formatUnits(v2Deposits, decimals), 2)
      ),
      parseFloat(
        formatSignificantDecimals(formatUnits(v2VaultLimit, decimals))
      ),
    ];
  }, [decimals, v2Deposits, v2VaultLimit]);

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
        formatUnits(
          vaultAccount.totalBalance.sub(vaultAccount.totalDeposits),
          decimals
        )
      ) /
        parseFloat(formatUnits(vaultAccount.totalDeposits, decimals))) *
      100;

    const roiColor = roiTemp >= 0 ? colors.green : colors.red;
    return [
      (parseFloat(
        formatUnits(
          vaultAccount.totalBalance.sub(vaultAccount.totalDeposits),
          decimals
        )
      ) /
        parseFloat(formatUnits(vaultAccount.totalDeposits, decimals))) *
        100,
      roiColor,
    ];
  }, [vaultAccount, decimals]);

  // WIP
  // const [investedInStrategy] = useMemo(() => {
  //   let totalBalance = BigNumber.from(0);
  //   let totalPendingDeposit = BigNumber.from(0);
  //   for (const earnVault of EarnVaultList) {
  //     const vaultAccount = vaultAccounts[earnVault];
  //     console.log(vaultAccount);
  //     if (!vaultAccount) {
  //     } else {
  //       totalBalance = totalBalance.add(vaultAccount.totalBalance);
  //       totalPendingDeposit = totalPendingDeposit.add(
  //         vaultAccounts[earnVault]!.totalPendingDeposit
  //       );
  //     }
  //   }

  //   return [totalBalance.sub(totalPendingDeposit)];
  // }, [vaultAccounts]);

  // const [roi, yieldColor] = useMemo(() => {
  //   let totalBalance = BigNumber.from(0);
  //   let totalDeposits = BigNumber.from(0);
  //   if (isPracticallyZero(totalDeposits, decimals)) {
  //     return [0, colors.green];
  //   }
  //   for (const earnVault of EarnVaultList) {
  //     const vaultAccount = vaultAccounts[earnVault];
  //     if (!vaultAccount) {
  //     } else {
  //       totalBalance = totalBalance.add(vaultAccount.totalBalance);
  //       totalDeposits = totalDeposits.add(
  //         vaultAccounts[earnVault]!.totalDeposits
  //       );
  //     }
  //   }

  //   const roiTemp =
  //     (parseFloat(formatUnits(totalBalance.sub(totalDeposits), decimals)) /
  //       parseFloat(formatUnits(totalDeposits, decimals))) *
  //     100;

  //   const roiColor = roiTemp >= 0 ? colors.green : colors.red;
  //   return [
  //     (parseFloat(formatUnits(totalBalance.sub(totalDeposits), decimals)) /
  //       parseFloat(formatUnits(totalDeposits, decimals))) *
  //       100,
  //     roiColor,
  //   ];
  // }, [vaultAccounts, decimals]);

  const pageOffset = useMemo(() => {
    return (
      (componentRefs.header?.offsetHeight || 0) +
      (componentRefs.footer?.offsetHeight || 0)
    );
  }, [componentRefs.header?.offsetHeight, componentRefs.footer?.offsetHeight]);

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
          <StyledEarnOuterRing type={"blue"} />
        </FadeDiv>
        <FadeDiv delaySeconds={0.3} show={isDepositSuccess}>
          <StyledEarnOuterRing type={"green"} />
        </FadeDiv>
        <FadeDiv delaySeconds={0.2} show={!isDepositSuccess}>
          <StyledEarnMiddleRing type={"blue"} />
        </FadeDiv>
        <FadeDiv delaySeconds={0.2} show={isDepositSuccess}>
          <StyledEarnMiddleRing type={"green"} />
        </FadeDiv>
        <FadeDiv delaySeconds={0.1} show={!isDepositSuccess}>
          <StyledEarnInnerRing type={"blue"} />
        </FadeDiv>
        <FadeDiv delaySeconds={0.1} show={isDepositSuccess}>
          <StyledEarnInnerRing type={"green"} />
        </FadeDiv>
      </CirclesContainer>
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
                {hasPendingDeposits ? (
                  <PendingDepositsContainer>
                    <ProductAssetLogoContainer color={color} delay={0.1}>
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
                  <ProductAssetLogoContainer color={color} delay={0.2}>
                    {logo}
                  </ProductAssetLogoContainer>
                )}
                <BalanceTitle className={`mt-1 py-3`} delay={0.2}>
                  Your Balance
                </BalanceTitle>
                <HeroText delay={0.3}>
                  {isLoading || !account
                    ? "---"
                    : "$" +
                      formatBigNumber(
                        BigNumber.from(investedInStrategy),
                        decimals,
                        2
                      )}
                </HeroText>
                <HeroSubtitle color={yieldColor} delay={0.4}>
                  +{isLoading || roi === 0 ? "0.00" : roi.toFixed(4)}%
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
                      >
                        Deposit
                      </StyledActionButton>
                      {hasLockedBalanceInAsset && (
                        <StyledActionButton
                          className={`py-3 mb-1 w-100`}
                          color={"white"}
                          onClick={() => {
                            setShowWithdrawModal(true);
                          }}
                        >
                          Initiate Withdraw
                        </StyledActionButton>
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
                    " USDC / " +
                    formatAmount(depositLimitStr) +
                    " USDC"
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
              <EarnStrategyExplainer maxYield={maxYield} />
            </motion.div>
          )}
        </AnimatePresence>
      </PageContainer>
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
        onClose={() => setShowWithdrawModal(false)}
      />
    </>
  );
};

export default EarnPage;
