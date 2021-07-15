import { AnimatePresence, motion } from "framer";
import React, { useCallback, useRef, useState } from "react";
import styled from "styled-components";

import { BaseButton, Title } from "../../designSystem";
import colors from "../../designSystem/colors";
import sizes from "../../designSystem/sizes";
import theme from "../../designSystem/theme";
import { useBoundingclientrect } from "../../hooks/useBoundingclientrect";
import useOutsideAlerter from "../../hooks/useOutsideAlerter";
import useScreenSize from "../../hooks/useScreenSize";
import { capitalize } from "../../utils/text";
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
  justify-content: center;
  align-items: center;
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
          background-color: ${colors.backgroundDarker};
          border: ${theme.border.width} ${theme.border.style} ${colors.border};
          border-radius: ${theme.border.radius};
        `
      : `
          display: none;
        `}
`;

const MenuItem = styled.div`
  padding: 8px 16px;
  padding-right: 66px;
  opacity: 1;
  display: flex;
  align-items: center;

  &:first-child {
    padding-top: 16px;
  }

  &:last-child {
    padding-bottom: 16px;
  }

  &:hover {
    span {
      color: ${colors.primaryText};
    }
  }
`;

const MenuItemText = styled(Title)`
  color: ${colors.primaryText}A3;
  white-space: nowrap;
  font-size: 14px;
  line-height: 20px;
`;

interface FilterDropdownProps {
  options: Array<string | { display: string; value: string }>;
  value: string;
  onSelect: (option: string) => void;
  buttonConfig?: FilterDropdownButtonConfig;
  dropdownMenuConfig?: FilterDropdownMenuConfig;
}

const FilterDropdown: React.FC<
  FilterDropdownProps & React.HTMLAttributes<HTMLDivElement>
> = ({
  options,
  value,
  onSelect,
  buttonConfig = {
    background: colors.backgroundDarker,
    activeBackground: colors.backgroundDarker,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: `${colors.primaryText}A3`,
  },
  dropdownMenuConfig = {
    topBuffer: 8,
  },
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const { height, width } = useScreenSize();
  const dropdownBoundingRect = useBoundingclientrect(ref);

  useOutsideAlerter(ref, () => {
    setOpen(false);
  });

  const renderMenuItem = useCallback(
    (title: string, onClick: () => void) => (
      <MenuItem onClick={onClick} role="button" key={title}>
        <MenuItemText>{title}</MenuItemText>
      </MenuItem>
    ),
    []
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
          {value} <ButtonArrow isOpen={open} />
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
          {options.map(
            (filterOption: string | { display: string; value: string }) =>
              typeof filterOption === "string"
                ? renderMenuItem(capitalize(filterOption), () => {
                    onSelect(filterOption);
                    setOpen(false);
                  })
                : renderMenuItem(capitalize(filterOption.display), () => {
                    onSelect(filterOption.value);
                    setOpen(false);
                  })
          )}
        </FilterDropdownMenu>
      </AnimatePresence>
    </Filter>
  );
};

export default FilterDropdown;
