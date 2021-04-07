import React, { useMemo, useState } from "react";

import useVaultActivity from "../../hooks/useVaultActivity";
import { ActivityFilter, activityFilters, SortBy, sortByList } from "./types";
import VaultActivityHeader from "./VaultActivityHeader";
import DesktopVaultActivityList from "./DesktopVaultActivityList";
import useScreenSize from "../../hooks/useScreenSize";
import sizes from "../../designSystem/sizes";
import MobileVaultActivityList from "./MobileVaultActivityList";

const VaultActivity = () => {
  const { activities } = useVaultActivity("ETH-THETA");
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>(
    activityFilters[0]
  );
  const [sortBy, setSortBy] = useState<SortBy>(sortByList[0]);
  const { width } = useScreenSize();

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

    return filteredActivities;
  }, [activities, activityFilter, sortBy]);

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
    </>
  );
};

export default VaultActivity;
