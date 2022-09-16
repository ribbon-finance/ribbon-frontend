import { BigNumber } from "ethers";
import colors from "shared/lib/designSystem/colors";
import { fadeIn } from "shared/lib/designSystem/keyframes";
import useWeb3Wallet from "shared/lib/hooks/useWeb3Wallet";
import styled, { css } from "styled-components";
import { Title, Subtitle, Button } from "../../designSystem";
import { getAssetLogo } from "../../utils/asset";
import { formatBigNumber } from "../../utils/math";

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

const HeroSubtitle = styled(Subtitle)<{ delay?: number }>`
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
  const isLoading = false;
  const { account } = useWeb3Wallet();

  const Logo = getAssetLogo("USDC");

  return (
    <BalanceWrapper>
      <VaultContainer>
        <ProductAssetLogoContainer color={"white"} delay={0.1}>
          <Logo height="100%" />
        </ProductAssetLogoContainer>
        <BalanceTitle delay={0.2}>Your Balance</BalanceTitle>
        <HeroText delay={0.3}>
          {isLoading || !account
            ? "---"
            : "$" + formatBigNumber(BigNumber.from(0), 0, 2)}
        </HeroText>
        <HeroSubtitle color={"white"} delay={0.4}>
          +{isLoading ? "0.00" : "0.00"}%
        </HeroSubtitle>
        <ClaimTextContainer delay={0.5}>
          <ClaimLabel>RBN Rewards Earned:</ClaimLabel>
          <ClaimValue>10,000.87</ClaimValue>
        </ClaimTextContainer>
        <ClaimButton delay={0.6}>Claim RBN</ClaimButton>
      </VaultContainer>
    </BalanceWrapper>
  );
};
