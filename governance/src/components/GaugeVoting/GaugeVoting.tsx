import React, { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import moment from "moment";
import { useWeb3React } from "@web3-react/core";
import MultiselectFilterDropdown from "shared/lib/components/Common/MultiselectFilterDropdown";
import { chunk } from "lodash";

import { Title, SecondaryText, BaseLink } from "shared/lib/designSystem";
import FilterDropdown from "shared/lib/components/Common/FilterDropdown";
import useScreenSize from "shared/lib/hooks/useScreenSize";
import sizes from "shared/lib/designSystem/sizes";
import Pagination from "shared/lib/components/Common/Pagination";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import {
  Chains,
  ENABLED_CHAINS,
  getDisplayAssets,
  getEtherscanURI,
  READABLE_CHAIN_NAMES,
  VaultLiquidityMiningMap,
  VaultOptions,
  vaultOptionToName,
} from "shared/lib/constants/constants";
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
import { CHAINID } from "shared/lib/utils/env";
import SingleGaugeCard from "./SingleGaugeCard";
import {
  getAssetColor,
  getAssetLogo,
  getChainByAsset,
  getWalletColor,
} from "shared/lib/utils/asset";
import useTVL from "shared/lib/hooks/useTVL";

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

const Gauges = styled.div`
  display: grid;
  gap: 8px;
  grid-template-columns: 1fr;
  justify-items: center;

  @media (min-width: ${sizes.md}px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: ${sizes.lg}px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const TopPaginationContainer = styled.div.attrs({
  className: "ml-auto",
})`
  // Don't show top pagination when on mobile
  @media (max-width: ${sizes.md}px) {
    display: none;
  }
`;

const VotingActivityHeader = styled.div.attrs({
  className: "d-flex align-items-center",
})`
  margin-top: 64px;
`;

const allNetworks = [
  {
    display: READABLE_CHAIN_NAMES[Chains.Ethereum],
    value: READABLE_CHAIN_NAMES[Chains.Ethereum],
    color: "",
  },
  // ONLY ETH CHAIN AVAILABLE FOR NOW.
  // ...ENABLED_CHAINS.map((chain) => {
  //   return {
  //     display: READABLE_CHAIN_NAMES[chain],
  //     value: READABLE_CHAIN_NAMES[chain],
  //   };
  // }),
];

const ethGauges = Object.keys(VaultLiquidityMiningMap.lg5).map((option) => {
  const displayAsset = getDisplayAssets(option as VaultOptions);
  const Logo = getAssetLogo(displayAsset);
  let logo = <Logo height="100%" />;
  return {
    display: vaultOptionToName(option as VaultOptions) || option,
    value: option,
    color: getAssetColor(displayAsset),
    textColor: colors.primaryText,
    logo,
  };
});

const allGauges = [...ethGauges];

const GAUGES_PER_PAGE = 9;
const ACTIVITIES_PER_PAGE = 10;

const GaugeVoting = () => {
  const { active } = useWeb3React();
  const { width } = useScreenSize();
  // const { activities } = useGovernanceActivity();
  const { transactions, loading } = useGovernanceTransactions();
  // type ActivityType = typeof activities[number];
  const animatedLoadingText = useLoadingText();

  const { data: tvlData, loading: tvlLoading } = useTVL()

  // FILTERS
  const [filteredNetworks, setFilteredNetworks] = useState(
    allNetworks.map(({ value }) => value)
  );
  const [filteredGauges, setFilteredGauges] = useState(
    allGauges.map(({ value }) => value)
  );
  const [filteredActivityGauges, setFilteredActivityGauges] = useState(
    allGauges.map(({ value }) => value)
  );

  // PAGINATION
  const [gaugesPage, setGaugesPage] = useState(1);
  const totalGaugePages = useMemo(() => {
    return Math.ceil(filteredGauges.length / GAUGES_PER_PAGE);
  }, [filteredGauges]);

  const filteredGaugesForPage = useMemo(() => {
    return chunk(filteredGauges, GAUGES_PER_PAGE)[gaugesPage - 1] || [];
  }, [filteredGauges, gaugesPage]);

  const processedActivities = useMemo(() => {
    return [];
  }, []);

  // const activities = useMemo(() => {
  //   if (!active) {
  //     return (
  //       <SecondaryText fontSize={16} lineHeight={24}>
  //         ---
  //       </SecondaryText>
  //     );
  //   }

  //   if (loading) {
  //     return (
  //       <SecondaryText fontSize={16} lineHeight={24}>
  //         {animatedLoadingText}
  //       </SecondaryText>
  //     );
  //   }

  //   if (processedActivities.length <= 0) {
  //     return (
  //       <SecondaryText fontSize={16} lineHeight={24}>
  //         You have no transactions
  //       </SecondaryText>
  //     );
  //   }

  //   return processedActivities
  //     .slice((page - 1) * perPage, page * perPage)
  //     .map((activity, index) => (
  //       <ActivityContainer key={index}>
  //         {/* Logo */}
  //         <ActivityLogoContainer color={getActivityLogoColor(activity)}>
  //           {renderActivityLogo(activity)}
  //         </ActivityLogoContainer>

  //         {/* Title and time */}
  //         <div className="d-flex flex-column mr-auto">
  //           <Title>{getActivityTitle(activity)}</Title>
  //           <SecondaryText fontSize={12} lineHeight={16} className="mt-1">
  //             {moment(activity.timestamp, "X").fromNow()}
  //           </SecondaryText>
  //         </div>

  //         {/* Data if any */}
  //         <div className="d-flex flex-column mr-4">
  //           {renderActivityData(activity)}
  //         </div>

  //         {/* External Logo */}
  //         <BaseLink
  //           to={`${getEtherscanURI(GovernanceChainID)}/tx/${activity.txhash}`}
  //           target="_blank"
  //           rel="noreferrer noopener"
  //           className="d-none d-md-block"
  //         >
  //           <ExternalLink>
  //             <ExternalLinkIcon color="white" />
  //           </ExternalLink>
  //         </BaseLink>
  //       </ActivityContainer>
  //     ));
  // }, [
  //   active,
  //   animatedLoadingText,
  //   getActivityLogoColor,
  //   getActivityTitle,
  //   loading,
  //   page,
  //   processedActivities,
  //   renderActivityData,
  //   renderActivityLogo,
  // ]);

  return (
    <div className="d-flex flex-column w-100 px-4">
      {/* VAULT GAUGES */}
      <div className="d-flex align-items-center mb-4">
        <Title fontSize={18} lineHeight={24} className="mr-4">
          Vault Gauges
        </Title>
        <MultiselectFilterDropdown
          values={filteredNetworks}
          options={allNetworks}
          title="Networks"
          onSelect={(values) => setFilteredNetworks(values as string[])}
          buttonConfig={{
            background: colors.background.two,
            activeBackground: colors.background.three,
            paddingHorizontal: 8,
            paddingVertical: 8,
            color: `${colors.primaryText}A3`,
          }}
        />
        <MultiselectFilterDropdown
          mode="compact"
          values={filteredGauges}
          options={allGauges}
          title="Gauges"
          // Only set if values is available
          onSelect={(values) =>
            (values as string[]).length
              ? setFilteredGauges(values as string[])
              : filteredGauges
          }
          buttonConfig={{
            background: colors.background.two,
            activeBackground: colors.background.three,
            paddingHorizontal: 8,
            paddingVertical: 8,
            color: `${colors.primaryText}A3`,
          }}
          className="ml-3"
        />
        <TopPaginationContainer>
          <Pagination
            page={gaugesPage}
            total={totalGaugePages}
            setPage={setGaugesPage}
            config={{
              hidePageNumbers: true,
            }}
          />
        </TopPaginationContainer>
      </div>
      <AnimatePresence initial={false} exitBeforeEnter>
        <motion.div
          key={gaugesPage}
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
          <Gauges>
            {filteredGaugesForPage.map((gauge) => (
              <SingleGaugeCard
                key={gauge}
                vaultOption={gauge as VaultOptions}
                loading={tvlLoading}
                tvl={tvlData.find((tvl) => tvl.vault.option === gauge as VaultOptions)?.tvl}
              />
            ))}
          </Gauges>
        </motion.div>
      </AnimatePresence>
      <Pagination
        page={gaugesPage}
        total={totalGaugePages}
        setPage={setGaugesPage}
      />

      {/* VOTING ACTIVITY */}
      <VotingActivityHeader>
        <Title fontSize={18} lineHeight={24} className="mr-4">
          VOTING ACTIVITY
        </Title>
        <MultiselectFilterDropdown
          mode="compact"
          values={filteredActivityGauges}
          options={allGauges}
          title="Gauges"
          onSelect={(values) => setFilteredActivityGauges(values as string[])}
          buttonConfig={{
            background: colors.background.two,
            activeBackground: colors.background.three,
            paddingHorizontal: 8,
            paddingVertical: 8,
            color: `${colors.primaryText}A3`,
          }}
        />
      </VotingActivityHeader>
      <AnimatePresence initial={false} exitBeforeEnter>
        <motion.div
          key={gaugesPage}
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
          {/* TODO: - Activities */}
          {/* {activities} */}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default GaugeVoting;
