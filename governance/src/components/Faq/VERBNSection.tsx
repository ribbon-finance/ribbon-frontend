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
                Vote-escrowed RBN, or veRBN, is an ERC-20 token that enable
                holders to earn boosted liquidity mining rewards, vote on vault
                incentives and earn a share in protocol revenue. The veRBN model
                is Ribbon’s adaptation of Curve’s successful and battle-tested
                veCRV tokenomics model.
              </FAQBody>
            ),
          },
          {
            header: "How do I obtain veRBN?",
            body: (
              <FAQBody>
                In order to obtain veRBN, you must lock up your RBN. The amount
                of veRBN you receive depends on (i) the amount of your RBN
                balance that you decide to lockup and (ii) the amount of time
                you decide to lock your RBN for (also known as the lockup
                period). You can lock your tokens for a maximum of 2 years and a
                minimum of 1 week. Your veRBN balance decreases linearly as the
                remaining time until your RBN lockup expiry decreases. At the
                end of your lockup period your veRBN balance will be zero.
                <br />
                <br />
                <strong>Example A</strong>: If Alice has 100 RBN and locks up
                100 RBN for 2 years, she will receive 100 veRBN.
                <br />
                <br />
                <strong>Example B</strong>: If Bob has 100 RBN and locks up 50
                RBN for 2 years, he will receive 50 veRBN.
                <br />
                <br />
                <strong>Example C</strong>: If Charlie has 100 RBN and locks up
                100 RBN for 1 year, she will receive 50 veRBN.
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
