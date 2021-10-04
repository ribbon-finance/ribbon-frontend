import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";
import styled from "styled-components";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion";

import {
  BaseLink,
  SecondaryText,
  Subtitle,
  Title,
} from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import { useAssetsPrice } from "shared/lib/hooks/useAssetPrice";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";
import useTransactions from "shared/lib/hooks/useTransactions";
import { CurrencyType } from "../../pages/Portfolio/types";
import { assetToUSD, formatBigNumber } from "shared/lib/utils/math";
import { capitalize } from "shared/lib/utils/text";
import {
  getAssets,
  getEtherscanURI,
  VaultNameOptionMap,
  VaultOptions,
} from "shared/lib/constants/constants";
import { getAssetDecimals, getAssetDisplay } from "shared/lib/utils/asset";
import { Assets, AssetsList } from "shared/lib/store/types";
import { ExternalIcon, MigrateIcon } from "shared/lib/assets/icons/icons";
import { VaultTransactionType } from "shared/lib/models/vault";
import { getVaultColor } from "shared/lib/utils/vault";
import {
  PortfolioTransactionActivityFilter,
  portfolioTransactionActivityFilters,
  PortfolioTransactionSortBy,
  portfolioTransactionSortByList,
} from "./types";
import Pagination from "shared/lib/components/Common/Pagination";
import FilterDropdown from "shared/lib/components/Common/FilterDropdown";
import useScreenSize from "shared/lib/hooks/useScreenSize";
import sizes from "shared/lib/designSystem/sizes";

const PortfolioTransactionsContainer = styled.div`
  margin-top: 64px;
  display: flex;
  flex: 1;
  flex-wrap: wrap;
`;

const SectionTitle = styled(Title)`
  font-size: 18px;
  line-height: 24px;
  margin-right: 24px;

  @media (max-width: ${sizes.md}px) {
    width: 100%;
    margin-bottom: 16px;
  }
`;

const TransactionTitle = styled(Title)<{ color: string }>`
  color: ${(props) => props.color};
`;

const TransactionContainer = styled.div`
  width: 100%;
  background: ${colors.backgroundLight};
  border-radius: ${theme.border.radius};
  margin-bottom: 18px;
  padding: 16px;
  display: flex;

  &:last-child {
    margin-bottom: 40px;
  }
`;

const TransactionTypeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  background: #ffffff14;
  border-radius: 100px;
  margin-right: 8px;
  color: ${colors.primaryText};
  font-size: 20px;

  @media (max-width: ${sizes.md}px) {
    margin: auto;
    margin-right: 24px;
  }
`;

const StakeOuterCircle = styled.div`
  display: flex;
  width: 20px;
  height: 20px;
  align-items: center;
  justify-content: center;
  border: 1px solid #ffffff66;
  border-radius: 10px;
`;

const StakeCircle = styled.div<{ type: "solid" | "hollow" }>`
  height: 12px;
  width: 12px;
  border-radius: 6px;

  ${(props) => {
    switch (props.type) {
      case "solid":
        return `
          background: ${colors.primaryText};
        `;
      case "hollow":
        return `
          border: ${theme.border.width} ${theme.border.style} ${colors.primaryText}
        `;
    }
  }}
`;

const TransactionInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex: 1;
`;

const TransactionInfoRow = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 4px;

  &:last-child {
    margin-bottom: 0px;
  }
`;

const TransactionInfoText = styled(SecondaryText)<{ variant?: "dark" }>`
  color: ${colors.primaryText}A3;
  font-size: 12px;
  line-height: 16px;
  font-weight: 400;
  display: flex;
  align-items: center;

  ${(props) => {
    switch (props.variant) {
      case "dark":
        return `color: ${colors.primaryText}3D`;
      default:
        return ``;
    }
  }}
`;

const AssetDisplayTitle = styled(Title)`
  color: ${colors.text};
  text-transform: none;
  margin-left: 8px;
`;

const TransactionSecondaryInfoText = styled(Subtitle)`
  color: ${colors.primaryText}A3;
  letter-spacing: unset;
  line-height: 16px;
`;

const Divider = styled.div`
  border-left: 2px ${theme.border.style} #ffffff3d;
  height: auto;
  margin: 4px 16px 4px 16px;
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

const perPage = 6;

const PortfolioTransactions = () => {
  const { transactions, loading } = useTransactions();
  const { active } = useWeb3React();
  const { prices: assetPrices, loading: assetPricesLoading } = useAssetsPrice({
    // @ts-ignore
    assets: AssetsList,
  });
  const animatedLoadingText = useTextAnimation(loading || assetPricesLoading);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<PortfolioTransactionSortBy>(
    portfolioTransactionSortByList[0]
  );
  const [activityFilter, setActivityFilter] =
    useState<PortfolioTransactionActivityFilter>(
      portfolioTransactionActivityFilters[0]
    );
  const { width } = useScreenSize();

  const processedTransactions = useMemo(() => {
    let filteredTransactions = transactions;

    /** Filter transactions */
    switch (activityFilter) {
      case "all activity":
        break;
      default:
        filteredTransactions = transactions.filter(
          (transaction) => transaction.type === activityFilter
        );
    }

    /** Sort */
    switch (sortBy) {
      case "latest first":
        filteredTransactions.sort((a, b) =>
          a.timestamp < b.timestamp ? 1 : -1
        );
        break;
      case "oldest first":
        filteredTransactions.sort((a, b) =>
          a.timestamp > b.timestamp ? 1 : -1
        );
        break;
    }

    return filteredTransactions;
  }, [activityFilter, sortBy, transactions]);

  useEffect(() => {
    const totalNumPage = Math.ceil(processedTransactions.length / perPage);
    if (
      processedTransactions.length &&
      page > Math.ceil(processedTransactions.length / perPage)
    ) {
      setPage(totalNumPage);
    }
  }, [page, processedTransactions]);

  const getTransactionAssetText = useCallback(
    (vaultOption: VaultOptions, type: VaultTransactionType) => {
      switch (type) {
        case "stake":
        case "unstake":
          return vaultOption;
        default:
          return getAssetDisplay(getAssets(vaultOption));
      }
    },
    []
  );

  const renderTransactionAmountText = useCallback(
    (
      amount: BigNumber,
      type: VaultTransactionType,
      currency: CurrencyType,
      asset: Assets
    ) => {
      let prependSymbol = "";
      switch (type) {
        case "deposit":
        case "receive":
        case "stake":
          prependSymbol = "+";
          break;
        case "withdraw":
        case "transfer":
        case "unstake":
          prependSymbol = "-";
      }

      switch (currency) {
        case "usd":
          return assetPricesLoading
            ? animatedLoadingText
            : `${prependSymbol}${assetToUSD(
                amount,
                // @ts-ignore
                assetPrices[asset],
                getAssetDecimals(asset)
              )}`;
        case "eth":
          return `${prependSymbol}${formatBigNumber(
            amount,
            getAssetDecimals(asset)
          )} `;
      }
    },
    [assetPrices, assetPricesLoading, animatedLoadingText]
  );

  const renderTransactionSymbol = useCallback((type: VaultTransactionType) => {
    switch (type) {
      case "deposit":
      case "receive":
        return "↓";
      case "withdraw":
      case "transfer":
        return "↑";
      case "stake":
        return (
          <StakeOuterCircle>
            <StakeCircle type="solid" />
          </StakeOuterCircle>
        );
      case "unstake":
        return <StakeCircle type="hollow" />;
      case "migrate":
        return <MigrateIcon width={14} height={14} />;
    }
  }, []);

  const renderTransactions = useCallback(() => {
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

    if (processedTransactions.length <= 0) {
      return (
        <SecondaryText fontSize={16} lineHeight={24}>
          You have no transactions
        </SecondaryText>
      );
    }

    return processedTransactions
      .slice((page - 1) * perPage, page * perPage)
      .map((transaction) => (
        <TransactionContainer
          key={transaction.id}
          className="align-items-md-center"
        >
          <TransactionTypeContainer>
            {renderTransactionSymbol(transaction.type)}
          </TransactionTypeContainer>

          {/* Desktop */}
          <TransactionInfo className="d-none d-md-flex">
            <TransactionInfoRow>
              {/* Title */}
              <TransactionTitle
                color={getVaultColor(transaction.vault.symbol)}
                className="mr-auto"
              >
                {
                  Object.keys(VaultNameOptionMap)[
                    Object.values(VaultNameOptionMap).indexOf(
                      transaction.vault.symbol as VaultOptions
                    )
                  ]
                }
              </TransactionTitle>

              {/* Amount in crypto */}
              <Title>
                {renderTransactionAmountText(
                  transaction.amount,
                  transaction.type,
                  "eth",
                  getAssets(transaction.vault.symbol)
                )}
              </Title>
              <AssetDisplayTitle>
                {getTransactionAssetText(
                  transaction.vault.symbol,
                  transaction.type
                )}
              </AssetDisplayTitle>
            </TransactionInfoRow>
            <TransactionInfoRow>
              {/* Type and Time */}
              <TransactionInfoText className="mr-auto">
                {`${capitalize(transaction.type)} - ${moment(
                  transaction.timestamp,
                  "X"
                ).fromNow()}`}
              </TransactionInfoText>

              {/* Amount in USD */}
              <TransactionSecondaryInfoText>
                {renderTransactionAmountText(
                  transaction.underlyingAmount,
                  transaction.type,
                  "usd",
                  getAssets(transaction.vault.symbol)
                )}
              </TransactionSecondaryInfoText>
            </TransactionInfoRow>
          </TransactionInfo>

          {/* Mobile */}
          <TransactionInfo className="d-flex d-md-none">
            <TransactionInfoRow>
              {/* Title */}
              <TransactionTitle color={getVaultColor(transaction.vault.symbol)}>
                {
                  Object.keys(VaultNameOptionMap)[
                    Object.values(VaultNameOptionMap).indexOf(
                      transaction.vault.symbol as VaultOptions
                    )
                  ]
                }
              </TransactionTitle>

              <Divider />

              {/* Type */}
              <Title>{transaction.type}</Title>
            </TransactionInfoRow>
            <TransactionInfoRow>
              {/* Amount in crypto */}
              <TransactionInfoText className="mr-1">
                {renderTransactionAmountText(
                  transaction.amount,
                  transaction.type,
                  "eth",
                  getAssets(transaction.vault.symbol)
                )}
              </TransactionInfoText>
              <TransactionInfoText variant="dark">
                {getTransactionAssetText(
                  transaction.vault.symbol,
                  transaction.type
                )}
              </TransactionInfoText>
            </TransactionInfoRow>
            <div className="pt-2">
              {/* Type and Time */}
              <TransactionInfoText className="mr-auto">
                {moment(transaction.timestamp, "X").fromNow()}
              </TransactionInfoText>
            </div>
          </TransactionInfo>

          <BaseLink
            to={`${getEtherscanURI()}/tx/${transaction.txhash}`}
            target="_blank"
            rel="noreferrer noopener"
            className="d-none d-md-block"
          >
            <ExternalLink>
              <ExternalLinkIcon color="white" />
            </ExternalLink>
          </BaseLink>
        </TransactionContainer>
      ));
  }, [
    active,
    page,
    processedTransactions,
    animatedLoadingText,
    loading,
    renderTransactionSymbol,
    renderTransactionAmountText,
    getTransactionAssetText,
  ]);

  return (
    <PortfolioTransactionsContainer className="mb-5">
      <div className="d-flex flex-wrap align-items-center w-100 mb-4">
        <SectionTitle>Transaction History</SectionTitle>
        <FilterDropdown
          // @ts-ignore
          options={portfolioTransactionActivityFilters}
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
          options={portfolioTransactionSortByList}
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
          className="w-100"
        >
          {renderTransactions()}
        </motion.div>
      </AnimatePresence>
      <Pagination
        page={page}
        total={Math.ceil(processedTransactions.length / perPage)}
        setPage={setPage}
      />
    </PortfolioTransactionsContainer>
  );
};

export default PortfolioTransactions;
