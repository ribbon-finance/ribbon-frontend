import React, { useCallback, useMemo, useState } from "react";
import { ChartOptions, ChartData } from "chart.js";
// import Chart from "chart.js";
import { Line } from "react-chartjs-2";
// import currency from "currency.js";

import colors from "shared/lib/designSystem/colors";
import Chart from "chart.js";

/**
 * Strike: Strike price of the option
 * Price: The price of which the profit is to be calculated
 * Premium: Premium of the option, assume per unit over here
 * Quantity: Quantity of which the user has
 * Expiry: Expiry of the option
 */
interface ProfitChartProps {
  strike: number;
  price: number;
  premium: number;
  isPut: boolean;
  onHoverPrice: (price: number | undefined) => void;
  onHoverPercentage: (percentage: number | undefined) => void;
  spotPrice: number;
  strikePrice: number;
  defaultPercentageDiff: string;
  defaultMoneyness: (moneyness: number) => void;
  barrierPercentage: number;
}

const EarnChart: React.FC<ProfitChartProps> = ({
  strike,
  price,
  premium,
  isPut,
  onHoverPrice,
  onHoverPercentage,
  spotPrice,
  strikePrice,
  defaultPercentageDiff,
  defaultMoneyness,
}) => {
  const [hoveredIndex, setIndex] = useState<number | undefined>(undefined);

  // x axis
  const priceRange = useMemo(() => {
    var leftArray = [];
    var array = [];
    var rightArray = [];
    for (let i = -28; i < -8; i += 1) {
      leftArray.push(i);
    }

    for (let i = -8; i <= 8; i += 1) {
      array.push(i);
    }

    for (let i = 9; i <= 28; i += 1) {
      rightArray.push(i);
    }

    return [...leftArray, -8.01, ...array, 8.01, ...rightArray];
  }, []);

  const otherRange = useMemo(() => {
    var leftArray = [];
    var array = [];
    var rightArray = [];

    for (let i = -28; i <= -8; i += 1) {
      leftArray.push(4);
    }

    for (let i = -8; i <= 8; i += 1) {
      array.push(4 + Math.abs(i / 8) * 25.12);
    }

    for (let i = 8; i <= 28; i += 1) {
      rightArray.push(4);
    }
    // console.log([...leftArray, ...array, ...rightArray]);
    return [...leftArray, ...array, ...rightArray];
  }, []);

  const getDefaultMoneyness = useMemo(() => {
    defaultMoneyness(
      otherRange[priceRange.indexOf(parseInt(defaultPercentageDiff))]
    );
  }, [defaultMoneyness, defaultPercentageDiff, priceRange, otherRange]);
  const drawPricePoint = useCallback(
    (chart: any, price: number, drawIndex: number) => {
      const ctx: CanvasRenderingContext2D = chart.chart.ctx;
      // Get breakeven datasaet because of stability over every point
      const datasetIndex = chart.chart.data.datasets.findIndex(
        (dataset: any) => dataset.label === "green"
      );
      const meta = chart.chart.getDatasetMeta(datasetIndex);
      // draw line behind dot
      ctx.globalCompositeOperation = "destination-over";
      const leftX = chart.chart.scales["x-axis-0"].left;
      const rightX = chart.chart.scales["x-axis-0"].right;
      const topY = chart.chart.scales["y-axis-0"].top;
      const bottomY = chart.chart.scales["y-axis-0"].bottom - 1;
      /**
       * Draw price point
       */
      const priceElement = meta.data[drawIndex];
      const priceX = priceElement._view.x;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(priceX, topY - 25);
      ctx.lineTo(priceX, bottomY + 50);
      ctx.lineWidth = 1;
      ctx.strokeStyle = colors.primaryText;
      ctx.stroke();
      ctx.restore();

      /**
       * Draw price text
       */
      ctx.fillStyle = Math.abs(price) > 8 ? `${colors.red}` : `${colors.green}`;
      const fontSize = 12;
      const fontStyle = "normal";
      const fontFamily = "VCR, sans-serif";
      ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const padding = 8;

      const text = `${drawIndex === 0 ? "<<< " : ""}${price.toFixed(2)}%${
        drawIndex === meta.data.length - 1 ? " >>>" : ""
      }`;
      const textLength = ctx.measureText(text).width;

      let xPosition = priceX;

      if (xPosition - textLength / 2 < leftX) {
        xPosition = leftX + padding + textLength / 2;
      }

      if (xPosition + textLength / 2 > rightX) {
        xPosition = rightX - padding - textLength / 2;
      }

      ctx.fillText(text, xPosition, bottomY + 62);

      ctx.globalCompositeOperation = "source-over";
    },
    []
  );

  const drawDefaultPricePoint = useCallback(
    (chart: any, price: number, drawIndex: number) => {
      const ctx: CanvasRenderingContext2D = chart.chart.ctx;
      // Get breakeven datasaet because of stability over every point
      const datasetIndex = chart.chart.data.datasets.findIndex(
        (dataset: any) => dataset.label === "green"
      );
      const meta = chart.chart.getDatasetMeta(datasetIndex);
      // draw line behind dot
      ctx.globalCompositeOperation = "destination-over";
      const leftX = chart.chart.scales["x-axis-0"].left;
      const rightX = chart.chart.scales["x-axis-0"].right;
      const topY = chart.chart.scales["y-axis-0"].top;
      const bottomY = chart.chart.scales["y-axis-0"].bottom - 1;
      /**
       * Draw price point
       */
      const priceElement = meta.data[drawIndex];
      const priceX = priceElement._view.x;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(priceX, topY - 25);
      ctx.lineTo(priceX, bottomY + 50);
      ctx.lineWidth = 1;
      ctx.strokeStyle = colors.primaryText + "66";
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.restore();

      /**
       * Draw price text
       */
      ctx.fillStyle = Math.abs(price) > 8 ? `${colors.red}` : `${colors.green}`;
      const fontSize = 12;
      const fontStyle = "normal";
      const fontFamily = "VCR, sans-serif";
      ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const padding = 8;

      const text = `${drawIndex === 0 ? "<<< " : ""}${price.toFixed(2)}%${
        drawIndex === meta.data.length - 1 ? " >>>" : ""
      }`;
      const textLength = ctx.measureText(text).width;

      let xPosition = priceX;

      if (xPosition - textLength / 2 < leftX) {
        xPosition = leftX + padding + textLength / 2;
      }

      if (xPosition + textLength / 2 > rightX) {
        xPosition = rightX - padding - textLength / 2;
      }

      ctx.fillText(text, xPosition, bottomY + 62);

      ctx.globalCompositeOperation = "source-over";
    },
    []
  );

  const drawDefaultBarriers = useCallback(
    (chart: any, price: number, drawIndex: number) => {
      const ctx: CanvasRenderingContext2D = chart.chart.ctx;
      // Get breakeven datasaet because of stability over every point
      const datasetIndex = chart.chart.data.datasets.findIndex(
        (dataset: any) => dataset.label === "green"
      );
      const meta = chart.chart.getDatasetMeta(datasetIndex);
      // draw line behind dot
      ctx.globalCompositeOperation = "destination-over";
      const leftX = chart.chart.scales["x-axis-0"].left;
      const rightX = chart.chart.scales["x-axis-0"].right;
      //const topY = chart.chart.scales["y-axis-0"].top;
      const bottomY = chart.chart.scales["y-axis-0"].bottom - 1;
      /**
       * Draw price point
       */
      const priceElement = meta.data[drawIndex];
      const priceX = priceElement._view.x;
      /**
       * Draw price text
       */
      ctx.fillStyle = "white";
      const fontSize = 12;
      const fontStyle = "normal";
      const fontFamily = "VCR, sans-serif";
      ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const padding = 8;

      const text = `${price.toFixed(2)}%`;
      const textLength = ctx.measureText(text).width;

      let xPosition = priceX;

      if (xPosition - textLength / 2 < leftX) {
        xPosition = leftX + padding + textLength / 2;
      }

      if (xPosition + textLength / 2 > rightX) {
        xPosition = rightX - padding - textLength / 2;
      }

      ctx.fillText(text, xPosition, bottomY + 24);

      ctx.globalCompositeOperation = "source-over";
    },
    []
  );

  const options = useMemo((): ChartOptions => {
    return {
      maintainAspectRatio: false,
      legend: { display: false },
      layout: { padding: { top: 50, bottom: 100 } },
      scales: {
        yAxes: [
          {
            display: false,
          },
        ],
        xAxes: [{ display: false }],
      },
      animation: { duration: 0 },
      hover: { animationDuration: 0, intersect: false },
      tooltips: {
        enabled: false,
        intersect: false,
        mode: "nearest",
      },
      onHover: (_: any, elements: any) => {
        if (elements && elements.length) {
          onHoverPrice(otherRange[elements[0]._index]);
          onHoverPercentage(priceRange[elements[0]._index]);
          setIndex(elements[0]._index);
          return;
        }
        onHoverPrice(undefined);
        onHoverPercentage(undefined);
        setIndex(undefined);
      },
    };
  }, [priceRange, otherRange, onHoverPrice, onHoverPercentage]);

  const getData = useCallback(
    (canvas: any): ChartData => {
      const ctx = canvas.getContext("2d");
      const green = ctx.createLinearGradient(0, 130, 0, 148);
      green.addColorStop(1, `${colors.green}05`);
      green.addColorStop(0, `${colors.green}14`);

      return {
        labels: priceRange,
        datasets: [
          {
            label: "breakevenPoint",
            data: priceRange.map((p) =>
              !hoveredIndex && (p === 8 || p === -8) ? 29 : null
            ),
            type: "line",
            pointRadius: 4,
            pointHoverRadius: 4,
            backgroundColor: colors.primaryText,
          },
          {
            label: "green",
            // @ts-ignore
            data: otherRange,
            type: "line",
            pointRadius: 0,
            pointHoverRadius: 0,
            borderDash: undefined,
            borderWidth: 2,
            borderColor: `${colors.green}`,
            fill: "-1",
            lineTension: 0,
          },
          {
            label: "hoveredPoint",
            data: priceRange.map((_, index) => {
              if (index === hoveredIndex) {
                return otherRange[index];
              } else {
                return null;
              }
            }),
            type: "line",
            pointRadius: 4,
            pointHoverRadius: 4,
            backgroundColor: colors.primaryText,
            borderColor: "#FFFFFF66",
            borderWidth: 1,
            lineTension: 0,
          },
        ],
      };
    },
    [otherRange, priceRange, hoveredIndex]
  );

  const chart = useMemo(() => {
    return (
      <Line
        key={hoveredIndex}
        type="line"
        data={getData}
        options={options}
        plugins={[
          {
            afterDraw: (chart: any) => {
              const ctx = chart.chart.ctx;

              // draw line behind dot
              ctx.globalCompositeOperation = "destination-over";
              const leftX = chart.chart.scales["x-axis-0"].left;
              const rightX = chart.chart.scales["x-axis-0"].right;
              const topY = chart.chart.scales["y-axis-0"].top;
              const bottomY = chart.chart.scales["y-axis-0"].bottom - 1;

              /**
               * Draw borders
               */
              ctx.save();
              ctx.beginPath();
              ctx.moveTo(leftX, topY - 25);
              ctx.lineTo(rightX, topY - 25);
              ctx.lineWidth = 1;
              ctx.strokeStyle = colors.border;
              ctx.stroke();

              ctx.beginPath();
              ctx.moveTo(leftX, bottomY + 10);
              ctx.lineTo(rightX, bottomY + 10);
              ctx.stroke();

              ctx.beginPath();
              ctx.moveTo(rightX / 2, bottomY + 50);
              ctx.lineTo(rightX / 2, topY - 25);
              ctx.stroke();

              ctx.beginPath();
              ctx.moveTo(leftX, bottomY + 50);
              ctx.lineTo(rightX, bottomY + 50);
              ctx.stroke();

              ctx.restore();

              if (hoveredIndex === undefined) {
                drawDefaultPricePoint(
                  chart,
                  priceRange[
                    priceRange.indexOf(parseInt(defaultPercentageDiff))
                  ],
                  priceRange.indexOf(parseInt(defaultPercentageDiff))
                );
              }

              /**
               * Draw price point
               */
              if (hoveredIndex !== undefined) {
                drawPricePoint(chart, priceRange[hoveredIndex], hoveredIndex);
              }

              drawDefaultBarriers(chart, 8, priceRange.indexOf(8));
              drawDefaultBarriers(chart, -8, priceRange.indexOf(-8));
            },
          },
        ]}
      />
    );
  }, [
    getData,
    options,
    hoveredIndex,
    drawPricePoint,
    drawDefaultPricePoint,
    defaultPercentageDiff,
    drawDefaultBarriers,
    priceRange,
  ]);

  return chart;
};

export default EarnChart;
