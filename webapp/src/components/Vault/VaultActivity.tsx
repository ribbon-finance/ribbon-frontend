import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";

import useVaultActivity from "../../hooks/useVaultActivity";
import { ActivityFilter, activityFilters, SortBy, sortByList } from "./types";
import VaultActivityHeader from "./VaultActivityHeader";
import DesktopVaultActivityList from "./DesktopVaultActivityList";
import useScreenSize from "shared/lib/hooks/useScreenSize";
import sizes from "shared/lib/designSystem/sizes";
import MobileVaultActivityList from "./MobileVaultActivityList";
import { Title } from "shared/lib/designSystem";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";
import { VaultOptions } from "shared/lib/constants/constants";
import Pagination from "shared/lib/components/Common/Pagination";
import { AnimatePresence, motion } from "framer-motion";

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
`;

const PaginationText = styled(Title)`
  font-size: 12px;
  line-height: 16px;
  margin-left: 24px;
  margin-right: 24px;
`;

const perPage = 6;

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

  const renderPagination = useCallback(() => {
    if (loading) {
      return <PaginationText>{loadingText}</PaginationText>;
    }

    if (activities.length <= 0) {
      return (
        <PaginationText>There is currently no vault activity</PaginationText>
      );
    }

    return (
      <Pagination
        page={page}
        total={Math.ceil(activities.length / perPage)}
        setPage={setPage}
      />
    );
  }, [loading, activities, loadingText, page]);

  return (
    <>
      <VaultActivityHeader
        activityFilter={activityFilter}
        setActivityFilter={setActivityFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <AnimatePresence initial={false} exitBeforeEnter>
        <motion.div
          key={page}
          transition={{
            duration: 0.25,
            type: "keyframes",
            ease: "easeInOut",
          }}
          initial={{
            y: 50,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          exit={{
            y: 50,
            opacity: 0,
          }}
          className="w-100"
        >
          {width > sizes.md ? (
            <DesktopVaultActivityList
              activities={processedActivities}
              vaultOption={vaultOption}
            />
          ) : (
            <MobileVaultActivityList
              activities={processedActivities}
              vaultOption={vaultOption}
            />
          )}
        </motion.div>
      </AnimatePresence>
      <PaginationContainer>{renderPagination()}</PaginationContainer>
    </>
  );
};

export default VaultActivity;
