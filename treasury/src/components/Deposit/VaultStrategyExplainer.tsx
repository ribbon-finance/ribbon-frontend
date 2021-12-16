import React, { useCallback, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";

import {
  getAssets,
  getDisplayAssets,
  getOptionAssets,
  isPutVault,
  VaultOptions,
  VaultVersion,
} from "shared/lib/constants/constants";
import theme from "shared/lib/designSystem/theme";
import colors from "shared/lib/designSystem/colors";
import useElementSize from "shared/lib/hooks/useElementSize";
import { getVaultColor } from "shared/lib/utils/vault";
import { SecondaryText, Title } from "shared/lib/designSystem";
import { getAssetDisplay } from "shared/lib/utils/asset";
import SegmentPagination from "../Common/SegmentPagination";
import StrikeSelection from "./ExplainerGraphic/StrikeSelection";
import ExpiryChart from "./ExplainerGraphic/ExpiryChart";
import TradeOffer from "./ExplainerGraphic/TradeOffer";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import useScreenSize from "shared/lib/hooks/useScreenSize";
import sizes from "shared/lib/designSystem/sizes";
import VaultDeposit from "./ExplainerGraphic/VaultDeposit";
import AlgoStrikeSelection from "./ExplainerGraphic/AlgoStrikeSelection";
import GnosisAuction from "./ExplainerGraphic/GnosisAuction";
import { useEffect } from "react";

const ExplainerContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: ${colors.background.two};
  border-radius: ${theme.border.radius};
  overflow: hidden;
  overflow: hidden;
`;

const ExplainerSection = styled.div<{ height: number }>`
  height: ${(props) => props.height}px;
`;

const VisualMotionDiv = styled(motion.div)<{ color: string }>`
  background: linear-gradient(
    96.84deg,
    ${(props) => props.color}14 1.04%,
    ${(props) => props.color}03 98.99%
  );
`;

const InfoTitle = styled(Title)<{ color: string }>`
  color: ${(props) => props.color};
`;

const InfoDescription = styled(SecondaryText)`
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
`;

const HighlighText = styled.span`
  color: ${colors.primaryText};
  cursor: help;

  poin &:hover {
    color: ${colors.primaryText}CC;
  }
`;

const ExplanationStepList = [
  "deposit",
  "swapCollateralAsset",
  "algoStrikeSelection",
  "strikeSelection",
  "mintOption",
  "gnosisAuction",
  "gnosisTrade",
  "tradeOption",
  "expiryA",
  "settlementA",
  "expiryB",
  "settlementB",
] as const;

type ExplanationStep = typeof ExplanationStepList[number];
const NonCollateralSwapExclusionExplanationStepList: ExplanationStep[] = [
  "swapCollateralAsset",
];

const ExplanatioStepMap: { [version in VaultVersion]: Array<ExplanationStep> } =
  {
    v1: [
      "deposit",
      "swapCollateralAsset",
      "strikeSelection",
      "mintOption",
      "tradeOption",
      "expiryA",
      "settlementA",
      "expiryB",
      "settlementB",
    ],
    v2: [
      "deposit",
      "swapCollateralAsset",
      "algoStrikeSelection",
      "mintOption",
      "gnosisAuction",
      "gnosisTrade",
      "expiryA",
      "settlementA",
      "expiryB",
      "settlementB",
    ],
  };

interface VaultStrategyExplainerProps {
  vault: {
    vaultOption: VaultOptions;
    vaultVersion: VaultVersion;
  };
}

const VaultStrategyExplainer: React.FC<VaultStrategyExplainerProps> = ({
  vault: { vaultOption, vaultVersion },
}) => {
  const containerRef = useRef(null);
  const { width } = useScreenSize();
  const { width: sectionWidth } = useElementSize(containerRef);
  const color = getVaultColor(vaultOption);
  const asset = getAssets(vaultOption);
  const optionAsset = getOptionAssets(vaultOption);
  const isPut = isPutVault(vaultOption);

  const isYearn = getDisplayAssets(vaultOption) === "yvUSDC";

  const currentVaultExplanationStepList = useMemo(() => {
    switch (getDisplayAssets(vaultOption)) {
      case "yvUSDC":
      case "stETH":
        return ExplanatioStepMap[vaultVersion];
      default:
        return ExplanatioStepMap[vaultVersion].filter(
          (item) =>
            !NonCollateralSwapExclusionExplanationStepList.includes(item)
        );
    }
  }, [vaultOption, vaultVersion]);

  const [step, setStep] = useState<ExplanationStep>(
    currentVaultExplanationStepList[0]
  );

  /**
   * Prevent wrong step showing up when change vault version
   */
  useEffect(() => {
    if (!currentVaultExplanationStepList.includes(step)) {
      setStep(currentVaultExplanationStepList[0]);
    }
  }, [currentVaultExplanationStepList, step]);

  const backgroundColor = useCallback(
    (s: ExplanationStep) => {
      switch (s) {
        case "expiryA":
          return colors.green;
        case "expiryB":
          return colors.red;
        default:
          return color;
      }
    },
    [color]
  );

  const renderGraphic = useCallback(
    (s: ExplanationStep) => {
      const collateralAsset = getDisplayAssets(vaultOption);
      switch (s) {
        case "deposit":
          return <VaultDeposit vaultOption={vaultOption} />;
        case "swapCollateralAsset":
          let tradeTarget: string = "";
          switch (getDisplayAssets(vaultOption)) {
            case "stETH":
              tradeTarget = "LIDO";
              break;
            case "yvUSDC":
              tradeTarget = "Yearn Vault";
              break;
          }
          return (
            <TradeOffer
              color={color}
              tradeTarget={tradeTarget}
              offerToken={asset}
              receiveToken={collateralAsset}
            />
          );
        case "algoStrikeSelection":
          return <AlgoStrikeSelection vaultOption={vaultOption} />;
        case "strikeSelection":
          return <StrikeSelection color={color} isPut={isPut} />;
        case "mintOption":
          return (
            <TradeOffer
              color={color}
              tradeTarget="Opyn Vault"
              offerToken={collateralAsset}
              receiveToken="oToken"
            />
          );
        case "gnosisAuction":
          return <GnosisAuction vaultOption={vaultOption} />;
        case "gnosisTrade":
          return (
            <TradeOffer
              color={color}
              tradeTarget="Gnosis"
              receiveToken={asset}
            />
          );
        case "tradeOption":
          return (
            <TradeOffer
              color={color}
              tradeTarget="MARKET MAKER"
              offerToken="oToken"
              receiveToken={asset}
            />
          );
        case "expiryA":
          return <ExpiryChart higherPrice={isPut} isOTM />;
        case "settlementA":
          return (
            <TradeOffer
              color={color}
              tradeTarget="Opyn Vault"
              receiveToken={collateralAsset}
            />
          );
        case "expiryB":
          return <ExpiryChart higherPrice={!isPut} isOTM={false} />;
        case "settlementB":
          let offerParty;

          switch (vaultVersion) {
            case "v1":
              offerParty = "MARKET MAKER";
              break;
            case "v2":
            default:
              offerParty = "OPTION BUYER";
          }

          return (
            <TradeOffer
              color={color}
              offerParty={offerParty}
              tradeTarget="Opyn Vault"
              receiveToken={collateralAsset}
            />
          );
      }
    },
    [asset, color, isPut, vaultOption, vaultVersion]
  );

  const renderTitle = useCallback(
    (s: ExplanationStep) => {
      switch (s) {
        case "deposit":
          return "VAULT Receives DEPOSITS";
        case "swapCollateralAsset":
          let collateralTarget: string = "";
          switch (getDisplayAssets(vaultOption)) {
            case "stETH":
              collateralTarget = "LIDO";
              break;
            case "yvUSDC":
              collateralTarget = "YEARN";
              break;
          }
          return `DEPOSITS ${getAssetDisplay(asset)} IN ${collateralTarget}`;
        case "algoStrikeSelection":
          return "ALGORITHMIC STRIKE SELECTION";
        case "strikeSelection":
          return "MANAGER SELECTS STRIKE AND EXPIRY";
        case "mintOption":
          return "VAULT MINTS OPTIONS";
        case "gnosisAuction":
          return "VAULT SELLS OPTIONS VIA GNOSIS AUCTION";
        case "gnosisTrade":
          return "VAULT COLLECTS YIELDS";
        case "tradeOption":
          return "VAULT SELLS OPTIONS TO MARKET MAKERS";
        case "expiryA":
          return `OPTIONS EXPIRE OTM`;
        case "settlementA":
          return "COLLATERAL RETURNED TO THE VAULT";
        case "expiryB":
          return `STRIKE IS ${isPut ? "ABOVE" : "BELOW"} MARKET PRICE`;
        case "settlementB":
          let offerParty;

          switch (vaultVersion) {
            case "v1":
              offerParty = "MARKET MAKER";
              break;
            case "v2":
            default:
              offerParty = "OPTION BUYER";
          }

          return `${offerParty} EXERCISEs OPTIONS`;
      }
    },
    [asset, isPut, vaultOption, vaultVersion]
  );

  const renderDescription = useCallback(
    (s: ExplanationStep) => {
      const assetUnit = getAssetDisplay(asset);
      const optionAssetUnit = getAssetDisplay(optionAsset);
      const collateralAsset = getDisplayAssets(vaultOption);
      const collateralAssetUnit = getAssetDisplay(collateralAsset);
      let optionBuyerParty;

      switch (vaultVersion) {
        case "v1":
          optionBuyerParty = "market makers";
          break;
        case "v2":
        default:
          optionBuyerParty = "option buyers";
      }

      switch (s) {
        case "deposit":
          switch (vaultVersion) {
            case "v1":
              return (
                <>
                  The vault receives {assetUnit} from depositors and invests 90%
                  of these funds in its weekly strategy. The remaining 10% of
                  funds is set aside so that depositors can withdraw their{" "}
                  {assetUnit} from the vault.
                </>
              );
            case "v2":
            default:
              return (
                <>
                  The vault receives {assetUnit} from depositors and invests
                  100% of its {assetUnit} balance in its weekly options
                  strategy.
                </>
              );
          }
        case "swapCollateralAsset":
          switch (getDisplayAssets(vaultOption)) {
            case "stETH":
              return (
                <>
                  Every Friday, the vault converts 100% of its {assetUnit}{" "}
                  balance into{" "}
                  <TooltipExplanation
                    title={collateralAssetUnit.toUpperCase()}
                    explanation={`${collateralAssetUnit} is the deposit token that represents a user's share of the their ETH on the Ethereum beacon chain.`}
                    learnMoreURL="https://lido.fi/ethereum"
                    renderContent={({ ref, ...triggerHandler }) => (
                      <HighlighText ref={ref} {...triggerHandler}>
                        {collateralAssetUnit}
                      </HighlighText>
                    )}
                  />{" "}
                  by depositing {assetUnit} into the{" "}
                  <TooltipExplanation
                    title="LIDO"
                    explanation="Lido is a defi asset staking protocol."
                    learnMoreURL="https://lido.fi"
                    renderContent={({ ref, ...triggerHandler }) => (
                      <HighlighText ref={ref} {...triggerHandler}>
                        Lido
                      </HighlighText>
                    )}
                  />{" "}
                  smart contracts. By converting {assetUnit} into{" "}
                  {collateralAssetUnit}, the vault gains exposure to the yield
                  generated from ETH 2.0 staking in Lido.
                </>
              );
            case "yvUSDC":
              return (
                <>
                  Every Friday, the vault converts 100% of its {assetUnit}{" "}
                  balance into{" "}
                  <TooltipExplanation
                    title={collateralAssetUnit.toUpperCase()}
                    explanation={`${collateralAssetUnit} is the deposit token that represents a user's share of the ${assetUnit} yVault.`}
                    learnMoreURL="https://docs.yearn.finance/yearn-finance/yvaults/vault-tokens"
                    renderContent={({ ref, ...triggerHandler }) => (
                      <HighlighText ref={ref} {...triggerHandler}>
                        {collateralAssetUnit}
                      </HighlighText>
                    )}
                  />{" "}
                  by depositing {assetUnit} into the Yearn {assetUnit}{" "}
                  <TooltipExplanation
                    title="YVAULT"
                    explanation="yVaults are Yearn vaults that accept customer deposits and then route them through strategies which seek out the highest yield available in DeFi."
                    learnMoreURL="https://docs.yearn.finance/yearn-finance/yvaults/overview#what-are-yvaults"
                    renderContent={({ ref, ...triggerHandler }) => (
                      <HighlighText ref={ref} {...triggerHandler}>
                        yVault
                      </HighlighText>
                    )}
                  />
                  . By converting {assetUnit} into {collateralAssetUnit}, the
                  vault gains exposure to the yield generated by the Yearn
                  yVault.
                </>
              );
          }

          return <></>;
        case "algoStrikeSelection":
          return (
            <>
              The vault algorithmically selects the optimal{" "}
              <TooltipExplanation
                title="STRIKE PRICE"
                explanation="A strike price is the set price at which an option contract can be bought or sold when it is exercised."
                learnMoreURL="https://www.investopedia.com/terms/s/strikeprice.asp"
                renderContent={({ ref, ...triggerHandler }) => (
                  <HighlighText ref={ref} {...triggerHandler}>
                    strike price
                  </HighlighText>
                )}
              />{" "}
              for the{" "}
              <TooltipExplanation
                title={isPut ? "PUT OPTION" : "COVERED CALL"}
                explanation={
                  isPut
                    ? "A put option is a derivative instrument which gives the holder the right to sell an asset, at a specified price, by a specified date to the writer of the put."
                    : "A covered call refers to a financial transaction in which the investor selling call options owns an equivalent amount of the underlying security."
                }
                learnMoreURL={
                  isPut
                    ? "https://www.investopedia.com/terms/p/putoption.asp"
                    : "https://www.investopedia.com/terms/c/coveredcall.asp"
                }
                renderContent={({ ref, ...triggerHandler }) => (
                  <HighlighText ref={ref} {...triggerHandler}>
                    {optionAssetUnit} {isPut ? "put" : "call"} options
                  </HighlighText>
                )}
              />
              .
            </>
          );
        case "strikeSelection":
          return (
            <>
              Before minting {optionAssetUnit} {isPut ? "put" : "call"} option
              on{" "}
              <TooltipExplanation
                title="OPYN"
                explanation="Opyn is a DeFi options protocol."
                learnMoreURL="https://www.opyn.co/"
                renderContent={({ ref, ...triggerHandler }) => (
                  <HighlighText ref={ref} {...triggerHandler}>
                    Opyn
                  </HighlighText>
                )}
              />
              , the vault manager must choose the{" "}
              <TooltipExplanation
                title="STRIKE PRICE"
                explanation="A strike price is the set price at which an option contract can be bought or sold when it is exercised."
                learnMoreURL="https://www.investopedia.com/terms/s/strikeprice.asp"
                renderContent={({ ref, ...triggerHandler }) => (
                  <HighlighText ref={ref} {...triggerHandler}>
                    strike price
                  </HighlighText>
                )}
              />{" "}
              for the options. Currently the role of the vault manager is played
              by the Ribbon team.
            </>
          );
        case "mintOption":
          switch (vaultVersion) {
            case "v1":
              return (
                <>
                  Every Friday, the vault creates{" "}
                  <TooltipExplanation
                    title="EUROPEAN OPTIONS"
                    explanation="A European option is a version of an options contract that limits execution to its expiration date."
                    learnMoreURL="https://www.investopedia.com/terms/e/europeanoption.asp"
                    renderContent={({ ref, ...triggerHandler }) => (
                      <HighlighText ref={ref} {...triggerHandler}>
                        European
                      </HighlighText>
                    )}
                  />{" "}
                  <TooltipExplanation
                    title={isPut ? "PUT OPTION" : "COVERED CALL"}
                    explanation={
                      isPut
                        ? "A put option is a derivative instrument which gives the holder the right to sell an asset, at a specified price, by a specified date to the writer of the put."
                        : "A covered call refers to a financial transaction in which the investor selling call options owns an equivalent amount of the underlying security."
                    }
                    learnMoreURL={
                      isPut
                        ? "https://www.investopedia.com/terms/p/putoption.asp"
                        : "https://www.investopedia.com/terms/c/coveredcall.asp"
                    }
                    renderContent={({ ref, ...triggerHandler }) => (
                      <HighlighText ref={ref} {...triggerHandler}>
                        {optionAssetUnit} {isPut ? "put" : "call"} options
                      </HighlighText>
                    )}
                  />{" "}
                  by depositing {collateralAssetUnit} as collateral in an{" "}
                  <TooltipExplanation
                    title="OPYN"
                    explanation="Opyn is a DeFi options protocol."
                    learnMoreURL="https://www.opyn.co/"
                    renderContent={({ ref, ...triggerHandler }) => (
                      <HighlighText ref={ref} {...triggerHandler}>
                        Opyn
                      </HighlighText>
                    )}
                  />{" "}
                  vault and setting a strike price (selected by the manager) and
                  expiry date (the following Friday). In return, the vault
                  receives oTokens from the Opyn vault which represent the{" "}
                  {optionAssetUnit} {isPut ? "put" : "call"} options.
                </>
              );
            case "v2":
            default:
              return (
                <>
                  Every Friday at 11am UTC, the vault mints{" "}
                  <TooltipExplanation
                    title="EUROPEAN OPTIONS"
                    explanation="A European option is a version of an options contract that limits execution to its expiration date."
                    learnMoreURL="https://www.investopedia.com/terms/e/europeanoption.asp"
                    renderContent={({ ref, ...triggerHandler }) => (
                      <HighlighText ref={ref} {...triggerHandler}>
                        European
                      </HighlighText>
                    )}
                  />{" "}
                  <TooltipExplanation
                    title={isPut ? "PUT OPTION" : "COVERED CALL"}
                    explanation={
                      isPut
                        ? "A put option is a derivative instrument which gives the holder the right to sell an asset, at a specified price, by a specified date to the writer of the put."
                        : "A covered call refers to a financial transaction in which the investor selling call options owns an equivalent amount of the underlying security."
                    }
                    learnMoreURL={
                      isPut
                        ? "https://www.investopedia.com/terms/p/putoption.asp"
                        : "https://www.investopedia.com/terms/c/coveredcall.asp"
                    }
                    renderContent={({ ref, ...triggerHandler }) => (
                      <HighlighText ref={ref} {...triggerHandler}>
                        {optionAssetUnit} {isPut ? "put" : "call"} options
                      </HighlighText>
                    )}
                  />{" "}
                  by depositing its {collateralAssetUnit} balance as collateral
                  in an{" "}
                  <TooltipExplanation
                    title="OPYN"
                    explanation="Opyn is a DeFi options protocol."
                    learnMoreURL="https://www.opyn.co/"
                    renderContent={({ ref, ...triggerHandler }) => (
                      <HighlighText ref={ref} {...triggerHandler}>
                        Opyn
                      </HighlighText>
                    )}
                  />{" "}
                  vault. The vault sets the strike price to the value determined
                  by its selection algorithm and the expiry date to the
                  following Friday. In return, the vault receives oTokens from
                  the Opyn vault, each of which represent an {optionAssetUnit}{" "}
                  {isPut ? "put" : "call"} option.
                </>
              );
          }
        case "gnosisAuction":
          return (
            <>
              The vault sells the newly minted options via a Gnosis batch
              auction. The vault first sets a minimum price for the options and
              then opens up bidding to anyone in the world. Participants whose
              bid is greater than or equal to the final clearing price receive
              the auctioned oTokens.
            </>
          );
        case "gnosisTrade":
          return (
            <>
              The {assetUnit} earned from the Gnosis auction is collected by the
              vault and represents the yield on this strategy.
            </>
          );
        case "tradeOption":
          return (
            <>
              The vault sells the newly minted options to{" "}
              <TooltipExplanation
                title="MARKET MAKER"
                explanation="A market maker (MM) is a firm or individual who actively quotes two-sided markets in a security, providing bids and offers (known as asks) along with the market size of each."
                learnMoreURL="https://www.investopedia.com/terms/m/marketmaker.asp"
                renderContent={({ ref, ...triggerHandler }) => (
                  <HighlighText ref={ref} {...triggerHandler}>
                    market makers
                  </HighlighText>
                )}
              />{" "}
              for a fee (the market price of the option, also known as the{" "}
              <TooltipExplanation
                title="OPTION PREMIUM"
                explanation="The option premium is the current market price of an option contract."
                learnMoreURL="https://www.investopedia.com/terms/o/option-premium.asp"
                renderContent={({ ref, ...triggerHandler }) => (
                  <HighlighText ref={ref} {...triggerHandler}>
                    option premium
                  </HighlighText>
                )}
              />
              ) - the sale is done{" "}
              <TooltipExplanation
                title="OVER-THE-COUNTER (OTC)"
                explanation="Over-the-counter (OTC) refers to the process of how tokens are traded via a broker-dealer network as opposed to on a centralized exchange."
                learnMoreURL="https://www.investopedia.com/terms/o/otc.asp"
                renderContent={({ ref, ...triggerHandler }) => (
                  <HighlighText ref={ref} {...triggerHandler}>
                    OTC
                  </HighlighText>
                )}
              />{" "}
              via{" "}
              <TooltipExplanation
                title="AIRSWAP"
                explanation="Airswap is a DeFi peer-to-peer trading protocol."
                learnMoreURL="https://www.airswap.io/"
                renderContent={({ ref, ...triggerHandler }) => (
                  <HighlighText ref={ref} {...triggerHandler}>
                    Airswap
                  </HighlighText>
                )}
              />
              .{" "}
              {isYearn
                ? `The fee earned by the vault
              in ${assetUnit} and represents the primary source of yield on this
              strategy (the secondary source is the yield generated by holding
              ${collateralAsset})`
                : `The fee earned by the vault is paid in ${assetUnit} and
              represents the yield on this strategy`}
              .
            </>
          );
        case "expiryA":
          return (
            <>
              At{" "}
              <TooltipExplanation
                title="EXPIRATION DATE"
                explanation="An expiration date in derivatives is the last day that derivative contracts, such as options or futures, are valid."
                learnMoreURL="https://www.investopedia.com/terms/e/expirationdate.asp"
                renderContent={({ ref, ...triggerHandler }) => (
                  <HighlighText ref={ref} {...triggerHandler}>
                    expiry
                  </HighlighText>
                )}
              />
              , if the strike price is {isPut ? "lower" : "higher"} than the
              market price of {optionAssetUnit}, the options expire{" "}
              <TooltipExplanation
                title="OUT-OF-THE-MONEY"
                explanation={`An ${optionAssetUnit} ${
                  isPut ? "put" : "call"
                } option is out-of-the-money (OTM) if the strike price is ${
                  isPut ? "below" : "above"
                } the market price of ${optionAssetUnit}.`}
                learnMoreURL="https://www.investopedia.com/terms/o/outofthemoney.asp"
                renderContent={({ ref, ...triggerHandler }) => (
                  <HighlighText ref={ref} {...triggerHandler}>
                    out-of-the-money
                  </HighlighText>
                )}
              />
              . In this situation the oTokens held by the {optionBuyerParty}{" "}
              expire worthless.
            </>
          );
        case "settlementA":
          return (
            <>
              When the {isPut ? "put" : "call"} options expire{" "}
              <TooltipExplanation
                title="OUT-OF-THE-MONEY"
                explanation={`An ${optionAssetUnit} ${
                  isPut ? "put" : "call"
                } option is out-of-the-money (OTM) if the strike price is ${
                  isPut ? "below" : "above"
                } the market price of ${optionAssetUnit}.`}
                learnMoreURL="https://www.investopedia.com/terms/o/outofthemoney.asp"
                renderContent={({ ref, ...triggerHandler }) => (
                  <HighlighText ref={ref} {...triggerHandler}>
                    out-of-the-money
                  </HighlighText>
                )}
              />
              , the {collateralAssetUnit} used to collateralize the options in
              the Opyn vault is returned back to the Ribbon vault.
            </>
          );
        case "expiryB":
          return (
            <>
              At{" "}
              <TooltipExplanation
                title="EXPIRATION DATE"
                explanation="An expiration date in derivatives is the last day that derivative contracts, such as options or futures, are valid."
                learnMoreURL="https://www.investopedia.com/terms/e/expirationdate.asp"
                renderContent={({ ref, ...triggerHandler }) => (
                  <HighlighText ref={ref} {...triggerHandler}>
                    expiry
                  </HighlighText>
                )}
              />
              , if the strike price is {isPut ? "higher" : "lower"} than the
              market price of {optionAssetUnit}, the options expire{" "}
              <TooltipExplanation
                title="IN-THE-MONEY"
                explanation={`An ${optionAssetUnit} ${
                  isPut ? "put" : "call"
                } option is in-the-money (ITM) if the strike price is ${
                  isPut ? "above" : "below"
                } the market price of ${optionAssetUnit}.`}
                learnMoreURL="https://www.investopedia.com/terms/i/inthemoney.asp"
                renderContent={({ ref, ...triggerHandler }) => (
                  <HighlighText ref={ref} {...triggerHandler}>
                    in-the-money
                  </HighlighText>
                )}
              />
              . In this situation the {optionBuyerParty} can exercise their
              options.
            </>
          );
        case "settlementB":
          return (
            <>
              When the call options expire{" "}
              <TooltipExplanation
                title="IN-THE-MONEY"
                explanation={`An ${optionAssetUnit} ${
                  isPut ? "put" : "call"
                } option is in-the-money (ITM) if the strike price is ${
                  isPut ? "above" : "below"
                } the market price of ${optionAssetUnit}.`}
                learnMoreURL="https://www.investopedia.com/terms/i/inthemoney.asp"
                renderContent={({ ref, ...triggerHandler }) => (
                  <HighlighText ref={ref} {...triggerHandler}>
                    in-the-money
                  </HighlighText>
                )}
              />
              , option holders exercise their options by withdrawing{" "}
              {collateralAssetUnit} from the Opyn vault. The amount withdrawn is
              equal to the difference between the price of {optionAssetUnit} and
              the strike price at expiry from the Opyn vault. Any{" "}
              {collateralAssetUnit} left over is returned back to the Ribbon
              vault.
            </>
          );
      }
    },
    [asset, isPut, isYearn, optionAsset, vaultOption, vaultVersion]
  );

  const infoSection = useMemo(() => {
    let titleColor;
    switch (step) {
      case "expiryA":
        titleColor = colors.green;
        break;
      case "expiryB":
        titleColor = colors.red;
        break;
      default:
        titleColor = color;
    }

    return (
      <ExplainerSection
        height={width > sizes.lg ? 280 : 330}
        className="d-flex flex-column p-3"
      >
        <AnimatePresence initial={false} exitBeforeEnter>
          <motion.div
            key={step}
            initial={{
              x: 100,
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            exit={{
              x: -100,
              opacity: 0,
            }}
            transition={{
              duration: 0.25,
              type: "keyframes",
              ease: "easeInOut",
            }}
            className="d-flex flex-column flex-grow-1"
          >
            <InfoTitle color={titleColor} className="mb-3">
              {renderTitle(step)}
            </InfoTitle>
            <InfoDescription className="flex-grow-1">
              {renderDescription(step)}
            </InfoDescription>
          </motion.div>
        </AnimatePresence>
        <SegmentPagination
          page={currentVaultExplanationStepList.indexOf(step) + 1}
          total={currentVaultExplanationStepList.length}
          onPageClick={(page) => {
            setStep(currentVaultExplanationStepList[page - 1]);
          }}
        />
      </ExplainerSection>
    );
  }, [
    color,
    currentVaultExplanationStepList,
    width,
    step,
    renderTitle,
    renderDescription,
  ]);

  return (
    <ExplainerContainer ref={containerRef}>
      <ExplainerSection
        height={
          width > sizes.lg ? (sectionWidth / 23) * 8 : (sectionWidth / 15) * 7
        }
      >
        <AnimatePresence initial={false} exitBeforeEnter>
          <VisualMotionDiv
            key={step}
            initial={{
              x: 100,
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            exit={{
              x: -100,
              opacity: 0,
            }}
            transition={{
              duration: 0.25,
              type: "keyframes",
              ease: "easeInOut",
            }}
            className="w-100 h-100"
            color={backgroundColor(step)}
          >
            {renderGraphic(step)}
          </VisualMotionDiv>
        </AnimatePresence>
      </ExplainerSection>
      {infoSection}
    </ExplainerContainer>
  );
};

export default VaultStrategyExplainer;
