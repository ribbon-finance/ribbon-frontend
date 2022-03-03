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
            <HighlightedText ref={ref} {...triggerHandler}>
              covered call
            </HighlightedText>
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
            <HighlightedText ref={ref} {...triggerHandler}>
              in-the-money
            </HighlightedText>
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
            <HighlightedText ref={ref} {...triggerHandler}>
              covered call
            </HighlightedText>
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
    liquidityMining: {
      explanation: (
        <>
          rBTC-THETA is a token that represents WBTC deposits in the WBTC Theta
          Vault (T-WBTC-C).
          <br />
          <br />
          Stake your rBTC-THETA tokens in the rBTC-THETA staking pool to earn
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
            <HighlightedText ref={ref} {...triggerHandler}>
              put-selling
            </HighlightedText>
          )}
        />{" "}
        strategy, where the put options are collateralized by USDC. The vault
        reinvests the yield it earns back into the strategy, effectively
        compounding the yields for depositors over time.
      </>
    ),
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
            <HighlightedText ref={ref} {...triggerHandler}>
              put-selling
            </HighlightedText>
          )}
        />{" "}
        strategy, where the put options are collateralized by{" "}
        <TooltipExplanation
          title="YVUSDC"
          explanation="yvUSDC is the deposit token that represents a user's share of the USDC yVault."
          learnMoreURL="https://docs.yearn.finance/getting-started/products/yvaults/vault-tokens"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlightedText ref={ref} {...triggerHandler}>
              yvUSDC
            </HighlightedText>
          )}
        />
        . The vault reinvests the yield it earns back into the strategy,
        effectively compounding the yields for depositors over time.
      </>
    ),
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
    liquidityMining: {
      explanation: (
        <>
          ryvUSDC-ETH-P-THETA is a token that represents USDC deposits in the
          ETH Put Theta Vault (T-yvUSDC-P-ETH).
          <br />
          <br />
          Stake your ryvUSDC-ETH-P-THETA tokens in the ryvUSDC-ETH-P-THETA
          staking pool to earn $RBN rewards.
        </>
      ),
    },
  },
  "rstETH-THETA": {
    title: "T-stETH-C",
    subtitle: "stETH Covered Call",
    description:
      "Generates yield by running an automated stETH-collateralized ETH covered call strategy.",
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
            <HighlightedText ref={ref} {...triggerHandler}>
              covered call
            </HighlightedText>
          )}
        />{" "}
        strategy where it stakes its ETH deposits in{" "}
        <TooltipExplanation
          title="LIDO"
          explanation="Lido empowers stakers to put their staked assets to use. "
          learnMoreURL="https://lido.fi"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlightedText ref={ref} {...triggerHandler}>
              Lido
            </HighlightedText>
          )}
        />{" "}
        and then uses its{" "}
        <TooltipExplanation
          title="STETH"
          explanation="stETH is the deposit token that represents a user's share of the their ETH on the Ethereum beacon chain."
          learnMoreURL="https://lido.fi/ethereum"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlightedText ref={ref} {...triggerHandler}>
              stETH
            </HighlightedText>
          )}
        />{" "}
        to collateralize weekly out-of-money ETH call options. The yield earned
        from both the covered call strategy and the ETH staking rewards are
        reinvested weekly, effectively compounding the yields for depositors
        over time.
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
            <HighlightedText ref={ref} {...triggerHandler}>
              in-the-money
            </HighlightedText>
          )}
        />{" "}
        (meaning the price of ETH is above the strike price of the call options
        minted by the vault).
      </>
    ),
    liquidityMining: {
      explanation: (
        <>
          rstETH-THETA is a token that represents ETH deposits in the ETH Theta
          Vault (T-stETH-THETA).
          <br />
          <br />
          Stake your rstETH-THETA tokens in the rstETH-THETA staking pool to
          earn $RBN rewards.
        </>
      ),
    },
  },
  "rAAVE-THETA": {
    title: "T-AAVE-C",
    subtitle: "AAVE Covered Call",
    description:
      "Generates yield by running an automated AAVE covered call strategy.",
    tags: ["COVERED CALL"],
    strategy: (
      <>
        The vault earns yield on its AAVE deposits by running a weekly automated
        AAVE{" "}
        <TooltipExplanation
          title="COVERED CALL"
          explanation="A covered call refers to a financial transaction in which the investor selling call options owns an equivalent amount of the underlying security."
          learnMoreURL="https://www.investopedia.com/terms/c/coveredcall.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlightedText ref={ref} {...triggerHandler}>
              covered call
            </HighlightedText>
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
    liquidityMining: {
      explanation: (
        <>
          rAAVE-THETA is a token that represents AAVE deposits in the AAVE Theta
          Vault (T-AAVE-C).
          <br />
          <br />
          Stake your rAAVE-THETA tokens in the rAAVE-THETA staking pool to earn
          $RBN rewards.
        </>
      ),
    },
  },
  "rAVAX-THETA": {
    title: "T-AVAX-C",
    subtitle: "AVAX Call",
    description:
      "Generates yield by running an automated AVAX covered call strategy.",
    tags: ["COVERED CALL"],
    strategy: (
      <>
        The vault earns yield on its AVAX deposits by running a weekly automated
        AVAX{" "}
        <TooltipExplanation
          title="COVERED CALL"
          explanation="A covered call refers to a financial transaction in which the investor selling call options owns an equivalent amount of the underlying security."
          learnMoreURL="https://www.investopedia.com/terms/c/coveredcall.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlightedText ref={ref} {...triggerHandler}>
              covered call
            </HighlightedText>
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
    liquidityMining: {
      explanation: (
        <>
          rAVAX-THETA is a token that represents AVAX deposits in the AVAX Theta
          Vault (T-AVAX-C).
          <br />
          <br />
          Stake your rAVAX-THETA tokens in the rAVAX-THETA staking pool to earn
          $RBN rewards.
        </>
      ),
    },
  },
  "rsAVAX-THETA": {
    title: "T-sAVAX-C",
    subtitle: "sAVAX Call",
    description:
      "Generates yield by running an automated sAVAX covered call strategy.",
    tags: ["COVERED CALL"],
    strategy: (
      <>
        The vault earns yield on its sAVAX deposits by running a weekly
        automated AVAX{" "}
        <TooltipExplanation
          title="COVERED CALL"
          explanation="A covered call refers to a financial transaction in which the investor selling call options owns an equivalent amount of the underlying security."
          learnMoreURL="https://www.investopedia.com/terms/c/coveredcall.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlightedText ref={ref} {...triggerHandler}>
              covered call
            </HighlightedText>
          )}
        />{" "}
        strategy where it stakes its AVAX deposits in{" "}
        <TooltipExplanation
          title="BENQI"
          explanation="BENQI is a decentralized non-custodial liquidity market protocol on Avalanche, enabling users to effortlessly lend, borrow, and earn interest with their assets."
          learnMoreURL="https://benqi.fi"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlightedText ref={ref} {...triggerHandler}>
              BENQI
            </HighlightedText>
          )}
        />{" "}
        and then uses its{" "}
        <TooltipExplanation
          title="SAVAX"
          explanation="sAVAX is the deposit token that represents a user's share of the their AVAX on the Avalanche blockchain."
          learnMoreURL="https://staking.benqi.fi/stake"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlightedText ref={ref} {...triggerHandler}>
              sAVAX
            </HighlightedText>
          )}
        />{" "}
        to collateralize weekly out-of-money AVAX call options. The yield earned
        from both the covered call strategy and the AVAX staking rewards are
        reinvested weekly, effectively compounding the yields for depositors
        over time.
      </>
    ),
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
    liquidityMining: {
      explanation: (
        <>
          rsAVAX-THETA is a token that represents sAVAX deposits in the sAVAX
          Theta Vault (T-sAVAX-C).
          <br />
          <br />
          Stake your rsAVAX-THETA tokens in the rsAVAX-THETA staking pool to
          earn $RBN rewards.
        </>
      ),
    },
  },
  "rUSDC-AVAX-P-THETA": {
    title: "T-USDC-P-AVAX",
    subtitle: "AVAX Put-Selling",
    description:
      "Generates yield by running an automated USDC-collateralized AVAX put selling strategy.",
    tags: ["PUT-SELLING"],
    strategy: (
      <>
        T-USDC-P-AVAX earns yield on its USDC.e deposits by running a weekly
        automated AVAX{" "}
        <TooltipExplanation
          title="PUT OPTION"
          explanation="A put option is a derivative instrument which gives the holder the right to sell an asset, at a specified price, by a specified date to the writer of the put."
          learnMoreURL="https://www.investopedia.com/terms/p/putoption.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlightedText ref={ref} {...triggerHandler}>
              put-selling
            </HighlightedText>
          )}
        />{" "}
        strategy, where the put options are collateralized by USDC.e.
      </>
    ),
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
    liquidityMining: {
      explanation: (
        <>
          rUSDC-AVAX-P-THETA is a token that represents USDC deposits in the
          AVAX Put Theta Vault (T-USDC-P-AVAX).
          <br />
          <br />
          Stake your rUSDC-AVAX-P-THETA tokens in the rUSDC-AVAX-P-THETA staking
          pool to earn $RBN rewards.
        </>
      ),
    },
  },
  "rPERP-TSRY": {
    title: "T-PERP-C",
    subtitle: "PERP Call",
    description:
      "Generates yield by running an automated PERP covered call strategy.",
    tags: ["COVERED CALL"],
    strategy: "",
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
    liquidityMining: {
      explanation: <></>,
    },
  },
  "rSOL-THETA": {
    title: "T-SOL-C",
    subtitle: "SOL Covered Call",
    description:
      "Generates yield by running an automated SOL covered call strategy.",
    tags: ["COVERED CALL"],
    strategy: (
      <>
        The vault earns yield on its SOL deposits by running a weekly automated
        SOL{" "}
        <TooltipExplanation
          title="COVERED CALL"
          explanation="A covered call refers to a financial transaction in which the investor selling call options owns an equivalent amount of the underlying security."
          learnMoreURL="https://www.investopedia.com/terms/c/coveredcall.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlightedText ref={ref} {...triggerHandler}>
              covered call
            </HighlightedText>
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
    liquidityMining: {
      explanation: (
        <>
          rSOL-THETA is a token that represents SOL deposits in the SOL Theta
          Vault (T-SOL-C).
          <br />
          <br />
          Stake your rSOL-THETA tokens in the rSOL-THETA staking pool to earn
          $RBN rewards.
        </>
      ),
    },
  },
  "rNEAR-THETA": {
    title: "T-WNEAR-C",
    subtitle: "WNEAR Call",
    description:
      "Generates yield by running an automated WNEAR covered call strategy.",
    tags: ["COVERED CALL"],
    strategy: (
      <>
        The vault earns yield on its WNEAR deposits by running a weekly
        automated WNEAR{" "}
        <TooltipExplanation
          title="COVERED CALL"
          explanation="A covered call refers to a financial transaction in which the investor selling call options owns an equivalent amount of the underlying security."
          learnMoreURL="https://www.investopedia.com/terms/c/coveredcall.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlightedText ref={ref} {...triggerHandler}>
              covered call
            </HighlightedText>
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
    liquidityMining: {
      explanation: (
        <>
          rNEAR-THETA is a token that represents WNEAR deposits in the WNEAR
          Theta Vault (T-WNEAR-C).
          <br />
          <br />
          Stake your rNEAR-THETA tokens in the rNEAR-THETA staking pool to earn
          $RBN rewards.
        </>
      ),
    },
  },
  "rAURORA-THETA": {
    title: "T-AURORA-C",
    subtitle: "AURORACall",
    description:
      "Generates yield by running an automated AURORA covered call strategy.",
    tags: ["COVERED CALL"],
    strategy: (
      <>
        The vault earns yield on its AURORA by running a weekly automated AURORA{" "}
        <TooltipExplanation
          title="COVERED CALL"
          explanation="A covered call refers to a financial transaction in which the investor selling call options owns an equivalent amount of the underlying security."
          learnMoreURL="https://www.investopedia.com/terms/c/coveredcall.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlightedText ref={ref} {...triggerHandler}>
              covered call
            </HighlightedText>
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
    liquidityMining: {
      explanation: (
        <>
          rAURORA-THETA is a token that represents AURORA deposits in the AURORA
          Theta Vault (T-AURORA-C).
          <br />
          <br />
          Stake your rAURORA-THETA tokens in the rAURORA-THETA staking pool to
          earn $RBN rewards.
        </>
      ),
    },
  },
};
