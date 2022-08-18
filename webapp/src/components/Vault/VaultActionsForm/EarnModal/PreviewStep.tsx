import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import { BigNumber } from "ethers";
import { useTranslation } from "react-i18next";

import { SecondaryText, Title, PrimaryText } from "shared/lib/designSystem";
import { ActionButton } from "shared/lib/components/Common/buttons";
import { ACTIONS, ActionType, V2WithdrawOption } from "./types";
import { formatBigNumber } from "shared/lib/utils/math";
import { getAssetDecimals, getAssetDisplay } from "shared/lib/utils/asset";
import { Assets } from "shared/lib/store/types";
import {
  VaultOptions,
  VaultFees,
  VaultVersion,
  isPutVault,
  isNativeToken,
} from "shared/lib/constants/constants";
import { getVaultColor } from "shared/lib/utils/vault";
import { capitalize } from "shared/lib/utils/text";
import {
  DepositIcon,
  MigrateIcon,
  TransferIcon,
  WithdrawIcon,
} from "shared/lib/assets/icons/icons";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import { useV2VaultData } from "shared/lib/hooks/web3DataContext";
import useLatestAPY from "shared/lib/hooks/useLatestAPY";
import useVaultPriceHistory from "shared/lib/hooks/useVaultPerformanceUpdate";
import { parseUnits } from "ethers/lib/utils";
import HelpInfo from "shared/lib/components/Common/HelpInfo";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import moment from "moment";

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

const WithdrawalStepsCircle = styled.div<{ active: boolean; color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  border-radius: 32px;
  background: ${(props) => props.color}14;

  ${(props) =>
    props.active
      ? `
          border: ${theme.border.width} ${theme.border.style} ${props.color};
        `
      : ``}
`;

const WithdrawalStepsDividerLine = styled.div<{ color: string }>`
  width: 40px;
  height: 1px;
  background: ${(props) => props.color}3D;
  margin-top: calc((32px - 1px) / 2);
`;

const WarningContainer = styled.div<{ color: string }>`
  padding: 8px;
  background: ${(props) => props.color}14;
  border-radius: ${theme.border.radiusSmall};
`;

const DetailWithTooltipContainer = styled.div`
  display: flex;
  align-items: center;
`;

const PreviewStep: React.FC<{
  actionType: ActionType;
  withdrawOption?: V2WithdrawOption;
  amount: BigNumber;
  positionAmount: BigNumber;
  onClickConfirmButton: () => Promise<void>;
  asset: Assets;
  vaultOption: VaultOptions;
  vaultVersion: VaultVersion;
  receiveVaultOption?: VaultOptions;
  estimatedSTETHDepositAmount?: string | JSX.Element;
}> = ({
  actionType,
  withdrawOption,
  amount,
  positionAmount,
  onClickConfirmButton,
  asset,
  vaultOption,
  vaultVersion,
  receiveVaultOption,
  estimatedSTETHDepositAmount,
}) => {
  const { t } = useTranslation();
  const color = getVaultColor(vaultOption);
  const latestAPY = useLatestAPY(vaultOption, vaultVersion);
  const {
    data: { withdrawals: v2Withdrawals },
  } = useV2VaultData(vaultOption);
  const { priceHistory } = useVaultPriceHistory(vaultOption, vaultVersion);

  interface ActionDetail {
    key: string;
    value: string;
  }

  const [toDepositTime, withdrawalDate] = useMemo(() => {
    // if (optionLoading) return loadingText;

    // if (!currentOption) return "---";

    let firstOpenLoanTime = moment.utc("2022-09-02").set("hour", 17);

    let toDepositTime;

    while (!toDepositTime) {
      let toDepositTimeTemp = moment.duration(
        firstOpenLoanTime.diff(moment()),
        "milliseconds"
      );
      if (toDepositTimeTemp.asMilliseconds() <= 0) {
        firstOpenLoanTime.add(28, "days");
      } else {
        toDepositTime = toDepositTimeTemp;
      }
    }

    return [
      `${toDepositTime.days()}D ${toDepositTime.hours()}H ${toDepositTime.minutes()}M`,
      firstOpenLoanTime.add(28, "days").format("Do MMMM, YYYY"),
    ];
  }, []);

  const detailRows: ActionDetail[] = useMemo(() => {
    const actionDetails: ActionDetail[] = [];

    actionDetails.push({
      key: "Deposit Time",
      value: `${toDepositTime}`,
    });

    actionDetails.push({
      key: "Counterparty",
      value: "Ribbon Diverisified",
    });

    return actionDetails;
  }, [
    actionType,
    latestAPY,
    receiveVaultOption,
    t,
    vaultOption,
    vaultVersion,
    withdrawOption,
  ]);

  const originalAmount = formatBigNumber(
    positionAmount,
    getAssetDecimals(asset)
  );

  const renderWithdrawalSteps = useCallback(
    (withdrawOption: V2WithdrawOption) => {
      if (withdrawOption === "instant") {
        return <></>;
      }

      return (
        <div className="d-flex mt-2">
          <div className="d-flex flex-column align-items-center">
            <WithdrawalStepsCircle
              active={withdrawOption === "standard"}
              color={color}
            >
              <Title
                fontSize={14}
                lineHeight={20}
                color={
                  withdrawOption === "standard" ? color : colors.quaternaryText
                }
              >
                1
              </Title>
            </WithdrawalStepsCircle>
            <PrimaryText
              fontSize={11}
              lineHeight={12}
              color={
                withdrawOption === "standard" ? color : colors.quaternaryText
              }
              className="mt-2 text-center"
              style={{ maxWidth: 60 }}
            >
              Initiate Withdrawal
            </PrimaryText>
          </div>
          <WithdrawalStepsDividerLine color={color} />
          <div className="d-flex flex-column align-items-center">
            <WithdrawalStepsCircle
              active={withdrawOption === "complete"}
              color={color}
            >
              <Title
                fontSize={14}
                lineHeight={20}
                color={
                  withdrawOption === "complete" ? color : colors.quaternaryText
                }
              >
                2
              </Title>
            </WithdrawalStepsCircle>
            <PrimaryText
              fontSize={11}
              lineHeight={12}
              color={
                withdrawOption === "complete" ? color : colors.quaternaryText
              }
              className="mt-2 text-center mb-4"
              style={{ maxWidth: 60 }}
            >
              Complete Withdrawal
            </PrimaryText>
          </div>
        </div>
      );
    },
    [color]
  );

  switch (actionType) {
    case ACTIONS.migrate:
      return (
        <div
          style={{ flex: 1 }}
          className="d-flex flex-column align-items-center"
        >
          {/* Logo */}
          <ActionLogoContainer color={color}>
            <MigrateIcon color={color} height={27} />
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
              {t(`shared:ProductCopies:${vaultOption}:title`)}
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
          return (
            <div className="d-flex flex-column align-items-center">
              {/* Title */}
              <FormTitle className="mt-4 mx-3 text-center">
                INITIATE WITHDRAWAL PREVIEW
              </FormTitle>

              {/* Info Preview */}
              <div className="d-flex w-100 flex-row align-items-center justify-content-between mt-4">
                <SecondaryText>Amount</SecondaryText>
                <Title className="text-right">
                  {formatBigNumber(amount, getAssetDecimals(asset))}{" "}
                  {getAssetDisplay(asset)}
                </Title>
              </div>
              <div className="d-flex w-100 flex-row align-items-center justify-content-between mt-4">
                <SecondaryText>Already Initiated</SecondaryText>
                <Title className="text-right">
                  {formatBigNumber(
                    v2Withdrawals.shares
                      .mul(
                        priceHistory.find(
                          (history) => history.round === v2Withdrawals.round
                        )?.pricePerShare || BigNumber.from(0)
                      )
                      .div(parseUnits("1", getAssetDecimals(asset))),
                    getAssetDecimals(asset)
                  )}{" "}
                  {getAssetDisplay(asset)}
                </Title>
              </div>
              <div className="d-flex w-100 flex-row align-items-center justify-content-between mt-4">
                <SecondaryText>Product</SecondaryText>
                <Title className="text-right">
                  {t(`shared:ProductCopies:${vaultOption}:title`)}
                </Title>
              </div>

              {/* Migrate Button */}
              <ActionButton
                onClick={onClickConfirmButton}
                className="btn py-3 mt-4 mb-3"
                color={color}
              >
                INITIATE WITHDRAWAL
              </ActionButton>
              {renderWithdrawalSteps("standard")}
              <WarningContainer
                className="mb-4 w-100 text-center"
                color={color}
              >
                <PrimaryText fontSize={14} lineHeight={20} color={color}>
                  {`You can complete your withdrawal any time after 12pm UTC on
                  Friday when your ${getAssetDisplay(
                    asset
                  )} will be removed from the vault’s
                  investable pool of funds`}
                </PrimaryText>
              </WarningContainer>
            </div>
          );
        case "complete":
          return (
            <div className="d-flex flex-column align-items-center">
              {/* Logo */}
              <ActionLogoContainer color={color}>
                <WithdrawIcon color={color} width={32} />
              </ActionLogoContainer>

              {/* Title */}
              <FormTitle className="mt-3 text-center">
                COMPLETE WITHDRAWAL
              </FormTitle>

              {/* Info Preview */}
              {vaultOption === "rstETH-THETA" ? (
                <div className="d-flex w-100 flex-row align-items-center justify-content-between mt-4">
                  <SecondaryText>Estimated Withdraw Amount</SecondaryText>
                  <Title className="text-right">
                    {formatBigNumber(amount, getAssetDecimals(asset))}{" "}
                    {getAssetDisplay(asset)}
                  </Title>
                </div>
              ) : (
                <div className="d-flex w-100 flex-row align-items-center justify-content-between mt-4">
                  <SecondaryText>Withdraw Amount</SecondaryText>
                  <Title className="text-right">
                    {formatBigNumber(amount, getAssetDecimals(asset))}{" "}
                    {getAssetDisplay(asset)}
                  </Title>
                </div>
              )}
              <div className="d-flex w-100 flex-row align-items-center justify-content-between mt-4">
                <SecondaryText>Product</SecondaryText>
                <Title className="text-right">
                  {t(`shared:ProductCopies:${vaultOption}:title`)}
                </Title>
              </div>

              {/* Migrate Button */}
              <ActionButton
                onClick={onClickConfirmButton}
                className="btn py-3 mt-4 mb-3"
                color={color}
              >
                COMPLETE WITHDRAWAL
              </ActionButton>
              {renderWithdrawalSteps("complete")}
            </div>
          );
      }

    /**
     * IMPORTANT
     * Do note over here that the fallthrough case currently will only allow V1 withdraw and v2 instant withdraw to fall through.
     * Exercise great caution when introducing further fallthrough to avoid unintended consequences.
     */
    // eslint-disable-next-line no-fallthrough
    default:
      const actionWord = capitalize(actionType);
      let actionLogo = <></>;
      let warning = <></>;

      switch (actionType) {
        case ACTIONS.deposit:
          actionLogo = <DepositIcon color={color} width={32} />;

          switch (vaultVersion) {
            case "earn":
            case "v2":
              warning = (
                <WarningContainer
                  className="mt-2 mb-4 w-100 text-center"
                  color={color}
                >
                  <PrimaryText fontSize={14} lineHeight={20} color={color}>
                    IMPORTANT: Your funds will be available for withdrawal at
                    5pm UTC on {withdrawalDate}
                  </PrimaryText>
                </WarningContainer>
              );
              break;
          }
          break;
        case ACTIONS.withdraw:
          actionLogo = <WithdrawIcon color={color} width={32} />;
          break;
        case ACTIONS.transfer:
          actionLogo = <TransferIcon color={color} width={32} />;
      }

      return (
        <div className="d-flex flex-column align-items-center">
          {/* Logo */}
          <ActionLogoContainer color={color}>{actionLogo}</ActionLogoContainer>

          {/* Title */}
          <FormTitle className="mt-3 text-center">
            {actionWord} PREVIEW
          </FormTitle>

          {/* Info Preview */}
          {vaultOption === "rstETH-THETA" &&
          actionType === "withdraw" &&
          withdrawOption === "instant" ? (
            <div className="d-flex w-100 flex-row align-items-center justify-content-between mt-4">
              <SecondaryText>Estimated {actionWord} Amount</SecondaryText>
              <Title className="text-right">
                {formatBigNumber(amount, getAssetDecimals(asset))}{" "}
                {getAssetDisplay(asset)}
              </Title>
            </div>
          ) : (
            <div className="d-flex w-100 flex-row align-items-center justify-content-between mt-4">
              <SecondaryText>{actionWord} Amount</SecondaryText>
              <Title className="text-right">
                {formatBigNumber(amount, getAssetDecimals(asset))}{" "}
                {getAssetDisplay(asset)}
              </Title>
            </div>
          )}
          {vaultOption === "rstETH-THETA" &&
            actionType === "deposit" &&
            isNativeToken(asset) &&
            estimatedSTETHDepositAmount && (
              <div className="d-flex w-100 flex-row align-items-center justify-content-between mt-4">
                <DetailWithTooltipContainer>
                  <SecondaryText>
                    {t("webapp:TooltipExplanations:stETHExchangeRate:title")}
                  </SecondaryText>
                  <TooltipExplanation
                    title={t(
                      "webapp:TooltipExplanations:stETHExchangeRate:title"
                    )}
                    explanation={t(
                      "webapp:TooltipExplanations:stETHExchangeRate:description"
                    )}
                    renderContent={({ ref, ...triggerHandler }) => (
                      <HelpInfo containerRef={ref} {...triggerHandler}>
                        i
                      </HelpInfo>
                    )}
                    learnMoreURL={t(
                      "webapp:TooltipExplanations:stETHExchangeRate:learnMoreURL"
                    )}
                  />
                </DetailWithTooltipContainer>
                <Title className="text-right">
                  {estimatedSTETHDepositAmount}
                </Title>
              </div>
            )}
          {detailRows.map((detail, index) => (
            <div
              className="d-flex w-100 flex-row align-items-center justify-content-between mt-4"
              key={index}
            >
              <SecondaryText>{detail.key}</SecondaryText>
              <Title className="text-right">{detail.value}</Title>
            </div>
          ))}

          <ActionButton
            onClick={onClickConfirmButton}
            className="btn py-3 mt-4 mb-3"
            color={color}
          >
            {actionWord} Now
          </ActionButton>
          {warning}
        </div>
      );
  }
};

export default PreviewStep;
