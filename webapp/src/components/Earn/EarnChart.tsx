import React, { useCallback, useMemo, useState } from "react";
import Chart, { ChartOptions, ChartData } from "chart.js";
import { Line } from "react-chartjs-2";
import colors from "shared/lib/designSystem/colors";

/**
 * Strike: Strike price of the option
 * Price: The price of which the profit is to be calculated
 * Premium: Premium of the option, assume per unit over here
 * Quantity: Quantity of which the user has
 * Expiry: Expiry of the option
 */
interface ProfitChartProps {
  loading?: boolean;
  onHoverPrice: (price: number | undefined) => void;
  onHoverPercentage: (percentage: number | undefined) => void;
  absolutePerformance: number;
  maxYield: number;
  barrierPercentage: number;

  priceRange: number[];
  otherRange: number[];
}

const EarnChart: React.FC<ProfitChartProps> = ({
  loading,
  onHoverPrice,
  onHoverPercentage,
  absolutePerformance,
  maxYield,
  barrierPercentage,
  priceRange,
  otherRange,
}) => {
  const [hoveredIndex, setIndex] = useState<number>();

  const drawPricePoint = useCallback(
    (chart: any, price: number, drawIndex: number) => {
      const ctx: CanvasRenderingContext2D = chart.chart.ctx;
      // Get breakeven datasaet because of stability over every point
      const datasetIndex = chart.chart.data.datasets.findIndex(
        (dataset: any) => dataset.label === "green"
      );
      const meta = chart.chart.getDatasetMeta(datasetIndex);
      // draw line behind dot
      // ctx.globalCompositeOperation = "destination-over";
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
      ctx.lineTo(priceX, bottomY + 34);
      ctx.lineWidth = 1;
      ctx.strokeStyle = colors.primaryText;
      ctx.stroke();
      ctx.restore();

      /**
       * Draw price text
       */
      ctx.fillStyle =
        Math.abs(price) > barrierPercentage * 100
          ? `${colors.red}`
          : `${colors.green}`;
      const fontSize = 14;
      const fontStyle = "normal";
      const fontFamily = "VCR, sans-serif";
      ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const padding = 8;

      const text = `${drawIndex === 0 ? "<<< " : ""}${price.toFixed(2)}%${drawIndex === meta.data.length - 1 ? " >>>" : ""
        }`;
      const textLength = ctx.measureText(text).width;

      let xPosition = priceX;

      if (xPosition - textLength / 2 < leftX) {
        xPosition = leftX + padding + textLength / 2;
      }

      if (xPosition + textLength / 2 > rightX) {
        xPosition = rightX - padding - textLength / 2;
      }

      ctx.fillText(text, xPosition, bottomY + 46);

      ctx.globalCompositeOperation = "source-over";
    },
    [barrierPercentage]
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
      ctx.lineTo(priceX, bottomY + 34);
      ctx.lineWidth = 1;
      ctx.strokeStyle = colors.primaryText + "66";
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.restore();

      /**
       * Draw price text
       */
      ctx.fillStyle =
        Math.abs(price) > barrierPercentage * 100
          ? `${colors.red}`
          : `${colors.green}`;
      const fontSize = 14;
      const fontStyle = "normal";
      const fontFamily = "VCR, sans-serif";
      ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const padding = 8;

      const text = `${drawIndex === 0 ? "<<< " : ""}${price.toFixed(2)}%${drawIndex === meta.data.length - 1 ? " >>>" : ""
        }`;
      const textLength = ctx.measureText(text).width;

      let xPosition = priceX;

      if (xPosition - textLength / 2 < leftX) {
        xPosition = leftX + padding + textLength / 2;
      }

      if (xPosition + textLength / 2 > rightX) {
        xPosition = rightX - padding - textLength / 2;
      }

      ctx.fillText(text, xPosition, bottomY + 46);
    },
    [barrierPercentage]
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

      ctx.fillText(text, xPosition, bottomY + 12);
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
      onHover: (a: any, elements: any) => {
        if (elements && elements.length) {
          onHoverPrice(otherRange[elements[0]._index]);
          onHoverPercentage(priceRange[elements[0]._index]);
          setIndex(elements[0]._index);
        } else {
          onHoverPrice(undefined);
          onHoverPercentage(undefined);
          setIndex(undefined);
        }
      },
    };
  }, [priceRange, otherRange, onHoverPrice, onHoverPercentage]);

  const getData = useCallback(
    (canvas: any): ChartData => {
      const ctx = canvas.getContext("2d");
      const green = ctx.createLinearGradient(0, 100, 0, 170);
      green.addColorStop(1, `transparent`);
      green.addColorStop(0.77, `${colors.green}05`);
      green.addColorStop(0, `${colors.green}14`);

      console.log({
        PP: priceRange.map((_, index) => {
          if (index === hoveredIndex) {
            return otherRange[index];
          } else {
            return null;
          }
        })
      })

      return {
        labels: priceRange,
        datasets: [
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
            backgroundColor: green,
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
          {
            label: "defaultPoint",
            data: priceRange.map((price) => {
              if (price === Math.round(absolutePerformance * 100)) {
                return price;
              } else {
                return null;
              }
            }),
            type: "line",
            pointRadius: 0,
            pointHoverRadius: 0,
            backgroundColor: colors.primaryText,
            borderColor: "#FFFFFF66",
            borderWidth: 1,
            lineTension: 0,
          },
          {
            label: "breakevenPoint",
            data: priceRange.map((p) =>
              !hoveredIndex &&
                (p === barrierPercentage * 100 || p === -barrierPercentage * 100)
                ? maxYield * 100
                : null
            ),
            type: "line",
            pointRadius: 4,
            pointHoverRadius: 4,
            backgroundColor: colors.primaryText,
          },
        ],
      };
    },
    [priceRange, otherRange, hoveredIndex, absolutePerformance, barrierPercentage, maxYield]
  );

  const chart = useMemo(() => {
    return (
      <Line
        type="line"
        data={getData}
        options={options}
        plugins={[
          {
            afterDraw: (chart: any) => {
              const ctx = chart.chart.ctx;

              // draw line behind dot
              const leftX = chart.chart.scales["x-axis-0"].left;
              const rightX = chart.chart.scales["x-axis-0"].right;
              const topY = chart.chart.scales["y-axis-0"].top;
              const bottomY = chart.chart.scales["y-axis-0"].bottom - 1;

              /**
               * Draw borders
               */
              ctx.save();
              ctx.globalCompositeOperation = "destination-over";
              ctx.beginPath();
              ctx.moveTo(leftX, topY - 25);
              ctx.lineTo(rightX, topY - 25);
              ctx.lineWidth = 1;
              ctx.strokeStyle = colors.border;
              ctx.stroke();

              ctx.beginPath();
              ctx.moveTo(leftX, bottomY + 2);
              ctx.lineTo(rightX, bottomY + 2);
              ctx.stroke();

              ctx.beginPath();
              ctx.moveTo(rightX / 2, bottomY + 35);
              ctx.lineTo(rightX / 2, topY - 25);
              ctx.stroke();

              ctx.beginPath();
              ctx.moveTo(leftX, bottomY + 35);
              ctx.lineTo(rightX, bottomY + 35);
              ctx.stroke();

              ctx.restore();

              const hoveredPointIndex = chart.chart.data.datasets.findIndex(
                (dataset: any) => dataset.label === "hoveredPoint"
              );
              const hoveredDataset = chart.chart.data.datasets[hoveredPointIndex];
              const dataIndex = hoveredDataset?.data?.findIndex((data: any) => data !== null)

              if (dataIndex >= 0) {
                drawPricePoint(
                  chart,
                  priceRange[dataIndex],
                  dataIndex
                );
              } else {
                // Draw the default line
                const defaultPointIndex = chart.chart.data.datasets.findIndex(
                  (dataset: any) => dataset.label === "defaultPoint"
                );
                const defaultPointDataset = chart.chart.data.datasets[defaultPointIndex];
                const defaultDataIndex = defaultPointDataset?.data?.findIndex((data: any) => data !== null)

                drawDefaultPricePoint(
                  chart,
                  priceRange[defaultDataIndex],
                  defaultDataIndex
                );
              }

              drawDefaultBarriers(
                chart,
                barrierPercentage * 100,
                priceRange.indexOf(barrierPercentage * 100)
              );
              drawDefaultBarriers(
                chart,
                -barrierPercentage * 100,
                priceRange.indexOf(-barrierPercentage * 100)
              );
            },
          },
        ]}
      />
    );
  }, [
    getData, 
    options, 
    drawDefaultBarriers, 
    barrierPercentage, 
    priceRange, 
    drawDefaultPricePoint, 
    drawPricePoint
  ]);

  return chart;
};

export default EarnChart;
