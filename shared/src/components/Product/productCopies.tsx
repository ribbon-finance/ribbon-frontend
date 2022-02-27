import React from "react";
import styled from "styled-components";

import { VaultOptions } from "../../constants/constants";
import colors from "../../designSystem/colors";
import TooltipExplanation from "../Common/TooltipExplanation";

const HighlightedText = styled.span`
  color: ${colors.primaryText};
  cursor: help;

  poin &:hover {
    color: ${colors.primaryText}CC;
  }
`;

const Link = styled.a`
  color: ${colors.primaryText};
  text-decoration: underline;

  &:hover {
    color: ${colors.primaryText}CC;
  }
`;

interface ProductCopies {
  tags: string[];
  vaultRisk: React.ReactNode;
}

export const vaultAudit = (vaultOption: VaultOptions) => {
  if (vaultOption === "rSOL-THETA") {
    return (
      <>
        The Flex Vault smart contracts are pending audit and so should be
        considered as beta software. Users are advised to exercise caution and
        only risk funds they can afford to lose.{" "}
      </>
    );
  } else {
    return (
      <>
        The Theta Vault smart contracts have been{" "}
        <Link
          href="https://blog.openzeppelin.com/ribbon-finance-audit/"
          target="_blank"
          rel="noreferrer noopener"
        >
          audited by OpenZeppelin
        </Link>{" "}
        and{" "}
        <Link
          href="https://github.com/ribbon-finance/audit/blob/master/reports/RibbonThetaVault%20V2%20Smart%20Contract%20Review%20And%20Verification.pdf"
          target="_blank"
          rel="noreferrer noopener"
        >
          ChainSafe
        </Link>
        . Despite that, users are advised to exercise caution and only risk
        funds they can afford to lose.
      </>
    );
  }
};

export const productCopies: { [vault in VaultOptions]: ProductCopies } = {
  "rETH-THETA": {
    tags: ["COVERED CALL"],
    vaultRisk: (
      <>
        The primary risk for running this covered call strategy is that the
        vault may incur a weekly loss in the case where the call options sold by
        the vault expire{" "}
        <TooltipExplanation
          title="IN-THE-MONEY"
          explanation="An ETH call option is in-the-money (ITM) if the strike price is below the market price of ETH."
          learnMoreURL="https://www.investopedia.com/terms/i/inthemoney.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlightedText ref={ref} {...triggerHandler}>
              in-the-money
            </HighlightedText>
          )}
        />{" "}
        (meaning the price of ETH is above the strike price of the call options
        minted by the vault).
      </>
    ),
  },
  "rBTC-THETA": {
    tags: ["COVERED CALL"],
    vaultRisk: (
      <>
        The primary risk for running this covered call strategy is that the
        vault may incur a weekly loss in the case where the call options sold by
        the vault expire{" "}
        <TooltipExplanation
          title="IN-THE-MONEY"
          explanation="An WBTC call option is in-the-money (ITM) if the strike price is below the market price of WBTC."
          learnMoreURL="https://www.investopedia.com/terms/i/inthemoney.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlightedText ref={ref} {...triggerHandler}>
              in-the-money
            </HighlightedText>
          )}
        />{" "}
        (meaning the price of WBTC is above the strike price of the call options
        minted by the vault).
      </>
    ),
  },
  "rUSDC-ETH-P-THETA": {
    tags: ["PUT-SELLING"],
    vaultRisk: (
      <>
        The primary risk for running this put selling strategy is that the vault
        may incur a weekly loss in the case where the put options sold by the
        vault expire{" "}
        <TooltipExplanation
          title="IN-THE-MONEY"
          explanation="An ETH put option is in-the-money (ITM) if the strike price is above the market price of ETH."
          learnMoreURL="https://www.investopedia.com/terms/i/inthemoney.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlightedText ref={ref} {...triggerHandler}>
              in-the-money
            </HighlightedText>
          )}
        />{" "}
        (meaning the price of ETH is below the strike price of the put options
        minted by the vault). Such a situation is expected to happen less than
        5% of the time.
      </>
    ),
  },
  "ryvUSDC-ETH-P-THETA": {
    tags: ["PUT-SELLING"],
    vaultRisk: (
      <>
        The primary risk for running this put selling strategy is that the vault
        may incur a weekly loss in the case where the put options sold by the
        vault expire{" "}
        <TooltipExplanation
          title="IN-THE-MONEY"
          explanation="An ETH put option is in-the-money (ITM) if the strike price is above the market price of ETH."
          learnMoreURL="https://www.investopedia.com/terms/i/inthemoney.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlightedText ref={ref} {...triggerHandler}>
              in-the-money
            </HighlightedText>
          )}
        />{" "}
        (meaning the price of ETH is below the strike price of the put options
        minted by the vault). Such a situation is expected to happen less than
        5% of the time.
      </>
    ),
  },
  "rstETH-THETA": {
    tags: ["COVERED CALL"],
    vaultRisk: (
      <>
        The primary risk for running this covered call strategy is that the
        vault may incur a weekly loss in the case where the call options sold by
        the vault expire{" "}
        <TooltipExplanation
          title="IN-THE-MONEY"
          explanation="An ETH call option is in-the-money (ITM) if the strike price is below the market price of ETH."
          learnMoreURL="https://www.investopedia.com/terms/i/inthemoney.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlightedText ref={ref} {...triggerHandler}>
              in-the-money
            </HighlightedText>
          )}
        />{" "}
        (meaning the price of ETH is above the strike price of the call options
        minted by the vault).
      </>
    ),
  },
  "rAAVE-THETA": {
    tags: ["COVERED CALL"],
    vaultRisk: (
      <>
        The primary risk for running this covered call strategy is that the
        vault may incur a weekly loss in the case where the call options sold by
        the vault expire{" "}
        <TooltipExplanation
          title="IN-THE-MONEY"
          explanation="An AAVE call option is in-the-money (ITM) if the strike price is below the market price of AAVE."
          learnMoreURL="https://www.investopedia.com/terms/i/inthemoney.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlightedText ref={ref} {...triggerHandler}>
              in-the-money
            </HighlightedText>
          )}
        />{" "}
        (meaning the price of AAVE is above the strike price of the call options
        minted by the vault).
      </>
    ),
  },
  "rAVAX-THETA": {
    tags: ["COVERED CALL"],
    vaultRisk: (
      <>
        The primary risk for running this covered call strategy is that the
        vault may incur a weekly loss in the case where the call options sold by
        the vault expire{" "}
        <TooltipExplanation
          title="IN-THE-MONEY"
          explanation="An AVAX call option is in-the-money (ITM) if the strike price is below the market price of AVAX."
          learnMoreURL="https://www.investopedia.com/terms/i/inthemoney.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlightedText ref={ref} {...triggerHandler}>
              in-the-money
            </HighlightedText>
          )}
        />{" "}
        (meaning the price of AVAX is above the strike price of the call options
        minted by the vault).
      </>
    ),
  },
  "rsAVAX-THETA": {
    tags: ["COVERED CALL"],
    vaultRisk: (
      <>
        The primary risk for running this covered call strategy is that the
        vault may incur a weekly loss in the case where the call options sold by
        the vault expire{" "}
        <TooltipExplanation
          title="IN-THE-MONEY"
          explanation="An sAVAX call option is in-the-money (ITM) if the strike price is below the market price of sAVAX."
          learnMoreURL="https://www.investopedia.com/terms/i/inthemoney.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlightedText ref={ref} {...triggerHandler}>
              in-the-money
            </HighlightedText>
          )}
        />{" "}
        (meaning the price of sAVAX is above the strike price of the call
        options minted by the vault).
      </>
    ),
  },
  "rUSDC-AVAX-P-THETA": {
    tags: ["PUT-SELLING"],
    vaultRisk: (
      <>
        The primary risk for running this put selling strategy is that the vault
        may incur a weekly loss in the case where the put options sold by the
        vault expire{" "}
        <TooltipExplanation
          title="IN-THE-MONEY"
          explanation="An AVAX put option is in-the-money (ITM) if the strike price is above the market price of AVAX."
          learnMoreURL="https://www.investopedia.com/terms/i/inthemoney.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlightedText ref={ref} {...triggerHandler}>
              in-the-money
            </HighlightedText>
          )}
        />{" "}
        (meaning the price of AVAX is below the strike price of the put options
        minted by the vault). Such a situation is expected to happen less than
        5% of the time.
      </>
    ),
  },
  "rPERP-TSRY": {
    tags: ["COVERED CAL"],
    vaultRisk: (
      <>
        The primary risk for running this covered call strategy is that the
        vault may incur a weekly loss in the case where the call options sold by
        the vault expire{" "}
        <TooltipExplanation
          title="IN-THE-MONEY"
          explanation="An PERP call option is in-the-money (ITM) if the strike price is below the market price of PERP."
          learnMoreURL="https://www.investopedia.com/terms/i/inthemoney.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlightedText ref={ref} {...triggerHandler}>
              in-the-money
            </HighlightedText>
          )}
        />{" "}
        (meaning the price of PERP is above the strike price of the call options
        minted by the vault).
      </>
    ),
  },
  "rSOL-THETA": {
    tags: ["COVERED CALL"],
    vaultRisk: (
      <>
        The primary risk for running this covered call strategy is that the
        vault may incur a weekly loss in the case where the call options sold by
        the vault expire{" "}
        <TooltipExplanation
          title="IN-THE-MONEY"
          explanation="A SOL call option is in-the-money (ITM) if the strike price is below the market price of SOL."
          learnMoreURL="https://www.investopedia.com/terms/i/inthemoney.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlightedText ref={ref} {...triggerHandler}>
              in-the-money
            </HighlightedText>
          )}
        />{" "}
        (meaning the price of SOL is above the strike price of the call options
        minted by the vault).
      </>
    ),
  },
  "rNEAR-THETA": {
    tags: ["COVERED CALL"],
    vaultRisk: (
      <>
        The primary risk for running this covered call strategy is that the
        vault may incur a weekly loss in the case where the call options sold by
        the vault expire{" "}
        <TooltipExplanation
          title="IN-THE-MONEY"
          explanation="An WNEAR call option is in-the-money (ITM) if the strike price is below the market price of WNEAR."
          learnMoreURL="https://www.investopedia.com/terms/i/inthemoney.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlightedText ref={ref} {...triggerHandler}>
              in-the-money
            </HighlightedText>
          )}
        />{" "}
        (meaning the price of WNEAR is above the strike price of the call
        options minted by the vault).
      </>
    ),
  },
  "rAURORA-THETA": {
    tags: ["COVERED CALL"],
    vaultRisk: (
      <>
        The primary risk for running this covered call strategy is that the
        vault may incur a weekly loss in the case where the call options sold by
        the vault expire{" "}
        <TooltipExplanation
          title="IN-THE-MONEY"
          explanation="An AURORA call option is in-the-money (ITM) if the strike price is below the market price of AURORA."
          learnMoreURL="https://www.investopedia.com/terms/i/inthemoney.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlightedText ref={ref} {...triggerHandler}>
              in-the-money
            </HighlightedText>
          )}
        />{" "}
        (meaning the price of AURORA is above the strike price of the call
        options minted by the vault).
      </>
    ),
  },
};
