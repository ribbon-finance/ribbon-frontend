import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";

import {
  BaseLink,
  BaseModal,
  BaseModalHeader,
  PrimaryText,
  SecondaryText,
  Title,
} from "shared/lib/designSystem";
import MenuButton from "../../Header/MenuButton";
import theme from "shared/lib/designSystem/theme";
import colors from "shared/lib/designSystem/colors";
import {
  USDCLogo,
  WBTCLogo,
  WETHLogo,
} from "shared/lib/assets/icons/erc20Assets";
import { getAssets, VaultOptions } from "shared/lib/constants/constants";
import { ActionButton } from "shared/lib/components/Common/buttons";

const StyledModal = styled(BaseModal)`
  .modal-dialog {
    max-width: 343px;
    margin-left: auto;
    margin-right: auto;
  }

  .modal-content {
    overflow: hidden;
  }
`;

const CloseButton = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
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

const ContentColumn = styled.div<{ marginTop?: number | "auto" }>`
  display: flex;
  justify-content: center;
  z-index: 1;
  margin-top: ${(props) =>
    props.marginTop === "auto"
      ? props.marginTop
      : `${props.marginTop || 24}px`};
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 100px;
  background: ${colors.green}29;
`;

const GreenWBTCLogo = styled(WBTCLogo)`
  width: 100%;
  && * {
    fill: ${colors.green};
  }
`;

const GreenUSDCLogo = styled(USDCLogo)`
  margin: -8px;
  width: 100%;

  && .background {
    fill: none;
  }

  && .content {
    fill: ${colors.green};
  }
`;

const GreenWETHLogo = styled(WETHLogo)`
  .cls-1,
  .cls-5 {
    fill: ${colors.green}66;
  }

  .cls-2,
  .cls-6 {
    fill: ${colors.green}CC;
  }

  .cls-3,
  .cls-4 {
    fill: ${colors.green};
  }
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

const UnderlinedLink = styled(BaseLink)`
  text-decoration: underline;
  color: ${colors.text};

  &:hover {
    text-decoration: none;
    color: ${colors.text};
  }
`;

interface StakingApprovalModalProps {
  show: boolean;
  onClose: () => void;
  vaultOption: VaultOptions;
}

const StakingApprovalModal: React.FC<StakingApprovalModalProps> = ({
  show,
  onClose,
  vaultOption,
}) => {
  const [step, setStep] = useState<"info" | "approve" | "approving">("info");

  console.log(step);

  const logo = useMemo(() => {
    switch (getAssets(vaultOption)) {
      case "WBTC":
        return <GreenWBTCLogo />;
      case "USDC":
        return <GreenUSDCLogo />;
      default:
        return <GreenWETHLogo height="48px" />;
    }
  }, [vaultOption]);

  const handleClose = useCallback(() => {
    onClose();
    if (step === "approve") {
      setStep("info");
    }
  }, [step, onClose]);

  const body = useMemo(() => {
    switch (step) {
      case "info":
        return (
          <>
            <ContentColumn marginTop={-8}>
              <LogoContainer>{logo}</LogoContainer>
            </ContentColumn>
            <ContentColumn marginTop={8}>
              <ApproveAssetTitle str={vaultOption}>
                {vaultOption}
              </ApproveAssetTitle>
            </ContentColumn>
            <ContentColumn>
              <PrimaryText className="text-center font-weight-normal">
                Before you stake, the pool needs your permission to hold your
                rETH-THETA tokens.
              </PrimaryText>
            </ContentColumn>
            <ContentColumn marginTop={16}>
              <UnderlinedLink
                to="https://ribbon.finance/faq"
                target="_blank"
                rel="noreferrer noopener"
                className="d-flex"
              >
                <SecondaryText>Why do I have to do this?</SecondaryText>
              </UnderlinedLink>
            </ContentColumn>
            <ContentColumn marginTop={40}>
              <ActionButton
                className="btn py-3 mb-2"
                onClick={() => setStep("approve")}
              >
                Approve
              </ActionButton>
            </ContentColumn>
          </>
        );
      case "approve":
      case "approving":
        return <></>;
    }
  }, [step, logo, vaultOption]);

  return (
    <StyledModal show={show} onHide={handleClose} centered backdrop={true}>
      <BaseModalHeader>
        <CloseButton role="button" onClick={handleClose}>
          <MenuButton
            isOpen={true}
            onToggle={handleClose}
            size={20}
            color={"#FFFFFFA3"}
          />
        </CloseButton>
      </BaseModalHeader>
      <Modal.Body>{body}</Modal.Body>
    </StyledModal>
  );
};

export default StakingApprovalModal;
