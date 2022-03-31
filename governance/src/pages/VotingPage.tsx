import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styled from "styled-components";
import SegmentControl from "shared/lib/components/Common/SegmentControl";
import colors from "shared/lib/designSystem/colors";
import sizes from "shared/lib/designSystem/sizes";
import theme from "shared/lib/designSystem/theme";
import GaugeVoting from "../components/GaugeVoting/GaugeVoting";
import { AnimatePresence, motion } from "framer-motion";
import { SecondaryText, Title } from "shared/lib/designSystem";

const SegmentControlContainer = styled.div`
  border-radius: ${theme.border.radius};
  overflow: hidden;
  width: 100%;

  @media (min-width: ${sizes.md}px) {
    width: auto;
    margin-left: auto;
    margin-right: auto;
  }
`;

const ExplanationContainer = styled.div.attrs({
  className: "d-flex justify-content-center w-100",
  role: "button",
})`
  background-color: ${colors.buttons.secondaryBackground2};
  color: ${colors.green}A3;
  padding: 6px;
  font-size: 12px;
`;

const VotingOverview = styled.div.attrs({
  className: "d-flex justify-content-center",
})`
  padding-top: 40px;
`;
const VotingOverviewRow = styled.div.attrs({
  className: "d-flex",
})`
  background-color: ${colors.primaryText}0A;

  @media (max-width: ${sizes.md}px) {
    flex-direction: column;
  }
`;
const VotingOverviewCol = styled(Col).attrs({
  className: "d-flex flex-column align-items-center text-center",
})`
  padding: 16px;
`;

const Section = styled(Row)`
  margin-top: 40px;
`;

const Column = styled(Col).attrs({
  sm: "11",
  md: "9",
  lg: "7",
})``;

const Tabs = ["Gauge Voting", "Proposals"] as const;
type TabType = typeof Tabs[number];

const VotingPage = () => {
  const [currentTab, setCurrentTab] = useState<TabType>("Gauge Voting");

  return (
    <Container>
      <Section className="justify-content-center">
        <Column className="d-flex flex-wrap">
          <SegmentControlContainer>
            <SegmentControl
              segments={Tabs.map((tab) => ({
                value: tab,
                display: tab.toUpperCase(),
                textColor:
                  tab === currentTab ? colors.primaryText : colors.tertiaryText,
              }))}
              value={currentTab}
              onSelect={(tab) => {
                setCurrentTab(tab as TabType);
              }}
              config={{
                backgroundColor: colors.background.two,
                hideBorderRadius: true,
                widthType: "fullWidth",
              }}
            />
            <ExplanationContainer>
              How does gauge voting work?
            </ExplanationContainer>
          </SegmentControlContainer>
        </Column>
      </Section>

      <VotingOverview>
        <Container>
          <VotingOverviewRow>
            <VotingOverviewCol>
              <SecondaryText fontSize={12} color={colors.tertiaryText}>
                Total Votes This Round (veRBN)
              </SecondaryText>
              <Title fontSize={14}>15.2M</Title>
            </VotingOverviewCol>
            <VotingOverviewCol>
              <SecondaryText fontSize={12} color={colors.tertiaryText}>
                RBN Incentives Per Round
              </SecondaryText>
              <Title fontSize={14}>15.2M</Title>
            </VotingOverviewCol>
            <VotingOverviewCol>
              <SecondaryText fontSize={12} color={colors.tertiaryText}>
                Time To Next Round
              </SecondaryText>
              <Title fontSize={14}>15.2M</Title>
            </VotingOverviewCol>
          </VotingOverviewRow>
        </Container>
      </VotingOverview>

      <Section>
        <AnimatePresence initial={false} exitBeforeEnter>
          <motion.div
            key={currentTab}
            transition={{
              duration: 0.25,
              type: "keyframes",
              ease: "easeInOut",
            }}
            initial={{
              y: 50,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: 50,
              opacity: 0,
            }}
            className="w-100 mb-5"
          >
            {currentTab === "Gauge Voting" ? (
              <GaugeVoting />
            ) : (
              // TODO: - Proposals
              <></>
            )}
          </motion.div>
        </AnimatePresence>
      </Section>
    </Container>
  );
};

export default VotingPage;
