import React from "react";
import { OverlayTrigger } from "react-bootstrap";
import styled from "styled-components";

import { VaultOptions } from "../../constants/constants";
import colors from "../../designSystem/colors";
import OverlayTooltipExplanation from "../Common/OverlayTooltipExplanation";

const HighlighText = styled.span`
  color: ${colors.primaryText};
  cursor: pointer;

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
      "Theta Vault is a yield-generating strategy on ETH. The vault runs an automated covered call strategy.",
    tags: ["THETA VAULT", "ETH"],
    strategy: (
      <>
        This vault earns yield on ETH through running an automated{" "}
        <OverlayTrigger
          overlay={(props) => (
            <OverlayTooltipExplanation
              title="Covered Call"
              explanation="A covered call refers to a financial transaction in which the investor selling call options owns an equivalent amount of the underlying security."
              overlayInjectedProps={props}
              learnMoreURL="https://www.investopedia.com/terms/c/coveredcall.asp"
            />
          )}
          trigger="click"
        >
          {({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              covered call
            </HighlighText>
          )}
        </OverlayTrigger>{" "}
        strategy. Put simply, the vault sells potential upside in exchange for
        high yield.
        <p />
        The vault generates yield by writing{" "}
        <OverlayTrigger
          overlay={(props) => (
            <OverlayTooltipExplanation
              title="OUT-OF-THE-MONEY"
              explanation="An BTC covered call is out-of-the-money (OTM) if the strike price is above the market price of BTC."
              overlayInjectedProps={props}
              learnMoreURL="https://www.investopedia.com/terms/o/outofthemoney.asp"
            />
          )}
          trigger="click"
        >
          {({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              out-of-the-money
            </HighlighText>
          )}
        </OverlayTrigger>{" "}
        call options on ETH on a weekly basis and selling the options to market
        makers in exchange for premiums. The vault repeats this process on a
        weekly basis and reinvests the premiums, effectively compounding the
        yields for depositors over time.
        <p />
        The vault has a manager who selects the strike prices for the call
        options that the vault writes. This manager is responsible for making
        the best tradeoff between yield vs risk of the call options getting
        exercised.
      </>
    ),
    vaultRisk: (
      <>
        The primary risk for running this covered call strategy is that
        depositors could potentially give up upside in exchange for guaranteed
        yield. This only happens when the call options get exercised, which
        should happen less than 3% of the time. In such a situation, depositors
        can still expect to be up significantly in USD terms.
      </>
    ),
  },
  "rBTC-THETA": {
    title: "T-WBTC-C",
    subtitle: "Theta Vault - WBTC",
    description:
      "Theta Vault is a yield-generating strategy on WBTC. The vault runs an automated covered call strategy.",
    tags: ["THETA VAULT", "WBTC"],
    strategy: (
      <>
        This vault earns yield on wBTC through running an automated{" "}
        <OverlayTrigger
          overlay={(props) => (
            <OverlayTooltipExplanation
              title="Covered Call"
              explanation="A covered call refers to a financial transaction in which the investor selling call options owns an equivalent amount of the underlying security."
              overlayInjectedProps={props}
              learnMoreURL="https://www.investopedia.com/terms/c/coveredcall.asp"
            />
          )}
          trigger="click"
        >
          {({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              covered call
            </HighlighText>
          )}
        </OverlayTrigger>{" "}
        strategy. Put simply, the vault sells potential upside in exchange for
        high yield.
        <p />
        The vault generates yield by writing{" "}
        <OverlayTrigger
          overlay={(props) => (
            <OverlayTooltipExplanation
              title="OUT-OF-THE-MONEY"
              explanation="An BTC covered call is out-of-the-money (OTM) if the strike price is above the market price of BTC."
              overlayInjectedProps={props}
              learnMoreURL="https://www.investopedia.com/terms/o/outofthemoney.asp"
            />
          )}
          trigger="click"
        >
          {({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              out-of-the-money
            </HighlighText>
          )}
        </OverlayTrigger>{" "}
        call options on WBTC on a weekly basis and selling the options to market
        makers in exchange for premiums. The vault repeats this process on a
        weekly basis and reinvests the premiums, effectively compounding the
        yields for depositors over time.
        <p />
        The vault has a manager who selects the strike prices for the call
        options that the vault writes. This manager is responsible for making
        the best tradeoff between yield vs risk of the call options getting
        exercised.
      </>
    ),
    vaultRisk: (
      <>
        The primary risk for running this covered call strategy is that
        depositors could potentially give up upside in exchange for guaranteed
        yield. This only happens when the call options get exercised, which
        should happen less than 3% of the time. In such a situation, depositors
        can still expect to be up significantly in USD terms.
      </>
    ),
  },
  "rETH-THETA-P": {
    title: "T-ETH-P",
    subtitle: "Theta Vault - ETH",
    description:
      "The vault generates yield by running an automated ETH put selling strategy.",
    tags: ["THETA VAULT", "ETH"],
    strategy: (
      <>
        This vault earns yield on its USDC deposits by running an automated
        strategy that sells ETH{" "}
        <OverlayTrigger
          overlay={(props) => (
            <OverlayTooltipExplanation
              title="Covered Call"
              explanation="A covered call refers to a financial transaction in which the investor selling call options owns an equivalent amount of the underlying security."
              overlayInjectedProps={props}
              learnMoreURL="https://www.investopedia.com/terms/c/coveredcall.asp"
            />
          )}
          trigger="click"
        >
          {({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              covered call
            </HighlighText>
          )}
        </OverlayTrigger>
        .
        <p />
        Put simply, the vault{" "}
        <OverlayTrigger
          overlay={(props) => (
            <OverlayTooltipExplanation
              title="MINTING"
              explanation="The vault mints, or creates, an option by depositing collateral into an Opyn vault resulting in the issuance of an oToken that represents the option contract."
              overlayInjectedProps={props}
              learnMoreURL="https://www.investopedia.com/terms/m/mint.asp"
            />
          )}
          trigger="click"
        >
          {({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              mints
            </HighlighText>
          )}
        </OverlayTrigger>{" "}
        <OverlayTrigger
          overlay={(props) => (
            <OverlayTooltipExplanation
              title="OUT-OF-THE-MONEY"
              explanation="An ETH put option is out-of-the-money (OTM) if the strike price is below the market price of ETH."
              overlayInjectedProps={props}
              learnMoreURL="https://www.investopedia.com/terms/o/outofthemoney.asp"
            />
          )}
          trigger="click"
        >
          {({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              out-of-the-money
            </HighlighText>
          )}
        </OverlayTrigger>{" "}
        ETH put options on Opyn on a weekly basis and sells these options to
        market makers for a fee (the market price of the option, also known as
        the{" "}
        <OverlayTrigger
          overlay={(props) => (
            <OverlayTooltipExplanation
              title="Option Premium"
              explanation="The option premium is the current market price of an option contract."
              overlayInjectedProps={props}
              learnMoreURL="https://www.investopedia.com/terms/o/option-premium.asp"
            />
          )}
          trigger="click"
        >
          {({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              option premium
            </HighlighText>
          )}
        </OverlayTrigger>
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
        <OverlayTrigger
          overlay={(props) => (
            <OverlayTooltipExplanation
              title="IN-THE-MONEY"
              explanation="An ETH put option is in-the-money (OTM) if the strike price is above the market price of ETH."
              overlayInjectedProps={props}
              learnMoreURL="https://www.investopedia.com/terms/i/inthemoney.asp"
            />
          )}
          trigger="click"
        >
          {({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              in-the-money
            </HighlighText>
          )}
        </OverlayTrigger>{" "}
        (meaning the price of ETH is below the strike price of the put options
        minted by the vault). Such a situation is expected to happen less than
        5% of the time.
      </>
    ),
  },
  "rBTC-THETA-P": {
    title: "T-WBTC-P",
    subtitle: "Theta Vault - WBTC",
    description:
      "The vault generates yield by running an automated WBTC put selling strategy.",
    tags: ["THETA VAULT", "WBTC"],
    strategy: (
      <>
        This vault earns yield on its USDC deposits by running an automated
        strategy that sells WBTC{" "}
        <OverlayTrigger
          overlay={(props) => (
            <OverlayTooltipExplanation
              title="Put Option"
              explanation="A put option is a derivative instrument which gives the holder the right to sell an asset, at a specified price, by a specified date to the writer of the put."
              overlayInjectedProps={props}
              learnMoreURL="https://www.investopedia.com/terms/p/putoption.asp"
            />
          )}
          trigger="click"
        >
          {({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              put options
            </HighlighText>
          )}
        </OverlayTrigger>
        .
        <p />
        Put simply, the vault{" "}
        <OverlayTrigger
          overlay={(props) => (
            <OverlayTooltipExplanation
              title="MINTING"
              explanation="The vault mints, or creates, an option by depositing collateral into an Opyn vault resulting in the issuance of an oToken that represents the option contract."
              overlayInjectedProps={props}
              learnMoreURL="https://www.investopedia.com/terms/m/mint.asp"
            />
          )}
          trigger="click"
        >
          {({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              mints
            </HighlighText>
          )}
        </OverlayTrigger>{" "}
        <OverlayTrigger
          overlay={(props) => (
            <OverlayTooltipExplanation
              title="OUT-OF-THE-MONEY"
              explanation="An BTC put option is out-of-the-money (OTM) if the strike price is below the market price of BTC."
              overlayInjectedProps={props}
              learnMoreURL="https://www.investopedia.com/terms/o/outofthemoney.asp"
            />
          )}
          trigger="click"
        >
          {({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              out-of-the-money
            </HighlighText>
          )}
        </OverlayTrigger>{" "}
        WBTC put options on Opyn on a weekly basis and sells these options to
        market makers for a fee (the market price of the option, also known as
        the{" "}
        <OverlayTrigger
          overlay={(props) => (
            <OverlayTooltipExplanation
              title="Option Premium"
              explanation="The option premium is the current market price of an option contract."
              overlayInjectedProps={props}
              learnMoreURL="https://www.investopedia.com/terms/o/option-premium.asp"
            />
          )}
          trigger="click"
        >
          {({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              option premium
            </HighlighText>
          )}
        </OverlayTrigger>
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
        <OverlayTrigger
          overlay={(props) => (
            <OverlayTooltipExplanation
              title="IN-THE-MONEY"
              explanation="An BTC put option is in-the-money (OTM) if the strike price is above the market price of BTC."
              overlayInjectedProps={props}
              learnMoreURL="https://www.investopedia.com/terms/i/inthemoney.asp"
            />
          )}
          trigger="click"
        >
          {({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              in-the-money
            </HighlighText>
          )}
        </OverlayTrigger>{" "}
        (meaning the price of WBTC is below the strike price of the put options
        minted by the vault). Such a situation is expected to happen less than
        5% of the time.
      </>
    ),
  },
};
