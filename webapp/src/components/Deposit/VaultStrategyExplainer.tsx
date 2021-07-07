import React, { useCallback, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";

import {
  getAssets,
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
  const { width: sectionWidth } = useElementSize(containerRef);
  const color = getVaultColor(vaultOption);
  const asset = getAssets(vaultOption);

  const [step, setStep] = useState<ExplanationStep>("deposit");

  const renderGraphic = useCallback(
    (s: ExplanationStep) => {
      switch (s) {
        case "strikeSelection":
          return <StrikeSelection color={color} />;
        case "mintOption":
          return (
            <TradeOffer
              color={color}
              tradeTarget="Opyn Vault"
              offerToken={asset}
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
    [asset, color]
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
      const isPut = isPutVault(vaultOption);
      switch (s) {
        case "deposit":
          return `The vault receives ${assetUnit} from depositors and invests 90% of these funds in its weekly strategy. The remaining 10% of funds is set aside so that depositors can withdraw their ${assetUnit} from the vault.`;
        case "strikeSelection":
          return `Before creating the ${assetUnit} ${
            isPut ? "put" : "call"
          } option, the vault manager must choose the strike price for the options. Currently the role of the vault manager is played by the Ribbon team.`;
        case "mintOption":
        case "tradeOption":
        case "expiryA":
        case "expiryB":
          return "Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non";
        case "settlementA":
          return `The ${assetUnit} used to collateralize the options in the Opyn vault is returned back to the Ribbon vault.`;
        case "settlementB":
          return `The options are cash-settled, meaning that for each options contract, market makers receive the difference between the between the price of ${assetUnit} at expiry and the strike price. The remaining ${assetUnit} left over is returned to the Ribbon vault.`;
      }
    },
    [asset, vaultOption]
  );

  const infoSection = useMemo(
    () => (
      <ExplainerSection height={200} className="d-flex flex-column p-3">
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
    [color, step, renderTitle, renderDescription]
  );

  return (
    <ExplainerContainer ref={containerRef} color={color}>
      <VisualSection height={(sectionWidth / 23) * 8} color={color}>
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
