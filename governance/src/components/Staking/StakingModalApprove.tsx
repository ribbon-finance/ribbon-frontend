import React from "react";

import Logo from "shared/lib/assets/icons/logo";
import { ActionButton } from "shared/lib/components/Common/buttons";
import {
  BaseUnderlineLink,
  BaseModalContentColumn,
  SecondaryText,
  Title,
} from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import { useRBNTokenAccount } from "shared/lib/hooks/useRBNTokenSubgraph";
import { formatBigNumber } from "shared/lib/utils/math";

interface StakingModalApproveProps {
  onApprove: () => void;
}

const StakingModalApprove: React.FC<StakingModalApproveProps> = ({
  onApprove,
}) => {
  const { data } = useRBNTokenAccount();

  return (
    <>
      <BaseModalContentColumn marginTop={48}>
        <Logo width={64} />
      </BaseModalContentColumn>
      <BaseModalContentColumn>
        <Title fontSize={22} lineHeight={28}>
          APPROVE RBN
        </Title>
      </BaseModalContentColumn>
      <BaseModalContentColumn marginTop={16}>
        <SecondaryText
          fontSize={16}
          lineHeight={24}
          fontWeight={400}
          className="text-center"
        >
          Before you continue, Ribbon first needs your permission to stake your
          RBN
        </SecondaryText>
      </BaseModalContentColumn>
      <BaseModalContentColumn marginTop={16}>
        <BaseUnderlineLink
          to="https://ribbon.finance/faq"
          target="_blank"
          rel="noreferrer noopener"
        >
          <SecondaryText>Why do I have to do this?</SecondaryText>
        </BaseUnderlineLink>
      </BaseModalContentColumn>
      <BaseModalContentColumn marginTop={40}>
        <ActionButton className="py-3" color={colors.red} onClick={onApprove}>
          APPROVE RBN
        </ActionButton>
      </BaseModalContentColumn>
      <BaseModalContentColumn>
        <SecondaryText>
          Wallet Balance:{" "}
          {data
            ? formatBigNumber(data.totalBalance.sub(data.walletBalance))
            : 0}{" "}
          RBN
        </SecondaryText>
      </BaseModalContentColumn>
    </>
  );
};

export default StakingModalApprove;
