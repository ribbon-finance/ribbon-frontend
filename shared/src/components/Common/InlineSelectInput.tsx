import { Frame } from "framer";
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import colors from "../../designSystem/colors";
import theme from "../../designSystem/theme";

const SelectContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  border-radius: ${theme.border.radius};
  background-color: ${colors.background.three};
`;

const SelectOption = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  flex-grow: 1;
`;

const ActiveBackground = styled(Frame)`
  border-radius: ${theme.border.radius} !important;
  transition: 0.25s border ease-out;
  border: ${theme.border.width} ${theme.border.style} ${colors.green};
  background-color: ${colors.green}1F !important;
`;

interface InlineSelectInputProps {
  options: Array<
    Array<{ value: string; display: (active: boolean) => JSX.Element }>
  >;
  value: string;
  onValueChange: (value: string) => void;
}

const InlineSelectInput: React.FC<InlineSelectInputProps> = ({
  options,
  value,
  onValueChange,
}) => {
  const controlRefs = useMemo(
    () =>
      options.reduce<any>(
        (acc, section) => ({
          ...acc,
          ...section.reduce<any>((sectionAcc, option) => {
            sectionAcc[option.value] = React.createRef();
            return sectionAcc;
          }, {}),
        }),
        {}
      ),
    [options]
  );
  const [activeBackgroundState, setActiveBackgroundState] = useState<
    object | boolean
  >(false);

  /**
   * Update background
   */
  useEffect(() => {
    const currentCurrency = controlRefs[value].current;

    if (!currentCurrency) {
      return;
    }

    const handleResize = () => {
      setActiveBackgroundState({
        left: currentCurrency.offsetLeft,
        top: currentCurrency.offsetTop,
        height: currentCurrency.clientHeight,
        width: currentCurrency.clientWidth,
      });
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [value, controlRefs]);

  return (
    <SelectContainer>
      <ActiveBackground
        transition={{
          type: "keyframes",
          ease: "easeOut",
        }}
        initial={{
          height: 0,
          width: 0,
        }}
        animate={activeBackgroundState}
      />
      {options.map((section, index) => (
        <React.Fragment key={index}>
          {section.map((option) => (
            <SelectOption
              key={option.value}
              ref={controlRefs[option.value]}
              role="button"
              onClick={() => onValueChange(option.value)}
            >
              {option.display(option.value === value)}
            </SelectOption>
          ))}
          {index !== options.length - 1 && (
            <div
              style={{ height: "50%", width: "1px", background: colors.text }}
            />
          )}
        </React.Fragment>
      ))}
    </SelectContainer>
  );
};

export default InlineSelectInput;
