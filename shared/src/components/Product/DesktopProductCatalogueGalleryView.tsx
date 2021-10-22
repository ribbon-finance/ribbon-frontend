import { AnimatePresence, motion } from "framer";
import React, { useEffect, useMemo, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styled from "styled-components";
import Marquee from "react-fast-marquee/dist";

import {
  VaultOptions,
  VaultVersion,
  VaultVersionList,
} from "../../constants/constants";
import { SecondaryText, Title } from "../../designSystem";
import colors from "../../designSystem/colors";
import theme from "../../designSystem/theme";
import useScreenSize from "../../hooks/useScreenSize";
import { AssetsList } from "../../store/types";
import {
  getAssetColor,
  getAssetDisplay,
  getAssetLogo,
} from "../../utils/asset";
import FilterDropdown from "../Common/FilterDropdown";
import FullscreenMultiselectFilters from "../Common/FullscreenMultiselectFilters";
import Pagination from "../Common/Pagination";
import { productCopies } from "./productCopies";
import EmptyResult from "./Shared/EmptyResult";
import SwitchViewButton from "./Shared/SwitchViewButton";
import YieldFrame from "./Theta/YieldFrame";
import {
  DesktopViewType,
  VaultFilterProps,
  VaultsDisplayVersionProps,
  VaultSortBy,
  VaultSortByFilterOptions,
  VaultStrategyList,
} from "./types";
import YourPosition from "../Vault/YourPosition";
import { useWeb3React } from "@web3-react/core";

const FullscreenContainer = styled(Container)<{ height: number }>`
  padding-top: 24px;
  height: ${(props) => props.height}px;
  z-index: 2;
`;

const FilterContainer = styled.div`
  display: flex;
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

const VaultInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 366px;
`;

const VaultSecondaryInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 280px;
`;

const VaultFrameContainer = styled(motion.div)`
  backdrop-filter: blur(16px);
`;

const EmptyResultContainer = styled.div`
  width: 100%;
  margin-right: -50%;
  z-index: 1;
`;

const BackgroundContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
`;

const BackgroundText = styled(Title)`
  font-size: 240px;
  color: ${colors.primaryText}14;
  white-space: nowrap;
`;

interface DesktopProductCatalogueGridViewProps {
  variant: "landing" | "webapp";
  setView?: React.Dispatch<React.SetStateAction<DesktopViewType>>;
  onVaultPress: (vault: VaultOptions, vaultVersion: VaultVersion) => void;
  filteredProducts: VaultOptions[];
}

const DesktopProductCatalogueGalleryView: React.FC<
  DesktopProductCatalogueGridViewProps &
    VaultFilterProps &
    VaultsDisplayVersionProps
> = ({
  variant,
  setView,
  onVaultPress,
  filteredProducts,
  sort,
  setSort,
  filterStrategies,
  setFilterStrategies,
  filterAssets,
  setFilterAssets,
  vaultsDisplayVersion,
  setVaultDisplayVersion,
}) => {
  const { active } = useWeb3React();
  const { height } = useScreenSize();
  const [page, setPage] = useState(1);
  const [currentVault, setCurrentVault] = useState<VaultOptions | undefined>(
    filteredProducts[page - 1]
  );
  const [vaultVersion, setVaultVersion] = useState<VaultVersion>(
    VaultVersionList[0]
  );

  // Prevent page overflow
  useEffect(() => {
    if (filteredProducts.length <= 0) {
      setCurrentVault(undefined);
      return;
    }

    let currPage = page;
    if (page > filteredProducts.length) {
      currPage = filteredProducts.length;
      setPage(currPage);
    }
    setCurrentVault(filteredProducts[currPage - 1]);
  }, [page, filteredProducts]);

  const vaultInfo = useMemo(() => {
    if (!currentVault) {
      return (
        <EmptyResultContainer>
          <EmptyResult
            setFilterAssets={setFilterAssets}
            setFilterStrategies={setFilterStrategies}
          />
        </EmptyResultContainer>
      );
    }

    return (
      <VaultInfo>
        {/* Title */}
        <Title fontSize={48} lineHeight={56} className="w-100">
          {productCopies[currentVault].title}
        </Title>

        <VaultSecondaryInfo>
          {/* Description */}
          <SecondaryText className="mt-3">
            {productCopies[currentVault].description}
          </SecondaryText>

          {active && (
            <div className="mt-4">
              <YourPosition
                vault={{ vaultOption: currentVault, vaultVersion }}
                variant="desktop"
                alwaysShowPosition
              />
            </div>
          )}
        </VaultSecondaryInfo>
      </VaultInfo>
    );
  }, [
    active,
    currentVault,
    vaultVersion,
    setFilterAssets,
    setFilterStrategies,
  ]);

  return (
    <Container fluid className="position-relative px-0 d-flex">
      <FullscreenContainer
        height={
          variant === "webapp"
            ? height - theme.header.height - theme.footer.desktop.height
            : 500
        }
      >
        <Row className="h-100 align-content-start">
          {/* Left Column */}
          <Col xs="6" className="d-flex flex-wrap h-100 flex-column">
            {/* Filters */}
            <div className="d-flex mr-auto">
              <FilterContainer>
                <FullscreenMultiselectFilters
                  filters={[
                    {
                      name: "strategy",
                      title: "STRATEGY",
                      values: filterStrategies,
                      options: VaultStrategyList.map((strategy) => ({
                        value: strategy,
                        display: strategy,
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
                <FilterDropdown
                  options={VaultSortByFilterOptions}
                  value={sort}
                  // @ts-ignore
                  onSelect={(option: string) => {
                    setSort(option as VaultSortBy);
                  }}
                  buttonConfig={{
                    background: colors.background.two,
                    activeBackground: colors.background.three,
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
                {setView && variant === "webapp" && (
                  <SwitchViewButton view="gallery" setView={setView} />
                )}
              </FilterContainer>
            </div>

            {/* Vault Info */}
            <AnimatePresence exitBeforeEnter>
              <motion.div
                key={currentVault}
                className="d-flex justify-content-end mt-auto mb-auto"
                transition={{
                  duration: 0.25,
                  type: "keyframes",
                  ease: "easeOut",
                }}
                initial={{
                  opacity: 0,
                  y: 100,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 100,
                }}
              >
                {vaultInfo}
              </motion.div>
            </AnimatePresence>

            {/* Pagination */}
            <div className="mr-auto mb-4">
              <Pagination
                page={page}
                total={filteredProducts.length}
                setPage={setPage}
                variant="buttonLeft"
              />
            </div>
          </Col>

          {/* Right column */}
          <Col xs="6" className="d-flex align-items-center h-100">
            <AnimatePresence exitBeforeEnter>
              <VaultFrameContainer
                key={currentVault}
                transition={{
                  duration: 0.35,
                  type: "keyframes",
                  ease: "easeOut",
                }}
                initial={{
                  opacity: 0,
                  y: 100,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 100,
                }}
                className="d-flex ml-5"
              >
                {currentVault && (
                  <YieldFrame
                    vault={currentVault}
                    vaultVersion={vaultsDisplayVersion[currentVault]}
                    onVaultPress={onVaultPress}
                    updateVaultVersionHook={setVaultVersion}
                    onVaultVersionChange={(version) =>
                      setVaultDisplayVersion(currentVault, version)
                    }
                  />
                )}
              </VaultFrameContainer>
            </AnimatePresence>
          </Col>
        </Row>
      </FullscreenContainer>
      <BackgroundContainer>
        <AnimatePresence exitBeforeEnter>
          <motion.div
            key={currentVault}
            className="d-flex justify-content-end mt-auto mb-auto"
            transition={{
              duration: 0.25,
              type: "keyframes",
              ease: "easeOut",
            }}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
          >
            <Marquee gradient={false} speed={75}>
              <BackgroundText>
                {currentVault ? productCopies[currentVault].title : ""}
              </BackgroundText>
            </Marquee>
          </motion.div>
        </AnimatePresence>
      </BackgroundContainer>
    </Container>
  );
};

export default DesktopProductCatalogueGalleryView;
