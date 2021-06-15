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

const Filter = styled.div`
  position: relative;
`;

const FilterButton = styled(BaseButton)`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: ${colors.backgroundDarker};

  &:hover {
    span {
      color: ${colors.primaryText};
    }
  }
`;

const FilterButtonText = styled(Title)`
  font-size: 14px;
  color: ${colors.primaryText}A3;
  text-transform: uppercase;
`;

const FilterDropdownMenu = styled.div<{
  isOpen: boolean;
  horizontalOrientation?: "left" | "right";
  verticalOrientation: "top" | "bottom";
}>`
  ${(props) =>
    props.isOpen
      ? `
          position: absolute;
          z-index: 2000;
          ${(() => {
            switch (props.horizontalOrientation) {
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
                return `top: 48px;`;
            }
          })()}
          width: fit-content;
          background-color: ${colors.backgroundDarker};
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
  options: string[];
  value: string;
  onSelect: (option: string) => void;
  dropdownOrientation?: "left" | "right";
}

const FilterDropdown: React.FC<
  FilterDropdownProps & React.HTMLAttributes<HTMLDivElement>
> = ({ options, value, onSelect, dropdownOrientation, ...props }) => {
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
        onClick={() => {
          setOpen((open) => !open);
        }}
      >
        <FilterButtonText>
          {value} <ButtonArrow isOpen={open} />
        </FilterButtonText>
      </FilterButton>
      <FilterDropdownMenu
        isOpen={open}
        horizontalOrientation={dropdownOrientation}
        verticalOrientation={getVerticalOrientation()}
      >
        {options.map((filterOption) =>
          renderMenuItem(capitalize(filterOption), () => {
            onSelect(filterOption);
            setOpen(false);
          })
        )}
      </FilterDropdownMenu>
    </Filter>
  );
};

export default FilterDropdown;
