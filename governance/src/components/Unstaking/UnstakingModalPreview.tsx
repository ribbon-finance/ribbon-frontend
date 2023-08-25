import React, { useMemo } from "react";
import styled from "styled-components";

import {
  BaseModalContentColumn,
  SecondaryText,
  Subtitle,
  Title,
} from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import { UnstakeIcon } from "shared/lib/assets/icons/icons";
import { useRBNTokenAccount } from "shared/lib/hooks/useRBNTokenSubgraph";
import useLoadingText from "shared/lib/hooks/useLoadingText";
import { formatBigNumber } from "shared/lib/utils/math";
import { ActionButton } from "shared/lib/components/Common/buttons";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import HelpInfo from "shared/lib/components/Common/HelpInfo";

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
    return !loading && rbnTokenAccount && rbnTokenAccount.lockEndTimestamp;
  }, [loading, rbnTokenAccount]);

  const lockupAmountDisplay = useMemo(() => {
    if (loading) {
      return loadingText;
    }

    return `${
      rbnTokenAccount && rbnTokenAccount.lockedBalance
        ? formatBigNumber(rbnTokenAccount.lockedBalance, 18, 2)
        : "0"
    } RBN`;
  }, [loading, loadingText, rbnTokenAccount]);

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
        <div className="d-flex w-100 align-items-center">
          <SecondaryText lineHeight={24}>RBN Available to Unlock</SecondaryText>
          <TooltipExplanation
            title="RBN AVAILABLE TO UNLOCK"
            explanation="The amount of locked RBN that you can now unlock"
            renderContent={({ ref, ...triggerHandler }) => (
              <HelpInfo containerRef={ref} {...triggerHandler}>
                i
              </HelpInfo>
            )}
          />
          <Subtitle
            fontSize={14}
            lineHeight={24}
            letterSpacing={1}
            className="ml-auto"
          >
            {lockupAmountDisplay}
          </Subtitle>
        </div>
      </BaseModalContentColumn>
      <BaseModalContentColumn marginTop="auto" className="mb-2">
        <ActionButton
          onClick={onUnstake}
          className="py-3"
          color={colors.red}
          disabled={!canUnstake}
        >
          CONFIRM UNLOCK
        </ActionButton>
      </BaseModalContentColumn>
    </>
  );
};

export default UnstakingModalPreview;
