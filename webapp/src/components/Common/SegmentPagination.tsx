import React from "react";
import styled from "styled-components";

import { getRange } from "shared/lib/utils/math";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";

const NavigationButton = styled.div<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${colors.primaryText}0A;
  border-radius: 100px;
  margin-right: 16px;
  transition: opacity 100ms ease-in;

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

const PaginationItem = styled.div<{ active: boolean; width: string }>`
  flex: 1;
  height: 4px;
  border-radius: 1px;
  margin-right: 16px;
  transition: background 0.2s ease-out, box-shadow 0.2s ease-out;

  ${(props) => {
    if (props.active) {
      return `
        background: ${colors.primaryText};
        box-shadow: 2px 4px 24px ${colors.primaryText};
      `;
    }

    return `
      background: ${colors.primaryText}14;
      box-shadow: none;
    `;
  }}

  &:last-child {
    margin-right: 0px;
  }
`;

interface SegmentPaginationProps {
  page: number;
  total: number;
  onPageClick: (page: number) => void;
}

const SegmentPagination: React.FC<SegmentPaginationProps> = ({
  page,
  total,
  onPageClick,
}) => {
  return (
    <div className="w-100 d-flex align-items-center">
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
      {getRange(1, total, 1).map((item) => (
        <PaginationItem
          key={item}
          role="button"
          active={item === page}
          onClick={() => {
            onPageClick(item);
          }}
          width={`calc((100% - (16px * ${total - 1}))/ ${total})`}
        />
      ))}
      <NavigationButton
        role="button"
        disabled={page >= total}
        onClick={() => {
          if (page >= total) {
            return;
          }
          onPageClick(page + 1);
        }}
      >
        <i className="fas fa-arrow-right" />
      </NavigationButton>
    </div>
  );
};

export default SegmentPagination;
