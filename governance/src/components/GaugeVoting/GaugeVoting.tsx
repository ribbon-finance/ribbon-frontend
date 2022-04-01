import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import MultiselectFilterDropdown, {
  DropdownOption,
} from "shared/lib/components/Common/MultiselectFilterDropdown";
import { chunk } from "lodash";

import { Title } from "shared/lib/designSystem";
import sizes from "shared/lib/designSystem/sizes";
import Pagination from "shared/lib/components/Common/Pagination";
import colors from "shared/lib/designSystem/colors";
import {
  Chains,
  getDisplayAssets,
  READABLE_CHAIN_NAMES,
  VaultLiquidityMiningMap,
  VaultOptions,
  vaultOptionToName,
} from "shared/lib/constants/constants";
import SingleGaugeCard from "./SingleGaugeCard";
import { getAssetColor, getAssetLogo } from "shared/lib/utils/asset";
import useTVL from "shared/lib/hooks/useTVL";
import VotingActivities from "./VotingActivities";

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

const ethGauges: DropdownOption[] = Object.keys(
  VaultLiquidityMiningMap.lg5
).map((option) => {
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

const GaugeVoting = () => {
  const { data: tvlData, loading: tvlLoading } = useTVL();

  // FILTERS
  const [filteredNetworks, setFilteredNetworks] = useState(
    allNetworks.map(({ value }) => value)
  );
  const [filteredGauges, setFilteredGauges] = useState(
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
                tvl={
                  tvlData.find(
                    (tvl) => tvl.vault.option === (gauge as VaultOptions)
                  )?.tvl
                }
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
      <VotingActivities gauges={allGauges} />
    </div>
  );
};

export default GaugeVoting;
