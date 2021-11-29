import React from "react";
import styled from "styled-components";

import { PrimaryText, Subtitle, Title } from "shared/lib/designSystem";
import theme from "shared/lib/designSystem/theme";
import colors from "shared/lib/designSystem/colors";

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
`;

const StakingSummary = () => {
  return (
    <div className="d-flex flex-column w-100">
      <Title className="mt-5" fontSize={18} lineHeight={24}>
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
      </SummaryContainer>
    </div>
  );
};

export default StakingSummary;
