import React, { useCallback, useEffect, useMemo, useState } from "react";
import moment, { Moment } from "moment";
import styled from "styled-components";

import colors from "../../designSystem/colors";
import theme from "../../designSystem/theme";
import { Title } from "../../designSystem";
import { AnimatePresence, motion } from "framer";

const modes = ["date", "month"] as const;
type Mode = typeof modes[number];

const CalendarNavigationButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: ${colors.background.three};
  border-radius: ${theme.border.radius};
`;

const CalendarNavigationButtonArrow = styled.i<{ disabled: boolean }>`
  color: ${(props) => (props.disabled ? colors.quaternaryText : colors.text)};
`;

const CalendarNavigationIndicator = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  height: 32px;
  margin: 0px 8px;
  background: ${colors.background.three};
  border-radius: ${theme.border.radius};
`;

const CalendarBodyItem = styled.div<{ mode: Mode }>`
  display: flex;
  align-items: center;
  justify-content: center;

  ${(props) => {
    switch (props.mode) {
      case "date":
        return `
          width: ${(1 / 7) * 100}%;
          height: 32px;
        `;
      case "month":
        return `
          width: ${(1 / 3) * 100}%;
          height: 56px;
        `;
    }
  }}
`;

const CalendarBodyButton = styled.div<{
  mode: Mode;
  active: boolean;
  disabled: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${(props) => (props.mode === "date" ? 32 : 40)}px;
  width: ${(props) => (props.mode === "date" ? 32 : 64)}px;
  border-radius: ${theme.border.radiusSmall};
  transition: all 0.2s ease-in-out;

  ${(props) => {
    if (props.active) {
      return `
        background: ${colors.green}1F;
        border: ${theme.border.width} ${theme.border.style} ${colors.green};
      `;
    }

    if (!props.disabled) {
      return `
        &:hover {
          background: ${colors.background.three};
        }
      `;
    }

    return ``;
  }}
`;

interface CalendarPickerProps {
  minDate?: Moment;
  maxDate?: Moment;
  initialValue?: Moment;
  onDateSelected: (date: Moment) => void;
}

const CalendarPicker: React.FC<CalendarPickerProps> = ({
  minDate,
  maxDate,
  initialValue,
  onDateSelected,
}) => {
  const [mode, setMode] = useState<Mode>(modes[0]);
  const [navigateDate, setNavigateDate] = useState(moment());
  const [selectedDate, setSelectedDate] = useState<Moment | undefined>(
    initialValue
  );

  /**
   * Safety hook, making sure selected date does not go before min and after max
   */
  useEffect(() => {
    setSelectedDate((currSelectedDate) => {
      if (minDate && currSelectedDate?.isBefore(minDate)) {
        return minDate.clone();
      }

      if (maxDate && currSelectedDate?.isAfter(maxDate)) {
        return maxDate.clone();
      }

      return currSelectedDate;
    });

    setNavigateDate((currNavigateDate) => {
      if (minDate && currNavigateDate?.isBefore(minDate)) {
        return minDate.clone();
      }

      if (maxDate && currNavigateDate?.isAfter(maxDate)) {
        return maxDate.clone();
      }

      return currNavigateDate;
    });
  }, [maxDate, minDate, navigateDate, selectedDate]);

  const [canNavigateBack, canNavigateForward] = useMemo(() => {
    switch (mode) {
      case "date":
        return [
          minDate ? minDate.isBefore(navigateDate, "M") : true,
          maxDate ? maxDate.isAfter(navigateDate, "M") : true,
        ];
      case "month":
        return [
          minDate ? minDate.isBefore(navigateDate, "y") : true,
          maxDate ? maxDate.isAfter(navigateDate, "y") : true,
        ];
    }
  }, [maxDate, minDate, mode, navigateDate]);

  const onNavigateBackPressed = useCallback(() => {
    if (!canNavigateBack) {
      return;
    }

    setNavigateDate((currNavigateDate) =>
      currNavigateDate.clone().subtract(1, mode === "date" ? "M" : "y")
    );
  }, [canNavigateBack, mode]);

  const onNavigateForwardPressed = useCallback(() => {
    if (!canNavigateForward) {
      return;
    }

    setNavigateDate((currNavigateDate) =>
      currNavigateDate.clone().add(1, mode === "date" ? "M" : "y")
    );
  }, [canNavigateForward, mode]);

  const calendarBody = useMemo(
    () => (
      <AnimatePresence exitBeforeEnter initial={false}>
        <motion.div
          key={navigateDate.format("MMMM YYYY")}
          className="d-flex flex-wrap"
          initial={{
            x: -25,
            opacity: 0,
          }}
          animate={{
            x: 0,
            opacity: 1,
          }}
          exit={{
            x: 25,
            opacity: 0,
          }}
          transition={{
            duration: 0.1,
            type: "keyframes",
            ease: "linear",
          }}
        >
          {(() => {
            switch (mode) {
              case "date":
                const monthFirstDay = navigateDate.clone().set("D", 1);
                const calendarFirstDate = monthFirstDay
                  .clone()
                  .subtract((monthFirstDay.day() || 7) - 1, "d");

                return (
                  <>
                    {[...new Array(7)].map((_item, index) => (
                      <CalendarBodyItem key={index} mode={mode}>
                        <Title
                          fontSize={14}
                          lineHeight={16}
                          color={colors.quaternaryText}
                        >
                          {moment()
                            .day(index + 1)
                            .format("dd")
                            .charAt(0)}
                        </Title>
                      </CalendarBodyItem>
                    ))}
                    {[...new Array(42)].map((_item, index) => {
                      const date = calendarFirstDate.clone().add(index, "d");
                      const inTheSameMonth =
                        date.month() === navigateDate.month();
                      const active = Boolean(
                        inTheSameMonth && selectedDate?.isSame(date, "d")
                      );
                      const disabled = Boolean(
                        !inTheSameMonth ||
                          minDate?.isAfter(date) ||
                          maxDate?.isBefore(date)
                      );

                      let fontColor = colors.primaryText;

                      if (active) {
                        fontColor = colors.green;
                      }

                      if (disabled) {
                        fontColor = colors.tertiaryText;
                      }

                      if (!inTheSameMonth) {
                        fontColor = colors.quaternaryText;
                      }

                      if (moment().isSame(date, "day")) {
                        fontColor = colors.green;
                      }

                      return (
                        <CalendarBodyItem key={index} mode={mode}>
                          <CalendarBodyButton
                            mode={mode}
                            active={active}
                            disabled={disabled}
                            role={disabled ? "" : "button"}
                            onClick={() => {
                              if (disabled) {
                                return;
                              }
                              setSelectedDate(() => date);
                              onDateSelected(date);
                            }}
                          >
                            <Title
                              fontSize={14}
                              lineHeight={16}
                              color={fontColor}
                            >
                              {date.format("D")}
                            </Title>
                          </CalendarBodyButton>
                        </CalendarBodyItem>
                      );
                    })}
                  </>
                );
              case "month":
                return (
                  <>
                    {[...new Array(12)].map((_item, index) => {
                      const month = navigateDate.clone().set("M", index);
                      const disabled = Boolean(
                        minDate?.isAfter(month, "M") ||
                          maxDate?.isBefore(month, "M")
                      );
                      const active = Boolean(selectedDate?.isSame(month, "M"));

                      let fontColor = colors.primaryText;

                      if (disabled) {
                        fontColor = colors.quaternaryText;
                      }

                      if (active) {
                        fontColor = colors.green;
                      }

                      return (
                        <CalendarBodyItem key={index} mode={mode}>
                          <CalendarBodyButton
                            mode={mode}
                            active={Boolean(selectedDate?.isSame(month, "M"))}
                            disabled={disabled}
                            role={disabled ? "" : "button"}
                            onClick={() => {
                              if (disabled) {
                                return;
                              }
                              setNavigateDate(() => month);
                              setMode("date");
                            }}
                          >
                            <Title
                              fontSize={14}
                              lineHeight={16}
                              letterSpacing={1}
                              color={fontColor}
                            >
                              {month.format("MMM")}
                            </Title>
                          </CalendarBodyButton>
                        </CalendarBodyItem>
                      );
                    })}
                  </>
                );
            }
          })()}
        </motion.div>
      </AnimatePresence>
    ),
    [maxDate, minDate, mode, onDateSelected, navigateDate, selectedDate]
  );

  return (
    <div className="d-flex flex-column w-100" style={{ perspective: 1500 }}>
      <div className="d-flex">
        {/* Back Button */}
        <CalendarNavigationButton
          role={canNavigateBack ? "button" : ""}
          onClick={onNavigateBackPressed}
        >
          <CalendarNavigationButtonArrow
            className="fas fa-chevron-left"
            disabled={!canNavigateBack}
          />
        </CalendarNavigationButton>

        <CalendarNavigationIndicator
          role="button"
          onClick={() =>
            setMode((curr) => (curr === "date" ? "month" : "date"))
          }
        >
          <AnimatePresence exitBeforeEnter>
            <motion.div
              key={
                mode === "date"
                  ? navigateDate.format("MMMM YYYY")
                  : navigateDate.year()
              }
              className="d-flex"
              initial={{
                x: -25,
                opacity: 0,
              }}
              animate={{
                x: 0,
                opacity: 1,
              }}
              exit={{
                x: 25,
                opacity: 0,
              }}
              transition={{
                duration: 0.1,
                type: "keyframes",
                ease: "linear",
              }}
            >
              <Title fontSize={14} lineHeight={16} letterSpacing={1}>
                {mode === "date"
                  ? navigateDate.format("MMMM YYYY")
                  : navigateDate.year()}
              </Title>
            </motion.div>
          </AnimatePresence>
        </CalendarNavigationIndicator>

        {/* Forward Button */}
        <CalendarNavigationButton
          role={canNavigateForward ? "button" : ""}
          onClick={onNavigateForwardPressed}
        >
          <CalendarNavigationButtonArrow
            className="fas fa-chevron-right"
            disabled={!canNavigateForward}
          />
        </CalendarNavigationButton>
      </div>

      {/* Body */}
      <AnimatePresence exitBeforeEnter>
        <motion.div
          key={mode}
          className="mt-2"
          initial={{
            transform: "rotateY(90deg)",
          }}
          animate={{
            transform: "rotateY(0deg)",
          }}
          exit={{
            transform: "rotateY(-90deg)",
          }}
          transition={{
            duration: 0.1,
            type: "keyframes",
            ease: "linear",
          }}
        >
          {calendarBody}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CalendarPicker;
