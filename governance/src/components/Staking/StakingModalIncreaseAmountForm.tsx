import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { BigNumber } from "ethers";
import moment, { Duration } from "moment";
import { useWeb3React } from "@web3-react/core";

import { StakeIcon } from "shared/lib/assets/icons/icons";
import {
  BaseInput,
  BaseInputButton,
  BaseInputContainer,
  BaseInputLabel,
  BaseModalContentColumn,
  BaseModalWarning,
  SecondaryText,
  Title,
} from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import { useRBNTokenAccount } from "shared/lib/hooks/useRBNTokenSubgraph";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { formatBigNumber, formatBigNumberAmount } from "shared/lib/utils/math";
import { calculateInitialveRBNAmount } from "shared/lib/utils/governanceMath";
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

const StakingWarningHighlight = styled.strong`
  color: ${colors.green};
`;

interface StakingModalncreaseAmountFormProps {
  initialStakingData: {
    amount: BigNumber;
    duration: Duration;
  };
  proceedToPreview: (amount: BigNumber, duration: Duration) => void;
}

const StakingModalncreaseAmountForm: React.FC<
  StakingModalncreaseAmountFormProps
> = ({ initialStakingData, proceedToPreview }) => {
  const { active } = useWeb3React();
  const { data: rbnTokenAccount } = useRBNTokenAccount();

  const [expiryMoment, durationToExpiry] = useMemo(() => {
    const expiryMoment =
      rbnTokenAccount && rbnTokenAccount.lockEndTimestamp
        ? moment.unix(rbnTokenAccount.lockEndTimestamp)
        : moment();

    return [expiryMoment, moment.duration(expiryMoment.diff(moment()))];
  }, [rbnTokenAccount]);

  const [amountInput, setAmountInput] = useState(
    initialStakingData.amount.isZero()
      ? ""
      : formatUnits(initialStakingData.amount)
  );

  const inputError = useMemo(() => {
    return Boolean(
      amountInput &&
        parseUnits(amountInput, 18).gt(
          rbnTokenAccount ? rbnTokenAccount.walletBalance : BigNumber.from(0)
        )
    );
  }, [amountInput, rbnTokenAccount]);

  const expiryInFuture = useMemo(
    () => expiryMoment.isAfter(moment()),
    [expiryMoment]
  );

  const canProceed = useMemo(() => {
    return amountInput && expiryInFuture && !inputError;
  }, [amountInput, expiryInFuture, inputError]);

  return (
    <>
      <BaseModalContentColumn>
        <LogoContainer>
          <StakeIcon size="32px" color={colors.red} />
        </LogoContainer>
      </BaseModalContentColumn>
      <BaseModalContentColumn>
        <Title fontSize={22} lineHeight={28}>
          Increase Lock Amount
        </Title>
      </BaseModalContentColumn>
      <BaseModalContentColumn className="flex-column">
        <BaseInputLabel>AMOUNT (RBN)</BaseInputLabel>
        <BaseInputContainer error={inputError}>
          <BaseInput
            className="form-control"
            placeholder="0"
            type="number"
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value)}
            fontSize={32}
            lineHeight={32}
          />
          {active && (
            <BaseInputButton
              onClick={() =>
                setAmountInput(
                  rbnTokenAccount
                    ? formatUnits(rbnTokenAccount.walletBalance)
                    : "0"
                )
              }
            >
              MAX
            </BaseInputButton>
          )}
        </BaseInputContainer>
        {inputError && (
          <SecondaryText
            fontSize={12}
            lineHeight={16}
            color={colors.red}
            className="mt-2"
          >
            Insufficient unstaked RBN balance
          </SecondaryText>
        )}
      </BaseModalContentColumn>
      <BaseModalContentColumn>
        <div className="d-flex justify-content-between w-100">
          <SecondaryText lineHeight={24}>Unlocked RBN</SecondaryText>
          <Title
            lineHeight={24}
            color={inputError ? colors.red : colors.primaryText}
          >
            {rbnTokenAccount
              ? formatBigNumber(rbnTokenAccount.walletBalance, 18)
              : "0"}
          </Title>
        </div>
      </BaseModalContentColumn>
      <BaseModalContentColumn>
        <div className="d-flex justify-content-between w-100">
          <SecondaryText lineHeight={24}>Current Locked RBN</SecondaryText>
          <Title lineHeight={24}>
            {rbnTokenAccount
              ? formatBigNumber(rbnTokenAccount.lockedBalance, 18)
              : "0"}
          </Title>
        </div>
      </BaseModalContentColumn>
      <BaseModalContentColumn>
        <div className="d-flex justify-content-between w-100">
          <SecondaryText lineHeight={24}>Lockup Expiry</SecondaryText>
          <Title
            color={expiryInFuture ? colors.primaryText : colors.red}
            lineHeight={24}
          >
            {expiryMoment.format("MMM, Do YYYY")}
          </Title>
        </div>
      </BaseModalContentColumn>
      <BaseModalWarning color={colors.green} marginTop="auto">
        <SecondaryText
          color={`${colors.green}A3`}
          className="w-100 text-center"
          fontWeight={400}
        >
          {amountInput ? (
            <>
              Increasing your stake to{" "}
              <StakingWarningHighlight>
                {formatBigNumberAmount(
                  parseUnits(amountInput, 18).add(
                    rbnTokenAccount?.lockedBalance || BigNumber.from(0)
                  )
                )}{" "}
                RBN
              </StakingWarningHighlight>{" "}
              increases your voting power by{" "}
              <StakingWarningHighlight>
                {formatBigNumberAmount(
                  calculateInitialveRBNAmount(
                    parseUnits(amountInput, 18).add(
                      rbnTokenAccount?.lockedBalance || BigNumber.from(0)
                    ),
                    durationToExpiry
                  ).sub(
                    calculateInitialveRBNAmount(
                      rbnTokenAccount?.lockedBalance || BigNumber.from(0),
                      durationToExpiry
                    )
                  )
                )}{" "}
                veRBN{" "}
              </StakingWarningHighlight>
              to a total of{" "}
              <StakingWarningHighlight>
                {formatBigNumberAmount(
                  calculateInitialveRBNAmount(
                    parseUnits(amountInput, 18).add(
                      rbnTokenAccount?.lockedBalance || BigNumber.from(0)
                    ),
                    durationToExpiry
                  )
                )}{" "}
                veRNB
              </StakingWarningHighlight>
            </>
          ) : (
            <>Enter an amount to see the change in your voting power</>
          )}
        </SecondaryText>
      </BaseModalWarning>
      <BaseModalContentColumn>
        <ActionButton
          disabled={!canProceed}
          onClick={() => {
            if (!canProceed) {
              return;
            }

            proceedToPreview(parseUnits(amountInput, 18), durationToExpiry);
          }}
          className="py-3 mb-2"
          color={colors.red}
        >
          Preview Lock Increase
        </ActionButton>
      </BaseModalContentColumn>
    </>
  );
};

export default StakingModalncreaseAmountForm;
