import React from "react";
import styled from "styled-components";

import { getRange } from "shared/lib/utils/math";
import colors from "shared/lib/designSystem/colors";

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
    <div className="w-100 d-flex">
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
    </div>
  );
};

export default SegmentPagination;
