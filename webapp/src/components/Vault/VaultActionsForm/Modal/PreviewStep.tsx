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
import { capitalize } from "shared/lib/utils/text";

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
  receiveVaultOption?: VaultOptions;
}> = ({
  actionType,
  amount,
  positionAmount,
  onClickConfirmButton,
  asset,
  vaultOption,
  receiveVaultOption,
}) => {
  const actionWord = capitalize(actionType);
  const color = getVaultColor(vaultOption);
  const latestAPY = useLatestAPY(vaultOption);

  const detailRows = useMemo(() => {
    let actionDetails: { key: string; value: string } = { key: "", value: "" };

    switch (actionType) {
      case ACTIONS.deposit:
        actionDetails = {
          key: "Approx. APY",
          value: `${
            latestAPY.fetched ? latestAPY.res.toFixed(2) : "0.00"
          }% APY`,
        };
        break;
      case ACTIONS.withdraw:
        actionDetails = {
          key: "Withdrawal Fee",
          value: `${parseFloat(VaultWithdrawalFee[vaultOption]).toString()}%`,
        };
        break;
      case ACTIONS.transfer:
        actionDetails = {
          key: "Transfer Fee",
          value: "0.00%",
        };
    }

    if (actionType === ACTIONS.transfer) {
      return [
        {
          key: "Transfer To",
          value: productCopies[receiveVaultOption!].title,
        },
        {
          key: "Transfer From",
          value: productCopies[vaultOption].title,
        },
        actionDetails,
      ];
    }

    return [
      { key: "Product", value: productCopies[vaultOption].title },
      { key: "Product Type", value: "Theta Vault" },
      actionDetails,
    ];
  }, [actionType, latestAPY, receiveVaultOption, vaultOption]);

  const originalAmount = formatBigNumber(
    positionAmount,
    5,
    getAssetDecimals(asset)
  );

  // If it's a deposit, just add to the existing positionAmount
  // If it's a withdrawal, subtract the amount and the fee, we can hardcode the fee for now
  const newAmountStr = useMemo(() => {
    let newAmount;

    switch (actionType) {
      case ACTIONS.deposit:
        newAmount = positionAmount.add(amount);
        break;
      case ACTIONS.withdraw:
      default:
        newAmount = positionAmount.sub(amount);
        break;
    }

    newAmount = newAmount.isNegative() ? BigNumber.from("0") : newAmount;
    return formatBigNumber(newAmount, 5, getAssetDecimals(asset));
  }, [actionType, amount, asset, positionAmount]);

  const positionChanged = useMemo(() => {
    switch (actionType) {
      case ACTIONS.transfer:
        return false;
      default:
        return true;
    }
  }, [actionType]);

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
          {positionChanged && (
            <div className="d-flex flex-row align-items-center justify-content-between mb-4">
              <SecondaryText>Your Position</SecondaryText>
              <Title className="d-flex align-items-center text-right">
                {originalAmount} {getAssetDisplay(asset)}{" "}
                <Arrow className="fas fa-arrow-right mx-2" color={color} />{" "}
                {newAmountStr} {getAssetDisplay(asset)}
              </Title>
            </div>
          )}
        </div>
      </div>

      <ActionButton
        onClick={onClickConfirmButton}
        className="btn py-3 mb-4 mt-auto"
        color={color}
      >
        {actionWord} Now
      </ActionButton>
    </>
  );
};

export default PreviewStep;
