import React, { useMemo } from "react";
import styled from "styled-components";
import { BigNumber } from "ethers";

import { Subtitle, SecondaryText, Title } from "shared/lib/designSystem";
import { ActionButton } from "shared/lib/components/Common/buttons";
import { ACTIONS, ActionType } from "./types";
import { formatBigNumber } from "shared/lib/utils/math";
import { getAssetDecimals, getAssetDisplay } from "shared/lib/utils/asset";
import { Assets } from "shared/lib/store/types";
import {
  VaultOptions,
  VaultWithdrawalFee,
} from "shared/lib/constants/constants";
import { productCopies } from "shared/lib/components/Product/productCopies";
import { getVaultColor } from "shared/lib/utils/vault";
import { useLatestAPY } from "shared/lib/hooks/useAirtableData";

const AmountText = styled(Title)`
  font-size: 40px;
  line-height: 64px;
`;

const CurrencyText = styled(AmountText)`
  color: rgba(255, 255, 255, 0.48);
`;

const Arrow = styled.i<{ color: string }>`
  font-size: 12px;
  color: ${(props) => props.color};
`;

const PreviewStep: React.FC<{
  actionType: ActionType;
  amount: BigNumber;
  positionAmount: BigNumber;
  onClickConfirmButton: () => Promise<void>;
  asset: Assets;
  vaultOption: VaultOptions;
}> = ({
  actionType,
  amount,
  positionAmount,
  onClickConfirmButton,
  asset,
  vaultOption,
}) => {
  const isDeposit = actionType === ACTIONS.deposit;
  const actionWord = isDeposit ? "Deposit" : "Withdrawal";
  const color = getVaultColor(vaultOption);
  const latestAPY = useLatestAPY(vaultOption);

  const detailRows = useMemo(() => {
    let detailValue = "";

    switch (actionType) {
      case ACTIONS.deposit:
        detailValue = latestAPY.fetched ? latestAPY.res.toFixed(2) : "0.00";
        break;
      case ACTIONS.withdraw:
        detailValue = parseFloat(VaultWithdrawalFee[vaultOption]).toString();
        break;
    }

    return [
      { key: "Product", value: productCopies[vaultOption].title },
      { key: "Product Type", value: "Theta Vault" },
      isDeposit
        ? { key: "Approx. APY", value: `${detailValue}% APY` }
        : { key: "Withdrawal Fee", value: `${detailValue}%` },
    ];
  }, [actionType, isDeposit, latestAPY, vaultOption]);

  const originalAmount = formatBigNumber(
    positionAmount,
    5,
    getAssetDecimals(asset)
  );
  // If it's a deposit, just add to the existing positionAmount
  // If it's a withdrawal, subtract the amount and the fee, we can hardcode the fee for now
  let newAmount = isDeposit
    ? positionAmount.add(amount)
    : positionAmount.sub(amount);
  newAmount = newAmount.isNegative() ? BigNumber.from("0") : newAmount;

  const newAmountStr = formatBigNumber(newAmount, 5, getAssetDecimals(asset));

  return (
    <>
      <div
        style={{ flex: 1 }}
        className="d-flex w-100 flex-column align-items-center"
      >
        <Subtitle className="d-block text-uppercase" style={{ opacity: 0.4 }}>
          {actionWord} Amount
        </Subtitle>

        <div className="text-center">
          <AmountText>
            {formatBigNumber(amount, 4, getAssetDecimals(asset))}
          </AmountText>
          <CurrencyText> {getAssetDisplay(asset)}</CurrencyText>
        </div>

        <div className="w-100 mt-4">
          {detailRows.map((detail, index) => (
            <div
              key={index}
              className="d-flex flex-row align-items-center justify-content-between mb-4"
            >
              <SecondaryText>{detail.key}</SecondaryText>
              <Title className="text-right">{detail.value}</Title>
            </div>
          ))}
          <div className="d-flex flex-row align-items-center justify-content-between mb-4">
            <SecondaryText>Your Position</SecondaryText>
            <Title className="d-flex align-items-center text-right">
              {originalAmount} {getAssetDisplay(asset)}{" "}
              <Arrow className="fas fa-arrow-right mx-2" color={color} />{" "}
              {newAmountStr} {getAssetDisplay(asset)}
            </Title>
          </div>
        </div>
      </div>

      <ActionButton
        onClick={onClickConfirmButton}
        className="btn py-3 my-3"
        color={color}
      >
        {isDeposit ? "Deposit" : "Withdraw"} Now
      </ActionButton>
    </>
  );
};

export default PreviewStep;
