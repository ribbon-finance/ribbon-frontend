import React from "react";
import styled from "styled-components";

import { VaultOptions } from "../../constants/constants";

const Link = styled.a`
  color: rgba(255, 255, 255, 0.8);
  text-decoration: underline;

  &:hover {
    color: rgba(255, 255, 255, 0.8);
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
        <Link
          href="https://www.investopedia.com/terms/c/coveredcall.asp"
          target="_blank"
          rel="noreferrer noopener"
        >
          covered call
        </Link>{" "}
        strategy. Put simply, the vault sells <i>potential upside</i> in
        exchange for high yield.
        <p />
        The vault generates yield by writing out-of-the-money call options on
        ETH on a weekly basis and selling the options to market makers in
        exchange for premiums. The vault repeats this process on a weekly basis
        and reinvests the premiums, effectively compounding the yields for
        depositors over time.
        <p />
        The vault has a <b>manager</b> who selects the strike prices for the
        call options that the vault writes. This manager is responsible for
        making the best tradeoff between yield vs risk of the call options
        getting exercised.
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
        <Link
          href="https://www.investopedia.com/terms/c/coveredcall.asp"
          target="_blank"
          rel="noreferrer noopener"
        >
          covered call
        </Link>{" "}
        strategy. Put simply, the vault sells <i>potential upside</i> in
        exchange for high yield.
        <p />
        The vault generates yield by writing out-of-the-money call options on
        WBTC on a weekly basis and selling the options to market makers in
        exchange for premiums. The vault repeats this process on a weekly basis
        and reinvests the premiums, effectively compounding the yields for
        depositors over time.
        <p />
        The vault has a <b>manager</b> who selects the strike prices for the
        call options that the vault writes. This manager is responsible for
        making the best tradeoff between yield vs risk of the call options
        getting exercised.
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
        <Link
          href="https://www.investopedia.com/terms/c/coveredcall.asp"
          target="_blank"
          rel="noreferrer noopener"
        >
          put options
        </Link>
        .
        <p />
        Put simply, the vault mints <i>out-of-the-money</i> ETH put options on
        Opyn on a weekly basis and sells these options to market makers for a
        fee (the market price of the option, also known as the option premium).
        The vault repeats this process on a weekly basis and reinvests the
        income earned from selling options to mint new options, effectively
        compounding the yields for depositors over time.
        <p />
        The vault has a <b>manager</b> who selects the strike price for the put
        options minted by the vault. The manager is responsible for making the
        best tradeoff between yield versus the risk of the put options getting
        exercised.
      </>
    ),
    vaultRisk: (
      <>
        The primary risk for running this put selling strategy is that the vault
        may incur a weekly loss in the case where the put options sold by the
        vault expire <b>in-the-money</b> (meaning the price of ETH is below the
        strike price of the put options minted by the vault). Such a situation
        is expected to happen less than 5% of the time.
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
        <Link
          href="https://www.investopedia.com/terms/c/coveredcall.asp"
          target="_blank"
          rel="noreferrer noopener"
        >
          put options
        </Link>
        .
        <p />
        Put simply, the vault mints <i>out-of-the-money</i> WBTC put options on
        Opyn on a weekly basis and sells these options to market makers for a
        fee (the market price of the option, also known as the option premium).
        The vault repeats this process on a weekly basis and reinvests the
        income earned from selling options to mint new options, effectively
        compounding the yields for depositors over time.
        <p />
        The vault has a <b>manager</b> who selects the strike price for the put
        options minted by the vault. The manager is responsible for making the
        best tradeoff between yield versus the risk of the put options getting
        exercised.
      </>
    ),
    vaultRisk: (
      <>
        The primary risk for running this put selling strategy is that the vault
        may incur a weekly loss in the case where the put options sold by the
        vault expire <b>in-the-money</b> (meaning the price of WBTC is below the
        strike price of the put options minted by the vault). Such a situation
        is expected to happen less than 5% of the time.
      </>
    ),
  },
};
