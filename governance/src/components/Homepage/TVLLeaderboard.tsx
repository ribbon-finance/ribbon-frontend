import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";

import theme from "shared/lib/designSystem/theme";
import colors from "shared/lib/designSystem/colors";
import { Subtitle, Title } from "shared/lib/designSystem";
import useTVL from "shared/lib/hooks/useTVL";
import Pagination from "shared/lib/components/Common/Pagination";
import { formatAmount } from "shared/lib/utils/math";
import { productCopies } from "shared/lib/components/Product/productCopies";
import useElementSize from "shared/lib/hooks/useElementSize";
import { getVaultColor } from "shared/lib/utils/vault";
import OverviewBarchart from "./OverviewBarchart";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";
import useScreenSize from "shared/lib/hooks/useScreenSize";
import sizes from "shared/lib/designSystem/sizes";

const perPage = 3;

const SectionLabel = styled.div`
  display: flex;
  padding: 16px;
  background: ${colors.red}1F;
  border-radius: ${theme.border.radiusSmall};
`;

const TVLLeaderboard = () => {
  const { width } = useScreenSize();
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: containerWidth } = useElementSize(containerRef);
  const { data, totalTVL, loading: TVLLoading } = useTVL();
  const loadingText = useTextAnimation(TVLLoading);

  const [page, setPage] = useState(1);

  /**
   * Prevent page number to go out of boundary
   */
  useEffect(() => {
    const totalPageNum = Math.ceil(data.length / perPage);

    if (data.length && page > totalPageNum) {
      setPage(totalPageNum);
    }
  }, [data.length, page]);

  const pagedVaults = useMemo(() => {
    return data.slice((page - 1) * perPage, (page - 1) * perPage + perPage);
  }, [data, page]);

  return (
    <div
      ref={containerRef}
      className="d-flex flex-column w-100 align-items-center"
    >
      <SectionLabel>
        <Subtitle
          color={colors.red}
          fontSize={11}
          lineHeight={12}
          letterSpacing={1}
        >
          Total Value Locked
        </Subtitle>
      </SectionLabel>
      <Title
        fontSize={width >= sizes.lg ? 80 : 64}
        lineHeight={width >= sizes.lg ? 96 : 72}
        letterSpacing={1}
        className="mt-3"
      >
        {TVLLoading ? loadingText : `$${formatAmount(totalTVL)}`}
      </Title>

      {!TVLLoading && (
        <>
          {/* Bar chart */}
          <AnimatePresence exitBeforeEnter initial={false}>
            <motion.div
              key={page}
              transition={{
                duration: 0.25,
                type: "keyframes",
                ease: "easeInOut",
              }}
              initial={{
                x: 50,
                opacity: 0,
              }}
              animate={{
                x: 0,
                opacity: 1,
              }}
              exit={{
                x: -50,
                opacity: 0,
              }}
              className="d-flex flex-row mt-4 w-100 justify-content-center"
            >
              <OverviewBarchart
                items={pagedVaults.map((vault) => ({
                  name: `${productCopies[vault.vault.option].title} ${
                    vault.vault.version
                  }`,
                  value: vault.tvl,
                  formattedValue: `$${formatAmount(vault.tvl)}`,
                  color: getVaultColor(vault.vault.option),
                }))}
                maxBarWidth={containerWidth * 0.4}
                maxValue={data[0]?.tvl || 0}
              />
            </motion.div>
          </AnimatePresence>

          {/* Pagination */}
          <div className="d-flex mt-5">
            <Pagination
              page={page}
              total={Math.ceil(data.length / perPage)}
              setPage={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TVLLeaderboard;
