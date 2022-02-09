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
            body: <FAQBody>TEST</FAQBody>,
          },
          {
            header: "How do I obtain veRBN?",
            body: <FAQBody>TEST</FAQBody>,
          },
          {
            header: "Is veRBN transferable?",
            body: <FAQBody>TEST</FAQBody>,
          },
          {
            header: "When can I unlock my RBN?",
            body: <FAQBody>TEST</FAQBody>,
          },
          {
            header: "What does the distribution of RBN look like?",
            body: <FAQBody>TEST</FAQBody>,
          },
        ]}
      />
    </Section>
  );
};

export default VERBNSection;
