import React from "react";
import styled from "styled-components";

import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import {
  BaseLink,
  PrimaryText,
  SecondaryText,
  Subtitle,
  Title,
} from "shared/lib/designSystem";
import { ExternalIcon } from "shared/lib/assets/icons/icons";
import { Waves } from "shared/lib/assets";

const OverviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 48px;
`;

const OverviewInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: relative;
  padding: 24px;
  background: linear-gradient(
    96.84deg,
    ${colors.green}29 1.04%,
    ${colors.green}07 98.99%
  );
  border-radius: ${theme.border.radius} ${theme.border.radius} 0 0;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
`;

const OverviewTag = styled.div`
  display: flex;
  background: #ffffff0a;
  padding: 8px;
  border-radius: ${theme.border.radius};
`;

const OverviewDescription = styled(SecondaryText)`
  line-height: 1.5;
`;

const UnderlineLink = styled(BaseLink)`
  text-decoration: underline;
  color: ${colors.primaryText};
  z-index: 1;

  &:hover {
    text-decoration: underline;
    color: ${colors.primaryText};
    opacity: ${theme.hover.opacity};
  }
`;

const OverviewBackgroundContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const StyledWaves = styled(Waves)`
  margin-bottom: -75px;

  path {
    stroke: ${colors.green}3D;
  }
`;

const OverviewKPI = styled.div`
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  padding: 16px;
  width: 50%;
  display: flex;
  flex-wrap: wrap;

  &:nth-child(odd) {
    border-left: none;
  }
`;

const OverviewLabel = styled(SecondaryText)`
  font-size: 12px;
  line-height: 16px;
  width: 100%;
  margin-bottom: 8px;
`;

const StakingOverview = () => {
  return (
    <OverviewContainer>
      <OverviewInfo>
        <OverviewTag>
          <Subtitle>Liquidity Mining</Subtitle>
        </OverviewTag>
        <Title className="mt-3 w-100">Staking On Ribbon</Title>
        <OverviewDescription className="mt-3 w-100">
          Lorem ipsum dolor sit amet, consectetur adipising elit ut aliquam,
          purus sit amet luctus venenatis, lectus magna fringilla urna,
          porttitor rhoncus dolor purus non enim preasent elementum facilisis
          leo, vel fringilla est
        </OverviewDescription>
        <UnderlineLink
          to="https://ribbon.finance/faq"
          target="_blank"
          rel="noreferrer noopener"
          className="d-flex mt-4"
        >
          <PrimaryText className="mr-2">
            Learn more about our liquidity mining program
          </PrimaryText>
          <ExternalIcon color="white" />
        </UnderlineLink>
        <OverviewBackgroundContainer>
          <StyledWaves />
        </OverviewBackgroundContainer>
      </OverviewInfo>
      <OverviewKPI>
        <OverviewLabel>$RBN Distributed</OverviewLabel>
        {/* TODO: Replace with API */}
        <Title>1,282,128.00</Title>
      </OverviewKPI>
      <OverviewKPI>
        <OverviewLabel>No. of $RBN Holders</OverviewLabel>
        {/* TODO: Replace with API */}
        <Title>1,500</Title>
      </OverviewKPI>
    </OverviewContainer>
  );
};

export default StakingOverview;
