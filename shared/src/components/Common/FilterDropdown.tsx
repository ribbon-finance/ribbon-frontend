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
  background?: string;
  activeBackground?: string;
  paddingHorizontal?: number;
  paddingVertical?: number;
  color?: string;
}

interface FilterDropdownMenuConfig {
  horizontalOrientation?: "left" | "right";
  topBuffer: number;
  backgroundColor?: string;
}

interface MenuItemConfig {
  firstItemPaddingTop?: string;
  lastItemPaddingBottom?: string;
  padding?: string;
}

interface MenuItemTextConfig {
  fontSize?: number;
  lineHeight?: number;
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
    `${props.config.paddingVertical || 8}px ${
      props.config.paddingHorizontal || 12
    }px`};
  background-color: ${(props) =>
    props.active
      ? props.config.activeBackground || colors.background.two
      : props.config.background || colors.background.two};

  &:hover {
    background-color: ${(props) =>
      props.config.activeBackground || colors.background.two};
  }
`;

const FilterButtonText = styled(Title)<{ config: FilterDropdownButtonConfig }>`
  font-size: 14px;
  color: ${(props) => props.config.color || colors.text};
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
          background-color: ${
            props.config.backgroundColor || colors.background.two
          };
          border-radius: ${theme.border.radius};
        `
      : `
          display: none;
        `}
`;

const MenuItem = styled.div<MenuItemConfig>`
  padding: ${(props) => props.padding || "8px 66px 8px 16px"};
  opacity: 1;
  display: flex;
  align-items: center;

  &:first-child {
    padding-top: ${(props) =>
      props.firstItemPaddingTop ? props.firstItemPaddingTop : "16px"};
  }

  &:last-child {
    padding-bottom: ${(props) =>
      props.lastItemPaddingBottom ? props.lastItemPaddingBottom : "16px"};
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
`;

type FilterDropdownProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onSelect"
> & {
  options: Array<string | { display: string; value: string }>;
  value: string;
  onSelect: (option: string) => void;
  buttonConfig?: FilterDropdownButtonConfig;
  dropdownMenuConfig?: FilterDropdownMenuConfig;
  menuItemConfig?: MenuItemConfig;
  menuItemTextConfig?: MenuItemTextConfig;
};

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  options,
  value,
  onSelect,
  buttonConfig = {},
  dropdownMenuConfig = {
    topBuffer: 8,
  },
  menuItemConfig,
  menuItemTextConfig,
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
      <MenuItem onClick={onClick} role="button" key={title} {...menuItemConfig}>
        <MenuItemText
          fontSize={menuItemTextConfig?.fontSize || 14}
          lineHeight={menuItemTextConfig?.lineHeight || 20}
        >
          {title}
        </MenuItemText>
      </MenuItem>
    ),
    [menuItemConfig, menuItemTextConfig]
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
          {value} <ButtonArrow isOpen={open} color={buttonConfig.color} />
        </FilterButtonText>
      </FilterButton>
      <AnimatePresence>
        <FilterDropdownMenu
          key={open.toString()}
          isOpen={open}
          verticalOrientation={getVerticalOrientation()}
          buttonPaddingVertical={buttonConfig.paddingVertical || 8}
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
