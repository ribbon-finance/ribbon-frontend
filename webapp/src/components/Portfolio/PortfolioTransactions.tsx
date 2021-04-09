import React, { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, ethers } from "ethers";
import styled from "styled-components";
import moment from "moment";

import { SecondaryText, Subtitle, Title } from "../../designSystem";
import colors from "../../designSystem/colors";
import theme from "../../designSystem/theme";
import useAssetPrice from "../../hooks/useAssetPrice";
import useTextAnimation from "../../hooks/useTextAnimation";
import useTransactions from "../../hooks/useTransactions";
import { CurrencyType } from "../../pages/Portfolio/types";
import { ethToUSD, formatSignificantDecimals } from "../../utils/math";
import { capitalize } from "../../utils/text";
import { VaultNameOptionMap, VaultOptions } from "../../constants/constants";

const PortfolioTransactionsContainer = styled.div`
  margin-top: 48px;
  display: flex;
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
  flex-wrap: wrap;
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

interface PortfolioTransactionsProps {
  currency: CurrencyType;
}

const PortfolioTransactions: React.FC<PortfolioTransactionsProps> = ({
  currency,
}) => {
  const { transactions, loading } = useTransactions();
  const { active } = useWeb3React();
  const { price: ethPrice, loading: ethPriceLoading } = useAssetPrice({});
  const animatedLoadingText = useTextAnimation(
    ["Loading", "Loading .", "Loading ..", "Loading ..."],
    250,
    loading || ethPriceLoading
  );

  const renderTransactionAmountText = useCallback(
    (
      amount: BigNumber,
      type: "deposit" | "withdraw",
      currency: CurrencyType
    ) => {
      const prependSymbol = type === "deposit" ? "+" : "-";

      switch (currency) {
        case "usd":
          return ethPriceLoading
            ? animatedLoadingText
            : `${prependSymbol}${ethToUSD(amount, ethPrice)}`;
        case "eth":
          return `${prependSymbol}${formatSignificantDecimals(
            ethers.utils.formatEther(amount)
          )} ETH`;
      }
    },
    [ethPrice, ethPriceLoading, animatedLoadingText]
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
              currency
            )}
          </Title>
        </TransactionInfoRow>
        <TransactionInfoRow>
          <TransactionInfoText className="flex-grow-1">
            {`${transaction.type === "deposit" ? `↓` : `↑`} ${capitalize(
              transaction.type
            )} - ${moment(transaction.timestamp, "X").fromNow()}`}
          </TransactionInfoText>
          <TransactionSecondaryInfoText>
            {renderTransactionAmountText(
              transaction.amount,
              transaction.type,
              currency === "eth" ? "usd" : "eth"
            )}
          </TransactionSecondaryInfoText>
        </TransactionInfoRow>
      </TransactionContainer>
    ));
  }, [
    active,
    transactions,
    animatedLoadingText,
    loading,
    renderTransactionAmountText,
    currency,
  ]);

  return (
    <PortfolioTransactionsContainer>
      <SectionTitle>Transactions</SectionTitle>
      {renderTransactions()}
    </PortfolioTransactionsContainer>
  );
};

export default PortfolioTransactions;
