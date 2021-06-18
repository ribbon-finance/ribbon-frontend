import { motion } from "framer";
import React from "react";
import styled from "styled-components";
import { VaultOptions } from "../../constants/constants";

import colors from "../../designSystem/colors";
import sizes from "../../designSystem/sizes";
import theme from "../../designSystem/theme";
import { AssetsList } from "../../store/types";
import { getAssetDisplay } from "../../utils/asset";
import FilterDropdown from "../Common/FilterDropdown";
import MultiselectFilterDropdown from "../Common/MultiselectFilterDropdown";
import SwitchViewButton from "./Shared/SwitchViewButton";
import YieldCard from "./Theta/YieldCard";
import {
  DesktopViewType,
  VaultFilterProps,
  VaultSortBy,
  VaultSortByList,
  VaultStrategyList,
} from "./types";

const FilterContainer = styled.div`
  display: flex;
  background: ${colors.backgroundDarker};
  padding: 8px;
  border-radius: ${theme.border.radius};
  box-shadow: 4px 8px 40px rgba(0, 0, 0, 0.24);

  & > * {
    margin-right: 8px;

    &:last-child {
      margin-right: unset;
    }
  }
`;

const YieldCardsContainer = styled.ul`
  display: flex;
  width: calc(320px * 3);
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-bottom: 40px;
  padding-inline-start: 0;

  @media (max-width: ${sizes.lg}px) {
    width: calc(320px * 2);
  }
`;

const YieldCardContainer = styled(motion.li)`
  height: 492px;
  margin: 40px 15px 0px 15px; ;
`;

interface DesktopProductCatalogueGridViewProps {
  setView: React.Dispatch<React.SetStateAction<DesktopViewType>>;
  onVaultPress: (vault: VaultOptions) => void;
  filteredProducts: VaultOptions[];
}

const DesktopProductCatalogueGridView: React.FC<
  DesktopProductCatalogueGridViewProps & VaultFilterProps
> = ({ setView, onVaultPress, sort, setSort, filteredProducts }) => (
  <div className="container mt-5 d-flex flex-column align-items-center">
    <FilterContainer>
      <MultiselectFilterDropdown
        options={VaultStrategyList.map((strategy) => ({
          value: strategy,
          display: strategy,
        }))}
        title="STRATEGY"
        onSelect={() => {}}
        dropdownOrientation="left"
      />
      <MultiselectFilterDropdown
        options={AssetsList.map((asset) => ({
          value: asset,
          display: getAssetDisplay(asset),
        }))}
        title="DEPOSIT ASSET"
        onSelect={() => {}}
        dropdownOrientation="left"
      />
      <FilterDropdown
        // @ts-ignore
        options={VaultSortByList}
        value={sort}
        // @ts-ignore
        onSelect={(option: string) => {
          setSort(option as VaultSortBy);
        }}
        buttonConfig={{
          background: `${colors.primaryText}14`,
          paddingHorizontal: 16,
          paddingVertical: 12,
          color: colors.primaryText,
        }}
        dropdownMenuConfig={{
          horizontalOrientation: "left",
          topBuffer: 16,
        }}
      />

      <SwitchViewButton view="grid" setView={setView} />
    </FilterContainer>
    <YieldCardsContainer>
      {filteredProducts.map((vault) => (
        <YieldCardContainer
          key={vault}
          layout
          transition={{
            type: "keyframes",
            ease: "easeOut",
          }}
        >
          <YieldCard vault={vault} onClick={() => onVaultPress(vault)} />
        </YieldCardContainer>
      ))}
    </YieldCardsContainer>
  </div>
);

export default DesktopProductCatalogueGridView;
