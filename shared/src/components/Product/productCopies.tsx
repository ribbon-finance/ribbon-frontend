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
        This vault earns yield on its ETH deposits by running an automated ETH{" "}
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
          title="OPTION PREMIUM"
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
        making the best tradeoff between yield versus the risk of the call
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
      "Generates yield by runnning an automated WBTC covered call strategy.",
    tags: ["COVERED CALL"],
    strategy: (
      <>
        This vault earns yield on its WBTC deposits by running an automated WBTC{" "}
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
          title="OPTION PREMIUM"
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
        making the best tradeoff between yield versus the risk of the call
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
        This vault earns yield on its USDC deposits by running an automated
        strategy that sells ETH{" "}
        <TooltipExplanation
          title="PUT OPTION"
          explanation="A put option is a derivative instrument which gives the holder the right to sell an asset, at a specified price, by a specified date to the writer of the put."
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
          title="OPTION PREMIUM"
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
        for the put options minted by the vault. The manager is responsible for
        making the best tradeoff between yield versus the risk of the put
        options getting exercised.
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
  "rUSDC-BTC-P-THETA": {
    title: "T-USDC-P-WBTC",
    subtitle: "WBTC Put-Selling",
    description:
      "Generates yield by running an automated WBTC put selling strategy.",
    tags: ["PUT-SELLING"],
    strategy: (
      <>
        This vault earns yield on its USDC deposits by running an automated
        strategy that sells WBTC{" "}
        <TooltipExplanation
          title="PUT OPTION"
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
          title="OPTION PREMIUM"
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
        for the put options minted by the vault. The manager is responsible for
        making the best tradeoff between yield versus the risk of the put
        options getting exercised.
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
    liquidityMining: {
      explanation: (
        <>
          rUSDC-BTC-P-THETA is a token that represents USDC deposits in the WBTC
          Put Theta Vault (T-USDC-P-WBTC).
          <br />
          <br />
          Stake your rUSDC-BTC-P-THETA tokens in the rUSDC-BTC-P-THETA staking
          pool to earn $RBN rewards.
        </>
      ),
    },
  },
  "ryvUSDC-ETH-P-THETA": {
    title: "T-yUSDC-P-ETH",
    subtitle: "ETH Put-Selling",
    description:
      "Generates yield by running an automated ETH put selling strategy.",
    tags: ["PUT-SELLING"],
    strategy: (
      <>
        This vault earns yield on its USDC deposits by running an automated
        strategy that deposits USDC into the Yearn USDC{" "}
        <TooltipExplanation
          title="YVAULT"
          explanation="yVaults are Yearn vaults that accept customer deposits and then route them through strategies which seek out the highest yield available in DeFi."
          learnMoreURL="https://docs.yearn.finance/yearn-finance/yvaults/overview#what-are-yvaults"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              yVault
            </HighlighText>
          )}
        />{" "}
        and sells ETH{" "}
        <TooltipExplanation
          title="PUT OPTION"
          explanation="A put option is a derivative instrument which gives the holder the right to sell an asset, at a specified price, by a specified date to the writer of the put."
          learnMoreURL="https://www.investopedia.com/terms/p/putoption.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              put options
            </HighlighText>
          )}
        />{" "}
        that are collaterlised by Yearn{" "}
        <TooltipExplanation
          title="YVUSDC"
          explanation="yvUSDC is the deposit token that represents a user's share of the USDC yVault."
          learnMoreURL="https://docs.yearn.finance/yearn-finance/yvaults/vault-tokens"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              yvUSDC
            </HighlighText>
          )}
        />{" "}
        deposit tokens.
        <p />
        On a weekly basis, the vault deposits USDC into the Yearn USDC yVault,
        uses the yvUSDC deposit token as collateral to mint{" "}
        <TooltipExplanation
          title="OUT-OF-THE-MONEY"
          explanation="A ETH put option is out-of-the-money (OTM) if the strike price is below the market price of ETH."
          learnMoreURL="https://www.investopedia.com/terms/o/outofthemoney.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              out-of-the-money
            </HighlighText>
          )}
        />{" "}
        ETH put options on{" "}
        <TooltipExplanation
          title="Opyn"
          explanation="Opyn is a DeFi options protocol."
          learnMoreURL="https://www.opyn.co/"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlighText ref={ref} {...triggerHandler}>
              Opyn
            </HighlighText>
          )}
        />{" "}
        and then sells these options to market makers for a fee (the market
        price of the option, also known as the{" "}
        <TooltipExplanation
          title="OPTION PREMIUM"
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
          ETH Put Theta Vault (T-yUSDC-P-ETH).
          <br />
          <br />
          Stake your ryvUSDC-ETH-P-THETA tokens in the ryvUSDC-ETH-P-THETA
          staking pool to earn $RBN rewards.
        </>
      ),
    },
  },
};
