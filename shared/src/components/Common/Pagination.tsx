import React from "react";
import styled from "styled-components";
import { Frame } from "framer";

import { Subtitle } from "../../designSystem";
import colors from "../../designSystem/colors";
import theme from "../../designSystem/theme";

const PaginationContainer = styled.div<{ variant?: "buttonLeft" }>`
  ${(props) => {
    switch (props.variant) {
      case "buttonLeft":
        return `
          & :nth-child(1) {
            order: 1;
          }

          & :nth-child(2) {
            order: 3;
          }

          & :nth-child(3) {
            order: 4;
          }

          & :nth-child(4) {
            order: 5;
          }

          & :nth-child(5) {
            order: 2;
            margin-left: 16px;
          }
        `;
    }
    return ``;
  }}
`;

const ArrowButton = styled.div<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors.background.two};
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

const PaginationBar = styled.div<{ width: number }>`
  width: ${(props) => props.width}px;
  height: 2px;
  background-color: ${colors.background.three};
  position: relative;
`;

interface PaginationProps {
  page: number;
  total: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  variant?: "buttonLeft";
  config?: {
    paginationBarWidth?: number;
  };
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  total,
  setPage,
  variant,
  config: { paginationBarWidth = 80 } = {},
}) =>
  total > 0 ? (
    <PaginationContainer
      className="d-flex w-100 justify-content-center align-items-center"
      variant={variant}
    >
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
      <PaginationBar width={paginationBarWidth}>
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
            width: (paginationBarWidth * page) / total,
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
    </PaginationContainer>
  ) : (
    <></>
  );

export default Pagination;
