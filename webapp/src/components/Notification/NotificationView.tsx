import React, { useMemo } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer";

import { Subtitle } from "shared/lib/designSystem";
import useScreenSize from "shared/lib/hooks/useScreenSize";
import BasicModal from "shared/lib/components/Common/BasicModal";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import sizes from "shared/lib/designSystem/sizes";
import { SettingsIcon } from "shared/lib/assets/icons/icons";
import NotificationList from "./NotificationList";

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
          background-color: ${colors.backgroundDarker};
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

interface NotificationViewProps {
  show: boolean;
  onClose: () => void;
}

const NotificationView: React.FC<NotificationViewProps> = ({
  show,
  onClose,
}) => {
  const { width } = useScreenSize();

  const content = useMemo(() => {
    return (
      <>
        <NotificationHeader>
          <Subtitle fontSize={14} lineHeight={24}>
            NOTIFICATIONS
          </Subtitle>
          <TopRightButtonContainer>
            <SettingsIcon />
          </TopRightButtonContainer>
        </NotificationHeader>
        <div
          className="d-flex flex-column position-relative"
          style={{ height: 531 }}
        >
          <NotificationList onClose={onClose} />
        </div>
      </>
    );
  }, []);

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
    <BasicModal show={show} onClose={onClose} height={596} closeButton={false}>
      <MobileModalContentContainer>{content}</MobileModalContentContainer>
    </BasicModal>
  );
};

export default NotificationView;
