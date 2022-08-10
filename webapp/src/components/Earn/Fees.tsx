import React from "react";
import styled from "styled-components";
import { SecondaryText } from "shared/lib/designSystem";

const ParagraphText = styled(SecondaryText)<{ marginTop?: number }>`
  color: rgba(255, 255, 255, 0.64);
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  margin-top: ${(props) => (props.marginTop ? `${props.marginTop}px` : `0px`)};
`;

const Fees: React.FC = () => {
  return (
    <>
      <ParagraphText>
        The vault fee structure consists of a 20% performance fee.
      </ParagraphText>
      <ParagraphText marginTop={24}>
        If the weekly option is in-the-money, the weekly performance fee is
        charged on the yield earned.
      </ParagraphText>
      <ParagraphText marginTop={24}>
        If the weekly strategy is unprofitable, there are no fees charged.
      </ParagraphText>
    </>
  );
};

export default Fees;
