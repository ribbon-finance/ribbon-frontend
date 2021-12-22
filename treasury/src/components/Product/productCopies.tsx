import React from "react";
import styled from "styled-components";

import { VaultOptions } from "../../constants/constants";
import colors from "shared/lib/designSystem/colors";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";

const HighlighText = styled.span`
  color: ${colors.primaryText};
  cursor: help;

  poin &:hover {
    color: ${colors.primaryText}CC;
  }
`;

interface ProductCopies {
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  strategy: React.ReactNode;
  vaultRisk: React.ReactNode;
  liquidityMining: {
    explanation: React.ReactNode;
  };
}

export const treasuryCopies : {"Treasury" : ProductCopies} = {
  "Treasury": {
    title: "TREASURY",
    subtitle: "ETH Covered Call",
    description:
      "Generates yield by running an automated ETH covered call strategy.",
    tags: ["COVERED CALL"],
    strategy: (
      <>
        The vault earns yield on its ETH deposits by running a weekly automated
        ETH{" "}
        <TooltipExplanation
          title="COVERED CALL"
          explanation="A covered call refers to a financial transaction in which the investor selling call options owns an equivalent amount of the underlying security."
          learnMoreURL="https://www.investopedia.com/terms/c/coveredcall.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              covered call
            </HighlighText>
          )}
        />{" "}
        strategy. The vault reinvests the yield earned back into the strategy,
        effectively compounding the yields for depositors over time.
      </>
    ),
    vaultRisk: (
      <>
        The primary risk for running this covered call strategy is that the
        vault may incur a weekly loss in the case where the call options sold by
        the vault expire{" "}
        <TooltipExplanation
          title="IN-THE-MONEY"
          explanation="A call option is in-the-money (ITM) if the strike price is below the market price of its underlying asset price."
          learnMoreURL="https://www.investopedia.com/terms/i/inthemoney.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              in-the-money
            </HighlighText>
          )}
        />{" "}
        (meaning the price of the vault's underlying asset is above the strike price of the call options
        minted by the vault).
      </>
    ),
    liquidityMining: {
      explanation: (
        <>
          rETH-THETA is a token that represents ETH deposits in the ETH Theta
          Vault (T-ETH-C).
          <br />
          <br />
          Stake your rETH-THETA tokens in the rETH-THETA staking pool to earn
          $RBN rewards.
        </>
      ),
    },
  },
}

export const productCopies: { [vault in VaultOptions]: ProductCopies } = {
  "rBZRX-TSRY": {
    title: "T-BZRX-C",
    subtitle: "BZRX Covered Call",
    description:
      "Generates yield by running an automated BZRX covered call strategy.",
    tags: ["COVERED CALL"],
    strategy: (
      <>
        The vault earns yield on its BZRX deposits by running a weekly automated
        BZRX{" "}
        <TooltipExplanation
          title="COVERED CALL"
          explanation="A covered call refers to a financial transaction in which the investor selling call options owns an equivalent amount of the underlying security."
          learnMoreURL="https://www.investopedia.com/terms/c/coveredcall.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              covered call
            </HighlighText>
          )}
        />{" "}
        strategy. The vault reinvests the yield earned back into the strategy,
        effectively compounding the yields for depositors over time.
      </>
    ),
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
            <HighlighText ref={ref} {...triggerHandler}>
              in-the-money
            </HighlighText>
          )}
        />{" "}
        (meaning the price of BZRX is above the strike price of the call options
        minted by the vault).
      </>
    ),
    liquidityMining: {
      explanation: (
        <>
          rBZRX-TSRY is a token that represents BZRX deposits in the ETH Theta
          Vault (T-ETH-C).
          <br />
          <br />
          Stake your rETH-THETA tokens in the rETH-THETA staking pool to earn
          $RBN rewards.
        </>
      ),
    },
  },
  "rPERP-TSRY": {
    title: "T-PERP-C",
    subtitle: "PERP Covered Call",
    description:
      "Generates yield by running an automated PERP covered call strategy.",
    tags: ["COVERED CALL"],
    strategy: (
      <>
        The vault earns yield on its PERP deposits by running a weekly automated
        PERP{" "}
        <TooltipExplanation
          title="COVERED CALL"
          explanation="A covered call refers to a financial transaction in which the investor selling call options owns an equivalent amount of the underlying security."
          learnMoreURL="https://www.investopedia.com/terms/c/coveredcall.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              covered call
            </HighlighText>
          )}
        />{" "}
        strategy. The vault reinvests the yield earned back into the strategy,
        effectively compounding the yields for depositors over time.
      </>
    ),
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
            <HighlighText ref={ref} {...triggerHandler}>
              in-the-money
            </HighlighText>
          )}
        />{" "}
        (meaning the price of PERP is above the strike price of the call options
        minted by the vault).
      </>
    ),
    liquidityMining: {
      explanation: (
        <>
          rPERP-TSRY is a token that represents PERP deposits in the PERP Theta
          Vault (T-PERP-C).
          <br />
          <br />
          Stake your rPERP-THETA tokens in the rPERP-THETA staking pool to earn
          $RBN rewards.
        </>
      ),
    },
  },
};
