import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";

import {
  getAssets,
  getDisplayAssets,
  isPutVault,
  VaultOptions,
} from "shared/lib/constants/constants";
import theme from "shared/lib/designSystem/theme";
import colors from "shared/lib/designSystem/colors";
import useElementSize from "shared/lib/hooks/useElementSize";
import { getVaultColor } from "shared/lib/utils/vault";
import { SecondaryText, Title } from "shared/lib/designSystem";
import { getAssetDisplay } from "shared/lib/utils/asset";
import SegmentPagination from "../Common/SegmentPagination";
import StrikeSelection from "./ExplainerGraphic.tsx/StrikeSelection";
import TradeOffer from "./ExplainerGraphic.tsx/TradeOffer";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import useScreenSize from "shared/lib/hooks/useScreenSize";
import sizes from "shared/lib/designSystem/sizes";
import VaultDeposit from "./ExplainerGraphic.tsx/VaultDeposit";

const ExplainerContainer = styled.div<{ color: string }>`
  display: flex;
  flex-direction: column;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: ${theme.border.radius};
  overflow: hidden;
  background: ${(props) => props.color}0a;
  overflow: hidden;
`;

const ExplainerSection = styled.div<{ height: number }>`
  height: ${(props) => props.height}px;
`;

const VisualSection = styled(ExplainerSection)<{ color: string }>`
  background: linear-gradient(
    96.84deg,
    ${(props) => props.color}14 1.04%,
    ${(props) => props.color}03 98.99%
  );
`;

const InfoTitle = styled(Title)<{ color: string }>`
  color: ${(props) => props.color};
`;

const HighlighText = styled.span`
  color: ${colors.primaryText};
  cursor: help;

  poin &:hover {
    color: ${colors.primaryText}CC;
  }
`;

type ExplanationStep =
  | "deposit"
  | "strikeSelection"
  | "mintOption"
  | "tradeOption"
  | "expiryA"
  | "settlementA"
  | "expiryB"
  | "settlementB";

const ExplanationStepNum: { [key: number]: ExplanationStep } = {
  1: "deposit",
  2: "strikeSelection",
  3: "mintOption",
  4: "tradeOption",
  5: "expiryA",
  6: "settlementA",
  7: "expiryB",
  8: "settlementB",
};

interface VaultStrategyExplainerProps {
  vaultOption: VaultOptions;
}

const VaultStrategyExplainer: React.FC<VaultStrategyExplainerProps> = ({
  vaultOption,
}) => {
  const containerRef = useRef(null);
  const { width } = useScreenSize();
  const { width: sectionWidth } = useElementSize(containerRef);
  const color = getVaultColor(vaultOption);
  const asset = getAssets(vaultOption);

  const [step, setStep] = useState<ExplanationStep>("deposit");

  useEffect(() => {
    const timer = setTimeout(() => {
      setStep((step) => {
        const currentNum = parseInt(
          Object.keys(ExplanationStepNum).find(
            (key) => ExplanationStepNum[parseInt(key)] === step
          )!
        );
        return ExplanationStepNum[
          (currentNum % Object.keys(ExplanationStepNum).length) + 1
        ];
      });
    }, 8000);

    return () => clearTimeout(timer);
  }, [step]);

  const renderGraphic = useCallback(
    (s: ExplanationStep) => {
      switch (s) {
        case "deposit":
          return <VaultDeposit depositAsset={asset} />;
        case "strikeSelection":
          return <StrikeSelection color={color} />;
        case "mintOption":
          const collateralAsset = getDisplayAssets(vaultOption);
          return (
            <TradeOffer
              color={color}
              tradeTarget="Opyn Vault"
              offerToken={collateralAsset}
              receiveToken="oToken"
            />
          );
        case "tradeOption":
          return (
            <TradeOffer
              color={color}
              tradeTarget="MARKET MAKER"
              offerToken="oToken"
              receiveToken="money"
            />
          );
      }
    },
    [asset, color, vaultOption]
  );

  const renderTitle = useCallback(
    (s: ExplanationStep) => {
      const isPut = isPutVault(vaultOption);
      switch (s) {
        case "deposit":
          return "VAULT Receives DEPOSITS";
        case "strikeSelection":
          return "MANAGER SELECTS STRIKE AND EXPIRY";
        case "mintOption":
          return "VAULT CREATES OPTIONS";
        case "tradeOption":
          return "Options SOLD TO MARKET MAKERS";
        case "expiryA":
          return `EXPIRY A - STRIKE IS ${
            isPut ? "BELOW" : "ABOVE"
          } MARKET PRICE`;
        case "settlementA":
          return "COLLATERAL RETURNED TO THE VAULT";
        case "expiryB":
          return `EXPIRY B - STRIKE IS ${
            isPut ? "ABOVE" : "BELOW"
          } MARKET PRICE`;
        case "settlementB":
          return "MARKET MAKERS EXERCISE OPTIONS";
      }
    },
    [vaultOption]
  );

  const renderDescription = useCallback(
    (s: ExplanationStep) => {
      const assetUnit = getAssetDisplay(asset);
      const collateralAsset = getDisplayAssets(vaultOption);
      const collateralAssetUnit = getAssetDisplay(collateralAsset);
      const isPut = isPutVault(vaultOption);
      switch (s) {
        case "deposit":
          return (
            <>
              The vault receives {assetUnit} from depositors and invests 90% of
              these funds in its weekly strategy. The remaining 10% of funds is
              set aside so that depositors can withdraw their {assetUnit} from
              the vault.
            </>
          );
        case "strikeSelection":
          return (
            <>
              Before creating the {assetUnit} {isPut ? "put" : "call"} option,
              the vault manager must choose the{" "}
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
                    {assetUnit} {isPut ? "put" : "call"} options
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
              expiry date (the following Friday). In return, the vault receives
              oTokens from the Opyn vault which represent the {assetUnit}{" "}
              {isPut ? "put" : "call"} options.
            </>
          );
        case "tradeOption":
          return (
            <>
              The newly minted options are sold to{" "}
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
              ). The sale is done{" "}
              <TooltipExplanation
                title="OVER-THE-COUNTER (OTC)"
                explanation="Over-the-counter (OTC) refers to the process of how securities are traded via a broker-dealer network as opposed to on a centralized exchange."
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
              .
            </>
          );
        case "expiryA":
        case "expiryB":
          return (
            <>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit ut
              aliquam, purus sit amet luctus venenatis, lectus magna fringilla
              urna, porttitor rhoncus dolor purus non
            </>
          );
        case "settlementA":
          return (
            <>
              The {assetUnit} used to collateralize the options in the Opyn
              vault is returned back to the Ribbon vault.
            </>
          );
        case "settlementB":
          return (
            <>
              The options are cash-settled, meaning that for each options
              contract, market makers receive the difference between the between
              the price of {assetUnit} at expiry and the strike price. The
              remaining {assetUnit} left over is returned to the Ribbon vault.
            </>
          );
      }
    },
    [asset, vaultOption]
  );

  const infoSection = useMemo(
    () => (
      <ExplainerSection
        height={width > sizes.lg ? 220 : 280}
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
            <InfoTitle color={color} className="mb-3">
              {renderTitle(step)}
            </InfoTitle>
            <SecondaryText className="flex-grow-1">
              {renderDescription(step)}
            </SecondaryText>
          </motion.div>
        </AnimatePresence>
        <SegmentPagination
          page={parseInt(
            Object.keys(ExplanationStepNum).find(
              (key) => ExplanationStepNum[parseInt(key)] === step
            )!
          )}
          total={Object.keys(ExplanationStepNum).length}
          onPageClick={(page) => {
            setStep(ExplanationStepNum[page]);
          }}
        />
      </ExplainerSection>
    ),
    [color, width, step, renderTitle, renderDescription]
  );

  return (
    <ExplainerContainer ref={containerRef} color={color}>
      <VisualSection
        height={
          width > sizes.lg ? (sectionWidth / 23) * 8 : (sectionWidth / 15) * 7
        }
        color={color}
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
            className="w-100 h-100"
          >
            {renderGraphic(step)}
          </motion.div>
        </AnimatePresence>
      </VisualSection>
      {infoSection}
    </ExplainerContainer>
  );
};

export default VaultStrategyExplainer;
