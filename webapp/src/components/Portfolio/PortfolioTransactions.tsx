import React, { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";
import styled from "styled-components";
import moment from "moment";

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
import { capitalize } from "../../utils/text";
import {
  getAssets,
  getEtherscanURI,
  VaultNameOptionMap,
  VaultOptions,
} from "shared/lib/constants/constants";
import { getAssetDecimals, getAssetDisplay } from "shared/lib/utils/asset";
import { Assets, AssetsList } from "shared/lib/store/types";
import { ExternalIcon } from "shared/lib/assets/icons/icons";

const PortfolioTransactionsContainer = styled.div`
  margin-top: 48px;
  display: flex;
  flex: 1;
  flex-wrap: wrap;
`;

const SectionTitle = styled(Title)`
  width: 100%;
  font-size: 18px;
  line-height: 24px;
  margin-bottom: 24px;
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

  const renderTransactionAmountText = useCallback(
    (
      amount: BigNumber,
      type: "deposit" | "withdraw" | "transfer" | "receive",
      currency: CurrencyType,
      asset: Assets
    ) => {
      const prependSymbol =
        type === "deposit" || type === "receive" ? "+" : "-";

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
          )} ${getAssetDisplay(asset)}`;
      }
    },
    [assetPrices, assetPricesLoading, animatedLoadingText]
  );

  const renderTransactions = useCallback(() => {
    if (!active) {
      return <SectionPlaceholderText>---</SectionPlaceholderText>;
    }

    if (loading) {
      return (
        <SectionPlaceholderText>{animatedLoadingText}</SectionPlaceholderText>
      );
    }

    if (transactions.length <= 0) {
      return (
        <SectionPlaceholderText>
          You have no previous transactions on Ribbon
        </SectionPlaceholderText>
      );
    }

    return transactions.map((transaction) => (
      <TransactionContainer key={transaction.id}>
        <TransactionInfo>
          <TransactionInfoRow>
            <Title className="flex-grow-1">
              {
                Object.keys(VaultNameOptionMap)[
                  Object.values(VaultNameOptionMap).indexOf(
                    transaction.vault.symbol as VaultOptions
                  )
                ]
              }
            </Title>
            <Title>
              {renderTransactionAmountText(
                transaction.amount,
                transaction.type,
                "eth",
                getAssets(transaction.vault.symbol)
              )}
            </Title>
          </TransactionInfoRow>
          <TransactionInfoRow>
            <TransactionInfoText className="flex-grow-1">
              {`${
                transaction.type === "deposit" || transaction.type === "receive"
                  ? `↓`
                  : `↑`
              } ${capitalize(transaction.type)} - ${moment(
                transaction.timestamp,
                "X"
              ).fromNow()}`}
            </TransactionInfoText>
            <TransactionSecondaryInfoText>
              {renderTransactionAmountText(
                transaction.amount,
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
        >
          <ExternalLink>
            <ExternalLinkIcon />
          </ExternalLink>
        </BaseLink>
      </TransactionContainer>
    ));
  }, [
    active,
    transactions,
    animatedLoadingText,
    loading,
    renderTransactionAmountText,
  ]);

  return (
    <PortfolioTransactionsContainer>
      <SectionTitle>Transactions</SectionTitle>
      {renderTransactions()}
    </PortfolioTransactionsContainer>
  );
};

export default PortfolioTransactions;
