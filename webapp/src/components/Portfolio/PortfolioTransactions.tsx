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
import { useAssetsPrice } from "../../hooks/useAssetPrice";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";
import useTransactions from "../../hooks/useTransactions";
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
import { ExternalIcon } from "shared/lib/assets/icons/icons";
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
  margin-top: 48px;
  display: flex;
  flex: 1;
  flex-wrap: wrap;
`;

const SectionTitle = styled(Title)`
  font-size: 18px;
  line-height: 24px;
  margin-right: 24px;

  @media (max-width: ${sizes.sm}px) {
    width: 100%;
    margin-bottom: 16px;
  }
`;

const TransactionTitle = styled(Title)<{ color: string }>`
  color: ${(props) => props.color};
`;

const SectionPlaceholderText = styled(SecondaryText)`
  font-size: 16px;
  line-height: 24px;
`;

const TransactionContainer = styled.div`
  width: 100%;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: ${theme.border.radius};
  margin-bottom: 18px;
  padding: 16px;
  display: flex;
  align-items: center;

  &:last-child {
    margin-bottom: 40px;
  }
`;

const TransactionInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-grow: 1;
`;

const TransactionInfoRow = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 4px;

  &:last-child {
    margin-bottom: 0px;
  }
`;

const TransactionInfoText = styled(SecondaryText)`
  color: ${colors.primaryText}A3;
  font-size: 12px;
  line-height: 16px;
  font-weight: 400;
  display: flex;
  align-items: center;
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

const ExternalLink = styled.div`
  margin: 0 8px 0px 24px;
  width: 24px;
`;

const ExternalLinkIcon = styled(ExternalIcon)`
  opacity: 0.48;
`;

const StakeCircle = styled.div<{ type: "solid" | "hollow" }>`
  height: 8px;
  width: 8px;
  margin-right: 6px;
  border-radius: 4px;

  ${(props) => {
    switch (props.type) {
      case "solid":
        return `
          background: ${colors.text};
        `;
      case "hollow":
        return `
          border: ${theme.border.width} ${theme.border.style} ${colors.text}
        `;
    }
  }}
`;

const perPage = 6;

const PortfolioTransactions = () => {
  const { transactions, loading } = useTransactions();
  const { active } = useWeb3React();
  const { prices: assetPrices, loading: assetPricesLoading } = useAssetsPrice({
    // @ts-ignore
    assets: AssetsList,
  });
  const animatedLoadingText = useTextAnimation(
    ["Loading", "Loading .", "Loading ..", "Loading ..."],
    250,
    loading || assetPricesLoading
  );
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
      const prependSymbol =
        type === "deposit" || type === "receive" || type === "stake"
          ? "+"
          : "-";

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
            6,
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
        return <StakeCircle type="solid" />;
      case "unstake":
        return <StakeCircle type="hollow" />;
    }
  }, []);

  const renderTransactions = useCallback(() => {
    if (!active) {
      return <SectionPlaceholderText>---</SectionPlaceholderText>;
    }

    if (loading) {
      return (
        <SectionPlaceholderText>{animatedLoadingText}</SectionPlaceholderText>
      );
    }

    if (processedTransactions.length <= 0) {
      return (
        <SectionPlaceholderText>
          You have no transactions
        </SectionPlaceholderText>
      );
    }

    return processedTransactions
      .slice((page - 1) * perPage, page * perPage)
      .map((transaction) => (
        <TransactionContainer key={transaction.id}>
          <TransactionInfo>
            <TransactionInfoRow>
              {/* Title */}
              <TransactionTitle
                color={getVaultColor(transaction.vault.symbol)}
                className="flex-grow-1"
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
              {/* Type and time */}
              <TransactionInfoText className="flex-grow-1">
                {renderTransactionSymbol(transaction.type)}
                {` ${capitalize(transaction.type)} - ${moment(
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
          <BaseLink
            to={`${getEtherscanURI()}/tx/${transaction.txhash}`}
            target="_blank"
            rel="noreferrer noopener"
            className="d-none d-sm-block"
          >
            <ExternalLink>
              <ExternalLinkIcon />
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
    <PortfolioTransactionsContainer>
      <div className="d-flex flex-wrap align-items-center w-100 mb-4">
        <SectionTitle>Transactions</SectionTitle>
        <FilterDropdown
          // @ts-ignore
          options={portfolioTransactionActivityFilters}
          value={activityFilter}
          // @ts-ignore
          onSelect={setActivityFilter}
          dropdownOrientation={width > sizes.sm ? "right" : "left"}
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
