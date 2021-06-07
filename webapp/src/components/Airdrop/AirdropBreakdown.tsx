import React, { useCallback, useMemo } from "react";
import { SecondaryText, Subtitle } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import styled from "styled-components";

import useAirdrop from "../../hooks/useAirdrop";
import { AirdropBreakDownType } from "../../models/airdrop";

type ProcessedAirdropBreakdownType = AirdropBreakDownType | "option";

export const getAirdropColor = (variant: ProcessedAirdropBreakdownType) => {
  switch (variant) {
    case "option":
      return colors.green;
    case "discord":
      return colors.brands.discord;
    case "strangle":
    case "thetaVaultBase":
    case "thetaVaultBonus":
      return colors.red;
  }
};

const getAirdropTitle = (variant: ProcessedAirdropBreakdownType) => {
  switch (variant) {
    case "option":
      return "Options Trader";
    case "discord":
      return "DISCORD MEMBER";
    case "strangle":
      return "STRANGLE BUYER";
    case "thetaVaultBase":
      return "VAULT USER";
    case "thetaVaultBonus":
      return "VAULT USER BONUS";
  }
};

const BreakdownContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;

const BreakdownBackground = styled.div<{
  variant: ProcessedAirdropBreakdownType;
}>`
  background: ${(props) => getAirdropColor(props.variant)}14;
  border-radius: 16px 16px 8px 8px;
  margin: 16px 16px 0px 16px;
  width: 100%;
`;

const BreakdownPill = styled.div<{
  variant: ProcessedAirdropBreakdownType;
}>`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border: ${theme.border.width} ${theme.border.style}
    ${(props) => getAirdropColor(props.variant)};
  border-radius: 100px;
`;

const BreakdwonPillIndicator = styled.div<{
  variant: ProcessedAirdropBreakdownType;
}>`
  height: 8px;
  width: 8px;
  background: ${(props) => getAirdropColor(props.variant)};
  margin-right: 8px;
  border-radius: 4px;
`;

const BreakdownPillToken = styled(Subtitle)<{
  variant: ProcessedAirdropBreakdownType;
}>`
  color: ${(props) => getAirdropColor(props.variant)};
  margin-left: auto;
`;

const BreakdownPillDropdown = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const BreakdownPillDropdownText = styled(SecondaryText)<{
  variant: ProcessedAirdropBreakdownType;
}>`
  color: ${(props) => getAirdropColor(props.variant)}A3;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
`;

const AirdropBreakdown = () => {
  const airdrop = useAirdrop();

  const processedBreakdown = useMemo(() => {
    if (!airdrop) {
      return {};
    }

    return Object.fromEntries(
      Object.keys(airdrop.breakdown).map((key) => [
        ["charm", "hegic", "opyn", "primitive"].includes(key) ? "option" : key,
        airdrop.breakdown[key],
      ])
    );
  }, [airdrop]);

  const renderBreakdownPill = useCallback(
    (token: number, variant: ProcessedAirdropBreakdownType, index: number) => (
      <BreakdownBackground variant={variant} key={index}>
        <BreakdownPill variant={variant}>
          <BreakdwonPillIndicator variant={variant} />
          <Subtitle>{getAirdropTitle(variant)}</Subtitle>
          <BreakdownPillToken variant={variant}>
            {token.toLocaleString()} RBN
          </BreakdownPillToken>
        </BreakdownPill>
        {variant === "option" && (
          <BreakdownPillDropdown>
            <BreakdownPillDropdownText variant={variant}>
              Airdrop for being either a Charm seller, Opyn seller, Hegic LP or
              Primitive LP.
            </BreakdownPillDropdownText>
          </BreakdownPillDropdown>
        )}
      </BreakdownBackground>
    ),
    []
  );

  return (
    <BreakdownContainer>
      {Object.keys(processedBreakdown).map((key, index) =>
        renderBreakdownPill(
          processedBreakdown[key] || 0,
          key as ProcessedAirdropBreakdownType,
          index
        )
      )}
    </BreakdownContainer>
  );
};

export default AirdropBreakdown;
