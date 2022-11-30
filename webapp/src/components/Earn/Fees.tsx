import React from "react";
import styled from "styled-components";
import { SecondaryText } from "shared/lib/designSystem";
import { VaultOptions, VaultFees } from "shared/lib/constants/constants";

const ParagraphText = styled(SecondaryText)<{ marginTop?: number }>`
  color: rgba(255, 255, 255, 0.64);
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  margin-top: ${(props) => (props.marginTop ? `${props.marginTop}px` : `0px`)};
`;

interface FeesProps {
  vaultOption: VaultOptions;
}

const Fees: React.FC<FeesProps> = ({ vaultOption }) => {
  const vaultFees = VaultFees[vaultOption].earn?.performanceFee;
  return (
    <>
      <ParagraphText>
        The vault fee structure consists of a {vaultFees}% flat fee on the yield
        earned between epochs.
      </ParagraphText>
    </>
  );
};

export default Fees;
