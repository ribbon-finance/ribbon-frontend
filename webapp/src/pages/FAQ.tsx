import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import styled from "styled-components";
import { PrimaryText, SecondaryText, Title } from "../designSystem";

const FAQTitle = styled(Title)`
  font-size: 24px;
  line-height: 32px;
  margin-top: 48px;
`;

const SectionTitle = styled(Title)`
  font-size: 18px;
  line-height: 24px;
  text-transform: uppercase;
  margin-top: 48px;
  margin-bottom: 24px;
`;

const SectionQuestion = styled(PrimaryText)`
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const SectionAnswer = styled(SecondaryText)`
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.64);
  margin-bottom: 24px;
`;

const Link = styled.a`
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.64);
  text-decoration: underline;
`;

const sections = [
  {
    sectionName: "",
    questions: [
      {
        question: "What is Ribbon Finance?",
        answer:
          "Ribbon Finance is a new protocol that creates crypto structured products for DeFi.",
      },
      {
        question: "Does Ribbon have a token?",
        answer:
          "No, we do not have a token. We are aware that there are scammers that have created fake Ribbon tokens and are actively distributing them on DEXes. Do not buy them.",
      },
      {
        question: "What are structured products?",
        answer:
          "Structured products are packaged financial instruments that use a combination of derivatives to achieve some specific risk-return objective, such as betting on volatility, enhancing yields or principal protection.",
      },
      {
        question: "What kinds of structured products does Ribbon have?",
        answer:
          "Ribbon currently offers a high yield product on ETH which generates yield through an automated option strategy. Ribbon will continue to expand the product offerings over time, including community-generated structured products.",
      },
      {
        question: "What is the Theta Vault?",
        answer: (
          <span>
            <p>
              Theta Vault is a new product that automates a covered call
              strategy to earn high yield on ETH. The vault runs a covered call
              strategy and sells out of the money call options on a weekly basis
              for yield. You can read more about the strategy{" "}
              <Link
                href="https://ribbon.finance/theta-vault/T-100-E"
                target="_blank"
              >
                here.
              </Link>
            </p>
          </span>
        ),
      },
      {
        question: "What Options Protocol does the Theta Vault use?",
        answer:
          "Theta Vault currently uses Opyn's infrastructure to mint and trade the options tokens on-chain. We chose Opyn because the protocol lets us create tokenized ETH options with custom parameters out of the box. This allows us to be flexible on the choice of strikes, expiries, and exchange method. ",
      },
      {
        question: "What is the expected yield for the Theta Vault?",
        answer: (
          <span>
            <p>
              The yield is variable, but we expect it to be in the 20-30% range.
              We performed a backtest on the strategy throughout 2020 and 2021,
              and you can see the results{" "}
              <Link
                href="https://ribbonfinance.medium.com/theta-vault-backtest-results-6e8c59adf38c"
                target="_blank"
              >
                here.
              </Link>
            </p>
            <p>
              The yield in production will likely be lower due to transaction
              costs and so on, but we can expect something in the double-digit
              APY range.
            </p>
          </span>
        ),
      },
      {
        question: "What are the risks of the Theta Vault?",
        answer: (
          <span>
            <p>
              The primary risk for running this strategy is that depositors
              could potentially give up upside in exchange for guaranteed yield.
              By selling a call option, users are basically promising to sell
              the asset at the strike price, even if it goes above it (a.k.a
              selling early). Because of this, if the price of the asset moves
              up significantly in a short period of time, it is possible for
              depositors to have "negative yield" on their ETH.
            </p>
            <p>
              However, this only happens if ETH/USD appreciates significantly,
              so depositors will still be up in USD terms. The vault also sells
              call options that are very out of the money, which means there is
              a relatively low chance of the options getting exercised.
            </p>
            <p>
              The smart contracts are{" "}
              <Link
                href="https://github.com/peckshield/publications/blob/master/audit_reports/PeckShield-Audit-Report-Ribbon-v1.0.pdf"
                target="_blank"
              >
                audited by Peckshield
              </Link>
              . Despite that, users are advised to exercise caution and only
              risk funds they can afford to lose.{" "}
            </p>
          </span>
        ),
      },
    ],
  },
];

const FAQPage = () => {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col
          xs={11}
          sm={10}
          md={9}
          lg={8}
          xl={7}
          className="d-flex flex-column"
        >
          <FAQTitle>Frequently Asked Questions</FAQTitle>
          {sections.map((section) => (
            <>
              <SectionTitle>{section.sectionName}</SectionTitle>
              {section.questions.map((question) => (
                <>
                  <SectionQuestion>{question.question}</SectionQuestion>
                  <SectionAnswer>{question.answer}</SectionAnswer>
                </>
              ))}
            </>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default FAQPage;
