import React from "react";
import styled from "styled-components";
import { Col, Row } from "react-bootstrap";

import { PrimaryText, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";

const InfoTitle = styled(Title)`
  font-size: 18px;
  line-height: 20px;
`;

const InfoText = styled(PrimaryText)`
  color: ${colors.text};
  font-weight: 400;
`;

const RibbonFinanceInfo = () => {
  return (
    <Row>
      <Col md={6} className="d-flex flex-column">
        {/* Ribbon Finance Textwall */}
        <InfoTitle>RIBBON FINANCE</InfoTitle>
        <InfoText className="mt-3">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam,
          purus sit amet luctus venenatis, lectus magna fringilla urna,
          porttitor rhoncus dolor purus non enim praesent elementum facilisis
          leo, vel fringilla est ullamcorper eget nulla facilisi etiam dignissim
          diam quis.
        </InfoText>
      </Col>
    </Row>
  );
};

export default RibbonFinanceInfo;
