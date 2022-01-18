import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import moment, { Moment } from "moment";

import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import {
  BaseModalContentColumn,
  BaseModalWarning,
  SecondaryText,
  Title,
} from "shared/lib/designSystem";
import ButtonArrow from "shared/lib/components/Common/ButtonArrow";
import CalendarPicker from "shared/lib/components/Common/CalendarPicker";
import { ActionButton } from "shared/lib/components/Common/buttons";

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

interface StakingModalFormCalendarOverlayProps {
  show: boolean;
  onCancel: () => void;
  onDateSelected: (date: Moment) => void;
}

const StakingModalFormCalendarOverlay: React.FC<StakingModalFormCalendarOverlayProps> =
  ({ show, onCancel, onDateSelected }) => {
    const [selectedDate, setSelectedDate] = useState<Moment>();

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
          <BaseModalContentColumn marginTop={0}>
            <CloseOverlayButton
              className="mr-auto"
              role="button"
              onClick={() =>
                selectedDate ? onDateSelected(selectedDate) : onCancel()
              }
            >
              <ButtonArrow isOpen={false} color={colors.text} />
            </CloseOverlayButton>
          </BaseModalContentColumn>
          <BaseModalContentColumn marginTop={8}>
            <Title fontSize={22} lineHeight={28}>
              SELECT LOCKUP DATE
            </Title>
          </BaseModalContentColumn>

          {/* Calendar */}
          <BaseModalContentColumn marginTop={34}>
            <CalendarPicker
              initialValue={selectedDate}
              minDate={moment().add(7, "d")}
              maxDate={moment().add(2 * 365, "d")}
              onDateSelected={(date) => {
                setSelectedDate(date);
              }}
            />
          </BaseModalContentColumn>

          <BaseModalWarning color={colors.green}>
            <SecondaryText color={colors.green} className="w-100 text-center">
              &#8226; Minimum lockup period: 1 week
              <br />
              &#8226; Maximum lockup period: 4 years
            </SecondaryText>
          </BaseModalWarning>

          <BaseModalContentColumn>
            <ActionButton
              disabled={!selectedDate}
              onClick={() => {
                if (!selectedDate) {
                  return;
                }

                onDateSelected(selectedDate);
              }}
              className="py-3"
              color={colors.red}
            >
              DONE
            </ActionButton>
          </BaseModalContentColumn>
        </ModalOverlay>
      </AnimatePresence>
    );
  };

export default StakingModalFormCalendarOverlay;
