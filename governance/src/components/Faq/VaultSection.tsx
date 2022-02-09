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
            header: "What are vault incentive rounds?",
            body: (
              <FAQBody>
                Vault incentive programs run over X rounds, where each round is
                4 weeks long. Prior to the beginning of a new round, veRBN
                holders can vote on the amount of RBN distributed to each vault
                for the following round.
              </FAQBody>
            ),
          },
          {
            header:
              "How is my voting power calculated in each vault incentive round?",
            body: (
              <FAQBody>
                Your voting power for the round is your veRBN balance at the
                start of a round.
              </FAQBody>
            ),
          },
        ]}
      />
    </Section>
  );
};

export default VaultSection;
