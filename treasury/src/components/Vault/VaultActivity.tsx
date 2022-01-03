import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";

import useVaultActivity from "shared/lib/hooks/useVaultActivity";
import { ActivityFilter, activityFilters, SortBy, sortByList } from "./types";
import VaultActivityHeader from "./VaultActivityHeader";
import DesktopVaultActivityList from "./DesktopVaultActivityList";
import useScreenSize from "shared/lib/hooks/useScreenSize";
import sizes from "shared/lib/designSystem/sizes";
import MobileVaultActivityList from "./MobileVaultActivityList";
import { Title } from "shared/lib/designSystem";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";
import { VaultOptions, VaultVersion } from "shared/lib/constants/constants";
import Pagination from "shared/lib/components/Common/Pagination";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
`;

const perPage = 6;

interface VaultActivityProps {
  vault: {
    vaultOption: VaultOptions;
    vaultVersion: VaultVersion;
  };
}

const VaultActivity: React.FC<VaultActivityProps> = ({
  vault: { vaultOption, vaultVersion },
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activities, loading } = useVaultActivity(vaultOption, vaultVersion);
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>(
    activityFilters[0]
  );

  const [sortBy, setSortBy] = useState<SortBy>(sortByList[0]);
  const { width } = useScreenSize();
  const [page, setPage] = useState(1);
  const loadingText = useTextAnimation(loading);

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

  const paginatedActivities = useMemo(() => {
    return filteredActivities.slice((page - 1) * perPage, page * perPage);
  }, [filteredActivities, page]);

  /**
   * TODO: Currently Table with Fixed Header component that comes with pagination only has desktop support, to be expenad in the future with mobile table
   */
  const renderPagination = useCallback(() => {
    if (loading) {
      return (
        <Title fontSize={12} lineHeight={16} className="mx-4">
          {loadingText}
        </Title>
      );
    }

    if (filteredActivities.length <= 0) {
      return (
        <Title fontSize={12} lineHeight={16} className="mx-4">
          There is currently no vault activity
        </Title>
      );
    }

    if (width > sizes.md) {
      return <></>;
    }

    return (
      <Pagination
        page={page}
        total={Math.ceil(filteredActivities.length / perPage)}
        setPage={setPage}
      />
    );
  }, [loading, filteredActivities, width, loadingText, page]);

  return (
    <>
      <VaultActivityHeader
        activityFilter={activityFilter}
        setActivityFilter={setActivityFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {width > sizes.md ? (
        <DesktopVaultActivityList
          activities={filteredActivities}
          vaultOption={vaultOption}
          page={page}
          setPage={setPage}
          perPage={perPage}
        />
      ) : (
        <AnimatePresence initial={false} exitBeforeEnter>
          <motion.div
            ref={containerRef}
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
            <MobileVaultActivityList
              activities={paginatedActivities}
              vaultOption={vaultOption}
            />
          </motion.div>
        </AnimatePresence>
      )}
      <PaginationContainer>{renderPagination()}</PaginationContainer>
    </>
  );
};

export default VaultActivity;
