import React, { useState } from "react";
import styled from "styled-components";
import { PrimaryText } from "../../designSystem";
import { Product, Instrument } from "../../models";
import currencyIcons from "../../img/currencyIcons";
import AmountInput from "./AmountInput";
import { calculateYield, transposeYieldByCurrency } from "../../utils";
import DualButton from "./DualButton";

const CalculatorDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 81px;
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
};

const SettlementCalculator: React.FC<Props> = ({ product, instrument }) => {
  const { targetCurrency, paymentCurrency } = product;
  const [amount, setAmount] = useState(0.0);
  const yields = calculateYield(amount, instrument, product);
  const yieldsByCurrency = transposeYieldByCurrency(yields);
  const targetYield = yieldsByCurrency.get(product.targetCurrency);
  const paymentYield = yieldsByCurrency.get(product.paymentCurrency);

  return (
    <CalculatorDiv>
      <SettlementTitle>Settlement Calculator</SettlementTitle>
      <CalculatorPanel>
        <AmountInput
          paymentCurrency={product.paymentCurrency}
          maxAmount={1000} /* Just hardcode this for now */
          onChange={(amount) => setAmount(amount)}
        ></AmountInput>
        <ExpectedPayoffRowWithLine>
          <ExpectedPayoffText>
            <ExpectedPayoffStatement>
              If price of ETH is {"<"} ${instrument.strikePrice} at expiry,
              receive:
            </ExpectedPayoffStatement>
          </ExpectedPayoffText>
          <ExpectedPayoffText style={{ marginTop: 16 }}>
            <ExpectedPayoffTarget>
              {targetYield && amount ? targetYield.amount.toFixed(3) : 0} ETH (
              {targetYield && amount ? targetYield.percentage.toFixed(2) : 0}%
              yield in {targetCurrency})
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
              If price of ETH is ≥ ${instrument.strikePrice} at expiry, receive:
            </ExpectedPayoffStatement>
          </ExpectedPayoffText>
          <ExpectedPayoffText style={{ marginTop: 16 }}>
            <ExpectedPayoffPayment>
              {paymentYield && amount ? paymentYield.amount.toFixed(3) : 0}{" "}
              {paymentCurrency} (
              {paymentYield && amount ? paymentYield.percentage.toFixed(2) : 0}%
              yield in {paymentCurrency})
            </ExpectedPayoffPayment>
          </ExpectedPayoffText>
        </ExpectedPayoffRow>
        <DualButton paymentCurrency={paymentCurrency}></DualButton>
      </CalculatorPanel>
    </CalculatorDiv>
  );
};

export default SettlementCalculator;
