import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { CheckIcon } from "../../assets/icons/icons";

import {
  BaseButton,
  BaseModalContentColumn,
  SecondaryText,
  Title,
} from "../../designSystem";
import colors from "../../designSystem/colors";
import sizes from "../../designSystem/sizes";
import theme from "../../designSystem/theme";
import useScreenSize from "../../hooks/useScreenSize";
import BasicModal from "./BasicModal";
import ButtonArrow from "./ButtonArrow";
import MenuButton from "./MenuButton";
import MobileOverlayMenu from "./MobileOverlayMenu";

interface FilterDropdownButtonConfig {
  background: string;
  activeBackground: string;
  paddingHorizontal: number;
  paddingVertical: number;
  color: string;
}

const FilterButton = styled(BaseButton)<{
  config: FilterDropdownButtonConfig;
  active: boolean;
}>`
  display: flex;
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

const FilterHeader = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: 80px;
  align-items: center;
  background: ${colors.pillBackground};
`;

const ClearButton = styled(SecondaryText)`
  z-index: 2;
`;

const CloseButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: 48px;
  color: ${colors.text};
  z-index: 2;
`;

const HeaderTitleContainer = styled.div`
  display: flex;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const FilterFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: ${theme.footer.mobile.height}px;
`;

const SaveButton = styled(BaseButton)`
  display: flex;
  width: 100%;
  justify-content: center;
  padding: 14px 0px;
  margin: 16px 0px auto 0px;
  background: ${colors.backgroundDarker};
  border-radius: ${theme.border.radius};

  @media (max-width: ${sizes.md}px) {
    margin: 16px 15px auto 15px;
  }
`;

const FilterSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  width: 100%;
  padding: 16px;
  margin-top: 24px;

  &:first-child {
    margin-top: 0px;
  }
`;

const FilterSectionHeader = styled.div`
  display: flex;
  width: 100%;
  padding: 12px 16px;
  background: ${colors.primaryText}14;
  border-radius: ${theme.border.radius};
`;

const ModalFixedHeightColumn = styled(BaseModalContentColumn)<{
  height: number;
}>`
  display: flex;
  align-items: center;
  position: relative;
  height: ${(props) => props.height}px;
`;

const ModalMaxContentBody = styled(BaseModalContentColumn)`
  flex: 1;
  overflow: hidden;
  margin: 0px -16px 0px -16px;
`;

const ModalFooterColumn = styled.div`
  position: absolute;
  width: calc(100%);
  height: ${theme.footer.mobile.height}px;
  bottom: 0;
  left: 0;
  padding: 0px 16px 16px 16px;
  background: ${colors.primaryText}03;
  z-index: 1;

  backdrop-filter: blur(40px);
  /**
   * Firefox desktop come with default flag to have backdrop-filter disabled
   * Firefox Android also currently has bug where backdrop-filter is not being applied
   * More info: https://bugzilla.mozilla.org/show_bug.cgi?id=1178765
   **/
  @-moz-document url-prefix() {
    background-color: rgba(0, 0, 0, 0.9);
  }
`;

const MenuItem = styled.div<{ color: string; active: boolean }>`
  display: flex;
  align-items: center;
  padding: 14px 16px;
  opacity: 0.48;
  border-radius: 100px;
  background: ${(props) => `${props.color}14`};
  margin-top: 16px;
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
        opacity: ${theme.hover.opacity};
      }
    `;
  }}
`;

const LogoContainer = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  margin: -12px;
  margin-right: 8px;
  background: ${(props) => props.color}29;
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

const ScrollFilterContainer = styled.div`
  overflow: scroll;
  padding-bottom: ${theme.footer.mobile.height}px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

interface DropdownOption {
  value: string;
  display: string;
  color: string;
  textColor?: string;
  logo?: React.ReactElement;
}

interface FiltersProps {
  title: string;
  options: DropdownOption[];
  onSelect: (option: string[]) => void;
}

const FullscreenMultiselectFilter: React.FC<
  FiltersProps & { selected: string[] }
> = ({ title, selected, options, onSelect }) => {
  const renderMenuItem = useCallback(
    (option: DropdownOption) => {
      const active = selected.includes(option.value);
      const textColor = option.textColor ? option.textColor : option.color;
      return (
        <MenuItem
          onClick={() => {
            onSelect(
              selected.includes(option.value)
                ? selected.filter((curr) => curr !== option.value)
                : selected.concat(option.value)
            );
          }}
          role="button"
          key={option.value}
          color={option.color}
          active={active}
        >
          {option.logo ? (
            <LogoContainer color={option.color}>{option.logo}</LogoContainer>
          ) : (
            <></>
          )}
          <MenuItemText color={active ? textColor : colors.primaryText}>
            {option.display}
          </MenuItemText>
          <StyledCheckButton
            color={active ? textColor : colors.primaryText}
            className="ml-auto"
          />
        </MenuItem>
      );
    },
    [selected, onSelect]
  );

  return (
    <FilterSection>
      <FilterSectionHeader>
        <Title>{title}</Title>
      </FilterSectionHeader>
      {options.map((option) => renderMenuItem(option))}
    </FilterSection>
  );
};

interface FullscreenMultiselectFiltersProps {
  filters: (FiltersProps & { name: string; values: string[] })[];
  title: string;
  buttonConfig?: FilterDropdownButtonConfig;
}

const FullscreenMultiselectFilters: React.FC<
  FullscreenMultiselectFiltersProps & React.HTMLAttributes<HTMLDivElement>
> = ({
  filters,
  title,
  buttonConfig = {
    background: `${colors.primaryText}0A`,
    activeBackground: `${colors.primaryText}14`,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: `${colors.primaryText}`,
  },
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const [filterSelected, setFilterSelected] = useState(
    Object.fromEntries(filters.map((filter) => [filter.name, filter.values]))
  );
  const filterCount = Object.keys(filterSelected).reduce(
    (acc, key) => acc + filterSelected[key].length,
    0
  );
  const { width } = useScreenSize();

  // Reset back to value if not saved
  useEffect(() => {
    if (!open) {
      setFilterSelected(
        Object.fromEntries(
          filters.map((filter) => [filter.name, filter.values])
        )
      );
    }
  }, [open, filters]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleClear = useCallback(() => {
    setFilterSelected((filterSelected) =>
      Object.fromEntries(Object.keys(filterSelected).map((key) => [key, []]))
    );
  }, []);

  const handleSave = useCallback(() => {
    filters.forEach(({ name, onSelect }) => onSelect(filterSelected[name]));
    setOpen(false);
  }, [filters, filterSelected]);

  return (
    <>
      <FilterButton
        role="button"
        active={open}
        onClick={() => {
          setOpen((open) => !open);
        }}
        config={buttonConfig}
        {...props}
      >
        <FilterButtonText config={buttonConfig}>
          {title}
          {filterCount > 0 ? ` (${filterCount})` : ""}{" "}
          <ButtonArrow isOpen={open} />
        </FilterButtonText>
      </FilterButton>
      {width > sizes.md ? (
        <BasicModal
          show={open}
          height={560}
          onClose={handleClose}
          headerBackground
        >
          <>
            {/* Header */}
            <ModalFixedHeightColumn marginTop={-16} height={72}>
              <ClearButton
                className="ml-2 mr-auto"
                onClick={handleClear}
                role="button"
              >
                Clear
              </ClearButton>
              <HeaderTitleContainer>
                <Title>{title}</Title>
              </HeaderTitleContainer>
            </ModalFixedHeightColumn>

            {/* Content */}
            <ModalMaxContentBody marginTop={0}>
              <ScrollFilterContainer className="d-flex flex-wrap align-content-start w-100 flex-grow-1">
                {filters.map(({ name, title: filterTitle, options }) => (
                  <FullscreenMultiselectFilter
                    title={filterTitle}
                    selected={filterSelected[name]}
                    options={options}
                    onSelect={(selected) => {
                      setFilterSelected((filterSelected) => ({
                        ...filterSelected,
                        [name]: selected,
                      }));
                    }}
                  />
                ))}
              </ScrollFilterContainer>
            </ModalMaxContentBody>

            {/* Footer */}
            <ModalFooterColumn>
              <SaveButton role="button" onClick={handleSave}>
                <Title>VIEW RESULTS</Title>
              </SaveButton>
            </ModalFooterColumn>
          </>
        </BasicModal>
      ) : (
        <MobileOverlayMenu
          isMenuOpen={open}
          boundingDivProps={{
            className: "d-flex w-100 flex-grow-1",
          }}
          className="d-flex w-100"
        >
          <div className="d-flex flex-column flex-wrap h-100 w-100">
            {/* Header */}
            <FilterHeader>
              <ClearButton className="ml-4" onClick={handleClear} role="button">
                Clear
              </ClearButton>
              <CloseButton
                role="button"
                onClick={handleClose}
                className="ml-auto mr-3"
              >
                <MenuButton
                  isOpen
                  onToggle={handleClose}
                  size={20}
                  color="#FFFFFFA3"
                />
              </CloseButton>
              <HeaderTitleContainer>
                <Title>{title}</Title>
              </HeaderTitleContainer>
            </FilterHeader>

            {/* Content */}
            <div className="d-flex flex-wrap align-content-start w-100 flex-grow-1">
              {filters.map(({ name, title: filterTitle, options }) => (
                <FullscreenMultiselectFilter
                  title={filterTitle}
                  selected={filterSelected[name]}
                  options={options}
                  onSelect={(selected) => {
                    setFilterSelected((filterSelected) => ({
                      ...filterSelected,
                      [name]: selected,
                    }));
                  }}
                />
              ))}
            </div>

            {/* Footer */}
            <FilterFooter>
              <SaveButton role="button" onClick={handleSave}>
                <Title>VIEW RESULTS</Title>
              </SaveButton>
            </FilterFooter>
          </div>
        </MobileOverlayMenu>
      )}
    </>
  );
};

export default FullscreenMultiselectFilters;
