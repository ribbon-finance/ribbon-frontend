import React, { useCallback, useRef, useState } from "react";
import styled from "styled-components";

import { BaseButton, Title } from "../../designSystem";
import colors from "../../designSystem/colors";
import theme from "../../designSystem/theme";
import useOutsideAlerter from "../../hooks/useOutsideAlerter";
import { capitalize } from "../../utils/text";
import ButtonArrow from "../Common/ButtonArrow";
import { SortBy, ActivityFilter, activityFilters, sortByList } from "./types";

const Header = styled(Title)`
  font-size: 18px;
  margin-right: 8px;
`;

const Filter = styled.div`
  position: relative;
`;

const FilterButton = styled(BaseButton)`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: ${colors.backgroundDarker};
  margin-left: 16px;

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

const FilterDropdownMenu = styled.div<{ isOpen: boolean }>`
  ${(props) =>
    props.isOpen
      ? `
          position: absolute;
          right: 0px;
          top: 48px;
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

interface VaultActivityHeaderProps {
  activityFilter: ActivityFilter;
  setActivityFilter: React.Dispatch<React.SetStateAction<ActivityFilter>>;
  sortBy: SortBy;
  setSortBy: React.Dispatch<React.SetStateAction<SortBy>>;
}

const VaultActivityHeader: React.FC<VaultActivityHeaderProps> = ({
  activityFilter,
  setActivityFilter,
  sortBy,
  setSortBy,
}) => {
  const [activityFilterOpen, setActivityFilterOpen] = useState(false);
  const [sortByOpen, setSortByOpen] = useState(false);
  const activityFilterRef = useRef<HTMLDivElement>(null);
  const sortByFilterRef = useRef<HTMLDivElement>(null);
  useOutsideAlerter(activityFilterRef, () => {
    setActivityFilterOpen(false);
  });
  useOutsideAlerter(sortByFilterRef, () => {
    setSortByOpen(false);
  });

  const renderMenuItem = useCallback(
    (title: string, onClick: () => void) => (
      <MenuItem onClick={onClick} role="button">
        <MenuItemText>{title}</MenuItemText>
      </MenuItem>
    ),
    []
  );

  return (
    <div className="d-flex align-items-center">
      <Header>Vault Activity</Header>
      <Filter ref={activityFilterRef}>
        <FilterButton
          role="button"
          onClick={() => {
            setActivityFilterOpen((open) => !open);
          }}
        >
          <FilterButtonText>
            {activityFilter} <ButtonArrow isOpen={activityFilterOpen} />
          </FilterButtonText>
        </FilterButton>
        <FilterDropdownMenu isOpen={activityFilterOpen}>
          {activityFilters.map((filterOption) =>
            renderMenuItem(capitalize(filterOption), () => {
              setActivityFilter(filterOption);
              setActivityFilterOpen(false);
            })
          )}
        </FilterDropdownMenu>
      </Filter>
      <Filter ref={sortByFilterRef}>
        <FilterButton
          role="button"
          onClick={() => {
            setSortByOpen((open) => !open);
          }}
        >
          <FilterButtonText>
            {sortBy} <ButtonArrow isOpen={sortByOpen} />
          </FilterButtonText>
        </FilterButton>
        <FilterDropdownMenu isOpen={sortByOpen}>
          {sortByList.map((sortOption) =>
            renderMenuItem(capitalize(sortOption), () => {
              setSortBy(sortOption);
              setSortByOpen(false);
            })
          )}
        </FilterDropdownMenu>
      </Filter>
    </div>
  );
};

export default VaultActivityHeader;
