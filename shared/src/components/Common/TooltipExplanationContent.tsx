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
  z-index: 1100;
`;

const ExplanationTitle = styled(Title)`
  text-transform: none;
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

interface OverlayTooltipExplanationProps {
  title: string;
  explanation: React.ReactNode;
  learnMoreURL?: string;
  overlayInjectedProps: OverlayInjectedProps;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const OverlayTooltipExplanation: React.FC<OverlayTooltipExplanationProps> = ({
  title,
  explanation,
  learnMoreURL,
  overlayInjectedProps,
  setShow,
}) => (
  <Tooltip
    {...overlayInjectedProps}
    onMouseOver={() => setShow(true)}
    onMouseOut={() => setShow(false)}
  >
    <ExplanationTitle>{title}</ExplanationTitle>
    <Explanation>{explanation}</Explanation>
    {learnMoreURL && (
      <LearnMoreLink
        to={learnMoreURL}
        target="_blank"
        rel="noreferrer noopener"
      >
        <PrimaryText fontSize={14} className="mr-2">
          Learn More
        </PrimaryText>
        <ExternalIcon containerStyle={{ display: "flex" }} color="white" />
      </LearnMoreLink>
    )}
  </Tooltip>
);

export default OverlayTooltipExplanation;
