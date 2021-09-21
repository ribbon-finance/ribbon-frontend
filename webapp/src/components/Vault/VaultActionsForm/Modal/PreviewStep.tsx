import React, { useMemo } from "react";
import styled from "styled-components";
import { BigNumber } from "ethers";
import moment from "moment";

import { Subtitle, SecondaryText, Title } from "shared/lib/designSystem";
import { ActionButton } from "shared/lib/components/Common/buttons";
import { ACTIONS, ActionType, V2WithdrawOption } from "./types";
import { formatBigNumber } from "shared/lib/utils/math";
import { getAssetDecimals, getAssetDisplay } from "shared/lib/utils/asset";
import { Assets } from "shared/lib/store/types";
import {
  isPutVault,
  VaultOptions,
  VaultWithdrawalFee,
} from "shared/lib/constants/constants";
import { productCopies } from "shared/lib/components/Product/productCopies";
import { getVaultColor } from "shared/lib/utils/vault";
import { useLatestAPY } from "shared/lib/hooks/useAirtableData";
import { capitalize } from "shared/lib/utils/text";
import { MigrateIcon } from "shared/lib/assets/icons/icons";
import colors from "shared/lib/designSystem/colors";

const ActionLogoContainer = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 100px;
  background: ${(props) => props.color}14;
`;

const FormTitle = styled(Title)`
  font-size: 22px;
  line-height: 28px;
  letter-spacing: 1px;
`;

const Arrow = styled.i<{ color: string }>`
  font-size: 12px;
  color: ${(props) => props.color};
`;

const PreviewStep: React.FC<{
  actionType: ActionType;
  withdrawOption?: V2WithdrawOption;
  amount: BigNumber;
  positionAmount: BigNumber;
  onClickConfirmButton: () => Promise<void>;
  asset: Assets;
  vaultOption: VaultOptions;
  receiveVaultOption?: VaultOptions;
}> = ({
  actionType,
  withdrawOption,
  amount,
  positionAmount,
  onClickConfirmButton,
  asset,
  vaultOption,
  receiveVaultOption,
}) => {
  const color = getVaultColor(vaultOption);
  const latestAPY = useLatestAPY(vaultOption);

  interface ActionDetail {
    key: string;
    value: string;
  }
  const detailRows: ActionDetail[] = useMemo(() => {
    let actionDetails: ActionDetail = { key: "", value: "" };

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

    const details: ActionDetail[] = [
      { key: "Product", value: productCopies[vaultOption].title },
      { key: "Product Type", value: "Theta Vault" },
      withdrawOption === "instant" ? null : actionDetails,
    ].filter((x) => x !== null) as ActionDetail[];
    return details;
  }, [actionType, latestAPY, receiveVaultOption, vaultOption, withdrawOption]);

  const originalAmount = formatBigNumber(
    positionAmount,
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
    return formatBigNumber(newAmount, getAssetDecimals(asset));
  }, [actionType, amount, asset, positionAmount]);

  const positionChanged = useMemo(() => {
    switch (actionType) {
      case ACTIONS.transfer:
        return false;
      default:
        return true;
    }
  }, [actionType]);

  switch (actionType) {
    case ACTIONS.migrate:
      return (
        <div
          style={{ flex: 1 }}
          className="d-flex flex-column align-items-center"
        >
          {/* Logo */}
          <ActionLogoContainer color={color}>
            <MigrateIcon color={color} />
          </ActionLogoContainer>

          {/* Title */}
          <FormTitle className="mt-3">MIGRATE PREVIEW</FormTitle>

          {/* Info Preview */}
          <div className="d-flex w-100 flex-row align-items-center justify-content-between mt-4 mt-lg-auto">
            <SecondaryText>Amount</SecondaryText>
            <Title className="text-right">
              {originalAmount} {getAssetDisplay(asset)}
            </Title>
          </div>
          <div className="d-flex w-100 flex-row align-items-center justify-content-between mt-4">
            <SecondaryText>Product</SecondaryText>
            <Title className="text-right">
              {productCopies[vaultOption].title}
            </Title>
          </div>
          <div className="d-flex w-100 flex-row align-items-center justify-content-between mt-4 mb-4 mb-md-5 mb-lg-auto">
            <SecondaryText>Migration</SecondaryText>
            <Title className="d-flex align-items-center text-right">
              V1 <Arrow className="fas fa-arrow-right mx-2" color={color} /> V2
            </Title>
          </div>

          {/* Migrate Button */}
          <ActionButton
            onClick={onClickConfirmButton}
            className="btn py-3 mb-4"
            color={color}
          >
            CONFIRM MIGRATION TO V2
          </ActionButton>
        </div>
      );
    // @ts-ignore
    case ACTIONS.withdraw:
      switch (withdrawOption) {
        case "standard":
          const withdrawTime = moment()
            .isoWeekday("friday")
            .utc()
            .set("hour", 10)
            .set("minute", 0)
            .set("second", 0)
            .set("millisecond", 0);

          if (withdrawTime.isBefore(moment())) {
            withdrawTime.add(1, "week");
          }

          return (
            <div className="d-flex flex-column align-items-center">
              {/* Logo */}
              <ActionLogoContainer color={color}>
                <MigrateIcon color={color} />
              </ActionLogoContainer>

              {/* Title */}
              <FormTitle className="mt-3 text-center">
                WITHDRAWAL INITIATION PREVIEW
              </FormTitle>

              {/* Info Preview */}
              <div className="d-flex w-100 flex-row align-items-center justify-content-between mt-4">
                <SecondaryText>Withdraw Amount</SecondaryText>
                <Title className="text-right">
                  {formatBigNumber(amount, getAssetDecimals(asset))}{" "}
                  {getAssetDisplay(asset)}
                </Title>
              </div>
              <div className="d-flex w-100 flex-row align-items-center justify-content-between mt-4">
                <SecondaryText>Product</SecondaryText>
                <Title className="text-right">
                  {productCopies[vaultOption].title}
                </Title>
              </div>
              <div className="d-flex w-100 flex-row align-items-center justify-content-between mt-4">
                <SecondaryText>Strategy</SecondaryText>
                <Title className="text-right">
                  {isPutVault(vaultOption) ? "PUT SELLING" : "COVERED CALL"}
                </Title>
              </div>
              <div className="d-flex w-100 flex-row align-items-center justify-content-between mt-4">
                <SecondaryText>Withdraw Date</SecondaryText>
                <Title className="d-flex align-items-center text-right">
                  {withdrawTime.format("MMM DD, YYYY")}
                </Title>
              </div>

              {/* Migrate Button */}
              <ActionButton
                onClick={onClickConfirmButton}
                className="btn py-3 mt-4 mb-3"
                color={color}
              >
                CONFIRM WITHDRAW Initiation
              </ActionButton>
            </div>
          );
        case "complete":
          return (
            <div className="d-flex flex-column align-items-center">
              {/* Logo */}
              <ActionLogoContainer color={color}>
                <MigrateIcon color={color} />
              </ActionLogoContainer>

              {/* Title */}
              <FormTitle className="mt-3 text-center">
                WITHDRAWAL PREVIEW
              </FormTitle>

              {/* Info Preview */}
              <div className="d-flex w-100 flex-row align-items-center justify-content-between mt-4">
                <SecondaryText>Withdraw Amount</SecondaryText>
                <Title className="text-right">
                  {formatBigNumber(amount, getAssetDecimals(asset))}{" "}
                  {getAssetDisplay(asset)}
                </Title>
              </div>
              <div className="d-flex w-100 flex-row align-items-center justify-content-between mt-4">
                <SecondaryText>Product</SecondaryText>
                <Title className="text-right">
                  {productCopies[vaultOption].title}
                </Title>
              </div>
              <div className="d-flex w-100 flex-row align-items-center justify-content-between mt-4">
                <SecondaryText>Strategy</SecondaryText>
                <Title className="text-right">
                  {isPutVault(vaultOption) ? "PUT SELLING" : "COVERED CALL"}
                </Title>
              </div>

              {/* Migrate Button */}
              <ActionButton
                onClick={onClickConfirmButton}
                className="btn py-3 mt-5 mb-3"
                color={color}
              >
                COMPLETE WITHDRAWAL
              </ActionButton>
            </div>
          );
      }

    // eslint-disable-next-line no-fallthrough
    default:
      const actionWord = capitalize(actionType);
      return (
        <>
          <div
            style={{ flex: 1 }}
            className="d-flex w-100 flex-column align-items-center"
          >
            <Subtitle
              className="d-block text-uppercase"
              style={{ opacity: 0.4 }}
            >
              {actionWord} Amount
            </Subtitle>

            <div className="text-center">
              <Title fontSize={40} lineHeight={64}>
                {formatBigNumber(amount, getAssetDecimals(asset))}
              </Title>
              <Title
                fontSize={40}
                lineHeight={64}
                color={`${colors.primaryText}7A`}
              >
                {getAssetDisplay(asset)}
              </Title>
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
  }
};

export default PreviewStep;
