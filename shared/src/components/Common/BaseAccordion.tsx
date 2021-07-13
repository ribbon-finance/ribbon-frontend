import React from "react";
import { Accordion, Card } from "react-bootstrap";
import styled from "styled-components";
import { PrimaryText, SecondaryText } from "../../designSystem";

import colors from "../../designSystem/colors";
import theme from "../../designSystem/theme";

const AccordionItem = styled(Card)`
  background: ${colors.primaryText}0A;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: ${theme.border.radiusSmall};
`;

const AccordionHeader = styled(Card.Header)`
  position: relative;
  background-color: ${colors.background};
  padding: 20px 16px;

  &&& {
    border-bottom: ${theme.border.width} ${theme.border.style} ${colors.border};
    border-radius: ${theme.border.radiusSmall};
  }

  &:before {
    position: absolute;
    height: 100%;
    width: 100%;
    content: " ";
    top: 0;
    left: 0;
    background: ${colors.primaryText}03;
    border-radius: ${theme.border.radiusSmall};
  }

  & > * {
    z-index: 1;
  }
`;

interface BaseAccordionProps {
  items: {
    header: string;
    body: string;
  }[];
}

const BaseAccordion: React.FC<BaseAccordionProps> = ({ items }) => {
  return (
    <Accordion>
      {items.map((item, index) => (
        <AccordionItem>
          <Accordion.Toggle
            as={AccordionHeader}
            eventKey={index.toString()}
            role="button"
          >
            <PrimaryText>{item.header}</PrimaryText>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={index.toString()}>
            <Card.Body>
              <SecondaryText>{item.body}</SecondaryText>
            </Card.Body>
          </Accordion.Collapse>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default BaseAccordion;
