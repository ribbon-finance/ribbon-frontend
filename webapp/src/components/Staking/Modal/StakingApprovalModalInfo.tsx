import React, { useMemo } from "react";
import styled from "styled-components";

import {
  BaseUnderlineLink,
  PrimaryText,
  SecondaryText,
  Title,
} from "shared/lib/designSystem";
import { getAssets, VaultOptions } from "shared/lib/constants/constants";
import { ActionButton } from "shared/lib/components/Common/buttons";
import { getAssetLogo } from "shared/lib/utils/asset";
import { getVaultColor } from "shared/lib/utils/vault";

const ContentColumn = styled.div<{ marginTop?: number | "auto" }>`
  display: flex;
  justify-content: center;
  z-index: 1;
  margin-top: ${(props) =>
    props.marginTop === "auto"
      ? props.marginTop
      : `${props.marginTop || 24}px`};
`;

const LogoContainer = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 100px;
  background: ${(props) => props.color}29;
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
    const asset = getAssets(vaultOption);
    const Logo = getAssetLogo(asset);

    switch (asset) {
      case "WETH":
        return <Logo height="48px" />;
      default:
        return <Logo />;
    }
  }, [vaultOption]);

  return (
    <>
      <ContentColumn marginTop={-8}>
        <LogoContainer color={getVaultColor(vaultOption)}>{logo}</LogoContainer>
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
        <ActionButton
          className="btn py-3 mb-2"
          onClick={onApprove}
          color={getVaultColor(vaultOption)}
        >
          Approve
        </ActionButton>
      </ContentColumn>
    </>
  );
};

export default StakingApprovalModalInfo;
