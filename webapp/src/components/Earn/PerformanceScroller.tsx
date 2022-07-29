import React from "react";
import styled from "styled-components";

import colors from "shared/lib/designSystem/colors";
import { getRange } from "shared/lib/utils/math";
import { Title } from "shared/lib/designSystem";

const PaginationItem = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  transition: background 0.2s ease-out, box-shadow 0.2s ease-out;
  overflow: show;
  padding-top: 12px;
  padding-bottom: 12px;
  width: 50%;
  z-index: 1;
  border: ${(props) => (props.active ? `1px solid #16CEB9` : ``)};
  border-radius: 8px;
  line-height: 16px;
  letter-spacing: 1.5px;
  font-size: 14px;
  text-align: center;
  justify-content: center;

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
  width: 100%;
  align-self: center;
  align-items: center;
  position: absolute;
  background: rgba(22, 206, 185, 0.08);
  bottom: 30px;
  border-radius: 8px;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-self: center;
  overflow: show;
  height: 100%;
  width: calc(100% - 32px);
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

const PerformanceScroller: React.FC<ScrollerProps> = ({
  stepList,
  page,
  total,
  onPageClick,
}) => {
  return (
    <Container>
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
            <Title color={colors.green} fontSize={14}>
              {stepList[item - 1]}
            </Title>
          </PaginationItem>
        ))}
      </Words>
    </Container>
  );
};

export default PerformanceScroller;
