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
            body: <FAQBody>TEST</FAQBody>,
          },
          {
            header: "What are vault incentive rounds?",
            body: <FAQBody>TEST</FAQBody>,
          },
          {
            header:
              "How is my voting power calculated in each vault incentive round?",
            body: <FAQBody>TEST</FAQBody>,
          },
        ]}
      />
    </Section>
  );
};

export default VaultSection;
