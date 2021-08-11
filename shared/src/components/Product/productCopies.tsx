import React from "react";
import styled from "styled-components";

import { VaultOptions } from "../../constants/constants";
import colors from "../../designSystem/colors";
import TooltipExplanation from "../Common/TooltipExplanation";

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

export const productCopies: { [vault in VaultOptions]: ProductCopies } = {
  "rETH-THETA": {
    title: "T-ETH-C",
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
        <p />
        The strategy works as follows:
      </>
    ),
    vaultRisk: (
      <>
        The primary risk for running this covered call strategy is that the
        vault may incur a weekly loss in the case where the call options sold by
        the vault expire{" "}
        <TooltipExplanation
          title="IN-THE-MONEY"
          explanation="An ETH call option is in-the-money (OTM) if the strike price is below the market price of ETH."
          learnMoreURL="https://www.investopedia.com/terms/i/inthemoney.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              in-the-money
            </HighlighText>
          )}
        />{" "}
        (meaning the price of ETH is above the strike price of the call options
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
  "rBTC-THETA": {
    title: "T-WBTC-C",
    subtitle: "WBTC Covered Call",
    description:
      "Generates yield by running an automated WBTC covered call strategy.",
    tags: ["COVERED CALL"],
    strategy: (
      <>
        The vault earns yield on its WBTC deposits by running a weekly automated
        WBTC{" "}
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
        <p />
        The strategy works as follows:
      </>
    ),
    vaultRisk: (
      <>
        The primary risk for running this covered call strategy is that the
        vault may incur a weekly loss in the case where the call options sold by
        the vault expire{" "}
        <TooltipExplanation
          title="IN-THE-MONEY"
          explanation="An WBTC call option is in-the-money (OTM) if the strike price is below the market price of WBTC."
          learnMoreURL="https://www.investopedia.com/terms/i/inthemoney.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              in-the-money
            </HighlighText>
          )}
        />{" "}
        (meaning the price of WBTC is above the strike price of the call options
        minted by the vault).
      </>
    ),
    liquidityMining: {
      explanation: (
        <>
          rWBTC-THETA is a token that represents WBTC deposits in the WBTC Theta
          Vault (T-WBTC-C).
          <br />
          <br />
          Stake your rWBTC-THETA tokens in the rWBTC-THETA staking pool to earn
          $RBN rewards.
        </>
      ),
    },
  },
  "rUSDC-ETH-P-THETA": {
    title: "T-USDC-P-ETH",
    subtitle: "ETH Put-Selling",
    description:
      "Generates yield by running an automated ETH put selling strategy.",
    tags: ["PUT-SELLING"],
    strategy: (
      <>
        T-USDC-P-ETH earns yield on its USDC deposits by running a weekly
        automated ETH{" "}
        <TooltipExplanation
          title="PUT OPTION"
          explanation="A put option is a derivative instrument which gives the holder the right to sell an asset, at a specified price, by a specified date to the writer of the put."
          learnMoreURL="https://www.investopedia.com/terms/p/putoption.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              put-selling
            </HighlighText>
          )}
        />{" "}
        strategy, where the put options are collateralized by USDC. The vault
        reinvests the yield it earns back into the strategy, effectively
        compounding the yields for depositors over time.
        <p />
        The strategy works as follows:
      </>
    ),
    vaultRisk: (
      <>
        The primary risk for running this put selling strategy is that the vault
        may incur a weekly loss in the case where the put options sold by the
        vault expire{" "}
        <TooltipExplanation
          title="IN-THE-MONEY"
          explanation="An ETH put option is in-the-money (OTM) if the strike price is above the market price of ETH."
          learnMoreURL="https://www.investopedia.com/terms/i/inthemoney.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              in-the-money
            </HighlighText>
          )}
        />{" "}
        (meaning the price of ETH is below the strike price of the put options
        minted by the vault). Such a situation is expected to happen less than
        5% of the time.
      </>
    ),
    liquidityMining: {
      explanation: (
        <>
          rUSDC-ETH-P-THETA is a token that represents USDC deposits in the ETH
          Put Theta Vault (T-USDC-P-ETH).
          <br />
          <br />
          Stake your rUSDC-ETH-P-THETA tokens in the rUSDC-ETH-P-THETA staking
          pool to earn $RBN rewards.
        </>
      ),
    },
  },
  "ryvUSDC-ETH-P-THETA": {
    title: "T-yvUSDC-P-ETH",
    subtitle: "ETH Put-Selling",
    description:
      "Generates yield by running an automated yvUSDC-collateralized ETH put selling strategy.",
    tags: ["PUT-SELLING"],
    strategy: (
      <>
        T-YVUSDC-P-ETH earns yield on its USDC deposits by running a weekly
        automated ETH{" "}
        <TooltipExplanation
          title="PUT OPTION"
          explanation="A put option is a derivative instrument which gives the holder the right to sell an asset, at a specified price, by a specified date to the writer of the put."
          learnMoreURL="https://www.investopedia.com/terms/p/putoption.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              put-selling
            </HighlighText>
          )}
        />{" "}
        strategy, where the put options are collateralized by{" "}
        <TooltipExplanation
          title="YVUSDC"
          explanation="yvUSDC is the deposit token that represents a user's share of the USDC yVault."
          learnMoreURL="https://docs.yearn.finance/yearn-finance/yvaults/vault-tokens"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              yvUSDC
            </HighlighText>
          )}
        />
        . The vault reinvests the yield it earns back into the strategy,
        effectively compounding the yields for depositors over time.
        <p />
        The strategy works as follows:
      </>
    ),
    vaultRisk: (
      <>
        The primary risk for running this put selling strategy is that the vault
        may incur a weekly loss in the case where the put options sold by the
        vault expire{" "}
        <TooltipExplanation
          title="IN-THE-MONEY"
          explanation="An ETH put option is in-the-money (OTM) if the strike price is above the market price of ETH."
          learnMoreURL="https://www.investopedia.com/terms/i/inthemoney.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              in-the-money
            </HighlighText>
          )}
        />{" "}
        (meaning the price of ETH is below the strike price of the put options
        minted by the vault). Such a situation is expected to happen less than
        5% of the time.
      </>
    ),
    liquidityMining: {
      explanation: (
        <>
          ryvUSDC-ETH-P-THETA is a token that represents yvUSDC deposits in the
          ETH Put Theta Vault (T-yvUSDC-P-ETH).
          <br />
          <br />
          Stake your ryvUSDC-ETH-P-THETA tokens in the ryvUSDC-ETH-P-THETA
          staking pool to earn $RBN rewards.
        </>
      ),
    },
  },
};
