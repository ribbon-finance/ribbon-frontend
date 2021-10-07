import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer";

import { SecondaryText, Subtitle, Title } from "shared/lib/designSystem";
import useScreenSize from "shared/lib/hooks/useScreenSize";
import BasicModal from "shared/lib/components/Common/BasicModal";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import sizes from "shared/lib/designSystem/sizes";
import { CheckIcon, SettingsIcon } from "shared/lib/assets/icons/icons";
import NotificationList from "./NotificationList";
import ButtonArrow from "shared/lib/components/Common/ButtonArrow";
import {
  NotificationType,
  NotificationTypeList,
} from "shared/lib/models/notification";

const NotificatioNDropdown = styled(motion.div)<{ isOpen: boolean }>`
  ${(props) =>
    props.isOpen
      ? `
          display: flex;
          flex-direction: column;
          width: 343px;
          height: 596px;
          position: absolute;
          right: -180px;
          top: 64px;
          background-color: ${colors.background.two};
          border-radius: ${theme.border.radius};
        `
      : `
          display: none;
        `}

  @media (max-width: ${sizes.md}px) {
    display: none;
  }
`;

const MobileModalContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: -16px;
  height: calc(100% + 32px);
  width: calc(100% + 32px);
`;

const NotificationHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: ${theme.border.width} ${theme.border.style} ${colors.border};
`;

const TopRightButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: 20px;
`;

const SettingsContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: ${theme.border.radius};
  background: ${colors.background.two};
  z-index: 10;
`;

const MenuItem = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  padding: 14px 16px;
  opacity: 0.64;
  border-radius: 100px;
  background: ${colors.green}14;
  margin-top: 16px;
  border: ${theme.border.width} ${theme.border.style} transparent;
  transition: border 150ms;

  ${(props) =>
    props.active
      ? `
        opacity: 1;
        border: ${theme.border.width} ${theme.border.style} ${colors.green};
      `
      : `
        &:hover {
          opacity: ${theme.hover.opacityHigher};
        }
      `}
`;

const StyledCheckButton = styled(CheckIcon)<{ color: string }>`
  path {
    transition: stroke 150ms;
    stroke: ${(props) => props.color};
  }
`;

interface NotificationViewProps {
  show: boolean;
  onClose: () => void;
}

const NotificationView: React.FC<NotificationViewProps> = ({
  show,
  onClose,
}) => {
  const { width } = useScreenSize();
  const [showSettings, setShowSettings] = useState(false);
  const [filters, setFilters] = useState<NotificationType[]>([
    ...NotificationTypeList,
  ]);

  const content = useMemo(() => {
    return (
      <div className="d-flex flex-column position-relative">
        <NotificationHeader>
          <Subtitle fontSize={14} lineHeight={24}>
            NOTIFICATIONS
          </Subtitle>
          <TopRightButtonContainer
            role="button"
            onClick={() => setShowSettings(true)}
          >
            <SettingsIcon />
          </TopRightButtonContainer>
        </NotificationHeader>
        <div className="d-flex flex-column" style={{ height: 531 }}>
          <NotificationList onClose={onClose} filters={filters} />
        </div>

        {/* Settings */}
        <AnimatePresence>
          {showSettings && (
            <SettingsContainer
              transition={{
                duration: 0.25,
                type: "keyframes",
                ease: "easeInOut",
              }}
              initial={{
                y: 100,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: 100,
                opacity: 0,
              }}
            >
              <NotificationHeader>
                <Subtitle fontSize={14} lineHeight={24}>
                  NOTIFICATIONS Settings
                </Subtitle>
                <TopRightButtonContainer
                  role="button"
                  onClick={() => setShowSettings(false)}
                >
                  <ButtonArrow isOpen={false} color={colors.text} />
                </TopRightButtonContainer>
              </NotificationHeader>
              <div className="d-flex flex-column p-3">
                <SecondaryText fontSize={14} lineHeight={20} className="mt-2">
                  Select the notifications you would like to see
                </SecondaryText>
                {NotificationTypeList.map((type) => {
                  let title = "";
                  switch (type) {
                    case "optionMinting":
                      title = "MINTED OPTIONS";
                      break;
                    case "optionSale":
                      title = "SOLD OPTIONS";
                      break;
                    case "withdrawalReady":
                      title = "WITHDRAWALS READY";
                      break;
                  }

                  return (
                    <MenuItem
                      onClick={() =>
                        setFilters((prev) =>
                          prev.includes(type)
                            ? prev.filter((item) => item !== type)
                            : prev.concat(type)
                        )
                      }
                      role="button"
                      active={filters.includes(type)}
                    >
                      <Title fontSize={14} lineHeight={20}>
                        {title}
                      </Title>
                      <StyledCheckButton
                        color={`${colors.green}${
                          filters.includes(type) ? "FF" : "00"
                        }`}
                        className="ml-auto"
                      />
                    </MenuItem>
                  );
                })}
              </div>
            </SettingsContainer>
          )}
        </AnimatePresence>
      </div>
    );
  }, [filters, onClose, setFilters, showSettings]);

  return width > sizes.md ? (
    <AnimatePresence>
      <NotificatioNDropdown
        key={show.toString()}
        isOpen={show}
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: 30,
        }}
        transition={{
          type: "keyframes",
          duration: 0.2,
        }}
      >
        {content}
      </NotificatioNDropdown>
    </AnimatePresence>
  ) : (
    <BasicModal
      show={show}
      onClose={onClose}
      height={596}
      closeButton={false}
      backgroundColor={colors.background.two}
    >
      <MobileModalContentContainer>{content}</MobileModalContentContainer>
    </BasicModal>
  );
};

export default NotificationView;
