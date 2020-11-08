import React, { useCallback, useMemo, useState } from "react";
import { Instrument, Product } from "../../models";
import {
  CurrencyPairContainer,
  ProductContainer,
  Title,
} from "../../designSystem";
import CurrencyPair from "../../designSystem/CurrencyPair";
import styled from "styled-components";
import SettlementCalculator from "./SettlementCalculator";
import PayoffChart from "./PayoffChart";
import {
  calculateYield,
  transposeYieldByCurrency,
} from "../../utils/yieldMath";
import AmountInput from "./AmountInput";

type Props = {
  product: Product;
  instrument: Instrument;
};

const SettlementContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  padding-top: 81px;
`;

const Spacer = styled.div`
  flex: 2.5%;
`;

const PurchaseInstrument: React.FC<Props> = ({ product, instrument }) => {
  const { targetCurrency, paymentCurrency } = product;
  const [purchaseAmount, setPurchaseAmount] = useState(0.0);

  const payoffAlgo = useCallback(
    (inputPrice: number): number => {
      const allYields = calculateYield(
        purchaseAmount,
        instrument,
        product,
        inputPrice
      );
      const yieldsByCurrency = transposeYieldByCurrency(allYields);

      const settlePastStrike = inputPrice >= instrument.strikePrice;

      const payoffYield = settlePastStrike
        ? yieldsByCurrency.get(product.paymentCurrency)
        : yieldsByCurrency.get(product.targetCurrency);

      if (payoffYield && payoffYield.amount) {
        const payoffAmount = settlePastStrike
          ? payoffYield.amount
          : payoffYield.amount * inputPrice;
        return payoffAmount;
      }
      return 0;
    },
    [purchaseAmount, product, instrument]
  );

  const amountInput = useMemo(
    () => (
      <AmountInput
        paymentCurrencyAddress={instrument.paymentCurrencyAddress}
        paymentCurrencySymbol={product.paymentCurrency}
        onChange={(amount) => setPurchaseAmount(amount)}
      ></AmountInput>
    ),
    [product, instrument.paymentCurrencyAddress]
  );

  return (
    <ProductContainer>
      <Title>{product.name}</Title>

      <CurrencyPairContainer>
        <CurrencyPair
          targetCurrency={targetCurrency}
          paymentCurrency={paymentCurrency}
        ></CurrencyPair>
      </CurrencyPairContainer>

      <SettlementContainer>
        <SettlementCalculator
          product={product}
          instrument={instrument}
          purchaseAmount={purchaseAmount}
          amountInput={amountInput}
        ></SettlementCalculator>

        <Spacer></Spacer>

        <PayoffChart
          minPrice={0}
          strikePrice={instrument.strikePrice}
          maxPrice={500}
          stepSize={100}
          payoffAlgo={payoffAlgo}
        ></PayoffChart>
      </SettlementContainer>
    </ProductContainer>
  );
};

export default PurchaseInstrument;
