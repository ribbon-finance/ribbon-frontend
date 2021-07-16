import { motion } from "framer";
import React, { useMemo } from "react";
import styled from "styled-components";
import { VaultOptions } from "../../constants/constants";

import colors from "../../designSystem/colors";
import sizes from "../../designSystem/sizes";
import theme from "../../designSystem/theme";
import { VaultAccount } from "../../models/vault";
import { AssetsList } from "../../store/types";
import {
  getAssetColor,
  getAssetDisplay,
  getAssetLogo,
} from "../../utils/asset";
import FilterDropdown from "../Common/FilterDropdown";
import FullscreenMultiselectFilters from "../Common/FullscreenMultiselectFilters";
import MultiselectFilterDropdown from "../Common/MultiselectFilterDropdown";
import EmptyResult from "./Shared/EmptyResult";
import SwitchViewButton from "./Shared/SwitchViewButton";
import YieldCard from "./Theta/YieldCard";
import {
  DesktopViewType,
  VaultFilterProps,
  VaultSortBy,
  VaultSortByFilterOptions,
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

  @media (max-width: ${sizes.md}px) {
    width: 100%;
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

  @media (max-width: ${sizes.md}px) {
    width: 100%;
    justify-content: center;
  }
`;

const YieldCardContainer = styled(motion.li)`
  height: 492px;
  margin: 40px 15px 0px 15px;
  margin-block-end: 0px;
  list-style-type: none;
`;

const EmptyContainer = styled.div`
  height: 60vh;
  width: 100%;

  @media (max-width: ${sizes.sm}px) {
    height: unset;
    margin-top: 60px;
  }
`;

interface ProductCatalogueGridViewProps {
  setView?: React.Dispatch<React.SetStateAction<DesktopViewType>>;
  onVaultPress: (vault: VaultOptions) => void;
  filteredProducts: VaultOptions[];
  vaultAccounts: {
    [key: string]: VaultAccount | undefined;
  };
  variant: "desktop" | "mobile";
}

const ProductCatalogueGridView: React.FC<
  ProductCatalogueGridViewProps & VaultFilterProps
> = ({
  setView,
  onVaultPress,
  sort,
  setSort,
  filterStrategies,
  setFilterStrategies,
  filterAssets,
  setFilterAssets,
  filteredProducts,
  vaultAccounts,
  variant,
}) => {
  const productResults = useMemo(() => {
    if (!filteredProducts.length) {
      return (
        <EmptyContainer>
          <EmptyResult
            setFilterAssets={setFilterAssets}
            setFilterStrategies={setFilterStrategies}
          />
        </EmptyContainer>
      );
    }

    return (
      <YieldCardsContainer>
        {filteredProducts.map((vault) => (
          <YieldCardContainer
            key={vault}
            layout
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.4,
              type: "keyframes",
              ease: "easeOut",
            }}
          >
            <YieldCard
              vault={vault}
              onClick={() => onVaultPress(vault)}
              vaultAccount={vaultAccounts[vault]}
            />
          </YieldCardContainer>
        ))}
      </YieldCardsContainer>
    );
  }, [
    setFilterAssets,
    setFilterStrategies,
    filteredProducts,
    onVaultPress,
    vaultAccounts,
  ]);

  return (
    <div className="container mt-5 d-flex flex-column align-items-center">
      {/* Filters */}
      <FilterContainer>
        {variant === "desktop" ? (
          <>
            {/* Strategy */}
            <MultiselectFilterDropdown
              values={filterStrategies}
              options={VaultStrategyList.map((strategy) => ({
                value: strategy,
                display: strategy,
                color: colors.green,
              }))}
              title="STRATEGY"
              // @ts-ignore
              onSelect={setFilterStrategies}
            />
            {/* Assets */}
            <MultiselectFilterDropdown
              values={filterAssets}
              options={AssetsList.map((asset) => {
                const Logo = getAssetLogo(asset);
                let logo = <Logo />;
                switch (asset) {
                  case "WETH":
                    logo = <Logo height="70%" />;
                }
                return {
                  value: asset,
                  display: getAssetDisplay(asset),
                  color: getAssetColor(asset),
                  textColor: colors.primaryText,
                  logo: logo,
                };
              })}
              title="DEPOSIT ASSET"
              // @ts-ignore
              onSelect={setFilterAssets}
            />{" "}
          </>
        ) : (
          <FullscreenMultiselectFilters
            filters={[
              {
                name: "strategy",
                title: "STRATEGY",
                values: filterStrategies,
                options: VaultStrategyList.map((strategy) => ({
                  value: strategy,
                  display: strategy,
                  color: colors.green,
                })),
                // @ts-ignore
                onSelect: setFilterStrategies,
              },
              {
                name: "asset",
                title: "DEPOSIT ASSET",
                values: filterAssets,
                options: AssetsList.map((asset) => {
                  const Logo = getAssetLogo(asset);
                  let logo = <Logo />;
                  switch (asset) {
                    case "WETH":
                      logo = <Logo height="70%" />;
                  }
                  return {
                    value: asset,
                    display: getAssetDisplay(asset),
                    color: getAssetColor(asset),
                    textColor: colors.primaryText,
                    logo: logo,
                  };
                }),
                // @ts-ignore
                onSelect: setFilterAssets,
              },
            ]}
            title="FILTERS"
            className="flex-grow-1 "
          />
        )}
        {/* Sort */}
        <FilterDropdown
          options={VaultSortByFilterOptions}
          value={sort}
          // @ts-ignore
          onSelect={(option: string) => {
            setSort(option as VaultSortBy);
          }}
          buttonConfig={{
            background: `${colors.primaryText}0A`,
            activeBackground: `${colors.primaryText}14`,
            paddingHorizontal: 16,
            paddingVertical: 12,
            color: colors.primaryText,
          }}
          dropdownMenuConfig={{
            horizontalOrientation: "right",
            topBuffer: 16,
          }}
          className="flex-grow-1"
        />
        {setView && <SwitchViewButton view="grid" setView={setView} />}
      </FilterContainer>
      {productResults}
    </div>
  );
};

export default ProductCatalogueGridView;
