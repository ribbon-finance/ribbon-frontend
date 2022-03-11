import React, { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import moment from "moment";
import { useWeb3React } from "@web3-react/core";

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
})``;

const perPage = 5;

const allNetworks = [
  {
    display: "All Networks",
    value: "All Networks",
  },
  {
    display: READABLE_CHAIN_NAMES[Chains.Ethereum],
    value: READABLE_CHAIN_NAMES[Chains.Ethereum],
  },
  // ONLY ETH CHAIN AVAILABLE FOR NOW.
  // ...ENABLED_CHAINS.map((chain) => {
  //   return {
  //     display: READABLE_CHAIN_NAMES[chain],
  //     value: READABLE_CHAIN_NAMES[chain],
  //   };
  // }),
];

const ethGauges = Object.keys(VaultLiquidityMiningMap.lg5).map((option) => ({
  display: vaultOptionToName(option as VaultOptions) || option,
  value: vaultOptionToName(option as VaultOptions) || option,
}));

const allGauges = [
  {
    display: "All Gauges",
    value: "All Gauges",
  },
  ...ethGauges,
];

const GaugeVoting = () => {
  const { active } = useWeb3React();
  const { width } = useScreenSize();
  // const { activities } = useGovernanceActivity();
  const { transactions, loading } = useGovernanceTransactions();
  // type ActivityType = typeof activities[number];
  const animatedLoadingText = useLoadingText();

  // FILTERS
  const [filteredNetwork, setFilteredNetwork] = useState(allNetworks[0].value);
  const [filteredGauges, setFilteredGauges] = useState(allGauges[0].value);
  const [page, setPage] = useState(1);

  return (
    <div className="d-flex flex-column w-100 px-4">
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <Title fontSize={18} lineHeight={24} className="mr-4">
          Vault Gauges
        </Title>
        <FilterDropdown
          options={allNetworks}
          value={filteredNetwork}
          onSelect={setFilteredNetwork}
          dropdownMenuConfig={{
            horizontalOrientation: width > sizes.md ? "right" : "left",
            topBuffer: 8,
          }}
        />
        <FilterDropdown
          options={allGauges}
          value={filteredGauges}
          onSelect={setFilteredGauges}
          className="ml-3"
        />
        <TopPaginationContainer>
          <Pagination
            page={page}
            total={6}
            setPage={setPage}
            config={{
              hidePageNumbers: true,
            }}
          />
        </TopPaginationContainer>
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
          <Gauges>
            <SingleGaugeCard vaultOption="ryvUSDC-ETH-P-THETA" />
            <SingleGaugeCard vaultOption="rBTC-THETA" />
            <SingleGaugeCard vaultOption="rAAVE-THETA" />
            <SingleGaugeCard vaultOption="rAVAX-THETA" />
          </Gauges>
        </motion.div>
      </AnimatePresence>

      <Pagination page={page} total={6} setPage={setPage} />
    </div>
  );
};

export default GaugeVoting;
