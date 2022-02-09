import colors from "shared/lib/designSystem/colors";
import BaseAccordion from "shared/lib/components/Common/BaseAccordion";
import { Header, FAQBody, Section } from "./common";

const VERBNSection = () => {
  return (
    <Section>
      <Header normalCased color={colors.red}>
        veRBN
      </Header>
      <BaseAccordion
        items={[
          {
            header: "What is veRBN?",
            body: (
              <FAQBody>
                Vote-escrowed RBN, or veRBN, is an ERC-20 token that is required
                to participate in Ribbon governance - it is a measure of a RBN
                holder’s voting power. veRBN is used to vote on governance
                proposals and vault incentives. veRBN is also required to
                propose new governance proposals.
              </FAQBody>
            ),
          },
          {
            header: "How do I obtain veRBN?",
            body: (
              <FAQBody>
                In order to obtain veRBN, you must lock up your RBN. The amount
                of veRBN you receive depends on (i) the percentage of your RBN
                balance that you decide to lock and (ii) the amount of time you
                decide to lock your RBN for (also known as the lockup period).
                You can lock your tokens for a maximum of 1 year and a minimum
                of 1 week. Your veRBN balance decreases linearly as the
                remaining time until your RBN lockup expiry decreases. At the
                end of your lockup period your veRBN balance will be zero.
                <br />
                <br />
                <b>Example A</b>: If Alice has 100 RBN and locks up 100 RBN for
                1 year, she will receive 100 veRBN.
                <br />
                <br />
                <b>Example B</b>: If Bob has 100 RBN and locks up 50 RBN for 1
                year, he will receive 50 veRBN.
                <br />
                <br />
                <b>Example C</b>: If Charlie has 100 RBN and locks up 100 RBN
                for 6 months, she will receive 50 veRBN.
              </FAQBody>
            ),
          },
          {
            header: "Is veRBN transferable?",
            body: <FAQBody>No, veRBN is non-transferrable.</FAQBody>,
          },
          {
            header: "When can I unlock my RBN?",
            body: (
              <FAQBody>
                You can unlock your RBN once your lockup period ends. At this
                point your veRBN balance will be zero.
              </FAQBody>
            ),
          },
        ]}
      />
    </Section>
  );
};

export default VERBNSection;
