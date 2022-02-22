import React, { useMemo } from "react";
import styled from "styled-components";

import {
  BaseModalContentColumn,
  BaseModalWarning,
  PrimaryText,
  SecondaryText,
  Subtitle,
  Title,
} from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import { UnstakeIcon } from "shared/lib/assets/icons/icons";
import moment from "moment";
import { useRBNTokenAccount } from "shared/lib/hooks/useRBNTokenSubgraph";
import useLoadingText from "shared/lib/hooks/useLoadingText";
import { formatBigNumber } from "shared/lib/utils/math";
import { ActionButton } from "shared/lib/components/Common/buttons";

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: ${colors.red}1F;
  border-radius: 100px;
`;

interface UnstakingModalPreviewProps {
  onUnstake: () => void;
}

const UnstakingModalPreview: React.FC<UnstakingModalPreviewProps> = ({
  onUnstake,
}) => {
  const { data: rbnTokenAccount, loading } = useRBNTokenAccount();
  const loadingText = useLoadingText();

  const canUnstake = useMemo(() => {
    if (loading || !rbnTokenAccount || !rbnTokenAccount.lockEndTimestamp) {
      return false;
    }

    return moment().isSameOrAfter(
      moment.unix(rbnTokenAccount.lockEndTimestamp)
    );
  }, [loading, rbnTokenAccount]);

  const lockupAmountDisplay = useMemo(() => {
    if (loading) {
      return loadingText;
    }

    return `${
      rbnTokenAccount && rbnTokenAccount.lockedBalance
        ? formatBigNumber(rbnTokenAccount.lockedBalance)
        : "0"
    } RBN`;
  }, [loading, loadingText, rbnTokenAccount]);

  const lockupExpiryDisplay = useMemo(() => {
    if (loading) {
      return loadingText;
    }

    if (!rbnTokenAccount?.lockEndTimestamp) {
      return "---";
    }

    return moment.unix(rbnTokenAccount.lockEndTimestamp).format("MMM, Do YYYY");
  }, [loading, loadingText, rbnTokenAccount?.lockEndTimestamp]);

  return (
    <>
      <BaseModalContentColumn>
        <LogoContainer>
          <UnstakeIcon size="32px" color={colors.red} />
        </LogoContainer>
      </BaseModalContentColumn>
      <BaseModalContentColumn marginTop={16}>
        <Title fontSize={22} lineHeight={28}>
          Unlock Your Ribbon
        </Title>
      </BaseModalContentColumn>
      <BaseModalContentColumn>
        <div className="d-flex w-100 justify-content-between">
          <SecondaryText lineHeight={24}>Lockup Amount</SecondaryText>
          <Subtitle fontSize={14} lineHeight={24} letterSpacing={1}>
            {lockupAmountDisplay}
          </Subtitle>
        </div>
      </BaseModalContentColumn>
      <BaseModalContentColumn>
        <div className="d-flex w-100 justify-content-between">
          <SecondaryText lineHeight={24}>Lockup Expiry</SecondaryText>
          <Subtitle fontSize={14} lineHeight={24} letterSpacing={1}>
            {lockupExpiryDisplay}
          </Subtitle>
        </div>
      </BaseModalContentColumn>
      <BaseModalContentColumn marginTop="auto" className="mb-4">
        <ActionButton
          onClick={onUnstake}
          className="py-3"
          color={colors.red}
          disabled={!canUnstake}
        >
          CONFIRM UNLOCK
        </ActionButton>
      </BaseModalContentColumn>
      <BaseModalWarning color={colors.green} className="mb-2" marginTop={0}>
        <PrimaryText
          fontSize={14}
          lineHeight={20}
          color={colors.green}
          fontWeight={400}
          className="text-center"
        >
          IMPORTANT: You cannot unlock your RBN until the lockup expires on{" "}
          {lockupExpiryDisplay}
        </PrimaryText>
      </BaseModalWarning>
    </>
  );
};

export default UnstakingModalPreview;
