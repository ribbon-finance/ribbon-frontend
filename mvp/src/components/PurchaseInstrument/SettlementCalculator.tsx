import React, { ReactNode, useMemo } from "react";
import styled from "styled-components";
import { PrimaryText } from "../../designSystem";
import { Product, Instrument } from "../../models";
import currencyIcons from "../../img/currencyIcons";
import {
  calculateYield,
  transposeYieldByCurrency,
} from "../../utils/yieldMath";

const Layout = styled.div`
  display: flex;
  flex: 45%;
  justify-content: flex-end;
`;

const CalculatorDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const SettlementTitle = styled(PrimaryText)`
  font-weight: bold;
  font-size: 24px;
  line-height: 28px;
  text-align: center;
  margin-bottom: 16px;
`;

const CalculatorPanel = styled.div`
  background: #ffffff;
  border: 1px solid #e3e3e3;
  box-sizing: border-box;
  box-shadow: 0px 4px 4px 1px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 22px 22px;
`;

const ExpectedPayoffRow = styled.div`
  padding: 12px 2px;
`;

const ExpectedPayoffRowWithLine = styled(ExpectedPayoffRow)`
  border-bottom: 1px solid #ececec;
`;

const ExpectedPayoffStatement = styled(PrimaryText)`
  font-size: 18px;
  line-height: 21px;
  text-align: center;
  color: #7d7d7d;
`;

const ExpectedPayoffText = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const PayoffNumbers = styled(PrimaryText)`
  font-weight: bold;
  font-size: 20px;
  line-height: 23px;
  text-align: center;
`;

const ExpectedPayoffTarget = styled(PayoffNumbers)`
  color: #627eea;
`;

const ExpectedPayoffPayment = styled(PayoffNumbers)`
  color: #2f2f2f;
`;

const TargetCurrencyIcon = styled.img`
  margin-left: 8px;
  width: 22px;
  height: 22px;
`;

type Props = {
  product: Product;
  instrument: Instrument;
  purchaseAmount: number;
  amountInput: ReactNode;
  dualButton: ReactNode;
};

const SettlementCalculator: React.FC<Props> = ({
  product,
  instrument,
  purchaseAmount,
  amountInput,
  dualButton,
}) => {
  const { targetCurrency } = product;
  const yields = useMemo(
    () =>
      calculateYield(
        purchaseAmount,
        instrument,
        product,
        instrument.targetSpotPrice
      ),
    [purchaseAmount, instrument, product]
  );
  const yieldsByCurrency = transposeYieldByCurrency(yields);
  const targetYield = yieldsByCurrency.get(product.targetCurrency);
  const paymentYield = yieldsByCurrency.get("USD");

  return (
    <Layout>
      <CalculatorDiv>
        <SettlementTitle>Settlement Calculator</SettlementTitle>
        <CalculatorPanel>
          {amountInput}

          <ExpectedPayoffRowWithLine>
            <ExpectedPayoffText>
              <ExpectedPayoffStatement>
                If price of ETH is {"<"} ${instrument.strikePrice} at expiry,
                receive:
              </ExpectedPayoffStatement>
            </ExpectedPayoffText>
            <ExpectedPayoffText style={{ marginTop: 16 }}>
              <ExpectedPayoffTarget>
                {targetYield && purchaseAmount
                  ? targetYield.amount.toFixed(4)
                  : 0}{" "}
                ETH (
                {targetYield && purchaseAmount
                  ? targetYield.percentage.toFixed(2)
                  : 0}
                % yield in {targetCurrency})
              </ExpectedPayoffTarget>
              <TargetCurrencyIcon
                src={currencyIcons[targetCurrency]}
                alt={targetCurrency}
              />
            </ExpectedPayoffText>
          </ExpectedPayoffRowWithLine>

          <ExpectedPayoffRow style={{ marginBottom: 25 }}>
            <ExpectedPayoffText>
              <ExpectedPayoffStatement>
                If price of ETH is ≥ ${instrument.strikePrice} at expiry,
                receive:
              </ExpectedPayoffStatement>
            </ExpectedPayoffText>
            <ExpectedPayoffText style={{ marginTop: 16 }}>
              <ExpectedPayoffPayment>
                {paymentYield && purchaseAmount
                  ? paymentYield.amount.toFixed(2)
                  : 0}{" "}
                USD of ETH (
                {paymentYield && purchaseAmount
                  ? paymentYield.percentage.toFixed(2)
                  : 0}
                % yield in USD)
              </ExpectedPayoffPayment>
            </ExpectedPayoffText>
          </ExpectedPayoffRow>
          {dualButton}
        </CalculatorPanel>
      </CalculatorDiv>
    </Layout>
  );
};

export default SettlementCalculator;
