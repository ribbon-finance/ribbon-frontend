import React, { useCallback } from "react";
import styled from "styled-components";

import BasicModal from "shared/lib/components/Common/BasicModal";
import {
  BaseLink,
  BaseModalContentColumn,
  PrimaryText,
  Title,
} from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import { useNFTDropGlobalState } from "../../store/store";
import theme from "shared/lib/designSystem/theme";
import MenuButton from "shared/lib/components/Common/MenuButton";
import { ExternalIcon } from "shared/lib/assets/icons/icons";

const ReadMoreLink = styled(BaseLink)`
  opacity: ${theme.hover.opacity};

  &:hover {
    opacity: 1;
  }
`;

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
          <Title fontSize={28} lineHeight={34} className="mr-auto">
            RIBBON OG NFT
          </Title>
        </BaseModalContentColumn>
        <BaseModalContentColumn marginTop={16}>
          <PrimaryText color={colors.text}>
            To mark the arrival of the new Ribbon App logo, we’ve saved 3284
            versions of the original logo on-chain. Each logo is represented by
            a commemorative NFT that can be claimed by anyone who deposited
            funds into a Ribbon vault before block 13300682. The point at which
            you first deposited funds determines which colour series your NFT
            belongs to.
          </PrimaryText>
        </BaseModalContentColumn>
        <BaseModalContentColumn>
          {/* TODO: Update Link */}
          <ReadMoreLink
            to="https://google.com"
            target="_blank"
            rel="noreferrer noopener"
            className="d-flex mr-auto"
          >
            <PrimaryText fontSize={16} lineHeight={24}>
              Read More
            </PrimaryText>
            <ExternalIcon
              className="ml-2"
              height={20}
              width={20}
              color={colors.primaryText}
            />
          </ReadMoreLink>
        </BaseModalContentColumn>
        <BaseModalContentColumn marginTop="auto" className="mb-2">
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
