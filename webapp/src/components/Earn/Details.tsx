import styled from "styled-components";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import { Title, SecondaryText, PrimaryText } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import { ExternalIcon } from "shared/lib/assets/icons/icons";
import { useAirtable } from "shared/lib/hooks/useAirtable";
import { SubgraphDataContext } from "shared/lib/hooks/subgraphDataContext";
import currency from "currency.js";
import { useContext, useMemo } from "react";
import { formatUnits } from "ethers/lib/utils";
import { BigNumber } from "ethers/lib/ethers";
import useLoadingText from "shared/lib/hooks/useLoadingText";
import HelpInfo from "shared/lib/components/Common/HelpInfo";
import { useV2VaultData } from "shared/lib/hooks/web3DataContext";
const ExplainerTitle = styled.div<{ color: string; marginTop?: number }>`
  display: flex;
  font-size: 12px;
  width: 100%;
  color: ${colors.tertiaryText};
  margin-top: ${(props) =>
    props.marginTop !== undefined ? `${props.marginTop}px` : `16px`};
`;

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

const ParagraphText = styled(SecondaryText)<{ marginTop?: number }>`
  color: ${colors.secondaryText};
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  margin-top: ${(props) => (props.marginTop ? `${props.marginTop}px` : `0px`)};
`;

const AnalysisContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledTitle = styled(Title)<{ marginTop: number }>`
  margin-top: ${(props) => props.marginTop}px;
`;

export const Strategy = () => {
  const {
    strikePrice,
    baseYield,
    maxYield,
    ethLowerBarrier,
    ethUpperBarrier,
    loading,
  } = useAirtable();

  const { vaultSubgraphData } = useContext(SubgraphDataContext);
  const {
    data: { allocationState },
    loading: v2DataLoading,
  } = useV2VaultData("rEARN");

  const loadingText = useLoadingText();
  const TVL = useMemo(() => {
    if (!vaultSubgraphData.vaults.earn.rEARN) {
      return BigNumber.from(0.0);
    }
    if (!vaultSubgraphData.vaults.earn.rEARN.totalNominalVolume) {
      return BigNumber.from(0.0);
    }
    return vaultSubgraphData.vaults.earn.rEARN.totalNominalVolume;
  }, [vaultSubgraphData.vaults.earn.rEARN]);
  return (
    <>
      <ParagraphText>
        The R-Earn vault employs a fully funded{" "}
        <TooltipExplanation
          title="TWIN WIN"
          explanation={`A Twin Win is a structured product where the investor can win if the underlying asset goes in either direction up to a specific level. It is similar to a straddle (call + put option) with additional barriers which limit the exposure on both sides.`}
          learnMoreURL="https://bookdown.org/maxime_debellefroid/MyBook/certificates.html#twin-win-certificates"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlightedText ref={ref} {...triggerHandler}>
              twin win
            </HighlightedText>
          )}
        />{" "}
        strategy through which depositors can capitalise on the intra-week ETH
        movements in either direction while also ensuring their capital is
        protected. The vault earns a base APY and uses the remaining funding to
        purchase{" "}
        <TooltipExplanation
          title="weekly at-the-money knock-out barrier options"
          explanation={`The options bought are expiring every Friday, with a one week maturity and the strike price is set to the current underlying asset price. The knock-out barriers are used to define when the payoff is inactive, i.e. if the price of the underlying asset at maturity is below the lower barrier or greater than the upper barrier, the option is worthless.`}
          learnMoreURL="https://bookdown.org/maxime_debellefroid/MyBook/barrier-options.html#knock-out-options"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlightedText ref={ref} {...triggerHandler}>
              weekly at-the-money knock-out barrier options
            </HighlightedText>
          )}
        />
        . As the epoch of the vault is one month but the options purchased are
        weekly options, 4 options are purchased within one epoch.
      </ParagraphText>
      <StyledTitle marginTop={24}>Key Conditions</StyledTitle>
      <ParagraphText marginTop={8}>
        The weekly barrier options enable the vault to participate in any ETH
        upside up to 108% of the ETH's spot level at the start of the week
        (upside barrier) and any ETH downside down to 92% of ETH's spot level at
        the start of the week (downside barrier). However, if the price of ETH
        has increased or decreased by more than 8% at the end of the week, the
        barrier options expire worthless and the vault earns the base APY only.
      </ParagraphText>
      <StyledTitle marginTop={24}>Vault Specifications</StyledTitle>
      <ExplainerTitle color={colors.tertiaryText}>
        <span>Loan Tenor</span>
      </ExplainerTitle>
      <StyledTitle marginTop={4}> 28 DAYS</StyledTitle>
      <ExplainerTitle color={colors.tertiaryText}>
        <span>Option Tenor</span>
      </ExplainerTitle>
      <StyledTitle marginTop={4}> 7 DAYS</StyledTitle>
      <ExplainerTitle color={colors.tertiaryText}>
        <span>Upside Barrier</span>
      </ExplainerTitle>
      <StyledTitle marginTop={4}>
        {loading ? loadingText : `108% (${currency(ethUpperBarrier).format()})`}
      </StyledTitle>
      <ExplainerTitle color={colors.tertiaryText}>
        <span>Downside Barrier</span>
      </ExplainerTitle>
      <StyledTitle marginTop={4}>
        {loading ? loadingText : `92% (${currency(ethLowerBarrier).format()})`}
      </StyledTitle>
      <ExplainerTitle color={colors.tertiaryText}>
        <span>Strike</span>
      </ExplainerTitle>
      <StyledTitle marginTop={4}>
        {loading ? loadingText : `100% (${currency(strikePrice).format()})`}
      </StyledTitle>{" "}
      <ExplainerTitle color={colors.tertiaryText}>
        <span>Capital Protection</span>
      </ExplainerTitle>
      <StyledTitle marginTop={4}>100%</StyledTitle>{" "}
      <ExplainerTitle color={colors.tertiaryText}>
        <span>Base APY</span>
      </ExplainerTitle>
      <StyledTitle marginTop={4}>
        {loading ? loadingText : `${(baseYield * 100).toFixed(2)}%`}
      </StyledTitle>
      <ExplainerTitle color={colors.tertiaryText}>
        <span>Max APY</span>
      </ExplainerTitle>
      <StyledTitle marginTop={4}>
        {loading ? loadingText : `${(maxYield * 100).toFixed(2)}%`}
      </StyledTitle>{" "}
      <ExplainerTitle color={colors.tertiaryText}>
        <span>Barrier Type</span>
      </ExplainerTitle>
      <StyledTitle marginTop={4}>European (Observed at Maturity)</StyledTitle>
      <ExplainerTitle color={colors.tertiaryText}>
        <span>Loan Allocation</span>
      </ExplainerTitle>
      {/* querying loanAllocationPCT seems to give the wrong value so we use constant here*/}
      <StyledTitle marginTop={4}>99.56%</StyledTitle>
      <ExplainerTitle color={colors.tertiaryText}>
        <span>Options Allocation</span>
      </ExplainerTitle>
      <StyledTitle marginTop={4}>
        0.44%
        {/* {v2DataLoading
          ? loadingText
          : `${(allocationState.optionAllocationPCT / 10000).toFixed(2)}%`} */}
      </StyledTitle>
      <ExplainerTitle color={colors.tertiaryText}>
        <span>TVL</span>
      </ExplainerTitle>
      <StyledTitle marginTop={4}>
        {<>${parseFloat(formatUnits(TVL, "6")).toFixed(2)}</>}
      </StyledTitle>
    </>
  );
};

export const Risk = () => {
  return (
    <>
      <Title>Credit Risk</Title>
      <ParagraphText marginTop={8}>
        Market makers taking the other side of Ribbon Earn trades carry credit
        risk and could potentially default in the case of extreme events. This
        means that both the principal and yield invested could be lost in the
        event of market makers defaulting. Ribbon works with accredited market
        makers who have a history of credit worthiness in order to minimize the
        risk of default for retail investors.
      </ParagraphText>
      <StyledTitle marginTop={24}>Counterparty Risk</StyledTitle>
      <ParagraphText marginTop={8}>
        In the situation that the knock-out options expire{" "}
        <TooltipExplanation
          title="IN-THE-MONEY"
          explanation={`The option payout will be positive as the underlying spot is within the barriers range and as such, a bonus coupon will be paid.`}
          learnMoreURL="https://www.investopedia.com/terms/i/inthemoney.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlightedText ref={ref} {...triggerHandler}>
              in-the-money
            </HighlightedText>
          )}
        />{" "}
        sellers of the knock-out options structure may be unable to fulfill part
        of their obligations to the vault.
      </ParagraphText>
      <StyledTitle marginTop={24}>Smart Contract Risk</StyledTitle>
      <ParagraphText marginTop={8}>
        The Ribbon Earn smart contracts have been{" "}
        <TooltipExplanation
          title="Veridise"
          explanation={`Hardening Blockchain Security with Formal Methods`}
          learnMoreURL="https://www.veridise.com/"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlightedText ref={ref} {...triggerHandler}>
              audited by Veridise
            </HighlightedText>
          )}
        />
        . Despite that, users are advised to exercise caution and only risk
        funds they can afford to lose.
      </ParagraphText>
      <StyledTitle marginTop={24}>Network Risk</StyledTitle>
      <ParagraphText marginTop={8}>
        You are aware of and accept the network risks. We are not responsible
        for any losses due to any technical issue arising from the Ethereum
        blockchain, ancillary features, plugins or wallets, including but not
        limited to late reports by developers or representatives (or no report
        at all) of any issues with the Ethereum blockchain, including forks,
        technical node issues, or any other issues resulting on a loss of funds.
      </ParagraphText>
      <StyledTitle marginTop={24}>Deposit Risk</StyledTitle>
      <ParagraphText marginTop={8}>
        You are aware of and accept that the USDC held in your the Vault on your
        behalf is not subject to deposit insurance protection, investor
        insurance protection, or any other relevant protection in any
        jurisdiction.
      </ParagraphText>
      <StyledTitle marginTop={24}>USDC Risk</StyledTitle>
      <ParagraphText marginTop={8}>
        You are aware of and accept the risk of using USDC in ribbon.finance. We
        are not responsible for any losses due to any actions performed by the
        USDC Issuer (Circle Internet Financial, LLC.) At any point in time, the
        Issuer may, with or without notice, at its sole discretion, "block" this
        Vault Smart Contract address, associated addresses or your address. USDC
        may be permanently frozen, resulting in a loss of funds.
      </ParagraphText>
    </>
  );
};

export const Backtest = () => {
  return (
    <>
      <ParagraphText>
        R-Earn was{" "}
        <TooltipExplanation
          explanation={
            "Source: Ribbon Finance, as of 17 Aug 2022. Data from 01/01/2021 to 12/08/2022. Backtesting analysis for illustrative purposes only. Ribbon Finance provides no assurance or guarantee that the strategy will operate or would have operated in the past in a manner consistent with the above backtesting analysis. Backtest and/or past performance figures are not a reliable indicator of future results. All data backtested over the entire range. The backtest period is going back to Jan21 only due to lack of options data prior to this date."
          }
          maxWidth={350}
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlightedText ref={ref} {...triggerHandler}>
              backtested
            </HighlightedText>
          )}
        />{" "}
        since January 2021, and the cumulative yield over the period between
        January 1st, 2021 and August 18th, 2022 generated 17.23%, corresponding
        to a realized APY of 10.37%. The vault earned more than the base coupon
        51.80% of the time, and the option payoff was 4.05% on average in these
        cases, corresponding to 12% bonus APY in addition to the 4% base APY.
      </ParagraphText>
      <PrimaryText className="d-block mt-3">
        <Link
          href="https://www.research.ribbon.finance/blog/introducing-ribbon-earn"
          target="_blank"
          rel="noreferrer noopener"
          className="d-flex"
        >
          <span className="mr-2">Read More</span>
          <ExternalIcon color="white" />
        </Link>
      </PrimaryText>
    </>
  );
};

export const Analysis = () => {
  const { itmPerformance, loading } = useAirtable();
  const loadingText = useLoadingText();
  const { vaultSubgraphData } = useContext(SubgraphDataContext);
  const [numberOfHits, optionsTraded] = useMemo(() => {
    if (!vaultSubgraphData.vaults.earn.rEARN) {
      return [0, 0];
    }
    if (
      !vaultSubgraphData.vaults.earn.rEARN.numberOfHits ||
      !vaultSubgraphData.vaults.earn.rEARN.optionsTraded
    ) {
      return [0, 0];
    }
    return [
      vaultSubgraphData.vaults.earn.rEARN.numberOfHits,
      vaultSubgraphData.vaults.earn.rEARN.optionsTraded,
    ];
  }, [vaultSubgraphData.vaults.earn.rEARN]);

  return (
    <AnalysisContainer>
      <ExplainerTitle marginTop={0} color={colors.tertiaryText}>
        <span>Hit Ratio</span>
        <TooltipExplanation
          title="HIT RATIO"
          explanation="The ratio of options trades expiring in-the-money over the total number of options traded."
          renderContent={({ ref, ...triggerHandler }) => (
            <HelpInfo containerRef={ref} {...triggerHandler}>
              i
            </HelpInfo>
          )}
        />
      </ExplainerTitle>
      <StyledTitle marginTop={4}>
        {" "}
        {numberOfHits} / {optionsTraded - 1}
      </StyledTitle>
      <ExplainerTitle color={colors.tertiaryText}>
        <span>Options Traded</span>{" "}
        <TooltipExplanation
          title="OPTIONS TRADED"
          explanation="The number of option trades executed by the vault since inception."
          renderContent={({ ref, ...triggerHandler }) => (
            <HelpInfo containerRef={ref} {...triggerHandler}>
              i
            </HelpInfo>
          )}
        />
      </ExplainerTitle>
      <StyledTitle marginTop={4}> {optionsTraded}</StyledTitle>
      <ExplainerTitle color={colors.tertiaryText}>
        <span>Absolute Performance when ITM</span>
        <TooltipExplanation
          title="ABSOLUTE PERFORMANCE WHEN ITM"
          explanation="The average absolute percentage underlying move when options expire in-the-money."
          renderContent={({ ref, ...triggerHandler }) => (
            <HelpInfo containerRef={ref} {...triggerHandler}>
              i
            </HelpInfo>
          )}
        />
      </ExplainerTitle>
      <StyledTitle marginTop={4}>
        {loading ? loadingText : `${(itmPerformance * 100).toFixed(2)}%`}{" "}
      </StyledTitle>
    </AnalysisContainer>
  );
};
