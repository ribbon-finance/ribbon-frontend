import { AnimatePresence, motion } from "framer";
import React, { useMemo, useRef, useState } from "react";
import styled from "styled-components";

import { ExternalIcon } from "../../assets/icons/icons";
import { BaseLink, SecondaryText } from "../../designSystem";
import colors from "../../designSystem/colors";
import sizes from "../../designSystem/sizes";
import theme from "../../designSystem/theme";
import useElementSize from "../../hooks/useElementSize";
import Pagination from "./Pagination";

const logoContainerWidth = 40;
const logoContainerMargin = 16;
const linkContainerWidth = 20;
const linkContainerMargin = 28;

const TableHeader = styled.div`
  display: flex;
  margin-top: 24px;
  padding: 0px 16px;
`;

const TableCol = styled.div<{
  orientation?: "left" | "right";
  contentWidth?: number;
  weight: number;
}>`
  display: flex;
  flex-direction: column;
  width: ${(props) =>
    props.contentWidth
      ? `calc(${props.contentWidth}px * ${props.weight})`
      : `${props.weight * 100}%`};

  text-align: ${(props) => {
    switch (props.orientation) {
      case "left":
      case "right":
        return props.orientation;
      default:
        return "left";
    }
  }};
`;

const TableHeaderCol = styled(TableCol)<{ hasLogo: boolean }>`
  &:first-child {
    width: ${(props) =>
      props.contentWidth
        ? `calc((${props.contentWidth}px * ${props.weight})${
            props.hasLogo
              ? ` + ${logoContainerWidth}px + ${logoContainerMargin}px`
              : ``
          })`
        : `${props.weight * 100}%`};
  }
`;

const TableRow = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: ${theme.border.radius};
  margin-top: 16px;
  padding: 16px;

  &:nth-child(2) {
    margin-top: 24px;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${logoContainerWidth}px;
  width: ${logoContainerWidth}px;
  margin-right: ${logoContainerMargin}px;
`;

const ExternalLinkContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${linkContainerWidth}px;
  height: ${linkContainerWidth}px;
  margin: 0px 8px 0px ${linkContainerMargin - 8}px;

  svg {
    opacity: 0.48;
  }

  &:hover {
    svg {
      opacity: 1;
    }
  }

  @media (max-width: ${sizes.xl}px) {
    margin: 0px 8px 0px 24px;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
`;

interface TableWithFixedHeaderProps {
  weights: number[];
  labels: string[];
  data: JSX.Element[][];
  orientations?: Array<"left" | "right">;
  logos?: JSX.Element[];
  externalLinks?: string[];
  perPage?: number;
}

const TableWithFixedHeader: React.FC<TableWithFixedHeaderProps> = ({
  weights,
  labels,
  data,
  orientations,
  logos,
  externalLinks,
  perPage = 10,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useElementSize(containerRef);
  const [page, setPage] = useState<number>(1);

  const availableContentWidth = useMemo(() => {
    let calculatedWidth = width - 32;

    if (logos) {
      calculatedWidth =
        calculatedWidth - logoContainerWidth - logoContainerMargin;
    }

    if (externalLinks) {
      calculatedWidth =
        calculatedWidth - linkContainerWidth - linkContainerMargin;
    }

    return calculatedWidth;
  }, [externalLinks, logos, width]);

  const pagination = useMemo(() => {
    if (data.length > 0) {
      return (
        <PaginationContainer>
          <Pagination
            page={page}
            total={Math.ceil(data.length / perPage)}
            setPage={setPage}
          />
        </PaginationContainer>
      );
    }

    return <></>;
  }, [data, page, perPage]);

  const paginatedData = useMemo(() => {
    return data.slice((page - 1) * perPage, page * perPage);
  }, [data, page, perPage]);

  return (
    <div className="d-flex flex-column" ref={containerRef}>
      <TableHeader>
        {weights.map((weight, index) => (
          <TableHeaderCol
            weight={weight}
            contentWidth={availableContentWidth}
            orientation={orientations ? orientations[index] : undefined}
            hasLogo={Boolean(logos)}
            key={index}
          >
            <SecondaryText>{labels[index]}</SecondaryText>
          </TableHeaderCol>
        ))}
      </TableHeader>
      <AnimatePresence initial={false} exitBeforeEnter>
        <motion.div
          key={page}
          transition={{
            duration: 0.25,
            type: "keyframes",
            ease: "easeInOut",
          }}
          initial={{
            y: 50,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          exit={{
            y: 50,
            opacity: 0,
          }}
          className="w-100"
        >
          {paginatedData.map((row, index) => {
            const rowNum = (page - 1) * perPage + index;
            return (
              <TableRow key={index}>
                {/* Row Logo */}
                {logos && <LogoContainer>{logos[rowNum]}</LogoContainer>}

                {/* Row content */}
                {row.map((col, colNum) => (
                  <TableCol
                    weight={weights[colNum]}
                    contentWidth={availableContentWidth}
                    orientation={
                      orientations ? orientations[colNum] : undefined
                    }
                    key={colNum}
                  >
                    {col}
                  </TableCol>
                ))}

                {/* External Link */}
                {externalLinks && (
                  <BaseLink
                    to={externalLinks[rowNum]}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <ExternalLinkContainer>
                      <ExternalIcon color="white" />
                    </ExternalLinkContainer>
                  </BaseLink>
                )}
              </TableRow>
            );
          })}
        </motion.div>
      </AnimatePresence>
      {pagination}
    </div>
  );
};

export default TableWithFixedHeader;
