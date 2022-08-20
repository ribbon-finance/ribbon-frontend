import styled from "styled-components";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import { Title, SecondaryText, PrimaryText } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import { ExternalIcon } from "shared/lib/assets/icons/icons";
import { useAirtable } from "shared/lib/hooks/useAirtable";
import currency from "currency.js";
const ExplainerTitle = styled.div<{ color: string }>`
  display: flex;
  font-size: 12px;
  width: 100%;
  color: ${colors.tertiaryText};
  margin-top: 16px;
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

const StyledTitle = styled(Title)<{ marginTop: number }>`
  margin-top: ${(props) => props.marginTop}px;
`;

export const Strategy = () => {
  const { strikePrice, barrierPercentage, baseYield, maxYield } = useAirtable();
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
        protected. The vault uses the funding to purchase{" "}
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
        .
      </ParagraphText>
      <StyledTitle marginTop={24}>Key Conditions</StyledTitle>
      <ParagraphText marginTop={8}>
        The weekly barrier options enable the vault to participate in any ETH
        upside up to 108% of the ETH's spot level at the start of the week
        (upside barrier) and any ETH downside down to 92% of ETH's spot level at
        the start of the week (downside barrier). However, if the price of ETH
        increases or decreases by more than 8% during the week, the barrier
        options expire worthless and the vault earns the base APY only.
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
        108% ({currency(strikePrice * (1 + barrierPercentage)).format()})
      </StyledTitle>
      <ExplainerTitle color={colors.tertiaryText}>
        <span>Downside Barrier</span>
      </ExplainerTitle>
      <StyledTitle marginTop={4}>
        {" "}
        92% ({currency(strikePrice * (1 - barrierPercentage)).format()})
      </StyledTitle>
      <ExplainerTitle color={colors.tertiaryText}>
        <span>Strike</span>
      </ExplainerTitle>
      <StyledTitle marginTop={4}>
        100% ({currency(strikePrice).format()})
      </StyledTitle>{" "}
      <ExplainerTitle color={colors.tertiaryText}>
        <span>Capital Protection</span>
      </ExplainerTitle>
      <StyledTitle marginTop={4}>100%</StyledTitle>{" "}
      <ExplainerTitle color={colors.tertiaryText}>
        <span>Base APY</span>
      </ExplainerTitle>
      <StyledTitle marginTop={4}>{(baseYield * 100).toFixed(2)}%</StyledTitle>
      <ExplainerTitle color={colors.tertiaryText}>
        <span>Max APY</span>
      </ExplainerTitle>
      <StyledTitle marginTop={4}>{(maxYield * 100).toFixed(2)}%</StyledTitle>{" "}
      <ExplainerTitle color={colors.tertiaryText}>
        <span>Barrier Type</span>
      </ExplainerTitle>
      <StyledTitle marginTop={4}>European (Observed at Maturity)</StyledTitle>{" "}
      <ExplainerTitle color={colors.tertiaryText}>
        <span>TVL</span>
      </ExplainerTitle>
      <StyledTitle marginTop={4}>$25,000,000.00</StyledTitle>
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
          explanation={`An option is in-the-money (ITM) if the strike price is below or above
              the market price of ETH`}
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
      <StyledTitle marginTop={24}>Equity Upside Risk</StyledTitle>
      <ParagraphText marginTop={8}>
        During periods of high market volatility, where ETH gains or loses 8%
        during the week, the vault's knock-out options will expire{" "}
        <TooltipExplanation
          title="OUT-THE-MONEY"
          explanation={`An option is out-the-money (ITM) if the strike price is below or above
              the market price of ETH`}
          learnMoreURL="https://www.investopedia.com/terms/i/outthemoney.asp"
          renderContent={({ ref, ...triggerHandler }) => (
            <HighlightedText ref={ref} {...triggerHandler}>
              out-the-money
            </HighlightedText>
          )}
        />{" "}
        and users may not fully capture the downside/upside performance of the
        underlying asset due to the knock-out barriers.
      </ParagraphText>
      <StyledTitle marginTop={24}>Smart Contract Risk</StyledTitle>
      <ParagraphText marginTop={8}>
        The Ribbon Earn smart contracts have been{" "}
        <TooltipExplanation
          title="Veridise"
          explanation={`something something veridise`}
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
    </>
  );
};

export const HistoricalPerformance = () => {
  return (
    <>
      <ParagraphText>
        R-Earn was backtested since January 2021, and the cumulative yield over
        the period between January 1st, 2021 and July 22th, 2022 generated
        13.67%. The trade had a positive payout 51.25% of the time over the
        backtested period (assuming product was traded every Friday, assuming
        constant parameters).
      </ParagraphText>
      <PrimaryText className="d-block mt-3">
        <Link
          href="https://www.research.ribbon.finance/blog/theta-vault-backtest-results"
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
