import React, { useMemo } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { BigNumber } from "@ethersproject/bignumber";

import {
  BaseLink,
  BaseModalContentColumn,
  SecondaryText,
  Title,
} from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import ButtonArrow from "shared/lib/components/Common/ButtonArrow";
import useDelegateLeaderboard from "../../../hooks/useDelegateLeaderboard";
import useENSSearch from "shared/lib/hooks/useENSSearch";
import createIcon from "shared/lib/utils/blockies";
import { truncateAddress } from "shared/lib/utils/address";
import { formatAmount } from "shared/lib/utils/math";
import { formatUnits } from "@ethersproject/units";
import { ExternalIcon } from "shared/lib/assets/icons/icons";

const ModalOverlay = styled(motion.div)<{ show: boolean }>`
  display: ${(props) => (props.show ? "flex" : "none")};
  flex-direction: column;
  position: absolute;
  background: ${colors.background.two};
  z-index: 2000;
  height: calc(100% - 32px);
  width: calc(100% - 32px);
`;

const CloseOverlayButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: 40px;
`;

const DelegateLeaderContainer = styled.div`
  display: flex;
  width: 100%;
  background: ${colors.background.three};
  border-radius: ${theme.border.radiusSmall};
  padding: 8px 16px;
  border: ${theme.border.width} ${theme.border.style} ${colors.green}00;
  transition: border 200ms ease-in-out;

  &:hover {
    border: ${theme.border.width} ${theme.border.style} ${colors.green};
  }
`;

const DelegateLeaderIcon = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 40px;
`;

const SeeMoreContianer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: 100px;
`;

interface DelegateLeaderButtonProps {
  address: string;
  votes: BigNumber;
  weight: number;
  onSelect: () => void;
}

const DelegateLeaderButton: React.FC<DelegateLeaderButtonProps> = ({
  address,
  votes,
  weight,
  onSelect,
}) => {
  const { data } = useENSSearch(address);

  const addressIcon = useMemo(
    () =>
      data?.avatar
        ? data.avatar
        : createIcon({
            seed: address.toLowerCase(),
            size: 8,
            scale: 5,
          }).toDataURL(),
    [address, data?.avatar]
  );

  return (
    <DelegateLeaderContainer role="button" onClick={onSelect}>
      <DelegateLeaderIcon src={addressIcon} />
      <div className="d-flex flex-column w-100 ml-2">
        <Title fontSize={14} lineHeight={24}>
          {data?.labelName || truncateAddress(address)}
        </Title>
        <SecondaryText fontSize={12} lineHeight={16}>
          {formatAmount(parseFloat(formatUnits(votes, 18)))} votes &#9899;{" "}
          {parseFloat((weight * 100).toFixed(2))}% weight
        </SecondaryText>
      </div>
    </DelegateLeaderContainer>
  );
};

interface DelegationModalLeaderboardOverlayProps {
  show: boolean;
  onLeaderSelected: (address: string) => void;
  onClose: () => void;
}

const DelegationModalLeaderboardOverlay: React.FC<DelegationModalLeaderboardOverlayProps> =
  ({ show, onLeaderSelected, onClose }) => {
    const { data } = useDelegateLeaderboard();

    return (
      <AnimatePresence>
        <ModalOverlay
          key={show.toString()}
          show={show}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{
            duration: 0.25,
            type: "keyframes",
            ease: "easeInOut",
          }}
        >
          <BaseModalContentColumn marginTop={8}>
            <CloseOverlayButton
              className="mr-auto"
              role="button"
              onClick={onClose}
            >
              <ButtonArrow isOpen={false} color={colors.text} />
            </CloseOverlayButton>
          </BaseModalContentColumn>
          <BaseModalContentColumn marginTop={5}>
            <Title fontSize={22} lineHeight={28}>
              DELEGATE LEADERBOARD
            </Title>
          </BaseModalContentColumn>
          <BaseModalContentColumn marginTop={8}>
            <SecondaryText>Select a delegate</SecondaryText>
          </BaseModalContentColumn>
          {data.map((delegate) => (
            <BaseModalContentColumn marginTop={16} key={delegate.address}>
              <DelegateLeaderButton
                {...delegate}
                onSelect={() => onLeaderSelected(delegate.address)}
              />
            </BaseModalContentColumn>
          ))}
          <BaseModalContentColumn>
            <BaseLink
              to="https://google.com"
              target="_blank"
              rel="noreferrer noopener"
            >
              <SeeMoreContianer>
                <SecondaryText>See all</SecondaryText>
                <ExternalIcon height={16} color={colors.text} />
              </SeeMoreContianer>
            </BaseLink>
          </BaseModalContentColumn>
        </ModalOverlay>
      </AnimatePresence>
    );
  };

export default DelegationModalLeaderboardOverlay;
