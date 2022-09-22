import { AnimatePresence, motion } from "framer";
import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

import { BaseLink, SecondaryText } from "../../designSystem";
import colors from "shared/lib/designSystem/colors";
import sizes from "../../designSystem/sizes";
import theme from "../../designSystem/theme";
import useElementSize from "shared/lib/hooks/useElementSize";
import Pagination from "./Pagination";
import ExternalLinkIcon from "../Common/ExternalLinkIcon";
import { getAssetLogo } from "../../utils/asset";
const logoContainerWidth = 24;
const logoContainerMargin = 0;
const linkContainerWidth = 0;
const linkContainerMargin = 0;

const TableHeader = styled.div`
  display: flex;
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
  padding-top: 8px;
  padding-bottom: 8px;
  margin-bottom: 16px;
  border-bottom: 1px solid ${colors.border};
  &:last-child {
    margin-bottom: 0px;
    border-bottom: none;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${logoContainerWidth}px;
  width: ${logoContainerWidth}px;
`;

const AssetContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${logoContainerWidth}px;
  width: ${logoContainerWidth}px;
`;

const ExternalLinkContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: right;
  width: ${linkContainerWidth}px;
  height: ${linkContainerWidth}px;
  margin: 0px 0px 0px ${linkContainerMargin}px;

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
  margin-top: 16px;
`;

interface TableWithFixedHeaderProps {
  weights: number[];
  labels: string[];
  data: JSX.Element[][];
  orientations?: Array<"left" | "right">;
  logos?: JSX.Element[];
  externalLinks?: string[];
  perPage?: number;
  pageController?: {
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
  };
}

const PoolTableWithFixedHeader: React.FC<TableWithFixedHeaderProps> = ({
  weights,
  labels,
  data,
  orientations,
  logos,
  externalLinks,
  perPage = 10,
  pageController,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useElementSize(containerRef);
  const [page, _setPage] = useState<number>(1);
  const setPage = pageController ? pageController.setPage : _setPage;
  const AssetLogo = getAssetLogo("USDC");
  // Sync page controller with local state
  useEffect(() => {
    if (pageController && pageController.page !== page) {
      _setPage(pageController.page);
    }
  }, [page, pageController]);

  const availableContentWidth = useMemo(() => {
    let calculatedWidth = width;

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
  }, [data, page, perPage, setPage]);

  const paginatedData = useMemo(() => {
    return data.slice((page - 1) * perPage, page * perPage);
  }, [data, page, perPage]);

  return (
    <div className="d-flex flex-column w-100" ref={containerRef}>
      <TableHeader>
        {weights.map((weight, index) => (
          <TableHeaderCol
            weight={weight}
            contentWidth={availableContentWidth}
            orientation={orientations ? orientations[index] : undefined}
            hasLogo={Boolean(logos)}
            key={index}
          />
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

                {externalLinks && (
                  <BaseLink
                    to={externalLinks[rowNum]}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <ExternalLinkIcon color="white" />
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

export default PoolTableWithFixedHeader;
