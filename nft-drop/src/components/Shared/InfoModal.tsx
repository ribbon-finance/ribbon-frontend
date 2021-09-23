import React, { useCallback } from "react";
import styled from "styled-components";

import BasicModal from "shared/lib/components/Common/BasicModal";
import {
  BaseModalContentColumn,
  PrimaryText,
  Title,
} from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import { useNFTDropGlobalState } from "../../store/store";
import theme from "shared/lib/designSystem/theme";
import MenuButton from "shared/lib/components/Common/MenuButton";

const CloseButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: 48px;
  color: ${colors.text};
  z-index: 2;
`;

const InfoModal = () => {
  const [showInfoModal, setShowInfoModal] =
    useNFTDropGlobalState("shwoInfoModal");

  const onClose = useCallback(() => {
    setShowInfoModal(false);
  }, [setShowInfoModal]);

  return (
    <BasicModal
      show={showInfoModal}
      height={560}
      onClose={onClose}
      closeButton={false}
    >
      <>
        <BaseModalContentColumn marginTop={8}>
          <Title fontSize={28} lineHeight={34}>
            SUNSETTING THE RIBBON ARCH
          </Title>
        </BaseModalContentColumn>
        <BaseModalContentColumn marginTop={16}>
          <PrimaryText color={colors.text}>
            As we move into the fully automated era of Ribbon we’ve decided to
            sunset the original Ribbon logo. To commemorate the original logo’s
            departure, we’ve saved 1,628 versions of the original logo on-chain.
            Each logo is represented by a commemorative NFT that can be claimed
            by anyone who interacted with the Ribbon vaults before block
            13264982.
            <br />
            <br />
            The Red collection is for anyone who made their first deposit
            between block 13264982 and 13264982.
          </PrimaryText>
        </BaseModalContentColumn>
        <BaseModalContentColumn marginTop="auto" className="mb-auto">
          <div className="d-flex flex-column">
            <CloseButton role="button" onClick={onClose}>
              <MenuButton
                isOpen
                onToggle={onClose}
                size={20}
                color="#FFFFFFA3"
              />
            </CloseButton>
            <PrimaryText
              fontSize={12}
              lineHeight={20}
              className="mt-2 text-center"
            >
              Close
            </PrimaryText>
          </div>
        </BaseModalContentColumn>
      </>
    </BasicModal>
  );
};

export default InfoModal;
