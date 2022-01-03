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
import useGovernanceActivity from "../../hooks/useGovernanceActivity";
import Pagination from "shared/lib/components/Common/Pagination";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import { getVaultColor } from "shared/lib/utils/vault";
import {
  getEtherscanURI,
  getDisplayAssets,
} from "shared/lib/constants/constants";
import {
  CheckIcon,
  CloseIcon,
  DelegateIcon,
  ExternalIcon,
  StakeIcon,
  UnstakeIcon,
} from "shared/lib/assets/icons/icons";
import { formatBigNumberAmount } from "shared/lib/utils/math";
import { productCopies } from "shared/lib/components/Product/productCopies";
import { getAssetLogo } from "shared/lib/utils/asset";
import { truncateAddress } from "shared/lib/utils/address";
import { GovernanceChainID } from "../../constants/constants";

const ActivityContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  background: ${colors.background.two};
  border-radius: ${theme.border.radius};
  margin-top: 24px;
  padding: 16px;
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
    margin: auto;
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
  const { account } = useWeb3React();
  const { width } = useScreenSize();
  const { activities } = useGovernanceActivity();
  type ActivityType = typeof activities[number];

  const [page, setPage] = useState(1);
  const [activityFilter, setActivityFilter] =
    useState<ProfileActivityFilterType>(profileActivityFilters[0]);
  const [sortBy, setSortBy] = useState<ProfileSortByType>(
    profileActivitySortByList[0]
  );

  const processedActivities = useMemo(() => {
    const filteredActivities = activities.filter((activity) => {
      switch (activityFilter) {
        case "all activity":
          return true;
        case "allocate voting power":
          return activity.type === "allocateVote";
        default:
          return activity.type === activityFilter;
      }
    });

    filteredActivities.sort((a, b) => {
      switch (sortBy) {
        case "latest first":
          return a.timestamp < b.timestamp ? 1 : -1;
        case "oldest first":
        default:
          return a.timestamp > b.timestamp ? 1 : -1;
      }
    });

    return filteredActivities;
  }, [activities, activityFilter, sortBy]);

  const getActivityLogoColor = useCallback((activity: ActivityType) => {
    switch (activity.type) {
      case "allocateVote":
        return `${getVaultColor(activity.vault!)}1F`;
      case "stake":
        return `${colors.red}1F`;
      case "vote":
        return activity.vote === "for"
          ? `${colors.green}1F`
          : `${colors.red}1F`;
      default:
        return undefined;
    }
  }, []);

  const renderActivityLogo = useCallback((activity: ActivityType) => {
    switch (activity.type) {
      case "allocateVote":
        const asset = getDisplayAssets(activity.vault!);
        const Logo = getAssetLogo(asset);
        switch (asset) {
          case "WETH":
            return <Logo height="70%" />;
          default:
            return <Logo />;
        }
      case "vote":
        switch (activity.vote) {
          case "for":
            return <CheckIcon color={colors.green} />;
          default:
            return <CloseIcon color={colors.red} />;
        }
      case "stake":
        return <StakeIcon color={colors.red} />;
      case "unstake":
        return <UnstakeIcon />;
      case "delegate":
        return <DelegateIcon width="20px" />;
    }
  }, []);

  const getActivityTitle = useCallback(
    (activity: ActivityType) => {
      switch (activity.type) {
        case "allocateVote":
          return "ALLOCATED VOTING POWER";
        case "vote":
          return `VOTED ${
            activity.vote === "for" ? "FOR" : "AGAINST"
          } PROPOSAL ${activity.proposal}`;
        case "stake":
        case "unstake":
          return `${activity.type}D`;
        case "delegate":
          return (
            <>
              DELEGATED VOTES <span style={{ color: colors.text }}>TO</span>{" "}
              {activity.address === account
                ? "SELF"
                : truncateAddress(activity.address!)}
            </>
          );
        default:
          return activity.type;
      }
    },
    [account]
  );

  const renderActivityData = useCallback((activity: ActivityType) => {
    switch (activity.type) {
      case "stake":
      case "unstake":
        return <Title>{formatBigNumberAmount(activity.amount!)} RBN</Title>;
      case "allocateVote":
        return (
          <>
            <Title>
              {formatBigNumberAmount(activity.amount!)} SRBN /{" "}
              {activity.percentage}%
            </Title>
            <SecondaryText
              fontSize={12}
              lineHeight={16}
              className="mt-1 text-right"
            >
              {productCopies[activity.vault!].title}
            </SecondaryText>
          </>
        );
    }
  }, []);

  return (
    <div className="d-flex flex-column w-100 mt-5 mb-3">
      {/* Header */}
      <div className="d-flex align-items-center">
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
          {processedActivities
            .slice((page - 1) * perPage, page * perPage)
            .map((activity) => (
              <ActivityContainer>
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
                  to={`${getEtherscanURI(GovernanceChainID)}/tx/${"TODO:"}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="d-none d-md-block"
                >
                  <ExternalLink>
                    <ExternalLinkIcon color="white" />
                  </ExternalLink>
                </BaseLink>
              </ActivityContainer>
            ))}
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
