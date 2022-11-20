import { useContext, useState } from "react";
import styled from "styled-components";
import colors from "shared/lib/designSystem/colors";
import { SecondaryText, Title } from "shared/lib/designSystem";
import { Button, PrimaryText } from "../../designSystem";
import { ReferralContext } from "../../hooks/referralContext";
import { ReactComponent as TwitterLogo } from "landing/src/img/Footer/twitter.svg";
import { ReferralFooter } from "./ReferralFooter";
import useWeb3Wallet from "shared/lib/hooks/useWeb3Wallet";

const TextContent = styled.div`
  color: ${colors.primaryText}A3;
  padding: 24px 16px;
  overflow: hidden;
  font-size: 16px;
`;

const StyledTitle = styled(Title)<{ color?: string; value?: string }>`
  color: ${(props) =>
    props.value === "0" || props.value === "---"
      ? colors.quaternaryText
      : props.color};
  text-align: right;
`;

const StyledSecondaryText = styled(SecondaryText)<{ color?: string }>`
  color: ${(props) => props.color};
  font-size: 14px;
  font-weight: 500;
`;

const ReferralPageContent = styled.div`
  padding: 24px 16px;
`;

const RbnButtonWrapper = styled.div`
  display: inline-block;
  width: 100%;
  padding-left: 16px;
  padding-right: 16px;
  > * {
    width: 100%;
  }
`;

const CopyToClipboardButton = styled(Button)`
  background: ${colors.buttons.secondaryBackground};
  color: ${colors.buttons.secondaryText};
  width: 78.75%;
  border: none;
  border-radius: 0;
  padding: 20px;
  margin-top: 16px;
  font-size: 14px;
`;

const TwitterButton = styled(Button)`
  background: #1da1f229;
  color: ${colors.buttons.secondaryText};
  width: 20.75%;
  border: none;
  border-radius: 0;
  padding: 18px 20px 19px 20px;
  margin-top: 16px;
  margin-left: 0.5%;
  img {
    color: red;
    fill: red;
    stroke: red;
  }
`;

const LinkBoxContainer = styled.div`
  display: flex;
  background: #ffffff0a;
  border-radius: 4px;
  width: auto;
  text-align: center;
  margin-left: 16px;
  margin-right: 16px;
`;

const LinkBox = styled.div`
  padding: 24px 0px 24px 8px;
  color: ${colors.primaryText};
  .baseLink {
    color: #ffffff52;
  }
  .code {
    color: #ffffff;
  }
`;

const CodeText = styled(PrimaryText)`
  font-size: 14px;
`;

const LearnMoreContainer = styled.div`
  display: flex;
  width: 100%;
  text-align: center;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
`;

const StyledTwitterLogo = styled(TwitterLogo)`
  & path {
    fill: #1da1f2;
  }
`;

export const ReferralPage = () => {
  const [buttonDisplayText, setButtonDisplayText] =
    useState("Copy Referral Link");
  const { referralLoading, referralAccountSummary, referralCode } =
    useContext(ReferralContext);
  const { account } = useWeb3Wallet();
  const baseLink = "https://lend.ribbon.finance/app?code=";
  const twitterText = `Lend USDC on Ribbon Lend using my referral link and earn a 0.25%25 payback in $RBN rewards! ${baseLink}${referralCode} 🎀`;
  // We use "0.25%25" as hacky way to display percentage after URL encoding
  const handleCopyToClipboardOnClick = () => {
    setButtonDisplayText("Link Copied");
    navigator.clipboard.writeText(`${baseLink}${referralCode}`);
  };
  const handleTwitterOnClick = () => {
    window.open(`https://twitter.com/intent/tweet?text=${twitterText}`);
  };

  const getReferralCodeUsed = () => {
    if (referralLoading) {
      return "---";
    } else if (account && localStorage.getItem(account)) {
      return localStorage.getItem(account)!;
    } else {
      return referralAccountSummary["referralCodeUsed"];
    }
  };

  return (
    <>
      <TextContent>
        Refer a new lender and you both receive a 0.25% payback on the new
        deposit in RBN
      </TextContent>
      <LinkBoxContainer>
        <LinkBox>
          <>
            <CodeText className="baseLink">{baseLink}</CodeText>
            <CodeText className="code">{referralCode}</CodeText>
          </>
        </LinkBox>
      </LinkBoxContainer>
      <RbnButtonWrapper>
        <CopyToClipboardButton onClick={handleCopyToClipboardOnClick}>
          {buttonDisplayText}
        </CopyToClipboardButton>
        <TwitterButton onClick={handleTwitterOnClick}>
          <StyledTwitterLogo />
        </TwitterButton>
      </RbnButtonWrapper>
      <ReferralPageContent>
        <div className="d-flex w-100 flex-row align-items-center justify-content-between">
          <StyledSecondaryText color={colors.tertiaryText}>
            RBN Referral Rewards
          </StyledSecondaryText>
          <StyledTitle
            value={
              referralLoading
                ? "---"
                : referralAccountSummary["totalReferralRewards"].toString()
            }
          >
            {referralLoading
              ? "---"
              : referralAccountSummary["totalReferralRewards"]}
          </StyledTitle>
        </div>
        <div className="d-flex w-100 flex-row align-items-center justify-content-between mt-4">
          <StyledSecondaryText color={colors.tertiaryText}>
            Users Referred
          </StyledSecondaryText>
          <StyledTitle
            value={
              referralLoading
                ? "---"
                : referralAccountSummary["userReferred"].toString()
            }
          >
            {referralLoading ? "---" : referralAccountSummary["userReferred"]}
          </StyledTitle>
        </div>
        <div className="d-flex w-100 flex-row align-items-center justify-content-between mt-4">
          <StyledSecondaryText color={colors.tertiaryText}>
            Referral Code Used
          </StyledSecondaryText>
          <StyledTitle value={getReferralCodeUsed()}>
            {getReferralCodeUsed()}
          </StyledTitle>
        </div>
      </ReferralPageContent>
      <LearnMoreContainer>
        <ReferralFooter></ReferralFooter>
      </LearnMoreContainer>
    </>
  );
};
