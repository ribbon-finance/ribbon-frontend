import React, { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import moment from "moment";
import { useWeb3React } from "@web3-react/core";

import { Title, SecondaryText, BaseLink } from "shared/lib/designSystem";
import FilterDropdown from "shared/lib/components/Common/FilterDropdown";
import useScreenSize from "shared/lib/hooks/useScreenSize";
import sizes from "shared/lib/designSystem/sizes";
import {
  profileActivityFilters,
  ProfileActivityFilterType,
  profileActivitySortByList,
  ProfileSortByType,
} from "./types";
import Pagination from "shared/lib/components/Common/Pagination";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import { getEtherscanURI } from "shared/lib/constants/constants";
import {
  ExternalIcon,
  IncreaseStakeAmountIcon,
  IncreaseStakeTimeIcon,
  StakeIcon,
  UnstakeIcon,
} from "shared/lib/assets/icons/icons";
import { formatBigNumberAmount } from "shared/lib/utils/math";
import { GovernanceChainID } from "../../constants/constants";
import useGovernanceTransactions from "shared/lib/hooks/useGovernanceTransactions";
import { GovernanceTransaction } from "shared/lib/models/governance";
import useLoadingText from "shared/lib/hooks/useLoadingText";

const ActivityContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  background: ${colors.background.two};
  border-radius: ${theme.border.radius};
  padding: 16px;

  &:not(:first-child) {
    margin-top: 24px;
  }
`;

const ActivityLogoContainer = styled.div<{ color?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  background: ${(props) =>
    props.color ? props.color : colors.background.four};
  border-radius: 100px;
  margin-right: 8px;

  @media (max-width: ${sizes.md}px) {
    margin-right: 24px;
  }
`;

const ExternalLink = styled.div`
  margin: 0px 0px 0px 24px;
  width: 24px;
`;

const ExternalLinkIcon = styled(ExternalIcon)`
  opacity: ${theme.hover.opacity};

  &:hover {
    opacity: 1;
  }
`;

const perPage = 5;

const ProfileActivity = () => {
  const { active } = useWeb3React();
  const { width } = useScreenSize();
  // const { activities } = useGovernanceActivity();
  const { transactions, loading } = useGovernanceTransactions();
  // type ActivityType = typeof activities[number];
  const animatedLoadingText = useLoadingText();

  const [page, setPage] = useState(1);
  const [activityFilter, setActivityFilter] =
    useState<ProfileActivityFilterType>(profileActivityFilters[0]);
  const [sortBy, setSortBy] = useState<ProfileSortByType>(
    profileActivitySortByList[0]
  );

  const processedActivities = useMemo(() => {
    const filteredTransactions = transactions.filter((transaction) => {
      switch (activityFilter) {
        case "all activity":
          return true;
        case "increase lock duration":
          return transaction.type === "increaseStakeDuration";
        case "increase lock amount":
          return transaction.type === "increaseStakeAmount";
        case "gauge boosting":
          return transaction.type === "gaugeBoosting";
        case "lock":
          return transaction.type === "stake";
        case "unlock":
          return transaction.type === "unstake";
        default:
          return transaction.type === activityFilter;
      }
    });

    filteredTransactions.sort((a, b) => {
      switch (sortBy) {
        case "latest first":
          return a.timestamp < b.timestamp ? 1 : -1;
        case "oldest first":
        default:
          return a.timestamp > b.timestamp ? 1 : -1;
      }
    });

    return filteredTransactions;
  }, [activityFilter, sortBy, transactions]);

  const getActivityLogoColor = useCallback(
    (transaction: GovernanceTransaction) => {
      switch (transaction.type) {
        case "stake":
        case "increaseStakeAmount":
        case "increaseStakeDuration":
          return `${colors.red}1F`;
        default:
          return undefined;
      }
    },
    []
  );

  const renderActivityLogo = useCallback((activity: GovernanceTransaction) => {
    switch (activity.type) {
      case "stake":
        return <StakeIcon color={colors.red} />;
      case "unstake":
        return <UnstakeIcon />;
      case "increaseStakeDuration":
        return <IncreaseStakeTimeIcon color={colors.red} />;
      case "increaseStakeAmount":
        return <IncreaseStakeAmountIcon color={colors.red} />;
    }
  }, []);

  const getActivityTitle = useCallback((activity: GovernanceTransaction) => {
    switch (activity.type) {
      case "stake":
        return "LOCKED RBN";
      case "unstake":
        return "UNLOCKED RBN";
      case "increaseStakeAmount":
        return `INCREASED LOCK AMOUNT`;
      case "increaseStakeDuration":
        return "INCREASED LOCK TIME";
      default:
        return activity.type;
    }
  }, []);

  const renderActivityData = useCallback((activity: GovernanceTransaction) => {
    switch (activity.type) {
      case "stake":
      case "unstake":
      case "increaseStakeAmount":
        return <Title>{formatBigNumberAmount(activity.amount!)} RBN</Title>;
    }
  }, []);

  const activities = useMemo(() => {
    if (!active) {
      return (
        <SecondaryText fontSize={16} lineHeight={24}>
          ---
        </SecondaryText>
      );
    }

    if (loading) {
      return (
        <SecondaryText fontSize={16} lineHeight={24}>
          {animatedLoadingText}
        </SecondaryText>
      );
    }

    if (processedActivities.length <= 0) {
      return (
        <SecondaryText fontSize={16} lineHeight={24}>
          You have no transactions
        </SecondaryText>
      );
    }

    return processedActivities
      .slice((page - 1) * perPage, page * perPage)
      .map((activity, index) => (
        <ActivityContainer key={index}>
          {/* Logo */}
          <ActivityLogoContainer color={getActivityLogoColor(activity)}>
            {renderActivityLogo(activity)}
          </ActivityLogoContainer>

          {/* Title and time */}
          <div className="d-flex flex-column mr-auto">
            <Title>{getActivityTitle(activity)}</Title>
            <SecondaryText fontSize={12} lineHeight={16} className="mt-1">
              {moment(activity.timestamp, "X").fromNow()}
            </SecondaryText>
          </div>

          {/* Data if any */}
          <div className="d-flex flex-column mr-4">
            {renderActivityData(activity)}
          </div>

          {/* External Logo */}
          <BaseLink
            to={`${getEtherscanURI(GovernanceChainID)}/tx/${activity.txhash}`}
            target="_blank"
            rel="noreferrer noopener"
            className="d-none d-md-block"
          >
            <ExternalLink>
              <ExternalLinkIcon color="white" />
            </ExternalLink>
          </BaseLink>
        </ActivityContainer>
      ));
  }, [
    active,
    animatedLoadingText,
    getActivityLogoColor,
    getActivityTitle,
    loading,
    page,
    processedActivities,
    renderActivityData,
    renderActivityLogo,
  ]);

  return (
    <div className="d-flex flex-column w-100 mt-5 mb-3">
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <Title fontSize={18} lineHeight={24} className="mr-4">
          Activity
        </Title>
        <FilterDropdown
          // @ts-ignore
          options={profileActivityFilters}
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
          options={profileActivitySortByList}
          value={sortBy}
          // @ts-ignore
          onSelect={setSortBy}
          className="ml-3"
        />
      </div>

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
          className="w-100 mb-5"
        >
          {activities}
        </motion.div>
      </AnimatePresence>

      <Pagination
        page={page}
        total={Math.ceil(processedActivities.length / perPage)}
        setPage={setPage}
      />
    </div>
  );
};

export default ProfileActivity;
