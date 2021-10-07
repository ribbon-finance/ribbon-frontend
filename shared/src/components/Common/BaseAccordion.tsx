import React, { useContext } from "react";
import {
  Accordion,
  AccordionContext,
  Card,
  useAccordionToggle,
} from "react-bootstrap";
import styled from "styled-components";
import { PrimaryText } from "../../designSystem";

import colors from "../../designSystem/colors";
import theme from "../../designSystem/theme";
import ButtonArrow from "./ButtonArrow";

const AccordionItem = styled(Card)`
  background: ${colors.primaryText}0A;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: ${theme.border.radiusSmall};
`;

const AccordionHeader = styled(Card.Header)`
  display: flex;
  align-items: center;
  position: relative;
  background-color: ${colors.background.one};
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

const AccordionHeaderArrow = styled.div`
  margin: 0px 8px 0px 24px;
  opacity: 0.64;
  color: ${colors.primaryText};
`;

const BaseAccordionToggleWithMenu: React.FC<any> = ({
  children,
  eventKey,
  callback,
}) => {
  const currentEventKey = useContext(AccordionContext);

  const decoratedOnClick = useAccordionToggle(
    eventKey,
    () => callback && callback(eventKey)
  );

  const isCurrentEventKey = currentEventKey === eventKey;

  return (
    <AccordionHeader onClick={decoratedOnClick} role="button">
      {children}
      <AccordionHeaderArrow>
        <ButtonArrow isOpen={isCurrentEventKey} />
      </AccordionHeaderArrow>
    </AccordionHeader>
  );
};

interface BaseAccordionProps {
  items: {
    header: string;
    body: JSX.Element;
  }[];
}

const BaseAccordion: React.FC<BaseAccordionProps> = ({ items }) => {
  return (
    <Accordion>
      {items.map((item, index) => (
        <AccordionItem key={index}>
          <BaseAccordionToggleWithMenu eventKey={index.toString()}>
            <PrimaryText className="mr-auto">{item.header}</PrimaryText>
          </BaseAccordionToggleWithMenu>
          <Accordion.Collapse eventKey={index.toString()}>
            <Card.Body className="p-3">{item.body}</Card.Body>
          </Accordion.Collapse>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default BaseAccordion;
