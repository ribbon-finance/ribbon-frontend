import React from "react";
import { Col, Row } from "react-bootstrap";

import BaseAccordion from "shared/lib/components/Common/BaseAccordion";
import { SecondaryText } from "shared/lib/designSystem";
import styled from "styled-components";

const FAQItems = [
  {
    header:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit? Lorem ipsum dolor sit amet, consectetur adipiscing elit?",
    body:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam quis.",
  },
  {
    header: "Lorem ipsum dolor sit amet?",
    body:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam quis.",
  },
  {
    header: "Lorem ipsum dolor sit amet, consectetur?",
    body:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam quis.",
  },
  {
    header: "Lorem ipsum dolor sit amet, consectetur adipiscing elit ut?",
    body:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam quis.",
  },
  {
    header: "Lorem ipsum dolor sit amet, consectetur adipiscing?",
    body:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam quis.",
  },
  {
    header: "Lorem ipsum dolor sit amet, consectetur?",
    body:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam quis.",
  },
  {
    header: "Lorem ipsum dolor sit amet, consectetur adipiscing elit?",
    body:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam quis.",
  },
  {
    header: "Lorem ipsum dolor sit?",
    body:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam quis.",
  },
  {
    header:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam?",
    body:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam quis.",
  },
  {
    header: "Lorem ipsum dolor sit amet, consectetur adipiscing",
    body:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam quis.",
  },
];

const AccordionContainer = styled.div`
  &:not(:first-child) {
    margin-top: 24px;
  }
`;

const BodyText = styled(SecondaryText)`
  font-size: 16px;
  line-height: 24px;
  font-weight: normal;
`;

const FAQ = () => {
  return (
    <>
      <Row className="justify-content-center">
        <Col xs={11} sm={10} md={9} lg={8} xl={7}>
          {FAQItems.map((item, index) => (
            <AccordionContainer key={index}>
              <BaseAccordion
                items={[
                  {
                    ...item,
                    body: <BodyText>{item.body}</BodyText>,
                  },
                ]}
              />
            </AccordionContainer>
          ))}
        </Col>
      </Row>
    </>
  );
};

export default FAQ;
