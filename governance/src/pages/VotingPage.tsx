import { useWeb3React } from "@web3-react/core";
import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styled from "styled-components";
import SegmentControl from "shared/lib/components/Common/SegmentControl";
import colors from "shared/lib/designSystem/colors";
import sizes from "shared/lib/designSystem/sizes";
import theme from "shared/lib/designSystem/theme";
import useScreenSize from "shared/lib/hooks/useScreenSize";

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

const Tabs = ["Gauge Voting", "Proposals"] as const;
type TabType = typeof Tabs[number];

const VotingPage = () => {
  const { active } = useWeb3React();
  const [currentTab, setCurrentTab] = useState<TabType>("Gauge Voting");

  const { width } = useScreenSize();

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col sm="11" md="9" lg="7" className="d-flex flex-wrap">
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
                // widthType: width >= sizes.md ? "fullWidth" : "maxContent",
                widthType: "fullWidth",
              }}
            />
            <ExplanationContainer>
              How does gauge voting work?
            </ExplanationContainer>
          </SegmentControlContainer>
        </Col>
      </Row>
    </Container>
  );
};

export default VotingPage;
