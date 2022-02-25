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
  strategy: React.ReactNode;
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
  },
  "rBTC-THETA": {
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
  },
  "rUSDC-ETH-P-THETA": {
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
  },
  "ryvUSDC-ETH-P-THETA": {
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
  },
  "rstETH-THETA": {
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
  },
  "rAAVE-THETA": {
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
  },
  "rAVAX-THETA": {
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
  },
  "rsAVAX-THETA": {
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
  },
  "rUSDC-AVAX-P-THETA": {
    tags: ["PUT-SELLING"],
    strategy: (
      <>
        T-USDC-P-AVAX earns yield on its USDC deposits by running a weekly
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
        strategy, where the put options are collateralized by USDC.
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
  },
  "rPERP-TSRY": {
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
  },
  "rSOL-THETA": {
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
  },
  "rNEAR-THETA": {
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
  },
  "rAURORA-THETA": {
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
  },
};
