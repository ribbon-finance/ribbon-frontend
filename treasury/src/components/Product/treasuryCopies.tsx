import React from "react";
import styled from "styled-components";

import colors from "shared/lib/designSystem/colors";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";

const HighlighText = styled.span`
  color: ${colors.primaryText};
  cursor: help;

  poin &:hover {
    color: ${colors.primaryText}CC;
  }
`;

interface ProductCopies {
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  strategy: React.ReactNode;
  vaultRisk: React.ReactNode;
  liquidityMining: {
    explanation: React.ReactNode;
  };
}

export const treasuryCopy: ProductCopies = {
  title: "Treasury",
  subtitle: "",
  description: "Generates yield by running an automated covered call strategy.",
  tags: ["COVERED CALL"],
  strategy: "",
  vaultRisk: (
    <>
      The primary risk for running this covered call strategy is that the vault
      may incur a weekly loss in the case where the call options sold by the
      vault expire{" "}
      <TooltipExplanation
        title="IN-THE-MONEY"
        explanation="An call option is in-the-money (ITM) if the strike price is below the market price of its underlying asset."
        learnMoreURL="https://www.investopedia.com/terms/i/inthemoney.asp"
        renderContent={({ ref, ...triggerHandler }) => (
          <HighlighText ref={ref} {...triggerHandler}>
            in-the-money
          </HighlighText>
        )}
      />{" "}
      (meaning the price of the underlying asset is above the strike price of
      the call options minted by the vault).
    </>
  ),
  liquidityMining: {
    explanation: <></>,
  },
};
