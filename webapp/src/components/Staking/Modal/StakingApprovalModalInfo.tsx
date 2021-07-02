import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import moment from "moment";

import {
  BaseModalContentColumn,
  BaseUnderlineLink,
  PrimaryText,
  SecondaryText,
  Title,
} from "shared/lib/designSystem";
import { getDisplayAssets, VaultOptions } from "shared/lib/constants/constants";
import { ActionButton } from "shared/lib/components/Common/buttons";
import { getAssetLogo } from "shared/lib/utils/asset";
import { getVaultColor } from "shared/lib/utils/vault";
import { StakingPoolData } from "../../../models/staking";
import colors from "shared/lib/designSystem/colors";
import ModalContentExtra from "shared/lib/components/Common/ModalContentExtra";

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

const ErrorMessage = styled(Title)`
  color: ${colors.red};
`;

const WarningText = styled(PrimaryText)<{ color: string }>`
  display: flex;
  color: ${(props) => props.color};
  font-size: 14px;
  line-height: 20px;
  text-align: center;
`;

interface StakingApprovalModalInfoProps {
  vaultOption: VaultOptions;
  stakingPoolData: StakingPoolData;
  onApprove: () => void;
}

const StakingApprovalModalInfo: React.FC<StakingApprovalModalInfoProps> = ({
  vaultOption,
  stakingPoolData,
  onApprove,
}) => {
  const color = getVaultColor(vaultOption);
  const logo = useMemo(() => {
    const asset = getDisplayAssets(vaultOption);
    const Logo = getAssetLogo(asset);

    switch (asset) {
      case "WETH":
        return <Logo height="48px" />;
      default:
        return <Logo />;
    }
  }, [vaultOption]);

  const renderStakingFinishDate = useCallback(() => {
    if (stakingPoolData.periodFinish) {
      const finishPeriod = moment(stakingPoolData.periodFinish, "X");

      if (finishPeriod.diff(moment()) > 0) {
        return finishPeriod.format("MMM Do, YYYY");
      }
    }

    return "TBA";
  }, [stakingPoolData]);

  return (
    <>
      <BaseModalContentColumn>
        <LogoContainer color={color}>{logo}</LogoContainer>
      </BaseModalContentColumn>
      <BaseModalContentColumn marginTop={8}>
        <ApproveAssetTitle str={vaultOption}>{vaultOption}</ApproveAssetTitle>
      </BaseModalContentColumn>
      <BaseModalContentColumn>
        <PrimaryText className="text-center font-weight-normal">
          Before you stake, the pool needs your permission to hold your{" "}
          {vaultOption} tokens.
        </PrimaryText>
      </BaseModalContentColumn>
      <BaseModalContentColumn marginTop={16}>
        <BaseUnderlineLink
          to="https://ribbon.finance/faq"
          target="_blank"
          rel="noreferrer noopener"
          className="d-flex"
        >
          <SecondaryText>Why do I have to do this?</SecondaryText>
        </BaseUnderlineLink>
      </BaseModalContentColumn>
      <BaseModalContentColumn marginTop="auto">
        <ActionButton
          className="btn py-3 mb-2"
          onClick={onApprove}
          color={getVaultColor(vaultOption)}
          disabled={stakingPoolData.unstakedBalance.isZero()}
        >
          Approve
        </ActionButton>
      </BaseModalContentColumn>
      {stakingPoolData.unstakedBalance.isZero() ? (
        <BaseModalContentColumn marginTop={16}>
          <ErrorMessage className="mb-2">WALLET BALANCE: 0</ErrorMessage>
        </BaseModalContentColumn>
      ) : (
        <ModalContentExtra>
          <WarningText color={color}>
            IMPORTANT: To claim RBN rewards you must remain staked in the pool
            until the end of the liquidity mining program (
            {renderStakingFinishDate()}).
          </WarningText>
        </ModalContentExtra>
      )}
    </>
  );
};

export default StakingApprovalModalInfo;
