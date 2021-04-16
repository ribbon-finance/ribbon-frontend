import React from "react";
import styled from "styled-components";

import { VaultOptions } from "../../../constants/constants";

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
}

export const productCopies: { [vault in VaultOptions]: ProductCopies } = {
  "rETH-THETA": {
    title: "T-100-ETH",
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
  },
  "rBTC-THETA": {
    title: "T-100-WBTC",
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
  },
};
