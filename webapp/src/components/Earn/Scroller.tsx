import React, { useEffect, useMemo, useRef } from "react";
import styled from "styled-components";

import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import { getRange } from "shared/lib/utils/math";
import { Title } from "shared/lib/designSystem";
import useScreenSize from "shared/lib/hooks/useScreenSize";

const NavigationButton = styled.div<{
  disabled?: boolean;
  marginLeft?: string;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${colors.primaryText}0A;
  border-radius: 100px;
  overflow: show;
  margin-left: ${(props) => props.marginLeft};
  transition: opacity 100ms ease-in;
  align-self: center;
  margin-bottom: 8px;

  ${(props) =>
    props.disabled
      ? `
          opacity: 0.24;
          cursor: default;
        `
      : `
          &:hover {
            opacity: ${theme.hover.opacity};
          }
        `}

  i {
    color: white;
  }

  &:last-child {
    margin-right: 0px;
  }
`;

const PaginationItem = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  transition: background 0.2s ease-out, box-shadow 0.2s ease-out;
  overflow: show;

  &:not(:last-child) {
    margin-right: 32px;
  }

  ${(props) => {
    if (props.active) {
      return `
        color: ${colors.primaryText};
      `;
    }

    return `
      box-shadow: none;
    `;
  }}

  &:last-child {
    margin-right: 0px;
  }
`;

const Words = styled.div`
  display: flex;
  justify-content: center;
  align-self: center;
  overflow: show;
  position: absolute;
  bottom: -40px;
  align-content: center;
  height: 48px;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 150%;
  align-self: center;
  overflow: show;
  height: 100%;
  position: absolute;
`;

const ButtonTitle = styled(Title)`
  margin: auto;
`;

const OverflowButton = styled.button<{ isLeft?: boolean }>`
  background: none;
  border: none;
  backdrop-filter: blur(4px);
  position: sticky;
  color: white;
  padding: 0 16px;

  ${({ isLeft }) => (isLeft ? "left: 0" : "right: 0")};
`;

interface ScrollerProps {
  step: string;
  stepList: string[];
  page: number;
  total: number;
  onPageClick: (page: number) => void;
  config?: {
    showNavigationButton?: boolean;
  };
}

const Scroller: React.FC<ScrollerProps> = ({
  step,
  stepList,
  page,
  total,
  onPageClick,
  config: { showNavigationButton = true } = {},
}) => {
  const { width } = useScreenSize();
  const scrollRef = useRef<HTMLDivElement>(null);
  const showDesktopNavigator = useMemo(
    () => width > (scrollRef.current?.offsetWidth || 0),
    [width]
  );

  useEffect(() => {
    console.log(scrollRef);
  }, [scrollRef]);

  const onScroll = (side: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: side === "left" ? -90 : 90,
      behavior: "smooth",
    });
  };

  return (
    <Container>
      {showDesktopNavigator && (
        <NavigationButton
          role="button"
          disabled={page <= 1}
          onClick={() => {
            if (page <= 1) {
              return;
            }
            onPageClick(page - 1);
          }}
        >
          <i className="fas fa-arrow-left" />
        </NavigationButton>
      )}
      <Words ref={scrollRef}>
        {!showDesktopNavigator && (
          <OverflowButton isLeft onClick={() => onScroll("left")}>
            <i className="fas fa-chevron-left" />
          </OverflowButton>
        )}
        {getRange(1, total, 1).map((item) => (
          <PaginationItem
            key={item}
            role="button"
            active={item === page}
            onClick={() => {
              onPageClick(item);
            }}
          >
            <ButtonTitle
              color={item === page ? colors.primaryText : colors.tertiaryText}
              fontSize={12}
            >
              {stepList[item - 1]}
            </ButtonTitle>
          </PaginationItem>
        ))}
        {!showDesktopNavigator && (
          <OverflowButton onClick={() => onScroll("right")}>
            <i className="fas fa-chevron-right" />
          </OverflowButton>
        )}
      </Words>
      {showDesktopNavigator && (
        <NavigationButton
          role="button"
          disabled={page >= total}
          marginLeft="auto"
          onClick={() => {
            if (page >= total) {
              return;
            }
            onPageClick(page + 1);
          }}
        >
          <i className="fas fa-arrow-right" />
        </NavigationButton>
      )}
    </Container>
  );
};

export default Scroller;
