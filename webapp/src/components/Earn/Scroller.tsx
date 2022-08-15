import React, { useMemo } from "react";
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
  margin-right: 32px;

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
  width: 700px;
  align-self: center;
  overflow: show;
  position: absolute;
  bottom: -40px;
  align-content: center;
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

  const showDesktopNavigator = useMemo(() => width > 700, [width]);
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
      <Words>
        {getRange(1, total, 1).map((item) => (
          <PaginationItem
            key={item}
            role="button"
            active={item === page}
            onClick={() => {
              onPageClick(item);
            }}
          >
            <Title
              color={item === page ? colors.primaryText : colors.tertiaryText}
              fontSize={12}
            >
              {stepList[item - 1]}
            </Title>
          </PaginationItem>
        ))}
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
