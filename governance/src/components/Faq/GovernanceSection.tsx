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
            header: "What is Governor Bravo?",
            body: <FAQBody>TEST</FAQBody>,
          },
          {
            header: "What is voting power?",
            body: <FAQBody>TEST</FAQBody>,
          },
          {
            header: "How do I increase my voting power?",
            body: <FAQBody>TEST</FAQBody>,
          },
          {
            header:
              "Do I have to delegate my voting power in order to participate in Ribbon governance?",
            body: <FAQBody>TEST</FAQBody>,
          },
          {
            header: "Can I delegate my voting power to myself?",
            body: <FAQBody>TEST</FAQBody>,
          },
          {
            header:
              "What happens if someone delegates their voting power to me?",
            body: <FAQBody>TEST</FAQBody>,
          },
          {
            header:
              "What happens if someone delegates their voting power to me?",
            body: <FAQBody>TEST</FAQBody>,
          },
          {
            header: "How much veRBN do I need to make a governance proposal?",
            body: <FAQBody>TEST</FAQBody>,
          },
          {
            header: "How do I vote on a governance proposal?",
            body: <FAQBody>TEST</FAQBody>,
          },
        ]}
      />
    </Section>
  );
};

export default GovernanceSection;
