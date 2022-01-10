import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { VaultOptions, VaultVersion } from "shared/lib/constants/constants";

const perPage = 3;

const SectionLabel = styled.div`
  display: flex;
  padding: 16px;
  background: ${colors.red}1F;
  border-radius: ${theme.border.radiusSmall};
`;

const Bar = styled.div<{ width: number; color: string }>`
  display: flex;
  position: relative;
  height: 48px;
  width: ${(props) => props.width}px;
  background: ${(props) =>
    `linear-gradient(270deg, ${props.color}52 0%,  ${props.color}21 100%)`};
`;

const TVLLeaderboard = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: containerWidth } = useElementSize(containerRef);
  const { data, totalTVL } = useTVL();

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

  const renderBarchartBar = useCallback(
    (param: {
      vault: { option: VaultOptions; version: VaultVersion };
      tvl: number;
    }) => {
      const maxBarWidth = containerWidth * 0.4;
      const color = getVaultColor(param.vault.option);

      return (
        <div className="d-flex align-items-center">
          <Bar color={color} width={maxBarWidth * (param.tvl / data[0].tvl)}>
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                height: "100%",
                width: maxBarWidth * 0.01,
                background: color,
              }}
            />
          </Bar>
          <Title color={color} fontSize={14} lineHeight={20} className="ml-4">
            {formatAmount(param.tvl)}
          </Title>
        </div>
      );
    },
    [containerWidth, data]
  );

  return (
    <div className="d-flex flex-column w-100 align-items-center">
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
      <Title fontSize={80} lineHeight={96} letterSpacing={1} className="mt-3">
        ${formatAmount(totalTVL)}
      </Title>

      {/* Barchart */}
      <AnimatePresence exitBeforeEnter initial={false}>
        <motion.div
          ref={containerRef}
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
          {/* Left vault titles */}
          <div className="d-flex flex-column">
            {pagedVaults.map((vault) => (
              <Subtitle
                fontSize={14}
                lineHeight={48}
                letterSpacing={1}
                color={colors.text}
                className="text-right"
              >{`${productCopies[vault.vault.option].title} ${
                vault.vault.version
              }`}</Subtitle>
            ))}
          </div>

          {/* Right bar */}
          <div className="d-flex flex-column ml-4">
            {pagedVaults.map((vault) => renderBarchartBar(vault))}
          </div>
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
    </div>
  );
};

export default TVLLeaderboard;
