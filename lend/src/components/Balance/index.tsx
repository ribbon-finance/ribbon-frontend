import colors from "shared/lib/designSystem/colors";
import useWeb3Wallet from "../../hooks/useWeb3Wallet";
import styled, { css } from "styled-components";
import { Title, Subtitle, Button } from "../../designSystem";
import { usePoolAccountBalances } from "../../hooks/usePoolAccountBalances";
import {
  getAssetColor,
  getAssetDecimals,
  getAssetLogo,
} from "../../utils/asset";
import { formatBigNumber, isPracticallyZero } from "../../utils/math";
import { useEffect, useMemo, useState } from "react";
import { usePoolTotalDeposits } from "../../hooks/usePoolTotalDeposits";
import { formatUnits } from "ethers/lib/utils";
import LendModal, { ModalContentEnum } from "../Common/LendModal";
import { delayedFade } from "../animations";
import { fadeIn } from "shared/lib/designSystem/keyframes";
import { PoolList } from "../../constants/constants";
import { usePoolsData } from "../../hooks/web3DataContext";
import { BigNumber } from "ethers";
import { usePoolsAPR } from "../../hooks/usePoolsAPR";
import currency from "currency.js";
import { BaseIndicator } from "shared/lib/designSystem";
const BalanceWrapper = styled.div`
  height: 100%;
  display: flex;
`;

const PoolContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-width: 240px;
  margin: auto;
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
  ${delayedFade}
`;

const BalanceTitle = styled.div<{ delay?: number }>`
  font-size: 12px;
  font-family: VCR;
  text-transform: uppercase;
  text-align: center;
  letter-spacing: 1.5px;
  color: ${colors.primaryText}7A;
  margin-top: 24px;
  ${delayedFade}
`;

const HeroText = styled(Title)<{ delay?: number }>`
  font-size: 56px;
  line-height: 64px;
  margin-top: 16px;
  margin-bottom: 16px;
  ${delayedFade}
`;

const HeroSubtitle = styled(Subtitle)<{ delay?: number; color: string }>`
  color: ${(props) => props.color};
  ${delayedFade}
`;

const ClaimButton = styled(Button)<{
  delay?: number;
  show: boolean;
  hidden: boolean;
}>`
  border-radius: 64px;
  font-size: 14px;
  background: ${colors.primaryText};
  color: ${colors.background.one};
  &:disabled {
    color: ${colors.tertiaryText};
    background: ${colors.background.one};
    border: 2px solid ${colors.tertiaryText};
    pointer-events: none;
  }
  &:hidden {
    display: none;
  }
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

const ConnectButton = styled(Button)<{
  delay?: number;
  show: boolean;
  hidden: boolean;
}>`
  border-radius: 64px;
  font-size: 14px;
  border-style: none;
  background: ${colors.buttons.secondaryBackground};
  color: ${colors.buttons.secondaryText};
  &:hidden {
    display: none;
  }
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

const ClaimTextContainer = styled.div<{ show: boolean; delay?: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 64px;
  margin-bottom: 24px;
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

const ClaimLabel = styled.span`
  font-size: 14px;
  color: ${colors.tertiaryText};
  margin-right: 8px;
`;

const ClaimValue = styled.span`
  color: ${colors.primaryText};
  font-family: VCR;
`;

export const Balance = () => {
  const { account } = useWeb3Wallet();
  const Logo = getAssetLogo("USDC");
  const { loading, accountBalances } = usePoolAccountBalances();

  const { loading: depositLoading, totalDeposits } = usePoolTotalDeposits();
  const { loading: poolDataLoading, data: poolDatas } = usePoolsData();
  const { aprs } = usePoolsAPR();
  const yourBalance = accountBalances.totalBalance;
  const rbnClaimableRewards = accountBalances.rbnClaimable;
  const rbnDecimals = getAssetDecimals("RBN");
  const decimals = getAssetDecimals("USDC");
  const [triggerWalletModal, setWalletModal] = useState<boolean>(false);
  const [triggerAnimation, setTriggerAnimation] = useState<boolean>(true);

  const [isManager, totalBorrowed, apr] = useMemo(() => {
    if (account && !poolDataLoading) {
      let managers: string[] = [];
      let totalBorrowed: BigNumber = BigNumber.from(0);
      let apr: number = 0;
      PoolList.forEach((pool) => {
        managers.push(poolDatas[pool].manager);
        if (poolDatas[pool].manager === account) {
          totalBorrowed = poolDatas[pool].borrows;
          apr = aprs[pool];
        }
      });
      return [managers.includes(account), totalBorrowed, apr];
    }
    return [false, BigNumber.from(0), 0];
  }, [account, aprs, poolDataLoading, poolDatas]);

  useEffect(() => {
    setTimeout(() => {
      setTriggerAnimation(false);
    }, 1600);
  }, []);

  const [profit, roi] = useMemo(() => {
    if (
      isPracticallyZero(totalDeposits, decimals) ||
      isPracticallyZero(yourBalance, decimals) ||
      !account ||
      loading ||
      depositLoading
    ) {
      return [0, 0];
    }

    return [
      parseFloat(formatUnits(yourBalance.sub(totalDeposits), decimals)),
      (parseFloat(formatUnits(yourBalance.sub(totalDeposits), decimals)) /
        parseFloat(formatUnits(totalDeposits, decimals))) *
        100,
    ];
  }, [totalDeposits, decimals, yourBalance, account, loading, depositLoading]);

  const roiColor = useMemo(() => {
    return roi === 0
      ? colors.primaryText
      : roi >= 0
      ? colors.green
      : colors.red;
  }, [roi]);

  const hasRbnReward = useMemo(() => {
    return !isPracticallyZero(
      rbnClaimableRewards,
      rbnDecimals,
      (1 / 10 ** 2).toFixed(2)
    );
  }, [rbnClaimableRewards, rbnDecimals]);

  const [triggerClaimModal, setClaimModal] = useState<boolean>(false);

  return (
    <>
      <LendModal
        show={triggerClaimModal}
        onHide={() => setClaimModal(false)}
        content={ModalContentEnum.CLAIMRBN}
      />
      <LendModal
        show={Boolean(triggerWalletModal)}
        onHide={() => setWalletModal(false)}
        content={ModalContentEnum.WALLET}
      />
      <BalanceWrapper>
        <PoolContainer>
          {!isManager ? (
            <>
              <ProductAssetLogoContainer delay={0.1}>
                <Logo height="100%" />
              </ProductAssetLogoContainer>
              <BalanceTitle delay={0.2}>Your Balance</BalanceTitle>
              <HeroText delay={0.3}>
                {loading || !account
                  ? "---"
                  : currency(formatUnits(yourBalance, decimals), {
                      symbol: "",
                    }).format()}
              </HeroText>
              <HeroSubtitle color={roiColor} delay={0.4}>
                {loading || !account
                  ? "---"
                  : `${roi > 0 ? "+" : ""}${currency(profit.toFixed(2), {
                      symbol: "",
                    }).format()} (${roi.toFixed(2)}%)`}
              </HeroSubtitle>
              <ClaimTextContainer show={triggerAnimation} delay={0.5}>
                {hasRbnReward && (
                  <BaseIndicator
                    size={8}
                    color={getAssetColor("RBN")}
                    blink={true}
                    className="mr-2"
                  />
                )}
                <ClaimLabel>Unclaimed RBN Rewards:</ClaimLabel>
                <ClaimValue>
                  {loading || !account
                    ? "---"
                    : currency(formatUnits(rbnClaimableRewards, rbnDecimals), {
                        symbol: "",
                      }).format()}
                </ClaimValue>
              </ClaimTextContainer>
              <ClaimButton
                disabled={!hasRbnReward}
                hidden={!account}
                onClick={() => setClaimModal(true)}
                show={triggerAnimation}
                delay={0.6}
              >
                Claim RBN
              </ClaimButton>
              <ConnectButton
                hidden={account !== undefined}
                delay={0.6}
                show={triggerAnimation}
                onClick={() => setWalletModal(true)}
              >
                Connect Wallet
              </ConnectButton>
            </>
          ) : (
            <>
              <BalanceTitle delay={0.1}>Total Borrowed</BalanceTitle>
              <HeroText delay={0.2}>
                {poolDataLoading
                  ? "---"
                  : "$" + formatBigNumber(totalBorrowed, decimals, 2)}
              </HeroText>
              <HeroSubtitle
                color={
                  apr === 0
                    ? colors.primaryText
                    : apr > 0
                    ? colors.green
                    : colors.red
                }
                delay={0.4}
              >
                {loading ? "0.00" : apr.toFixed(2)}% APR
              </HeroSubtitle>
            </>
          )}
        </PoolContainer>
      </BalanceWrapper>
    </>
  );
};
