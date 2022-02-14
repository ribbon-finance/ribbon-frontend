import styled from "styled-components";
import colors from "shared/lib/designSystem/colors";
import BaseAccordion from "shared/lib/components/Common/BaseAccordion";
import DistributionStat from "./DistributionStat";
import { Header, FAQBody, Link, Section } from "./common";
import sizes from "shared/lib/designSystem/sizes";

const DistributionContainer = styled.div`
  padding-top: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-row-gap: 16px;
  grid-column-gap: 16px;

  @media (max-width: ${sizes.md}px) {
    grid-template-columns: 1fr;
  }
`;

const RibbonFinanceSection = () => {
  return (
    <Section>
      <Header color={colors.red}>RIBBON FINANCE</Header>
      <BaseAccordion
        items={[
          {
            header: "What is the Ribbon Finance Protocol?",
            body: (
              <FAQBody>
                Ribbon Finance is a structured products protocol that builds
                DeFi-native financial products through cross-protocol
                composition. Ribbon’s core product is the Theta Vault, also
                known as a DeFi Options Vault (DOV), which allows users to
                generate sustainable yield on their DeFi assets through fully
                automated covered call and put-selling options strategies.
              </FAQBody>
            ),
          },
          {
            header: "What is RBN?",
            body: (
              <FAQBody>
                RBN is the governance token for the Ribbon Finance Protocol and
                was launched on May 24th, 2021.
                <br />
                <br />
                The offficial RBN address is:{" "}
                <Link
                  to="https://etherscan.io/address/0x6123B0049F904d730dB3C36a31167D9d4121fA6B"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="d-NONE d-md-block"
                >
                  View Contract
                </Link>
              </FAQBody>
            ),
          },
          {
            header: "What is the distribution of RBN?",
            body: (
              <FAQBody>
                At genesis 1 billion RBN tokens were minted, with 30 million
                tokens distributed to Ribbon Finance users in a retroactive
                airdrop and 10 million tokens distributed in a liquidity mining
                program. The remaining tokens will become accessible over the
                next 3 years.
                <DistributionContainer>
                  <DistributionStat
                    title="Community Treasury"
                    percentage={48}
                  />
                  <DistributionStat
                    title="Curent & Future Team"
                    percentage={23}
                  />
                  <DistributionStat title="Curent Investors" percentage={15} />
                  <DistributionStat title="Corporate Treasury" percentage={8} />
                  <DistributionStat
                    title="Retro Airdrop Receiptients"
                    percentage={3}
                  />
                  <DistributionStat
                    title="Liq Mining Participants"
                    percentage={1}
                  />
                  <DistributionStat
                    title="Initial Market Makers"
                    percentage={1}
                  />
                </DistributionContainer>
              </FAQBody>
            ),
          },
        ]}
      />
    </Section>
  );
};

export default RibbonFinanceSection;
