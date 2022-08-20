import { useMemo, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { useWeb3Wallet } from "shared/lib/hooks/useWeb3Wallet";
import styled, { keyframes } from "styled-components";
import { Redirect } from "react-router-dom";
import { Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import { AnimatePresence, motion } from "framer-motion";
import { useV2VaultData, useVaultData } from "shared/lib/hooks/web3DataContext";
import { formatBigNumber, isPracticallyZero } from "shared/lib/utils/math";
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
import moment from "moment";

const { formatUnits } = ethers.utils;

const rotateClockwise = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const rotateAnticlockwise = keyframes`
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
`;

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

const FadeInDiv = styled.div<{ delaySeconds?: number }>`
  position: absolute;
  opacity: 0;
  animation: ${fadeIn} 4s ease-in-out forwards;
  animation-delay: ${(delaySeconds) => `${delaySeconds || 0}s`};
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

const BalanceTitle = styled.div`
  font-size: 14px;
  font-family: VCR;
  text-transform: uppercase;
  text-align: center;
  letter-spacing: 1px;
  color: ${colors.primaryText}7A;
`;

const VaultContainer = styled.div<{ offset: number }>`
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: auto;
  overflow: hidden;
  height: calc(100vh - ${({ offset }) => offset}px);
`;

const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-width: 240px;
`;

const HeroText = styled(Title)`
  font-size: 56px;
  line-height: 64px;
  margin-bottom: 16px;
`;

const ViewDetailsButton = styled.div`
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

const ButtonContainer = styled.div`
  z-index: 1;
  width: 240px;
`;
const StyledActionButton = styled(ActionButton)`
  font-size: 14px;
  z-index: 1;
  letter-spacing: 1px;
`;
const EarnPage = () => {
  const { vaultOption, vaultVersion } = useVaultOption();
  const { active, account, chainId } = useWeb3Wallet();

  const { expectedYield } = useAirtable();

  useRedirectOnWrongChain(vaultOption, chainId);
  usePullUp();

  const [showVault] = useGlobalState("showEarnVault");
  const [, setShowConnectModal] = useConnectWalletModal();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const { pendingTransactions } = usePendingTransactions();

  const isDepositSuccess = useMemo(() => {
    return pendingTransactions.some((transaction) => {
      return (
        transaction.status === "success" &&
        transaction.type === "deposit" &&
        transaction.vault === vaultOption
      );
    });
  }, [pendingTransactions, vaultOption]);
  const [componentRefs] = useGlobalState("componentRefs");
  const { status } = useVaultData(vaultOption || VaultList[0]);
  const {
    data: { asset, decimals },
    loading,
  } = useV2VaultData(vaultOption || VaultList[0]);
  const { vaultAccounts } = useVaultAccounts(vaultVersion);
  const vaultAccount = vaultAccounts[vaultOption || VaultList[0]];
  const Logo = getAssetLogo(asset);

  const isLoading = status === "loading" || loading;
  useRedirectOnSwitchChain(getChainByVaultOption(vaultOption as VaultOptions));

  let logo = <Logo height="100%" />;

  const toDepositTime = useMemo(() => {
    let firstOpenLoanTime = moment.utc("2022-09-02").set("hour", 17);

    let toDepositTime;

    while (!toDepositTime) {
      let toDepositTimeTemp = moment.duration(
        firstOpenLoanTime.diff(moment()),
        "milliseconds"
      );
      if (toDepositTimeTemp.asMilliseconds() <= 0) {
        firstOpenLoanTime.add(28, "days");
      } else {
        toDepositTime = toDepositTimeTemp;
      }
    }

    return `${toDepositTime.days()}D ${toDepositTime.hours()}H ${toDepositTime.minutes()}M`;
  }, []);

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

  const hasPendingDeposits = useMemo(() => {
    if (!vaultAccount) {
      return false;
    }
    return !isPracticallyZero(vaultAccount.totalPendingDeposit, decimals);
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
        <FadeInDiv delaySeconds={0.45}>
          <StyledEarnOuterRing deposited={isDepositSuccess} />
        </FadeInDiv>
        <FadeInDiv delaySeconds={0.3}>
          <StyledEarnMiddleRing deposited={isDepositSuccess} />
        </FadeInDiv>
        <FadeInDiv delaySeconds={0.15}>
          <StyledEarnInnerRing deposited={isDepositSuccess} />
        </FadeInDiv>
      </CirclesContainer>
      <VaultContainer offset={pageOffset}>
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
              <MainContainer>
                {hasPendingDeposits ? (
                  <PendingDepositsContainer>
                    <ProductAssetLogoContainer color={"blue"}>
                      {logo}
                    </ProductAssetLogoContainer>
                    <TextContainer>
                      <p>
                        Your deposit will deployed in the vault in{" "}
                        <span style={{ color: "white" }}>{toDepositTime}</span>
                      </p>
                    </TextContainer>
                  </PendingDepositsContainer>
                ) : (
                  <ProductAssetLogoContainer color={"blue"}>
                    {logo}
                  </ProductAssetLogoContainer>
                )}
                <BalanceTitle className={`mt-1 py-3`}>
                  Your Balance
                </BalanceTitle>
                <HeroText>
                  {isLoading
                    ? "---"
                    : vaultAccount
                    ? parseFloat(
                        formatBigNumber(investedInStrategy, decimals)
                      ).toFixed(2)
                    : "0.00"}
                </HeroText>
                <Subtitle color={yieldColor}>+{roi.toFixed(2)}%</Subtitle>
                <ViewDetailsButton
                  role="button"
                  onClick={() => {
                    setShowDetailsModal(true);
                  }}
                >
                  View Details
                </ViewDetailsButton>
                <ButtonContainer>
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
                      {/* <StyledActionButton
                        disabled={true}
                        className={`py-3 mb-1 w-100`}
                        color={"white"}
                      >
                        Initiate Withdraw
                      </StyledActionButton> */}
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
              </MainContainer>
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
              <EarnStrategyExplainer expectedYield={expectedYield} />
            </motion.div>
          )}
        </AnimatePresence>
      </VaultContainer>
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
        onClose={() => setShowDepositModal(false)}
      />
    </>
  );
};

export default EarnPage;
