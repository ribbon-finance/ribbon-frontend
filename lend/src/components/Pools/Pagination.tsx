import React from "react";
import styled from "styled-components";
import { Frame } from "framer";

import { Subtitle } from "../../designSystem";
import colors from "shared/lib/designSystem/colors";
import theme from "../../designSystem/theme";

const PaginationContainer = styled.div<{ variant?: "buttonLeft" }>`
  margin-left: 30px;
  margin-right: 30px;
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
  background-color: rgba(255, 255, 255, 0.04);
  border-radius: 100px;
  width: 40px;
  height: 40px;
  transition: opacity 100ms ease-in;

  ${(props) =>
    props.disabled
      ? `
          opacity: 0.48;
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
    hidePageNumbers?: boolean;
  };
}

const EarnPagination: React.FC<PaginationProps> = ({
  page,
  total,
  setPage,
  variant,
  config: { paginationBarWidth = 80, hidePageNumbers = false } = {},
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
      {hidePageNumbers ? (
        // Just for spacing between the arrows
        <div className="pl-4" />
      ) : (
        <>
          <Subtitle className="ml-4 mr-3">
            {String(page).padStart(2, "0")}
          </Subtitle>
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
          <TotalText className="mr-4 ml-3">
            {String(total).padStart(2, "0")}
          </TotalText>
        </>
      )}
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

export default EarnPagination;
