import React from "react";
import styled from "styled-components";
import colors from "shared/lib/designSystem/colors";
import { SecondaryText, Title } from "shared/lib/designSystem";
import { ActionButton } from "shared/lib/components/Common/buttons";

const ActionLogoContainer = styled.div.attrs({
  className: "mt-3",
})<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 100px;
  background: ${(props) => props.color}14;
`;

const FormTitle = styled(Title)`
  font-size: 22px;
  line-height: 28px;
  letter-spacing: 1px;
`;

interface WarningModalContentProps {
  descriptionText: string;
  buttonText?: string;
  onButtonClick: () => void;
  color?: string;
}

const WarningModalContent: React.FC<WarningModalContentProps> = ({
  descriptionText,
  onButtonClick,
  buttonText = "Continue",
  color = colors.red,
}) => {
  return (
    <div className="d-flex flex-column align-items-center">
      {/* Logo */}
      <ActionLogoContainer color={color}>
        <Title fontSize={25} lineHeight={25} color={color}>
          !
        </Title>
      </ActionLogoContainer>

      {/* Title */}
      <FormTitle className="mt-3 text-center">IMPORTANT</FormTitle>

      {/* Description */}
      <SecondaryText className="mt-2 text-center">
        {descriptionText}
      </SecondaryText>

      <ActionButton
        onClick={onButtonClick}
        className="btn py-3 mt-4 mb-3"
        color={color}
      >
        {buttonText}
      </ActionButton>
    </div>
  );
};

export default WarningModalContent;
