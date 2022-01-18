import React, { useMemo, useRef, useState } from "react";
import styled from "styled-components";
import currency from "currency.js";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion";

import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import { Subtitle, Title } from "shared/lib/designSystem";
import useAssetPrice, {
  useAssetsPriceHistory,
} from "shared/lib/hooks/useAssetPrice";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";
import { Chart } from "shared/lib/components/Common/PerformanceChart";
import useElementSize from "shared/lib/hooks/useElementSize";
import SegmentControl from "shared/lib/components/Common/SegmentControl";
import useScreenSize from "shared/lib/hooks/useScreenSize";
import sizes from "shared/lib/designSystem/sizes";

const priceRangeList = ["24H", "1W", "1M", "6M", "1Y", "ALL"] as const;
type PriceRange = typeof priceRangeList[number];

const SectionLabel = styled.div`
  display: flex;
  padding: 16px;
  background: ${colors.red}1F;
  border-radius: ${theme.border.radiusSmall};
`;

const RBNPriceOverview = () => {
  const { width } = useScreenSize();
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: containerWidth } = useElementSize(containerRef);
  const { price: RBNPrice, loading: assetPriceLoading } = useAssetPrice({
    asset: "RBN",
  });
  const { histories } = useAssetsPriceHistory();
  const loadingText = useTextAnimation(assetPriceLoading);

  const [range, setRange] = useState<PriceRange>("1M");

  const RBNPrices = useMemo(() => {
    const startingTime = moment();

    switch (range) {
      case "24H":
        startingTime.subtract(1, "d");
        break;
      case "1W":
        startingTime.subtract(1, "w");
        break;
      case "1M":
        startingTime.subtract(1, "M");
        break;
      case "6M":
        startingTime.subtract(6, "M");
        break;
      case "1Y":
        startingTime.subtract(1, "y");
        break;
    }

    let transformedHistories = Object.keys(histories["RBN"]).map((key) => {
      const timestamp = parseInt(key);

      return {
        timestamp: timestamp,
        price: histories["RBN"][timestamp],
      };
    });

    switch (range) {
      case "ALL":
        return transformedHistories;
      default:
        return transformedHistories.filter(
          (history) => history.timestamp > startingTime.valueOf()
        );
    }
  }, [histories, range]);

  const priceChanges = useMemo(() => {
    if (RBNPrices.length <= 0) {
      return 0;
    }

    const startingPrice = RBNPrices[0].price;

    return (RBNPrice - startingPrice) / startingPrice;
  }, [RBNPrice, RBNPrices]);

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
          RBN Price
        </Subtitle>
      </SectionLabel>
      <Title
        fontSize={width >= sizes.lg ? 80 : 64}
        lineHeight={width >= sizes.lg ? 96 : 72}
        letterSpacing={1}
        className="mt-3"
      >
        {assetPriceLoading ? loadingText : currency(RBNPrice).format()}
      </Title>

      {/* Chart */}
      <AnimatePresence exitBeforeEnter initial={false}>
        <motion.div
          key={range}
          transition={{
            duration: 0.25,
            type: "keyframes",
            ease: "easeInOut",
          }}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          className="d-flex flex-column align-items-center"
        >
          <Subtitle
            fontSize={14}
            lineHeight={16}
            letterSpacing={1}
            color={priceChanges >= 0 ? colors.green : colors.red}
            className={width >= sizes.lg ? "mt-2" : "mt-4"}
          >
            {`${priceChanges >= 0 ? "+" : ""}${(priceChanges * 100).toFixed(
              2
            )}%`}
          </Subtitle>
          <div
            className="mt-5"
            style={{
              height:
                width >= sizes.lg
                  ? containerWidth / 15
                  : containerWidth * 0.9 * 0.25,
              width:
                width >= sizes.lg ? containerWidth / 4 : containerWidth * 0.9,
            }}
          >
            <Chart
              dataset={RBNPrices.map((price) => price.price)}
              labels={RBNPrices.map((price) => new Date(price.timestamp))}
              padding={{ top: 0, bottom: 0 }}
              borderColor={priceChanges >= 0 ? colors.green : colors.red}
              gradientStartColor="transparent"
              gradientStopColor="transparent"
              pointBackgroundColor="transparent"
              hoverable={false}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="d-flex mt-5">
        <SegmentControl
          segments={priceRangeList.map((item) => ({
            value: item,
            display: item,
          }))}
          value={range}
          onSelect={(value) => setRange(value as PriceRange)}
          config={{
            backgroundColor: colors.background.one,
            button: {
              px: 16,
              py: 8,
              fontSize: 12,
              lineHeight: 16,
            },
          }}
        />
      </div>
    </div>
  );
};

export default RBNPriceOverview;
