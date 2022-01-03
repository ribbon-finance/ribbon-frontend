import React, { useCallback } from "react";
import styled from "styled-components";

import {
  PrimaryText,
  SecondaryText,
  Subtitle,
  Title,
} from "shared/lib/designSystem";
import theme from "shared/lib/designSystem/theme";
import colors from "shared/lib/designSystem/colors";
import StakingSummaryChart from "./StakingSummaryChart";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import HelpInfo from "shared/lib/components/Common/HelpInfo";

const SummaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: ${colors.background.two};
  width: 100%;
  border-radius: ${theme.border.radius};
  margin-top: 24px;
`;

const LockupExpiryContainer = styled.div`
  display: flex;
  padding: 8px 16px;
  background: ${colors.green}1F;
  border-radius: ${theme.border.radiusSmall};
`;

const LockupData = styled.div`
  width: 50%;
  padding: 16px 24px;
  border-top: ${theme.border.width} ${theme.border.style} ${colors.border};

  &:nth-child(odd) {
    border-right: ${theme.border.width} ${theme.border.style} ${colors.border};
  }
`;

const StakingSummary = () => {
  const renderDataTooltip = useCallback(
    (title: string, explanation: string, learnMoreURL?: string) => (
      <TooltipExplanation
        title={title}
        explanation={explanation}
        renderContent={({ ref, ...triggerHandler }) => (
          <HelpInfo containerRef={ref} {...triggerHandler}>
            i
          </HelpInfo>
        )}
        learnMoreURL={learnMoreURL}
      />
    ),
    []
  );

  return (
    <div className="d-flex flex-column w-100 mt-5 mb-3">
      <Title fontSize={18} lineHeight={24}>
        STAKING SUMMARY
      </Title>
      <SummaryContainer>
        {/* Header Info */}
        <div className="p-4">
          {/* Voting Power Title */}
          <Subtitle fontSize={12} lineHeight={20} color={colors.red}>
            VOTING POWER
          </Subtitle>

          {/* sRBN amount and Expiry */}
          <div className="d-flex align-items-center mt-1">
            {/* sRBN Amount */}
            <div className="d-flex align-items-center">
              <Title fontSize={32} lineHeight={40}>
                5,235.27
              </Title>
              <Title
                fontSize={12}
                lineHeight={16}
                color={colors.text}
                className="ml-2"
              >
                sRBN
              </Title>
            </div>

            {/* Expiry Container */}
            <LockupExpiryContainer className="ml-auto">
              <PrimaryText
                fontSize={12}
                lineHeight={16}
                color={`${colors.green}A3`}
              >
                Lockup ends on
              </PrimaryText>
              <PrimaryText
                fontSize={12}
                lineHeight={16}
                color={colors.green}
                className="ml-1"
              >
                January 29th, 2026
              </PrimaryText>
            </LockupExpiryContainer>
          </div>
        </div>

        {/* Graph */}
        <StakingSummaryChart />

        {/* Stats */}
        <div className="d-flex flex-wrap">
          <LockupData>
            <div className="d-flex align-items-center">
              <SecondaryText>Locked RBN</SecondaryText>
              {renderDataTooltip(
                "Locked RBN",
                "Locked RBN is the total amount of RBN locked in the staking contract."
              )}
            </div>
            <Title className="mt-1">10,000,000</Title>
          </LockupData>

          <LockupData>
            <div className="d-flex align-items-center">
              <SecondaryText>Unstaked RBN</SecondaryText>
              {renderDataTooltip(
                "Locked RBN",
                "Locked RBN is the total amount of RBN locked in the staking contract."
              )}
            </div>
            <Title className="mt-1">5,000.00</Title>
          </LockupData>

          <LockupData>
            <div className="d-flex align-items-center">
              <SecondaryText>RBN Staking Rewards</SecondaryText>
              {renderDataTooltip(
                "Locked RBN",
                "Locked RBN is the total amount of RBN locked in the staking contract."
              )}
            </div>
            <Title className="mt-1" color={colors.green}>
              1,273.14
            </Title>
          </LockupData>

          <LockupData>
            <div className="d-flex align-items-center">
              <SecondaryText>Rewards Booster</SecondaryText>
              {renderDataTooltip(
                "Locked RBN",
                "Locked RBN is the total amount of RBN locked in the staking contract."
              )}
            </div>
            <Title className="mt-1">5.23x</Title>
          </LockupData>
        </div>
      </SummaryContainer>
    </div>
  );
};

export default StakingSummary;
