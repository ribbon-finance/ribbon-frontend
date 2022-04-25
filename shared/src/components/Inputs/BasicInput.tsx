import React, { useMemo } from "react";
import styled from "styled-components";
import {
  BaseInput,
  BaseInputButton,
  BaseInputContainer,
  BaseInputLabel,
} from "../../designSystem";

const Container = styled.div.attrs({
  className: "d-flex flex-column flex-grow-1",
})``;

const InputContent = styled.div``;

const InputContainer = styled(BaseInputContainer).attrs({
  className: "d-flex flex-row flex-grow-1",
})`
  padding: 10px 0;
  margin-top: 0;
`;

const Input = styled(BaseInput)``;

const InsideInputLabel = styled(BaseInputLabel)`
  padding: 0 8px;
`;

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  inputWidth?: string;
  fontSize?: number;
  lineHeight?: number;
}
interface BasicInputProps {
  leftContent?: React.ReactNode;
  size?: "xs" | "s" | "m" | "l";
  rightButtonProps?: {
    text: string;
    onClick: () => void;
  };
  labelProps: {
    text: string;
    // Label inside the input itself
    isInside?: boolean;
  };
  inputProps: InputProps;
}

const BasicInput: React.FC<BasicInputProps> = ({
  size = "s",
  rightButtonProps,
  inputProps,
  labelProps,
  leftContent,
}) => {
  const sizeSpecificProps = useMemo(() => {
    let props = {
      containerHeight: "48px",
      fontSize: "16px",
      lineHeight: 24,
    };
    switch (size) {
      case "xs":
        props.containerHeight = "48px";
        props.fontSize = "16px";
        props.lineHeight = 24;
        break;
      case "s":
        props.containerHeight = "64px";
        props.fontSize = "22px";
        props.lineHeight = 28;
        break;
      default:
        props.containerHeight = "64px";
        props.fontSize = "22px";
        props.lineHeight = 28;
        break;
    }
    return props;
  }, [size]);

  const inputStyles = useMemo(() => {
    const style = {
      fontSize: sizeSpecificProps.fontSize,
      ...inputProps.style,
    };
    if (labelProps.isInside) {
      style.padding = "0 8px";
      style.height = "auto";
    }
    return style;
  }, [sizeSpecificProps, inputProps, labelProps]);

  return (
    <Container>
      {!labelProps.isInside && (
        <BaseInputLabel>{labelProps.text}</BaseInputLabel>
      )}
      <InputContainer
        style={{
          height: sizeSpecificProps.containerHeight,
        }}
        error={!!inputProps.error}
      >
        {leftContent}
        <InputContent>
          {labelProps.isInside && (
            <InsideInputLabel>{labelProps.text}</InsideInputLabel>
          )}
          <Input
            type="number"
            className="form-control"
            {...inputProps}
            style={inputStyles}
            lineHeight={sizeSpecificProps.lineHeight}
          />
          {rightButtonProps && (
            <BaseInputButton onClick={rightButtonProps.onClick}>
              {rightButtonProps.text}
            </BaseInputButton>
          )}
        </InputContent>
      </InputContainer>
    </Container>
  );
};

export default BasicInput;
