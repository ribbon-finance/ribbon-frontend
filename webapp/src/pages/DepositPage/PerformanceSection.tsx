import React from "react";
import styled from "styled-components";
import PerformanceChart from "../../components/PerformanceChart/PerformanceChart";
import { PrimaryText, SecondaryText, Title } from "../../designSystem";
import sizes from "../../designSystem/sizes";

const Paragraph = styled.div`
  margin-bottom: 48px;
`;

const ParagraphHeading = styled(Title)`
  display: block;
  font-size: 18px;
  line-height: 24px;
  margin-bottom: 16px;
`;

const ParagraphText = styled(SecondaryText)`
  color: rgba(255, 255, 255, 0.64);
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
`;

const LinkIcon = styled.i`
  width: 24px;
  height: 24px;
`;

const Link = styled.a`
  color: rgba(255, 255, 255, 0.8);
  text-decoration: underline;

  &:hover {
    color: rgba(255, 255, 255, 0.8);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: ${sizes.md}px) {
    & > div:nth-child(2) {
      order: 1;
    }
    & > div:nth-child(1) {
      order: 2;
    }
    & > div:nth-child(3) {
      order: 3;
    }
    & > div:nth-child(4) {
      order: 4;
    }
  }
`;

const PerformanceSection = () => {
  return (
    <Container className="col-xl-7 col-md-6">
      <Paragraph>
        <ParagraphHeading>Vault Strategy</ParagraphHeading>
        <ParagraphText>
          This vault earns yield on ETH through running an automated{" "}
          <Link href="https://www.investopedia.com/terms/c/coveredcall.asp">
            covered call
          </Link>{" "}
          strategy. Put simply, the vault sells <i>potential upside</i> in
          exchange for high yield.
          <p />
          The vault generates yield by writing out-of-the-money call options on
          ETH on a weekly basis and selling the options to market makers in
          exchange for premiums. The vault repeats this process on a weekly
          basis and reinvests the premiums, effectively compounding the yields
          for depositors over time.
          <p />
          The vault has a <b>manager</b> who selects the strike prices for the
          call options that the vault writes. This manager is responsible for
          making the best tradeoff between yield vs risk of the call options
          getting exercised.
        </ParagraphText>
      </Paragraph>

      <Paragraph>
        <ParagraphHeading>Vault Performance</ParagraphHeading>
        <PerformanceChart></PerformanceChart>
      </Paragraph>

      <Paragraph>
        <ParagraphHeading>Withdrawal Fee - 0.5%</ParagraphHeading>
        <ParagraphText>
          Withdrawing from the vault has a fixed withdrawal fee of 0.5%. This is
          to encourage longer-term depositors.
        </ParagraphText>
      </Paragraph>

      <Paragraph>
        <ParagraphHeading>Risk</ParagraphHeading>
        <ParagraphText>
          The primary risk for running this covered call strategy is that
          depositors could potentially give up upside in exchange for guaranteed
          yield. This only happens when the call options get exercised, which
          should happen less than 3% of the time. In such a situation,
          depositors can still expect to be up significantly in USD terms.
        </ParagraphText>

        <PrimaryText className="d-block mt-3">
          <Link
            href="https://ribbonfinance.medium.com/theta-vault-backtest-results-6e8c59adf38c"
            target="_blank"
            rel="noreferrer noopener"
          >
            <span className="mr-2">Read More</span>
            <LinkIcon className="fas fa-external-link-alt"></LinkIcon>
          </Link>
        </PrimaryText>
      </Paragraph>
    </Container>
  );
};

export default PerformanceSection;
