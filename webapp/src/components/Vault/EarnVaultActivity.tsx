import React, { useEffect, useMemo, useRef, useState } from "react";

import useVaultActivity from "shared/lib/hooks/useVaultActivity";
import { ActivityFilter, activityFilters, SortBy, sortByList } from "./types";
import EarnVaultActivityList from "./EarnVaultActivityList";
import { VaultOptions, VaultVersion } from "shared/lib/constants/constants";
import { useLocation } from "react-router-dom";

const perPage = 6;

interface VaultActivityProps {
  vault: {
    vaultOption: VaultOptions;
    vaultVersion: VaultVersion;
  };
}

const EarnVaultActivity: React.FC<VaultActivityProps> = ({
  vault: { vaultOption, vaultVersion },
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activities, loading } = useVaultActivity(vaultOption, vaultVersion);
  const [activityFilter] = useState<ActivityFilter>(activityFilters[0]);
  const [sortBy] = useState<SortBy>(sortByList[0]);
  const [page, setPage] = useState(1);

  /**
   * Default to initial state and process initial state
   */
  const [processedInitialState, setProcessedInitialState] = useState(false);
  const location = useLocation();

  const filteredActivities = useMemo(() => {
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

  return (
    <>
      <EarnVaultActivityList
        activities={filteredActivities}
        vaultOption={vaultOption}
        page={page}
        setPage={setPage}
        perPage={perPage}
      />
    </>
  );
};

export default EarnVaultActivity;
