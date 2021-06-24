import { formatUnits } from "@ethersproject/units";
import { ethers } from "ethers";
import { AnimatePresence, motion } from "framer";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styled, { keyframes } from "styled-components";
import { getAssets, VaultOptions } from "../../constants/constants";
import { SecondaryText, Title } from "../../designSystem";

import colors from "../../designSystem/colors";
import theme from "../../designSystem/theme";
import { useAssetsPrice } from "../../hooks/useAssetPrice";
import useScreenSize from "../../hooks/useScreenSize";
import useTextAnimation from "../../hooks/useTextAnimation";
import { VaultAccount } from "../../models/vault";
import { Assets, AssetsList } from "../../store/types";
import {
  getAssetColor,
  getAssetDecimals,
  getAssetDisplay,
  getAssetLogo,
} from "../../utils/asset";
import { assetToUSD, formatAmount } from "../../utils/math";
import FilterDropdown from "../Common/FilterDropdown";
import FullscreenMultiselectFilters from "../Common/FullscreenMultiselectFilters";
import Pagination from "../Common/Pagination";
import { productCopies } from "./productCopies";
import EmptyResult from "./Shared/EmptyResult";
import SwitchViewButton from "./Shared/SwitchViewButton";
import Frame from "./Theta/YieldFrame";
import {
  DesktopViewType,
  VaultFilterProps,
  VaultSortBy,
  VaultSortByList,
  VaultStrategyList,
} from "./types";

const FullscreenContainer = styled(Container)<{ height: number }>`
  padding-top: 24px;
  height: ${(props) => props.height}px;
  z-index: 1;
`;

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

const VaultInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 366px;
`;

const VaultTitle = styled(Title)`
  font-size: 48px;
  line-height: 56px;
`;

const VaultSecondaryInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 280px;
`;

const VaultPositionBox = styled.div`
  margin-top: 24px;
  width: 100%;
  background: ${colors.background};
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: ${theme.border.radius};
  padding: 16px;
`;

const VaultPositionPrimaryText = styled(Title)`
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 1px;
`;

const VaultPositionSecondaryText = styled(Title)<{ roi?: number }>`
  font-size: 12px;
  line-height: 16px;

  color: ${(props) => {
    if (props.roi === undefined) {
      return colors.primaryText;
    }

    return props.roi >= 0 ? colors.green : colors.red;
  }};
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

const marquee = keyframes`
  from {
    transform: translateX(90vw);
  }

  to {
    transform: translateX(-90vw);
  }
`;

const BackgroundText = styled(Title)`
  font-size: 240px;
  color: ${colors.primaryText}0A;
  animation: ${marquee} 30s linear infinite;
  white-space: nowrap;
`;
interface DesktopProductCatalogueGridViewProps {
  variant: "landing" | "webapp";
  setView?: React.Dispatch<React.SetStateAction<DesktopViewType>>;
  onVaultPress: (vault: VaultOptions) => void;
  filteredProducts: VaultOptions[];
  vaultAccounts: {
    [key: string]: VaultAccount | undefined;
  };
}

const DesktopProductCatalogueGalleryView: React.FC<
  DesktopProductCatalogueGridViewProps & VaultFilterProps
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
  vaultAccounts,
}) => {
  const { height } = useScreenSize();
  const [page, setPage] = useState(1);
  const [currentVault, setCurrentVault] = useState<VaultOptions | undefined>(
    filteredProducts[page - 1]
  );
  const { prices: assetPrices, loading: assetPricesLoading } = useAssetsPrice({
    // @ts-ignore
    assets: AssetsList,
  });
  const loadingText = useTextAnimation(
    ["Loading", "Loading .", "Loading ..", "Loading ..."],
    250,
    assetPricesLoading
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

  const roi = useMemo(() => {
    const vault = filteredProducts[page];
    const asset = getAssets(vault);
    const vaultAccount = vaultAccounts[vault];
    const decimals = getAssetDecimals(asset);

    if (!vaultAccount) {
      return 0;
    }

    return (
      (parseFloat(
        ethers.utils.formatUnits(
          vaultAccount.totalBalance.sub(vaultAccount.totalDeposits),
          decimals
        )
      ) /
        parseFloat(
          ethers.utils.formatUnits(vaultAccount.totalDeposits, decimals)
        )) *
      100
    );
  }, [vaultAccounts, page, filteredProducts]);

  const getVaultUSDDisplay = useCallback(
    (vaultAccount: VaultAccount, asset: Assets) => {
      if (assetPricesLoading) {
        return loadingText;
      }

      return assetToUSD(
        vaultAccount.totalBalance,
        assetPrices[asset]!,
        getAssetDecimals(asset)
      );
    },
    [loadingText, assetPrices, assetPricesLoading]
  );

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

    const asset = getAssets(currentVault);
    const decimals = getAssetDecimals(asset);
    const vaultAccount = vaultAccounts[currentVault];

    return (
      <VaultInfo role="button" onClick={() => onVaultPress(currentVault)}>
        {/* Title */}
        <VaultTitle className="w-100">
          {productCopies[currentVault].title}
        </VaultTitle>

        <VaultSecondaryInfo>
          {/* Description */}
          <SecondaryText className="mt-3">
            {productCopies[currentVault].description}
          </SecondaryText>

          {/* Your position box */}
          {vaultAccount && (
            <VaultPositionBox>
              <div className="w-100 d-flex">
                <VaultPositionPrimaryText className="mr-auto">
                  Your Position
                </VaultPositionPrimaryText>
                <VaultPositionPrimaryText>
                  {`${formatAmount(
                    parseFloat(formatUnits(vaultAccount.totalBalance, decimals))
                  )} ${getAssetDisplay(asset)}`}
                </VaultPositionPrimaryText>
              </div>
              <div className="w-100 d-flex">
                <VaultPositionSecondaryText roi={roi} className="mr-auto">
                  {roi.toFixed(2)}%
                </VaultPositionSecondaryText>
                <VaultPositionSecondaryText>
                  {getVaultUSDDisplay(vaultAccount, asset)}
                </VaultPositionSecondaryText>
              </div>
            </VaultPositionBox>
          )}
        </VaultSecondaryInfo>
      </VaultInfo>
    );
  }, [
    roi,
    currentVault,
    onVaultPress,
    vaultAccounts,
    getVaultUSDDisplay,
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
                <FilterDropdown
                  // @ts-ignore
                  options={VaultSortByList}
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
                  <Frame
                    vault={currentVault}
                    onClick={() => onVaultPress(currentVault)}
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
            <BackgroundText>
              {currentVault ? productCopies[currentVault].title : ""}
            </BackgroundText>
          </motion.div>
        </AnimatePresence>
      </BackgroundContainer>
    </Container>
  );
};

export default DesktopProductCatalogueGalleryView;
