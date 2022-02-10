import colors from "shared/lib/designSystem/colors";
import BaseAccordion from "shared/lib/components/Common/BaseAccordion";
import { Header, FAQBody, Section } from "./common";

const GovernanceSection = () => {
  return (
    <Section>
      <Header normalCased color={colors.red}>
        GOVERNANCE PROPOSALS
      </Header>
      <BaseAccordion
        items={[
          {
            header: "What is voting power?",
            body: (
              <FAQBody>
                Your voting power is represented by your veRBN balance at any
                particular point in time. The greater your veRBN balance, the
                greater your ability to influence the outcome of Ribbon
                governance proposals and vault incentives programs.
              </FAQBody>
            ),
          },
          {
            header: "How do I increase my voting power?",
            body: (
              <FAQBody>
                You can increase your voting power by (i) locking up more RBN
                and / or (i) increasing your lock time.
              </FAQBody>
            ),
          },
          {
            header: "What are governance proposals?",
            body: (
              <FAQBody>
                Governance proposals are autonomous proposals made by veRBN
                holders to change the Ribbon Finance protocol. If a proposal
                receives at least XXX veRBN votes in support of it, the changes
                to the protocol specified in the proposal are autonomously
                executed.
              </FAQBody>
            ),
          },
          {
            header: "How much veRBN do I need to make a governance proposal?",
            body: (
              <FAQBody>
                You must have at least [???] veRBN to make governance proposals.
              </FAQBody>
            ),
          },
          {
            header: "What is Governor Bravo?",
            body: (
              <FAQBody>
                Governor Bravo is a governance framework that allows governance
                proposals to get executed autonomously instead of through loose
                consensus via a Snapshot vote and multisig execution.
              </FAQBody>
            ),
          },
          {
            header: "How do I vote on a governance proposal?",
            body: (
              <FAQBody>
                You can vote on governance proposals on Ribbon Finance’s
                governance page on Tally. All proposals listed on the Ribbon
                Governance Portal link out directly to Tally.
              </FAQBody>
            ),
          },
        ]}
      />
    </Section>
  );
};

export default GovernanceSection;
