import { BaseButton, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import ButtonArrow from "shared/lib/components/Common/ButtonArrow";

const StakingPoolDropdownContainer = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
  z-index: 1000;
  position: relative;
`;

const StakingPoolButton = styled(BaseButton)`
  background-color: ${colors.background.three};
  align-items: center;
  height: fit-content;
  width: 100%;
  margin-top: 8px;
  padding: 8px;
  padding-right: 14px;

  &:hover {
    opacity: ${theme.hover.opacity};
  }
`;

const StakingPoolTitle = styled(Title)`
  padding-left: 8px;
  flex: 1;
`;

const StakingPoolMenu = styled(motion.div)<{ isOpen: boolean }>`
  ${(props) =>
    props.isOpen
      ? `
        position: absolute;
        top: 72px;
        width: 100%;
        background-color: ${colors.background.three};
        border-radius: ${theme.border.radius};
        box-shadow: 2px 4px 40px rgba(0, 0, 0, 0.64);
      `
      : `
        display: none;
      `}
`;

const OptionRow = styled(BaseButton)`
  padding: 8px;
  &:hover {
    opacity: ${theme.hover.opacity};
  }
`;

export interface StakingPoolOption {
  value: string; // Must be unique
  label: string;
  logo?: JSX.Element;
}
interface StakingPoolDropdownProps {
  selectedValue: string;
  options: StakingPoolOption[];
  onSelectOption: (value: string) => void;
}

const StakingPoolDropdown: React.FC<StakingPoolDropdownProps> = ({
  selectedValue,
  options,
  onSelectOption,
}) => {
  const [stakingPoolMenuOpen, setStakingPoolMenuOpen] = useState(false);

  const selectedOption = useMemo(() => {
    return options.find((option) => option.value === selectedValue);
  }, [options, selectedValue]);

  const renderRow = useCallback(
    (option: StakingPoolOption) => {
      return (
        <OptionRow
          role="button"
          key={option.value}
          onClick={() => {
            onSelectOption(option.value);
            setStakingPoolMenuOpen(false);
          }}
        >
          {option.logo}
          <StakingPoolTitle normalCased>{option.label}</StakingPoolTitle>
        </OptionRow>
      );
    },
    [onSelectOption]
  );

  return (
    <StakingPoolDropdownContainer>
      <StakingPoolButton
        role="button"
        onClick={() => setStakingPoolMenuOpen(!stakingPoolMenuOpen)}
      >
        {selectedOption?.logo || null}
        <StakingPoolTitle normalCased>
          {selectedOption?.label || ""}
        </StakingPoolTitle>
        <ButtonArrow isOpen={stakingPoolMenuOpen} color="#FFF" />
      </StakingPoolButton>
      <AnimatePresence>
        <StakingPoolMenu
          key={stakingPoolMenuOpen.toString()}
          isOpen={stakingPoolMenuOpen}
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: 20,
          }}
          transition={{
            type: "keyframes",
            duration: 0.2,
          }}
        >
          {options.map((option) => renderRow(option))}
        </StakingPoolMenu>
      </AnimatePresence>
    </StakingPoolDropdownContainer>
  );
};

export default StakingPoolDropdown;
