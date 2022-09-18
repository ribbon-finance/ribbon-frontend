import colors from "shared/lib/designSystem/colors";
import { fadeIn } from "shared/lib/designSystem/keyframes";
import useWeb3Wallet from "../../hooks/useWeb3Wallet";
import styled, { css } from "styled-components";
import { Title, Subtitle, Button } from "../../designSystem";
import { useVaultAccountBalances } from "../../hooks/useVaultAccountBalances";
import { getAssetLogo } from "../../utils/asset";
import { formatBigNumber, isPracticallyZero } from "../../utils/math";
import { useMemo, useState } from "react";
import { useVaultTotalDeposits } from "../../hooks/useVaultTotalDeposits";
import { formatUnits } from "ethers/lib/utils";
import LendModal, { ModalContentEnum } from "../Common/LendModal";

const delayedFade = css<{ delay?: number }>`
  opacity: 0;
  animation: ${fadeIn} 1s ease-in-out forwards;
  animation-delay: ${({ delay }) => `${delay || 0}s`};
`;

const BalanceWrapper = styled.div`
  height: 100%;
  display: flex;
`;

const VaultContainer = styled.div`
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
  font-size: 14px;
  font-family: VCR;
  text-transform: uppercase;
  text-align: center;
  letter-spacing: 1px;
  color: ${colors.primaryText}7A;
  margin-top: 24px;
  ${delayedFade}
`;

const HeroText = styled(Title)<{ delay?: number }>`
  font-size: 56px;
  line-height: 64px;
  margin-bottom: 16px;
  ${delayedFade}
`;

const HeroSubtitle = styled(Subtitle)<{ delay?: number; color: string }>`
  color: ${(props) => props.color};
  ${delayedFade}
`;

const ClaimButton = styled(Button)<{ delay?: number }>`
  border-radius: 64px;
  background: white;
  color: ${colors.background.one};
  ${delayedFade}
`;

const ClaimTextContainer = styled.div<{ delay?: number }>`
  display: flex;
  margin-top: 64px;
  margin-bottom: 24px;
  ${delayedFade}
`;

const ClaimLabel = styled.span`
  color: ${colors.tertiaryText};
  margin-right: 8px;
`;

const ClaimValue = styled.span`
  color: white;
  font-family: VCR;
`;

export const Balance = () => {
  const { account } = useWeb3Wallet();
  const Logo = getAssetLogo("USDC");
  const { loading, accountBalances } = useVaultAccountBalances();
  const yourBalance = accountBalances.totalBalance;
  const rbnRewards = accountBalances.rbnEarned;
  const yourDeposits = useVaultTotalDeposits();
  const decimals = 6;
  const roi = useMemo(() => {
    if (
      isPracticallyZero(yourDeposits, decimals) ||
      isPracticallyZero(yourBalance, decimals)
    ) {
      return 0;
    }

    return (
      (parseFloat(formatUnits(yourBalance.sub(yourDeposits), decimals)) /
        parseFloat(formatUnits(yourDeposits, decimals))) *
      100
    );
  }, [yourDeposits, yourBalance]);
  const [triggerClaimModal, setClaimModal] = useState<boolean>(false);

  return (
    <>
      <LendModal
        show={Boolean(triggerClaimModal)}
        onHide={() => setClaimModal(false)}
        content={ModalContentEnum.CLAIMRBN}
      />
      <BalanceWrapper>
        <VaultContainer>
          <ProductAssetLogoContainer color={"white"} delay={0.1}>
            <Logo height="100%" />
          </ProductAssetLogoContainer>
          <BalanceTitle delay={0.2}>Your Balance</BalanceTitle>
          <HeroText delay={0.3}>
            {loading || !account
              ? "---"
              : "$" + formatBigNumber(yourBalance, decimals, 2)}
          </HeroText>
          <HeroSubtitle
            color={roi === 0 ? "white" : roi > 0 ? colors.green : colors.red}
            delay={0.4}
          >
            +{loading ? "0.00" : roi.toFixed(2)}%
          </HeroSubtitle>
          <ClaimTextContainer delay={0.5}>
            <ClaimLabel>RBN Rewards Earned:</ClaimLabel>
            <ClaimValue>
              {" "}
              {loading || !account ? "---" : formatBigNumber(rbnRewards, 18, 2)}
            </ClaimValue>
          </ClaimTextContainer>
          <ClaimButton onClick={() => setClaimModal(true)} delay={0.6}>
            Claim RBN
          </ClaimButton>
        </VaultContainer>
      </BalanceWrapper>
    </>
  );
};
