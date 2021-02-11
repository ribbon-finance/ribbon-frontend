import React from "react";
import styled from "styled-components";
import { PrimaryMedium } from "../../designSystem";

const H1 = styled(PrimaryMedium)`
  font-size: 50px;
`;

const H2 = styled(PrimaryMedium)`
  font-size: 30px;
`;

const QuestionText = styled.p`
  margin-bottom: 0.5em;
  font-weight: 600;
`;

const AnswerText = styled.p`
  margin-bottom: 2em;
`;

const Anchor = styled.a`
  color: blue;
`;

const sections = [
  {
    sectionName: "Overview",
    questions: [
      {
        question: "What is Ribbon Finance?",
        answer:
          "Ribbon Finance is a new protocol that creates crypto structured products for DeFi.",
      },
      {
        question: "What are structured products?",
        answer:
          "Structured products are packaged financial instruments that use a combination of derivatives to achieve some specific risk-return objective, such as betting on volatility, enhancing yields or principal protection.",
      },
      {
        question: "What kinds of structured products does Ribbon have?",
        answer:
          "Ribbon currently offers an ETH Strangle, which is a way for investors to bet on the volatility on ETH. We plan to release products in 4 different categories - volatility, yield enhancement, principal protection and accumulation.",
      },
      {
        question: "What is a “strangle”?",
        answer: (
          <span>
            A{" "}
            <Anchor href="https://en.wikipedia.org/wiki/Strangle_(options)">
              strangle
            </Anchor>{" "}
            is an options strategy in which the investor holds a call and a put
            position at different strike prices. A strangle is a good strategy
            if you think the underlying asset will experience a large price
            movement in the near future, but are unsure of the direction.
          </span>
        ),
      },
      {
        question: "How are the products structured?",
        answer:
          "The products are structured by combining multiple derivatives on-chain. For example, the ETH Strangle product combines a put and a call option from Hegic and Opyn. Ribbon plans to integrate with more options protocols over time. ",
      },
    ],
  },
  {
    sectionName: "Trading",
    questions: [
      {
        question: "How are Strangle contracts priced?",
        answer:
          "Each Strangle contract will have 1 underlying call option and 1 underlying put option. The total cost of 1 contract is the sum of the call option’s premium and the put option’s premium on the underlying venues (Hegic or Opyn).",
      },
      {
        question: "Where do Strangle contracts trade?",
        answer:
          "Currently Strangle contracts are only traded on Ribbon. We do not tokenize the Strangle positions yet, so they are not tradable on a secondary exchange such as Uniswap.",
      },
      {
        question: "How do I know I am getting the best price for a Strangle?",
        answer:
          "Ribbon finds the cheapest price for each option on-chain, for the position size that you are trying to trade. Before you checkout, the Ribbon UI will show you the prices of the underlying call and put options.",
      },
      {
        question: "How can I exercise my Strangle positions?",
        answer:
          "You can access and exercise your positions at the Positions page. Generally positions that have call or put options which are in-the-money can be exercised. Due to the differences in how the underlying options protocols work, some positions can only be exercised after expiry, whereas others can be exercised only before the expiry.",
      },
    ],
  },
  {
    sectionName: "Under the Hood",
    questions: [
      {
        question: "Does Ribbon have a token?",
        answer:
          "No, we do not have a token. We are aware that there are scammers that have created fake Ribbon tokens and are actively distributing them on DEXes. Do not buy them.",
      },
      {
        question: "What is the security of Ribbon’s smart contracts?",
        answer:
          "Our v1 Solidity contracts are not audited yet, and as such must be treated as alpha software. Users are encouraged to only risk funds that they are willing to lose. The v1 contracts do not hold any significant amount of cash, but holds the underlying options positions on behalf of the user. Therefore, there is a risk that users will lose their positions in the event of a hack.",
      },
      {
        question: "Does the protocol have any privileged roles?",
        answer: (
          <span>
            The protocol currently has a few privileged roles.
            <br />
            <ul>
              <li>
                Owner: Able to create new instruments in the factory contract,
                add new options protocol adapters.
              </li>
              <li>
                Upgrade Admin: Able to upgrade proxy contracts to use a new
                implementation contract
              </li>
            </ul>
            Both of these roles are managed by a Gnosis Safe multisig address.
          </span>
        ),
      },
      {
        question: "Help! I need help to do a trade.",
        answer: (
          <span>
            Reach out to us on{" "}
            <Anchor href="https://discord.gg/85gcVafPyN">Discord</Anchor>, we'll
            help you out.
          </span>
        ),
      },
    ],
  },
];

const FAQPage = () => {
  return (
    <div>
      <div style={{ marginBottom: 30 }}>
        <H1>FAQ</H1>
      </div>

      {sections.map(({ sectionName, questions }) => {
        return (
          <>
            <div style={{ marginTop: 50, marginBottom: 20 }}>
              <H2>{sectionName}</H2>
            </div>

            {questions.map(({ question, answer }) => (
              <div>
                <QuestionText>{question}</QuestionText>
                <AnswerText>{answer}</AnswerText>
              </div>
            ))}
          </>
        );
      })}
    </div>
  );
};
export default FAQPage;
