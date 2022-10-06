import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import useVaultActivity from "../../hooks/useVaultActivity";
import { ActivityFilter, activityFilters, SortBy, sortByList } from "./types";
import PoolActivityList from "./PoolActivityList";
import { VaultOptions, VaultVersion } from "../../constants/constants";
import { Title } from "shared/lib/designSystem";
import { useLocation } from "react-router-dom";
import useLoadingText from "shared/lib/hooks/useLoadingText";

const PaginationContainer = styled.div`
  display: flex;
`;

const perPage = 6;

interface VaultActivityProps {
  vault: {
    vaultOption: VaultOptions;
    vaultVersion: VaultVersion;
  };
}

const PoolActivity: React.FC<VaultActivityProps> = ({
  vault: { vaultOption, vaultVersion },
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activities, loading } = useVaultActivity(vaultOption, vaultVersion);
  const [activityFilter] = useState<ActivityFilter>(activityFilters[0]);
  const [sortBy] = useState<SortBy>(sortByList[0]);
  const [page, setPage] = useState(1);
  const loadingText = useLoadingText();
  /**
   * Default to initial state and process initial state
   */
  const [processedInitialState, setProcessedInitialState] = useState(false);
  const location = useLocation();

  const filteredActivities = useMemo(() => {
    let filteredActivities = activities;

    switch (activityFilter) {
      case "borrow":
      case "repay":
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

    return filteredActivities;
  }, [activities, activityFilter, sortBy]);

  /**
   * Process initial states
   */
  useEffect(() => {
    if (processedInitialState) {
      return;
    }

    const searchParams = new URLSearchParams(location.search);
    try {
      switch (searchParams.get("jumpTo")) {
        case "vaultActivity":
          const jumpToActivity = filteredActivities.find(
            (activity) =>
              activity.date.valueOf() ===
              parseInt(searchParams.get("activityTimestamp")!)
          );

          if (!loading && jumpToActivity) {
            setTimeout(async () => {
              if (containerRef.current) {
                containerRef.current.scrollIntoView({ behavior: "smooth" });
              }

              setPage(
                Math.min(
                  Math.ceil(
                    (filteredActivities.indexOf(jumpToActivity) + 1) / perPage
                  ),
                  1
                )
              );
            }, 800);
            setProcessedInitialState(true);
          }
          break;
      }
    } catch {
      setProcessedInitialState(true);
    }
  }, [filteredActivities, loading, location.search, processedInitialState]);

  useEffect(() => {
    const maxNumPages = Math.ceil(filteredActivities.length / perPage);
    if (page > maxNumPages) {
      setPage(maxNumPages > 0 ? maxNumPages : 1);
    }
  }, [page, filteredActivities]);

  const renderPagination = useCallback(() => {
    if (loading) {
      return (
        <Title fontSize={12} lineHeight={16}>
          {loadingText}
        </Title>
      );
    }

    if (filteredActivities.length <= 0) {
      return (
        <Title fontSize={12} lineHeight={16}>
          There is currently no pool activity
        </Title>
      );
    }

    return <></>;
  }, [loading, filteredActivities, loadingText]);

  return (
    <>
      <PoolActivityList
        activities={filteredActivities}
        vaultOption={vaultOption}
        page={page}
        setPage={setPage}
        perPage={perPage}
      />
      <PaginationContainer>{renderPagination()}</PaginationContainer>
    </>
  );
};

export default PoolActivity;
