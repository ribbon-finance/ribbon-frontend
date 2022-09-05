import React from "react";
import styled from "styled-components";

import { Title } from "shared/lib/designSystem";
import sizes from "shared/lib/designSystem/sizes";
import useScreenSize from "shared/lib/hooks/useScreenSize";
import { SortBy, ActivityFilter, activityFilters, sortByList } from "./types";
import FilterDropdown from "shared/lib/components/Common/FilterDropdown";

const Header = styled(Title)`
  font-size: 18px;
  margin-right: 24px;

  @media (max-width: ${sizes.sm}px) {
    width: 100%;
    margin-bottom: 16px;
  }
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
  const { width } = useScreenSize();

  return (
    <div className="d-flex flex-wrap align-items-center flex-wrap w-100 mb-4">
      <Header>Vault Activity</Header>
      <FilterDropdown
        // @ts-ignore
        options={activityFilters}
        value={activityFilter}
        // @ts-ignore
        onSelect={setActivityFilter}
        dropdownMenuConfig={{
          horizontalOrientation: width > sizes.md ? "right" : "left",
          topBuffer: 8,
        }}
      />
      <FilterDropdown
        // @ts-ignore
        options={sortByList}
        value={sortBy}
        // @ts-ignore
        onSelect={setSortBy}
        className="ml-3"
      />
    </div>
  );
};

export default VaultActivityHeader;
