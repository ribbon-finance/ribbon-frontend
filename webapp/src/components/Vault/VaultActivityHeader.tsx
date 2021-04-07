import React, { useState } from "react";
import styled from "styled-components";

import { BaseButton, Title } from "../../designSystem";
import colors from "../../designSystem/colors";
import ButtonArrow from "../Common/ButtonArrow";
import { SortBy, ActivityFilter } from "./types";

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

  return (
    <div className="d-flex align-items-center">
      <Header>Vault Activity</Header>
      <Filter>
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
      </Filter>
      <Filter>
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
      </Filter>
    </div>
  );
};

export default VaultActivityHeader;
