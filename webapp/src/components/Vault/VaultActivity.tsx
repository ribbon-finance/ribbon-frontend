import React, { useMemo, useState } from "react";
import styled from "styled-components";

import useVaultActivity from "../../hooks/useVaultActivity";
import { ActivityFilter, activityFilters, SortBy, sortByList } from "./types";
import VaultActivityHeader from "./VaultActivityHeader";
import DesktopVaultActivityList from "./DesktopVaultActivityList";
import useScreenSize from "../../hooks/useScreenSize";
import sizes from "../../designSystem/sizes";
import MobileVaultActivityList from "./MobileVaultActivityList";
import colors from "../../designSystem/colors";
import theme from "../../designSystem/theme";
import { Title } from "../../designSystem";
import useTextAnimation from "../../hooks/useTextAnimation";
import { VaultOptions } from "../../constants/constants";

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
`;

const ArrowButton = styled.div<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors.backgroundDarker};
  border-radius: 100px;
  width: 40px;
  height: 40px;
  ${(props) =>
    props.disabled
      ? `
          opacity: 0.24;
          cursor: default;
        `
      : `
          &:hover {
            opacity: ${theme.hover.opacity};
          }
        `}

  i {
    color: white;
  }
`;

const PaginationText = styled(Title)`
  font-size: 12px;
  line-height: 16px;
  margin-left: 24px;
  margin-right: 24px;
`;

const perPage = 10;

interface VaultActivityProps {
  vaultOption: VaultOptions;
}

const VaultActivity: React.FC<VaultActivityProps> = ({ vaultOption }) => {
  const { activities, loading } = useVaultActivity(vaultOption);
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>(
    activityFilters[0]
  );
  const [sortBy, setSortBy] = useState<SortBy>(sortByList[0]);
  const { width } = useScreenSize();
  const [page, setPage] = useState(1);
  const loadingText = useTextAnimation(
    ["Loading", "Loading .", "Loading ..", "Loading ..."],
    250,
    loading
  );

  const processedActivities = useMemo(() => {
    let filteredActivities = activities;

    switch (activityFilter) {
      case "sales":
      case "minting":
        filteredActivities = activities.filter(
          (activity) => activity.type === activityFilter
        );
    }

    switch (sortBy) {
      case "latest first":
        filteredActivities.sort((a, b) =>
          a.date.valueOf() < b.date.valueOf() ? 1 : -1
        );
        break;
      case "oldest first":
        filteredActivities.sort((a, b) =>
          a.date.valueOf() > b.date.valueOf() ? 1 : -1
        );
        break;
    }

    filteredActivities = filteredActivities.slice(
      (page - 1) * perPage,
      page * perPage
    );

    return filteredActivities;
  }, [activities, activityFilter, sortBy, page]);

  const canPrev = useMemo(() => page > 1, [page]);
  const canNext = useMemo(() => Math.ceil(activities.length / perPage) > page, [
    page,
    activities,
  ]);

  return (
    <>
      <VaultActivityHeader
        activityFilter={activityFilter}
        setActivityFilter={setActivityFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      {width > sizes.md ? (
        <DesktopVaultActivityList activities={processedActivities} />
      ) : (
        <MobileVaultActivityList activities={processedActivities} />
      )}
      <PaginationContainer>
        {loading ? (
          <PaginationText>{loadingText}</PaginationText>
        ) : (
          <>
            <ArrowButton
              role="button"
              disabled={!canPrev}
              onClick={() => {
                if (!canPrev) {
                  return;
                }

                setPage((currPage) => currPage - 1);
              }}
            >
              <i className="fas fa-arrow-left" />
            </ArrowButton>
            <PaginationText>
              {page}/{Math.ceil(activities.length / perPage)}
            </PaginationText>
            <ArrowButton
              role="button"
              disabled={!canNext}
              onClick={() => {
                if (!canNext) {
                  return;
                }

                setPage((currPage) => currPage + 1);
              }}
            >
              <i className="fas fa-arrow-right" />
            </ArrowButton>
          </>
        )}
      </PaginationContainer>
    </>
  );
};

export default VaultActivity;
