import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import {
  BaseInput,
  BaseInputContainer,
  BaseInputLabel,
  BaseLink,
  BaseModalContentColumn,
  BaseModalWarning,
  PrimaryText,
  SecondaryText,
  Title,
} from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import useENSSearch from "shared/lib/hooks/useENSSearch";
import theme from "shared/lib/designSystem/theme";
import { ActionButton } from "shared/lib/components/Common/buttons";
import DelegationModalLeaderboardOverlay from "./DelegationModalLeaderboardOverlay";

const ModalBackButton = styled.div`
  display: flex;
  position: absolute;
  z-index: 1000;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: 40px;
`;

const ArrowBack = styled.i`
  color: ${colors.text};
  height: 14px;
`;

const DelegateLeaderboardButton = styled(PrimaryText)`
  text-decoration: underline;

  &:hover {
    opacity: ${theme.hover.opacity};
  }
`;

const WarningLearnMoreText = styled.span`
  color: ${colors.green};
  font-weight: 600;

  &:hover {
    opacity: ${theme.hover.opacity};
  }
`;

interface DelegationModalFormProps {
  onBack: () => void;
  onDelegate: (address: string) => void;
}

const DelegationModalForm: React.FC<DelegationModalFormProps> = ({
  onBack,
  onDelegate,
}) => {
  const [addressInput, setAddressInput] = useState("");
  const [inputError, setInputError] = useState<boolean>(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const { data: ensSearchResult, loading: ensSearching } =
    useENSSearch(addressInput);

  useEffect(() => {
    setInputError(Boolean(addressInput && !ensSearching && !ensSearchResult));
  }, [addressInput, ensSearchResult, ensSearching]);

  const canProceed = useMemo(
    () => Boolean(addressInput && ensSearchResult?.address),
    [addressInput, ensSearchResult]
  );

  return (
    <>
      <DelegationModalLeaderboardOverlay
        show={showLeaderboard}
        onLeaderSelected={(address) => {
          setAddressInput(address);
          setShowLeaderboard(false);
        }}
        onClose={() => setShowLeaderboard(false)}
      />
      <ModalBackButton role="button" onClick={onBack}>
        <ArrowBack className="fas fa-arrow-left" />
      </ModalBackButton>
      <BaseModalContentColumn marginTop={16}>
        <Title fontSize={22} lineHeight={28} className="text-center">
          DELEGATE YOUR VOTES TO ANOTHER ETHEREUM ADDRESS
        </Title>
      </BaseModalContentColumn>
      <BaseModalContentColumn className="flex-column">
        <BaseInputLabel>ADDRESS / ENS</BaseInputLabel>
        <BaseInputContainer error={Boolean(inputError)}>
          <BaseInput
            className="form-control"
            placeholder="0x573B...c65F"
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            fontSize={22}
            lineHeight={32}
            inputWidth="100%"
          />
        </BaseInputContainer>
        {inputError && (
          <SecondaryText
            fontSize={12}
            lineHeight={16}
            color={colors.red}
            className="mt-2"
          >
            Please enter a valid Ethereum address or ENS
          </SecondaryText>
        )}
      </BaseModalContentColumn>
      <BaseModalContentColumn>
        <DelegateLeaderboardButton
          fontSize={14}
          lineHeight={20}
          role="button"
          onClick={() => setShowLeaderboard(true)}
        >
          Select delegate leaderboard
        </DelegateLeaderboardButton>
      </BaseModalContentColumn>
      <BaseModalContentColumn marginTop={40}>
        <ActionButton
          disabled={!canProceed}
          onClick={() => onDelegate(ensSearchResult!.address)}
          className="py-3"
          color={colors.red}
        >
          DELEGATE
        </ActionButton>
      </BaseModalContentColumn>
      <BaseModalWarning color={colors.green}>
        <SecondaryText
          color={colors.green}
          className="text-center"
          fontWeight={400}
        >
          If you delegate your voting rights to another address you will still
          remain in control of your veRBN.{" "}
          <BaseLink
            to="https://google.com"
            target="_blank"
            rel="noreferrer noopener"
          >
            <WarningLearnMoreText>Learn more &rarr;</WarningLearnMoreText>
          </BaseLink>
        </SecondaryText>
      </BaseModalWarning>
    </>
  );
};

export default DelegationModalForm;
