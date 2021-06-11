import React, { useCallback, useRef, useState } from "react";
import styled from "styled-components";

import { BaseButton, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import sizes from "shared/lib/designSystem/sizes";
import theme from "shared/lib/designSystem/theme";
import useScreenSize from "shared/lib/hooks/useScreenSize";
import { capitalize } from "shared/lib/utils/text";
import ButtonArrow from "shared/lib/components/Common/ButtonArrow";
import { SortBy, ActivityFilter, activityFilters, sortByList } from "./types";
import useOutsideAlerter from "shared/lib/hooks/useOutsideAlerter";

const Header = styled(Title)`
  font-size: 18px;
  margin-right: 8px;

  @media (max-width: ${sizes.sm}px) {
    width: 100%;
  }
`;

const Filter = styled.div`
  position: relative;
  margin-left: 16px;

  @media (max-width: ${sizes.sm}px) {
    margin-top: 24px;

    &:nth-child(2) {
      margin-left: 0px;
    }
  }
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
  orientation?: "left" | "right";
}>`
  ${(props) =>
    props.isOpen
      ? `
          position: absolute;
          ${(() => {
            switch (props.orientation) {
              case "left":
                return `left: 0px;`;
              case "right":
              default:
                return `right: 0px;`;
            }
          })()}
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
  const { width } = useScreenSize();

  const renderMenuItem = useCallback(
    (title: string, onClick: () => void) => (
      <MenuItem onClick={onClick} role="button" key={title}>
        <MenuItemText>{title}</MenuItemText>
      </MenuItem>
    ),
    []
  );

  return (
    <div className="d-flex align-items-center flex-wrap">
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
        <FilterDropdownMenu
          isOpen={activityFilterOpen}
          orientation={width > sizes.sm ? "right" : "left"}
        >
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
