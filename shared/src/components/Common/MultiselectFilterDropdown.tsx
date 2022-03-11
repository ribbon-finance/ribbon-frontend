import { AnimatePresence, motion } from "framer";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { CheckIcon } from "../../assets/icons/icons";
import { BaseButton, SecondaryText, Title } from "../../designSystem";
import colors from "../../designSystem/colors";
import sizes from "../../designSystem/sizes";
import theme from "../../designSystem/theme";
import { useBoundingclientrect } from "../../hooks/useBoundingclientrect";
import useOutsideAlerter from "../../hooks/useOutsideAlerter";
import useScreenSize from "../../hooks/useScreenSize";
import ButtonArrow from "./ButtonArrow";

interface FilterDropdownButtonConfig {
  background: string;
  activeBackground: string;
  paddingHorizontal: number;
  paddingVertical: number;
  color: string;
}

interface FilterDropdownMenuConfig {
  horizontalOrientation?: "left" | "right";
  topBuffer: number;
}

const Filter = styled.div`
  position: relative;
`;

const FilterButton = styled(BaseButton)<{
  config: FilterDropdownButtonConfig;
  active: boolean;
}>`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: ${(props) =>
    `${props.config.paddingVertical}px ${props.config.paddingHorizontal}px`};
  background-color: ${(props) =>
    props.active ? props.config.activeBackground : props.config.background};

  &:hover {
    background-color: ${(props) => props.config.activeBackground};
    span {
      color: ${colors.primaryText};
    }
  }
`;

const FilterButtonText = styled(Title)<{ config: FilterDropdownButtonConfig }>`
  font-size: 14px;
  color: ${(props) => props.config.color};
  text-transform: uppercase;
`;

const FilterDropdownMenu = styled(motion.div)<{
  isOpen: boolean;
  verticalOrientation: "top" | "bottom";
  buttonPaddingVertical: number;
  config: FilterDropdownMenuConfig;
}>`
  ${(props) =>
    props.isOpen
      ? `
          position: absolute;
          z-index: 2000;
          padding: 16px;
          ${(() => {
            switch (props.config.horizontalOrientation) {
              case "left":
                return `left: 0px;`;
              case "right":
              default:
                return `right: 0px;`;
            }
          })()}
          ${(() => {
            switch (props.verticalOrientation) {
              case "top":
                return `bottom: 48px;`;
              case "bottom":
              default:
                return `top: calc(21px + ${
                  props.buttonPaddingVertical * 2
                }px + ${props.config.topBuffer}px);`;
            }
          })()}
          width: fit-content;
          background-color: ${colors.background.two};
          border-radius: ${theme.border.radius};
        `
      : `
          display: none;
        `}
`;

const MenuItem = styled.div<{ color: string; active: boolean }>`
  display: flex;
  align-items: center;
  width: 256px;
  padding: 14px 16px;
  opacity: 0.48;
  border-radius: 100px;
  background: ${(props) => `${props.color}14`};
  margin-bottom: 16px;
  border: ${theme.border.width} ${theme.border.style} transparent;
  transition: border 150ms;

  ${(props) => {
    if (props.active) {
      return `
        opacity: 1;
        border: ${theme.border.width} ${theme.border.style} ${props.color};
      `;
    }
    return `
      &:hover {
        opacity: 1;
      }
    `;
  }}
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  margin: -12px;
  margin-right: 8px;
  border-radius: 100px;
`;

const MenuItemText = styled(Title)<{ color: string }>`
  color: ${(props) => props.color};
  white-space: nowrap;
  font-size: 14px;
  line-height: 20px;
  transition: color 150ms;
`;

const StyledCheckButton = styled(CheckIcon)<{ color: string }>`
  path {
    transition: fill 150ms;
    stroke: ${(props) => props.color};
  }
`;

const SaveButton = styled(BaseButton)`
  display: flex;
  justify-content: center;
  padding: 12px 24px;
  margin-top: 24px;
  background: ${colors.primaryText}14;
  border-radius: ${theme.border.radius};
`;

interface DropdownOption {
  value: string;
  display: string;
  color: string;
  textColor?: string;
  logo?: React.ReactElement;
}

interface MultiselectFilterDropdownProps {
  values: string[];
  options: DropdownOption[];
  title: string;
  onSelect: (option: string[]) => void;
  buttonConfig?: FilterDropdownButtonConfig;
  dropdownMenuConfig?: FilterDropdownMenuConfig;
}

const MultiselectFilterDropdown: React.FC<
  MultiselectFilterDropdownProps & React.HTMLAttributes<HTMLDivElement>
> = ({
  values,
  options,
  title,
  onSelect,
  buttonConfig = {
    background: colors.background.two,
    activeBackground: colors.background.three,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: `${colors.primaryText}`,
  },
  dropdownMenuConfig = {
    horizontalOrientation: "left",
    topBuffer: 16,
  },
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const { height, width } = useScreenSize();
  const dropdownBoundingRect = useBoundingclientrect(ref);
  const [selected, setSelected] = useState<string[]>(values);

  // Reset selected value if close without save
  useEffect(() => {
    if (!open) {
      setSelected(values);
    }
  }, [open, values]);

  useOutsideAlerter(ref, () => {
    setOpen(false);
  });

  const renderMenuItem = useCallback(
    (option: DropdownOption) => {
      const active = selected.includes(option.value);
      const textColor = option.textColor ? option.textColor : option.color;
      return (
        <MenuItem
          onClick={() => {
            setSelected((currSelected) =>
              currSelected.includes(option.value)
                ? currSelected.filter((curr) => curr !== option.value)
                : currSelected.concat(option.value)
            );
          }}
          role="button"
          key={option.value}
          color={option.color}
          active={active}
        >
          {option.logo ? <LogoContainer>{option.logo}</LogoContainer> : <></>}
          <MenuItemText color={active ? textColor : colors.primaryText}>
            {option.display}
          </MenuItemText>
          {active && (
            <StyledCheckButton color={textColor} className="ml-auto" />
          )}
        </MenuItem>
      );
    },
    [selected]
  );

  const getVerticalOrientation = useCallback(() => {
    /**
     * Height of dropdown: 48px
     * Height of each option: 36px
     * Total dropdown margin: 16px
     */
    if (
      dropdownBoundingRect &&
      dropdownBoundingRect.top +
        48 +
        options.length * 36 +
        16 +
        (width > sizes.lg
          ? theme.footer.desktop.height
          : theme.footer.mobile.height) >
        height
    ) {
      return "top";
    }

    return "bottom";
  }, [width, height, dropdownBoundingRect, options]);

  return (
    <Filter {...props} ref={ref}>
      <FilterButton
        role="button"
        active={open}
        onClick={() => {
          setOpen((open) => !open);
        }}
        config={buttonConfig}
      >
        <FilterButtonText config={buttonConfig}>
          {title}
          {values.length > 0 ? ` (${values.length})` : ""}{" "}
          <ButtonArrow isOpen={open} />
        </FilterButtonText>
      </FilterButton>
      <AnimatePresence>
        <FilterDropdownMenu
          key={open.toString()}
          isOpen={open}
          verticalOrientation={getVerticalOrientation()}
          buttonPaddingVertical={buttonConfig.paddingVertical}
          config={dropdownMenuConfig}
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
          {options.map((filterOption) => renderMenuItem(filterOption))}
          <SaveButton
            role="button"
            onClick={() => {
              onSelect(selected);
              setOpen(false);
            }}
          >
            <Title>Save</Title>
          </SaveButton>
          <div className="d-flex w-100 justify-content-center mt-3">
            <SecondaryText
              onClick={() =>
                selected.length === options.length
                  ? setSelected([])
                  : setSelected(options.map((option) => option.value))
              }
              role="button"
            >
              {selected.length === options.length
                ? `Deselect All`
                : `Select All`}
            </SecondaryText>
          </div>
        </FilterDropdownMenu>
      </AnimatePresence>
    </Filter>
  );
};

export default MultiselectFilterDropdown;
