import { BigNumber } from "@ethersproject/bignumber";
import moment, { Moment } from "moment";
import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import currency from "currency.js";

import BasicModal from "shared/lib/components/Common/BasicModal";
import {
  BaseInput,
  BaseInputButton,
  BaseInputContainer,
  BaseInputLabel,
  BaseModalContentColumn,
  SecondaryText,
  Subtitle,
  Title,
} from "shared/lib/designSystem";
import { Assets } from "shared/lib/store/types";
import { getAssetDecimals, getAssetDisplay } from "shared/lib/utils/asset";
import { assetToFiat, formatOption } from "shared/lib/utils/math";
import ProfitChart from "./ProfitChart";
import colors from "shared/lib/designSystem/colors";
import ModalContentExtra from "shared/lib/components/Common/ModalContentExtra";
import { formatUnits } from "@ethersproject/units";
import useVaultAccounts from "shared/lib/hooks/useVaultAccounts";
import { VaultOptions, VaultVersion } from "shared/lib/constants/constants";

const ChartContainer = styled.div`
  height: 264px;
  margin: 0 -15px;
  width: calc(100% + 30px);
`;

const StrikeLabel = styled(Subtitle)`
  color: ${colors.text};
  letter-spacing: 1px;
  line-height: 16px;
`;

const HoverLabel = styled(SecondaryText)`
  font-size: 12px;
  line-height: 16px;
  color: ${colors.primaryText};
`;

const CalculationContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex: 1;
  align-items: center;
  align-content: center;
`;

const CalculationColumn = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 16px;
  align-items: center;

  &:last-child {
    margin-bottom: unset;
  }
`;

const CalculationLabel = styled(SecondaryText)`
  font-size: 14px;
  margin-right: auto;
`;

const CalculationData = styled(Title)<{ variant?: "red" | "green" }>`
  color: ${(props) => {
    switch (props.variant) {
      case "red":
        return colors.red;
      case "green":
        return colors.green;
      default:
        return colors.primaryText;
    }
  }};
`;

interface ProfitCalculatorProps {
  vault: {
    vaultOption: VaultOptions;
    vaultVersion: VaultVersion;
  };
  show: boolean;
  onClose: () => void;
  prices: Partial<{ [asset in Assets]: number }>;
  asset: Assets;
  optionAsset: Assets;
  currentOption: {
    strike: BigNumber;
    expiry: Moment;
    premium: BigNumber;
    depositAmount: BigNumber;
    amount: number;
    isPut: boolean;
  };
}

const ProfitCalculatorModal: React.FC<ProfitCalculatorProps> = ({
  vault: { vaultOption, vaultVersion },
  show,
  onClose,
  prices,
  asset,
  optionAsset,
  currentOption,
}) => {
  const [input, setInput] = useState<string>("");
  const [hoverPrice, setHoverPrice] = useState<number>();
  const [chartHovering, setChartHovering] = useState(false);
  const vaultOptions = useMemo(() => [vaultOption], [vaultOption]);
  const vaultVersions = useMemo(() => [vaultVersion], [vaultVersion]);
  const { vaultAccounts } = useVaultAccounts(vaultOptions, vaultVersions);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const parsedInput = parseFloat(e.target.value);
    setInput(isNaN(parsedInput) || parsedInput < 0 ? "" : `${parsedInput}`);
  }, []);

  const handleCurrentPress = useCallback(() => {
    setInput(`${prices[optionAsset]!}`);
  }, [prices, optionAsset]);

  const KPI = useMemo(() => {
    let calculatePrice = input ? parseFloat(input) : prices[optionAsset]!;

    if (hoverPrice) {
      calculatePrice = hoverPrice;
    }

    const higherStrike = formatOption(currentOption.strike) > calculatePrice;
    const isExercisedRange = currentOption.isPut ? higherStrike : !higherStrike;
    const assetDecimals = getAssetDecimals(asset);
    let profit: number;

    if (!isExercisedRange) {
      profit = parseFloat(formatUnits(currentOption.premium, assetDecimals));
    } else if (currentOption.isPut) {
      const exerciseCost = formatOption(currentOption.strike) - calculatePrice;

      profit =
        parseFloat(formatUnits(currentOption.premium, assetDecimals)) -
        currentOption.amount * exerciseCost;
    } else {
      profit =
        (currentOption.amount * formatOption(currentOption.strike)) /
          calculatePrice -
        currentOption.amount +
        parseFloat(formatUnits(currentOption.premium, assetDecimals));
    }

    return {
      isProfit: profit >= 0,
      roi:
        (profit /
          parseFloat(formatUnits(currentOption.depositAmount, assetDecimals))) *
        100 *
        0.9,
    };
  }, [asset, currentOption, input, hoverPrice, optionAsset, prices]);

  const toExpiryText = useMemo(() => {
    const toExpiryDuration = moment.duration(
      currentOption.expiry.diff(moment()),
      "milliseconds"
    );

    if (toExpiryDuration.asMilliseconds() <= 0) {
      return "Expired";
    }

    return `${toExpiryDuration.days()}D ${toExpiryDuration.hours()}H ${toExpiryDuration.minutes()}M`;
  }, [currentOption]);

  return (
    <BasicModal
      show={show}
      headerBackground
      height={vaultAccounts[vaultOption] ? 654 : 624}
      onClose={onClose}
    >
      <>
        <BaseModalContentColumn marginTop={8}>
          <Title>PROFIT CALCULATOR</Title>
        </BaseModalContentColumn>
        <BaseModalContentColumn
          marginTop={40}
          className="justify-content-start"
        >
          <div className="d-flex w-100 flex-wrap">
            <BaseInputLabel>
              ENTER {getAssetDisplay(optionAsset)} PRICE
            </BaseInputLabel>
            <BaseInputContainer className="position-relative">
              <BaseInput
                type="number"
                min="0"
                className="form-control"
                placeholder={`$${prices[optionAsset]}`}
                value={input}
                onChange={handleInput}
                inputWidth="70%"
              />
              <BaseInputButton onClick={handleCurrentPress}>
                CURRENT
              </BaseInputButton>
            </BaseInputContainer>
          </div>
        </BaseModalContentColumn>
        <BaseModalContentColumn marginTop={16}>
          <ChartContainer
            onClick={() => {
              if (hoverPrice) {
                setInput(hoverPrice.toFixed(2));
              }
            }}
            onMouseEnter={() => setChartHovering(true)}
            onMouseLeave={() => setChartHovering(false)}
          >
            <ProfitChart
              strike={formatOption(currentOption.strike)}
              price={
                hoverPrice
                  ? hoverPrice
                  : input
                  ? parseFloat(input)
                  : prices[optionAsset]!
              }
              premium={
                parseFloat(
                  assetToFiat(
                    currentOption.premium,
                    prices[asset]!,
                    getAssetDecimals(asset)
                  )
                ) / currentOption.amount
              }
              isPut={currentOption.isPut}
              onHover={setHoverPrice}
            />
          </ChartContainer>
        </BaseModalContentColumn>
        <BaseModalContentColumn marginTop={8}>
          {chartHovering ? (
            <HoverLabel>Tap to update price field above</HoverLabel>
          ) : (
            <StrikeLabel>
              STRIKE PRICE:{" "}
              {currency(formatOption(currentOption.strike)).format()}
            </StrikeLabel>
          )}
        </BaseModalContentColumn>
        <ModalContentExtra style={{ flex: 1 }}>
          <CalculationContainer>
            <CalculationColumn>
              <CalculationLabel>Vault % Gain / Loss</CalculationLabel>
              <CalculationData
                variant={
                  KPI.roi > 0 ? "green" : KPI.roi < 0 ? "red" : undefined
                }
              >
                {KPI.roi >= 0 ? "+" : ""}
                {KPI.roi.toFixed(2)}%
              </CalculationData>
            </CalculationColumn>
            {vaultAccounts[vaultOption] && (
              <CalculationColumn>
                <CalculationLabel>
                  Your Gain / Loss ({getAssetDisplay(asset)})
                </CalculationLabel>
                <CalculationData
                  variant={
                    KPI.roi > 0 ? "green" : KPI.roi < 0 ? "red" : undefined
                  }
                >
                  {parseFloat(
                    (
                      (parseFloat(
                        formatUnits(
                          vaultAccounts[vaultOption]!.totalBalance,
                          getAssetDecimals(asset)
                        )
                      ) *
                        KPI.roi) /
                      100
                    ).toFixed(4)
                  )}
                </CalculationData>
              </CalculationColumn>
            )}
            <CalculationColumn>
              <CalculationLabel>Time to Expiry</CalculationLabel>
              <CalculationData>{toExpiryText}</CalculationData>
            </CalculationColumn>
          </CalculationContainer>
        </ModalContentExtra>
      </>
    </BasicModal>
  );
};

export default ProfitCalculatorModal;
