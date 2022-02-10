import colors from "shared/lib/designSystem/colors";
import BaseAccordion from "shared/lib/components/Common/BaseAccordion";
import { Header, FAQBody, Section } from "./common";

const VaultSection = () => {
  return (
    <Section>
      <Header normalCased color={colors.red}>
        VAULT INCENTIVES
      </Header>
      <BaseAccordion
        items={[
          {
            header: "What is a vault incentive program?",
            body: (
              <FAQBody>
                A vault incentive program is where RBN from the Ribbon Finance
                Treasury is set aside for distribution to users of the Ribbon
                Finance vaults. veRBN holders can vote on the amount of RBN that
                is distributed to each vault by using their voting power to vote
                on specific vaults. Vaults then receive an amount of RBN
                proportional to the amount of veRBN allocated towards it.
              </FAQBody>
            ),
          },
          {
            header: "What are vault gauges?",
            body: (
              <FAQBody>
                Each Ribbon vault has a vault gauge (similar to Curve’s
                liquidity pool gauges). Each week, veRBN holders can vote on the
                amount of RBN that is distributed to each vault gauge by using
                their voting power to vote on specific vault gauges. Vault
                gauges then receive an amount of RBN proportional to the amount
                of veRBN allocated towards it.
              </FAQBody>
            ),
          },
          {
            header: "How do I earn RBN rewards?",
            body: (
              <FAQBody>
                To receive the weekly RBN rewards, you need to stake your
                rTokens (the tokens that represent your deposits in the vaults)
                into vault gauges. The rewards you receive depends on the gauge,
                amount of rTokens you stake in the gauge, your veRBN balance,
                the total amount staked in the gauge.
              </FAQBody>
            ),
          },
          {
            header:
              "How much voting power can I apply as part of the gauge voting process?",
            body: (
              <FAQBody>
                The amount of voting power you can apply to each vault gauge
                each week is the equal to your veRBN balance at the start of
                each week.
              </FAQBody>
            ),
          },
        ]}
      />
    </Section>
  );
};

export default VaultSection;
