import { useCallback, useEffect, useMemo, useState } from "react";
import { CloseIcon } from "shared/lib/assets/icons/icons";
import { Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import styled, { keyframes } from "styled-components";
import ExternalLinkIcon from "../Common/ExternalLinkIcon";
import { Button, PrimaryText, SecondaryText } from "../../designSystem";
import { usePoolAccountBalances } from "../../hooks/usePoolAccountBalances";
import { formatBigNumber } from "../../utils/math";
import TransactionStep from "./TransactionStep";
import usePoolFactoryContract from "../../hooks/usePoolFactoryContract";
import { PoolFactory } from "../../codegen";
import { usePendingTransactions } from "../../hooks/pendingTransactionsContext";
import { getAssetColor, getAssetDecimals } from "../../utils/asset";
import { PoolAddressMap, PoolList } from "../../constants/constants";
import Logo from "shared/lib/assets/icons/logo";
import useWeb3Wallet from "../../hooks/useWeb3Wallet";

const borderStyle = `1px solid ${colors.primaryText}1F`;

const ProductAssetLogoContainer = styled.div<{ size: number; delay?: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  border-radius: 50%;
  position: relative;
`;

const AssetContainer = styled.div<{ size: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${(props) => props.size}px;
  width: 100%;
  background: linear-gradient(
    102.28deg,
    rgba(252, 10, 84, 0.04) 0%,
    rgba(252, 10, 84, 0) 100%
  );
  border-bottom: 1px solid ${colors.primaryText}1F;
`;

const StyledTitle = styled(Title)<{ color?: string; position?: string }>`
  color: ${(props) => props.color};
  text-align: right;
`;

const StyledSecondaryText = styled(SecondaryText)<{ color?: string }>`
  color: ${(props) => props.color};
  font-size: 14px;
  font-weight: 500;
`;

const ClaimTextContent = styled.div`
  padding: 24px 16px;
`;

const RbnButtonWrapper = styled.div`
  display: block;
  width: 100%;
  padding-left: 16px;
  padding-right: 16px;
  > * {
    width: 100%;
  }
`;

const ClaimRbnButton = styled(Button)`
  background: #fc0a541f;
  color: #fc0a54;
  border: none;
  border-radius: 0;
  padding: 20px;
`;

const LearnMoreContainer = styled.div`
  display: flex;
  width: 100%;
  text-align: center;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
`;

const Footer = styled.div`
  display: flex;
  margin-top: 20px;
  font-size: 14px;

  color: ${colors.primaryText};

  svg {
    transition: all 0.2s ease-in-out;
  }

  > a {
    color: ${colors.primaryText};
    text-decoration: underline;
    &:hover {
      svg {
        transform: translate(2px, -2px);
      }
    }
  }
`;

const BottomTextContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 64px;
`;

const BottomText = styled(PrimaryText)`
  color: rgba(255, 255, 255, 0.8);
`;

const livelyAnimation = (position: "top" | "bottom") => keyframes`
  0% {
    background-position-x: ${position === "top" ? 0 : 100}%;
  }

  50% {
    background-position-x: ${position === "top" ? 100 : 0}%; 
  }

  100% {
    background-position-x: ${position === "top" ? 0 : 100}%;
  }
`;

const FrameBar = styled.div<{
  color: string;
  position: "top" | "bottom";
  height: number;
}>`
  width: 100%;
  height: ${(props) => props.height}px;
  background: ${(props) => `linear-gradient(
    270deg,
    ${props.color}00 5%,
    ${props.color} 50%,
    ${props.color}00 95%
  )`};
  background-size: 200%;
  animation: 10s ${(props) => livelyAnimation(props.position)} linear infinite;

  &:before {
    content: "";
    z-index: -1;
    position: absolute;
    ${(props) => props.position}: 0;
    right: 0;
    left: 0;
    background: inherit;
    filter: blur(${(props) => props.height * 4}px);
    opacity: 1;
    transition: opacity 0.3s;
    height: ${(props) => props.height * 2}px;
  }
`;

const StyledExternalLinkIcon = styled(ExternalLinkIcon)`
  margin-left: 4px;
`;

const Header = styled.div`
  padding-left: 24px;
  border-bottom: ${borderStyle};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  width: 80px;
  height: 80px;
  border-left: ${borderStyle};
`;

export enum ClaimRbnPageEnum {
  CLAIM_RBN = "CLAIM RBN",
  TRANSACTION_STEP = "CLAIMING RBN",
  SUCCESS_STEP = "RBN CLAIMED",
}

interface ClaimRbnPageProps {
  onHide: () => void;
}

export const ClaimRbnPage: React.FC<ClaimRbnPageProps> = ({ onHide }) => {
  const { pendingTransactions, addPendingTransaction } =
    usePendingTransactions();

  const [txhash, setTxhash] = useState("");
  const { account } = useWeb3Wallet();
  const { loading, accountBalances } = usePoolAccountBalances();
  const claimableRbn = accountBalances.rbnClaimable;
  const claimedRbn = accountBalances.rbnClaimed;
  const poolFactory = usePoolFactoryContract();
  const rbnDecimals = getAssetDecimals("RBN");
  const [rbnClaimStep, setRbnClaimStep] = useState<ClaimRbnPageEnum>(
    ClaimRbnPageEnum.CLAIM_RBN
  );

  const cleanupEffects = useCallback(() => {
    setRbnClaimStep(ClaimRbnPageEnum.CLAIM_RBN);
    onHide();
  }, [onHide, setRbnClaimStep]);

  useEffect(() => {
    // we check that the txhash and check if it had succeed
    // so we can move to successmodal
    if (rbnClaimStep === ClaimRbnPageEnum.TRANSACTION_STEP && txhash !== "") {
      const pendingTx = pendingTransactions.find((tx) => tx.txhash === txhash);

      if (pendingTx && pendingTx.status) {
        setTimeout(() => {
          setTxhash("");
          setRbnClaimStep(ClaimRbnPageEnum.SUCCESS_STEP);
        }, 300);
      }
    }
  }, [pendingTransactions, txhash, setRbnClaimStep, rbnClaimStep]);

  const handleClickClaimButton = useCallback(async () => {
    const pool = poolFactory as PoolFactory;
    if (pool !== null) {
      setRbnClaimStep(ClaimRbnPageEnum.TRANSACTION_STEP);
      let addresses: string[] = [];
      PoolList.forEach((pool) => {
        addresses.push(PoolAddressMap[pool].lend);
      });
      try {
        let res: any;
        res = await pool.withdrawReward(addresses);

        const withdrawAmount = formatBigNumber(claimableRbn, 18);
        addPendingTransaction({
          txhash: res.hash,
          type: "claim",
          amount: withdrawAmount,
        });

        setTxhash(res.hash);
      } catch (e) {
        cleanupEffects();
        console.error(e);
      }
    }
  }, [
    addPendingTransaction,
    claimableRbn,
    cleanupEffects,
    poolFactory,
    setRbnClaimStep,
  ]);

  const claimHeader = useMemo(() => {
    return (
      <Header>
        <Title>{rbnClaimStep}</Title>
        <CloseButton onClick={onHide}>
          <CloseIcon />
        </CloseButton>
      </Header>
    );
  }, [onHide, rbnClaimStep]);

  const claimContent = useMemo(() => {
    if (rbnClaimStep === ClaimRbnPageEnum.CLAIM_RBN) {
      return (
        <>
          <AssetContainer size={160}>
            <ProductAssetLogoContainer size={80}>
              <Logo width={80} height={80} />
            </ProductAssetLogoContainer>
          </AssetContainer>
          <ClaimTextContent>
            <div className="d-flex w-100 flex-row align-items-center justify-content-between">
              <StyledSecondaryText color={colors.tertiaryText}>
                Unclaimed RBN
              </StyledSecondaryText>
              <StyledTitle>
                {loading || !account
                  ? "---"
                  : formatBigNumber(claimableRbn, rbnDecimals, 2)}
              </StyledTitle>
            </div>
            <div className="d-flex w-100 flex-row align-items-center justify-content-between mt-4">
              <StyledSecondaryText color={colors.tertiaryText}>
                Claimed RBN
              </StyledSecondaryText>
              <StyledTitle>
                {loading || !account
                  ? "---"
                  : formatBigNumber(claimedRbn, rbnDecimals, 2)}
              </StyledTitle>
            </div>
          </ClaimTextContent>
          <RbnButtonWrapper>
            <ClaimRbnButton onClick={() => handleClickClaimButton()}>
              Claim RBN
            </ClaimRbnButton>
            <LearnMoreContainer>
              <Footer>
                <a
                  href="https://ribbonfinance.medium.com/decentralizing-ribbon-governance-395950da7a6"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Learn more about RBN
                  <StyledExternalLinkIcon />
                </a>
              </Footer>
            </LearnMoreContainer>
          </RbnButtonWrapper>
        </>
      );
    }
    if (rbnClaimStep === ClaimRbnPageEnum.TRANSACTION_STEP) {
      return (
        <>
          <TransactionStep txhash={txhash} color={getAssetColor("RBN")} />
        </>
      );
    }

    if (rbnClaimStep === ClaimRbnPageEnum.SUCCESS_STEP) {
      return (
        <>
          <FrameBar color={colors.asset.RBN} position="top" height={4} />
          <AssetContainer size={352}>
            <ProductAssetLogoContainer size={96}>
              <Logo width={96} height={96} />
            </ProductAssetLogoContainer>
          </AssetContainer>
          <FrameBar color={colors.asset.RBN} position="bottom" height={4} />
          <BottomTextContainer>
            <BottomText>Thank you for being part of the community</BottomText>
          </BottomTextContainer>
        </>
      );
    }

    return <></>;
  }, [
    account,
    claimableRbn,
    claimedRbn,
    handleClickClaimButton,
    loading,
    rbnClaimStep,
    rbnDecimals,
    txhash,
  ]);

  const claimPage = useMemo(() => {
    return (
      <div style={{ minHeight: 480 }}>
        {claimHeader}
        {claimContent}
      </div>
    );
  }, [claimHeader, claimContent]);

  return claimPage;
};
