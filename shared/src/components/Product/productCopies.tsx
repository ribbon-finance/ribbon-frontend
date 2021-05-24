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
}

export const productCopies: { [vault in VaultOptions]: ProductCopies } = {
  "rETH-THETA": {
    title: "T-ETH-C",
    subtitle: "Theta Vault - ETH",
    description:
      "Generates yield by running an automated ETH covered call strategy.",
    tags: ["THETA VAULT", "ETH"],
    strategy: (
      <>
        This vault earns yield on its ETH deposits by running an automated ETH{" "}
        <TooltipExplanation
          title="Covered Call"
          explanation="A covered call refers to a financial transaction in which the investor selling call options owns an equivalent amount of the underlying security."
          learnMoreURL="https://www.investopedia.com/terms/c/coveredcall.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              covered call
            </HighlighText>
          )}
        />{" "}
        strategy.
        <p />
        Put simply, the vault{" "}
        <TooltipExplanation
          title="MINTING"
          explanation="The vault mints, or creates, an option by depositing collateral into an Opyn vault resulting in the issuance of an oToken that represents the option contract."
          learnMoreURL="https://www.investopedia.com/terms/m/mint.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              mints
            </HighlighText>
          )}
        />{" "}
        <TooltipExplanation
          title="OUT-OF-THE-MONEY"
          explanation="An ETH covered call is out-of-the-money (OTM) if the strike price is above the market price of ETH."
          learnMoreURL="https://www.investopedia.com/terms/o/outofthemoney.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              out-of-the-money
            </HighlighText>
          )}
        />{" "}
        ETH call options on Opyn on a weekly basis and sells these options to
        market makers for a fee (the market price of the option, also known as
        the{" "}
        <TooltipExplanation
          title="Option Premium"
          explanation="The option premium is the current market price of an option contract."
          learnMoreURL="https://www.investopedia.com/terms/o/option-premium.asp"
          renderContent={({ ref, ...props }) => (
            <HighlighText ref={ref} {...props}>
              option premium
            </HighlighText>
          )}
        />
        ). The vault repeats this process on a weekly basis and reinvests the
        income earned from selling options to mint new options, effectively
        compounding the yields for depositors over time.
        <p />
        The vault has a manager who selects the{" "}
        <TooltipExplanation
          title="STRIKE PRICE"
          explanation="A strike price is the set price at which an option contract can be bought or sold when it is exercised."
          learnMoreURL="https://www.investopedia.com/terms/s/strikeprice.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              strike price
            </HighlighText>
          )}
        />{" "}
        for the call options minted by the vault. The manager is responsible for
        making the best tradeoff between yield versus the risk of the put
        options getting exercised.
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
  },
  "rBTC-THETA": {
    title: "T-WBTC-C",
    subtitle: "Theta Vault - WBTC",
    description:
      "Generates yield by runnning an automated WBTC covered call strategy.",
    tags: ["THETA VAULT", "WBTC"],
    strategy: (
      <>
        This vault earns yield on its WBTC deposits by running an automated WBTC{" "}
        <TooltipExplanation
          title="Covered Call"
          explanation="A covered call refers to a financial transaction in which the investor selling call options owns an equivalent amount of the underlying security."
          learnMoreURL="https://www.investopedia.com/terms/c/coveredcall.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              covered call
            </HighlighText>
          )}
        />{" "}
        strategy.
        <p />
        Put simply, the vault{" "}
        <TooltipExplanation
          title="MINTING"
          explanation="The vault mints, or creates, an option by depositing collateral into an Opyn vault resulting in the issuance of an oToken that represents the option contract."
          learnMoreURL="https://www.investopedia.com/terms/m/mint.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              mints
            </HighlighText>
          )}
        />{" "}
        <TooltipExplanation
          title="OUT-OF-THE-MONEY"
          explanation="An WBTC covered call is out-of-the-money (OTM) if the strike price is above the market price of WBTC."
          learnMoreURL="https://www.investopedia.com/terms/o/outofthemoney.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              out-of-the-money
            </HighlighText>
          )}
        />{" "}
        WBTC call options on Opyn on a weekly basis and sells these options to
        market makers for a fee (the market price of the option, also known as
        the{" "}
        <TooltipExplanation
          title="Option Premium"
          explanation="The option premium is the current market price of an option contract."
          learnMoreURL="https://www.investopedia.com/terms/o/option-premium.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              option premium
            </HighlighText>
          )}
        />
        ). The vault repeats this process on a weekly basis and reinvests the
        income earned from selling options to mint new options, effectively
        compounding the yields for depositors over time.
        <p />
        The vault has a manager who selects the{" "}
        <TooltipExplanation
          title="STRIKE PRICE"
          explanation="A strike price is the set price at which an option contract can be bought or sold when it is exercised."
          learnMoreURL="https://www.investopedia.com/terms/s/strikeprice.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              strike price
            </HighlighText>
          )}
        />{" "}
        for the call options minted by the vault. The manager is responsible for
        making the best tradeoff between yield versus the risk of the put
        options getting exercised.
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
  },
  "rUSDC-ETH-P-THETA": {
    title: "T-USDC-P-ETH",
    subtitle: "Theta Vault - ETH",
    description:
      "Generates yield by running an automated ETH put selling strategy.",
    tags: ["THETA VAULT", "ETH"],
    strategy: (
      <>
        This vault earns yield on its USDC deposits by running an automated
        strategy that sells ETH{" "}
        <TooltipExplanation
          title="Put Option"
          explanation="A put option is a contract giving the owner the right, but not the obligation, to sell–or sell short–a specified amount of an underlying security at a pre-determined price within a specified time frame. This pre-determined price that buyer of the put option can sell at is called the strike price."
          learnMoreURL="https://www.investopedia.com/terms/p/putoption.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              put options
            </HighlighText>
          )}
        />
        . The idea is to profit when the asset goes up in price.
        <p />
        Put simply, the vault{" "}
        <TooltipExplanation
          title="MINTING"
          explanation="The vault mints, or creates, an option by depositing collateral into an Opyn vault resulting in the issuance of an oToken that represents the option contract."
          learnMoreURL="https://www.investopedia.com/terms/m/mint.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              mints
            </HighlighText>
          )}
        />{" "}
        <TooltipExplanation
          title="OUT-OF-THE-MONEY"
          explanation="An ETH put option is out-of-the-money (OTM) if the strike price is below the market price of ETH."
          learnMoreURL="https://www.investopedia.com/terms/o/outofthemoney.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              out-of-the-money
            </HighlighText>
          )}
        />{" "}
        ETH put options on Opyn on a weekly basis and sells these options to
        market makers for a fee (the market price of the option, also known as
        the{" "}
        <TooltipExplanation
          title="Option Premium"
          explanation="The option premium is the current market price of an option contract."
          learnMoreURL="https://www.investopedia.com/terms/o/option-premium.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              option premium
            </HighlighText>
          )}
        />
        ). The vault repeats this process on a weekly basis and reinvests the
        income earned from selling options to mint new options, effectively
        compounding the yields for depositors over time.
        <p />
        The vault has a manager who selects the strike price for the put options
        minted by the vault. The manager is responsible for making the best
        tradeoff between yield versus the risk of the put options getting
        exercised.
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
  },
  "rUSDC-BTC-P-THETA": {
    title: "T-USDC-P-WBTC",
    subtitle: "Theta Vault - WBTC",
    description:
      "Generates yield by running an automated WBTC put selling strategy.",
    tags: ["THETA VAULT", "WBTC"],
    strategy: (
      <>
        This vault earns yield on its USDC deposits by running an automated
        strategy that sells WBTC{" "}
        <TooltipExplanation
          title="Put Option"
          explanation="A put option is a derivative instrument which gives the holder the right to sell an asset, at a specified price, by a specified date to the writer of the put."
          learnMoreURL="https://www.investopedia.com/terms/p/putoption.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              put options
            </HighlighText>
          )}
        />
        .
        <p />
        Put simply, the vault{" "}
        <TooltipExplanation
          title="MINTING"
          explanation="The vault mints, or creates, an option by depositing collateral into an Opyn vault resulting in the issuance of an oToken that represents the option contract."
          learnMoreURL="https://www.investopedia.com/terms/m/mint.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              mints
            </HighlighText>
          )}
        />{" "}
        <TooltipExplanation
          title="OUT-OF-THE-MONEY"
          explanation="A WBTC put option is out-of-the-money (OTM) if the strike price is below the market price of WBTC."
          learnMoreURL="https://www.investopedia.com/terms/o/outofthemoney.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              out-of-the-money
            </HighlighText>
          )}
        />{" "}
        WBTC put options on Opyn on a weekly basis and sells these options to
        market makers for a fee (the market price of the option, also known as
        the{" "}
        <TooltipExplanation
          title="Option Premium"
          explanation="The option premium is the current market price of an option contract."
          learnMoreURL="https://www.investopedia.com/terms/o/option-premium.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              option premium
            </HighlighText>
          )}
        />
        ). The vault repeats this process on a weekly basis and reinvests the
        income earned from selling options to mint new options, effectively
        compounding the yields for depositors over time.
        <p />
        The vault has a manager who selects the strike price for the put options
        minted by the vault. The manager is responsible for making the best
        tradeoff between yield versus the risk of the put options getting
        exercised.
      </>
    ),
    vaultRisk: (
      <>
        The primary risk for running this put selling strategy is that the vault
        may incur a weekly loss in the case where the put options sold by the
        vault expire{" "}
        <TooltipExplanation
          title="IN-THE-MONEY"
          explanation="A WBTC put option is in-the-money (OTM) if the strike price is above the market price of WBTC."
          learnMoreURL="https://www.investopedia.com/terms/i/inthemoney.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              in-the-money
            </HighlighText>
          )}
        />
        (meaning the price of WBTC is below the strike price of the put options
        minted by the vault). Such a situation is expected to happen less than
        5% of the time.
      </>
    ),
  },
};
