import React from "react";
import { OverlayInjectedProps } from "react-bootstrap/esm/Overlay";
import styled from "styled-components";
import { ExternalIcon } from "../../assets/icons/icons";
import {
  BaseLink,
  PrimaryText,
  SecondaryText,
  Title,
} from "../../designSystem";

import colors from "../../designSystem/colors";
import theme from "../../designSystem/theme";

const Tooltip = styled.div`
  background: ${colors.backgroundDarker};
  padding: 16px;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: ${theme.border.radius};
  display: flex;
  flex-direction: column;
  z-index: 10;
`;

const Explanation = styled(SecondaryText)`
  margin-top: 8px;
  max-width: 240px;
`;

const LearnMoreLink = styled(BaseLink)`
  display: flex;
  align-items: center;
  margin-top: 16px;
`;

const LearnMore = styled(PrimaryText)`
  font-size: 14px;
  margin-right: 8px;
`;

interface OverlayTooltipExplanationProps {
  title: string;
  explanation: string;
  learnMoreURL?: string;
  overlayInjectedProps: OverlayInjectedProps;
}

const OverlayTooltipExplanation: React.FC<OverlayTooltipExplanationProps> = ({
  title,
  explanation,
  learnMoreURL,
  overlayInjectedProps,
}) => (
  <Tooltip {...overlayInjectedProps}>
    <Title>{title}</Title>
    <Explanation>{explanation}</Explanation>
    {learnMoreURL && (
      <LearnMoreLink
        to={learnMoreURL}
        target="_blank"
        rel="noreferrer noopener"
      >
        <LearnMore>Learn More</LearnMore>
        <ExternalIcon containerStyle={{ display: "flex" }} color="white" />
      </LearnMoreLink>
    )}
  </Tooltip>
);

export default OverlayTooltipExplanation;
