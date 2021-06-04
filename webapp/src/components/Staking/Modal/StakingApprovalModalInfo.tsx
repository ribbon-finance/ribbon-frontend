import React, { useMemo } from "react";
import styled from "styled-components";

import {
  BaseUnderlineLink,
  PrimaryText,
  SecondaryText,
  Title,
} from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import {
  USDCLogo,
  WBTCLogo,
  WETHLogo,
} from "shared/lib/assets/icons/erc20Assets";
import { getAssets, VaultOptions } from "shared/lib/constants/constants";
import { ActionButton } from "shared/lib/components/Common/buttons";

const ContentColumn = styled.div<{ marginTop?: number | "auto" }>`
  display: flex;
  justify-content: center;
  z-index: 1;
  margin-top: ${(props) =>
    props.marginTop === "auto"
      ? props.marginTop
      : `${props.marginTop || 24}px`};
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 100px;
  background: ${colors.green}29;
`;

const GreenWBTCLogo = styled(WBTCLogo)`
  width: 100%;
  && * {
    fill: ${colors.green};
  }
`;

const GreenUSDCLogo = styled(USDCLogo)`
  margin: -8px;
  width: 100%;

  && .background {
    fill: none;
  }

  && .content {
    fill: ${colors.green};
  }
`;

const GreenWETHLogo = styled(WETHLogo)`
  .cls-1,
  .cls-5 {
    fill: ${colors.green}66;
  }

  .cls-2,
  .cls-6 {
    fill: ${colors.green}CC;
  }

  .cls-3,
  .cls-4 {
    fill: ${colors.green};
  }
`;

const ApproveAssetTitle = styled(Title)<{ str: string }>`
  text-transform: none;

  ${(props) =>
    props.str.length > 12
      ? `
    font-size: 24px;
    line-height: 36px;
  `
      : `
    font-size: 40px;
    line-height: 52px;
  `}
`;

interface StakingApprovalModalInfoProps {
  vaultOption: VaultOptions;
  onApprove: () => void;
}

const StakingApprovalModalInfo: React.FC<StakingApprovalModalInfoProps> = ({
  vaultOption,
  onApprove,
}) => {
  const logo = useMemo(() => {
    switch (getAssets(vaultOption)) {
      case "WBTC":
        return <GreenWBTCLogo />;
      case "USDC":
        return <GreenUSDCLogo />;
      default:
        return <GreenWETHLogo height="48px" />;
    }
  }, [vaultOption]);

  return (
    <>
      <ContentColumn marginTop={-8}>
        <LogoContainer>{logo}</LogoContainer>
      </ContentColumn>
      <ContentColumn marginTop={8}>
        <ApproveAssetTitle str={vaultOption}>{vaultOption}</ApproveAssetTitle>
      </ContentColumn>
      <ContentColumn>
        <PrimaryText className="text-center font-weight-normal">
          Before you stake, the pool needs your permission to hold your{" "}
          {vaultOption} tokens.
        </PrimaryText>
      </ContentColumn>
      <ContentColumn marginTop={16}>
        <BaseUnderlineLink
          to="https://ribbon.finance/faq"
          target="_blank"
          rel="noreferrer noopener"
          className="d-flex"
        >
          <SecondaryText>Why do I have to do this?</SecondaryText>
        </BaseUnderlineLink>
      </ContentColumn>
      <ContentColumn marginTop="auto">
        <ActionButton className="btn py-3 mb-2" onClick={onApprove}>
          Approve
        </ActionButton>
      </ContentColumn>
    </>
  );
};

export default StakingApprovalModalInfo;
