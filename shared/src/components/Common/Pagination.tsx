import React from "react";
import styled from "styled-components";
import { Frame } from "framer";

import { Subtitle } from "../../designSystem";
import colors from "../../designSystem/colors";
import theme from "../../designSystem/theme";

const ArrowButton = styled.div<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff0a;
  border-radius: 100px;
  width: 48px;
  height: 48px;
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
`;

const TotalText = styled(Subtitle)`
  color: ${colors.text};
`;

const PaginationBar = styled.div`
  width: 80px;
  height: 2px;
  background-color: #ffffff0a;
  position: relative;
`;

interface PaginationProps {
  page: number;
  total: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const Pagination: React.FC<PaginationProps> = ({ page, total, setPage }) =>
  total > 0 ? (
    <div className="d-flex w-100 justify-content-center align-items-center">
      <ArrowButton
        role="button"
        disabled={page <= 1}
        onClick={() => {
          if (page <= 1) {
            return;
          }

          setPage((page) => page - 1);
        }}
      >
        <i className="fas fa-arrow-left" />
      </ArrowButton>
      <Subtitle className="ml-5 mr-3">{String(page).padStart(2, "0")}</Subtitle>
      <PaginationBar>
        <Frame
          transition={{
            type: "keyframes",
            ease: "easeOut",
          }}
          top={0}
          left={0}
          height={2}
          width={0}
          backgroundColor="#FFFFFF"
          animate={{
            width: (80 * page) / total,
          }}
        />
      </PaginationBar>
      <TotalText className="mr-5 ml-3">
        {String(total).padStart(2, "0")}
      </TotalText>
      <ArrowButton
        role="button"
        disabled={page >= total}
        onClick={() => {
          if (page >= total) {
            return;
          }

          setPage((page) => page + 1);
        }}
      >
        <i className="fas fa-arrow-right" />
      </ArrowButton>
    </div>
  ) : (
    <></>
  );

export default Pagination;
