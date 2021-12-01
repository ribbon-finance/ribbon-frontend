import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";

import { PrimaryText, SecondaryText, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import useENSSearch from "shared/lib/hooks/useENSSearch";
import createIcon from "shared/lib/utils/blockies";
import { truncateAddress } from "shared/lib/utils/address";

const VoteDelegationContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: ${colors.background.two};
  width: 100%;
  border-radius: ${theme.border.radius};
  margin-top: 24px;
`;

const VoteDelegationPreferenceContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  margin: 16px;
  background: ${colors.background.three};
  border-radius: 100px;
`;

const DelegationIcon = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 48px;
`;

const DelegationButton = styled.div<{ widthType: "fitContent" | "fullWidth" }>`
  display: flex;
  width: ${(props) => {
    switch (props.widthType) {
      case "fitContent":
        return "fit-content";
      case "fullWidth":
        return "100%";
    }
  }};
  justify-content: center;
  padding: 10px 16px;
  border-radius: 100px;
  background: ${colors.green}1F;
`;

const VoteDelegation = () => {
  const { account } = useWeb3React();
  const delegation: string | undefined =
    Math.random() < 1
      ? "0x5555763613a12D8F3e73be831DFf8598089d3dCa"
      : undefined;
  const { data } = useENSSearch(delegation || "");

  const delegationContent = useMemo(() => {
    if (!data) {
      return (
        <DelegationButton role="button" widthType="fullWidth">
          <PrimaryText color={colors.green}>
            Add Your Voting Preferences
          </PrimaryText>
        </DelegationButton>
      );
    }

    const imageUrl = data.avatar
      ? data.avatar
      : createIcon({
          seed: data.address.toLowerCase(),
          size: 8,
          scale: 5,
        }).toDataURL();
    return (
      <>
        <DelegationIcon src={imageUrl} />
        <div className="d-flex flex-column ml-2">
          <SecondaryText fontSize={12} lineHeight={16}>
            Delegated To
          </SecondaryText>
          <Title className="mt-1">
            {data.labelName || truncateAddress(data.address)}
          </Title>
        </div>
        <DelegationButton
          role="button"
          className="ml-auto"
          widthType="fitContent"
        >
          <PrimaryText color={colors.green}>
            Add Your Voting Preferences
          </PrimaryText>
        </DelegationButton>
      </>
    );
  }, [data]);

  return (
    <div className="d-flex flex-column w-100 my-5 mb-3">
      <Title fontSize={18} lineHeight={24}>
        VOTE DELEGATION
      </Title>

      <VoteDelegationContainer>
        <VoteDelegationPreferenceContainer>
          {delegationContent}
        </VoteDelegationPreferenceContainer>
      </VoteDelegationContainer>
    </div>
  );
};

export default VoteDelegation;
