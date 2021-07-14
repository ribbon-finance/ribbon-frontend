import React from "react";
import styled from "styled-components";
import moment from "moment";

import { SecondaryText, Title } from "shared/lib/designSystem";
import useLBPPoolTransactions from "../../hooks/useLBPPoolTransactions";
import TableWithFixedHeader from "shared/lib/components/Common/TableWithFixedHeader";
import { getEtherscanURI } from "shared/lib/constants/constants";
import { assetToUSD, formatBigNumber } from "shared/lib/utils/math";
import { truncateAddress } from "shared/lib/utils/address";

const SectionTitle = styled(Title)`
  font-size: 18px;
  line-height: 20px;
`;

const TransactionPrimaryText = styled(Title)<{}>`
  &:not(:last-child) {
    margin-bottom: 4px;
  }
`;

const TransactionSecondaryText = styled(SecondaryText)<{
  fontFamily?: string;
}>`
  font-size: 12px;
  ${(props) =>
    props.fontFamily ? `font-family: ${props.fontFamily}, sans-serif;` : ""}
`;

const PoolTransaction = () => {
  const { transactions } = useLBPPoolTransactions();

  return (
    <div className="d-flex flex-column">
      <SectionTitle>Pool Transactions</SectionTitle>
      <TableWithFixedHeader
        weights={[0.3, 0.3, 0.15, 0.25]}
        orientations={["left", "left", "left", "right"]}
        labels={["Action", "Account", "Price", "Quantity"]}
        data={transactions.map((transaction) => [
          <>
            <TransactionPrimaryText>
              {transaction.type === "buy" ? "BOUGHT" : "SOLD"}
            </TransactionPrimaryText>
            <TransactionSecondaryText>
              {moment(transaction.timestamp, "X").fromNow()}
            </TransactionSecondaryText>
          </>,
          <TransactionPrimaryText>
            {truncateAddress(transaction.address)}
          </TransactionPrimaryText>,
          <TransactionPrimaryText>
            ${transaction.price.toFixed(6)}
          </TransactionPrimaryText>,
          <>
            <TransactionPrimaryText>
              {formatBigNumber(transaction.amount)} RBN
            </TransactionPrimaryText>
            <TransactionSecondaryText fontFamily="VCR">
              {assetToUSD(transaction.amount, transaction.price, 18)}
            </TransactionSecondaryText>
          </>,
        ])}
        externalLinks={transactions.map(
          (transaction) => `${getEtherscanURI()}/tx/${transaction.txhash}`
        )}
      />
    </div>
  );
};

export default PoolTransaction;
