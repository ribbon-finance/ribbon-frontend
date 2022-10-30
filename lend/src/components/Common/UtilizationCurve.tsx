import React, { useCallback, useEffect, useMemo, useState } from "react";
import Chart, { ChartOptions, ChartData } from "chart.js";
import { Line } from "react-chartjs-2";
import colors from "shared/lib/designSystem/colors";
import styled from "styled-components";
import { useInterestRateModelData } from "../../hooks/useInterestRateModelData";
import { useVaultData } from "../../hooks/web3DataContext";
import { VaultOptions } from "../../constants/constants";
import { borrowRate, formatBigNumber, lendingRate } from "../../utils/math";

const ChartContainer = styled.div`
  height: 350px;
  margin: 0;
  width: 100%;
`;

interface UtilizationCurveProps {
  pool: VaultOptions;
  setUtilizationRate: (utilizationRate: number | undefined) => void;
  setBorrowRate: (borrowRate: number | undefined) => void;
  setLendingRate: (lendingRate: number | undefined) => void;
}

const UtilizationCurve: React.FC<UtilizationCurveProps> = ({
  pool,
  setUtilizationRate,
  setBorrowRate,
  setLendingRate,
}) => {
  const {
    data: { kink, kinkRate, fullRate, zeroRate },
  } = useInterestRateModelData();

  const [hoveredIndex, setIndex] = useState<number>();
  const { utilizationRate, reserveFactor } = useVaultData(pool);

  const utilRate = parseFloat(formatBigNumber(utilizationRate, 18, 2)) * 100;
  const utilRateRaw = parseFloat(formatBigNumber(utilizationRate, 18, 4)) * 100;
  // array from 0, 0.0001 ... 1
  const utilArray = useMemo(() => {
    const utilArray: number[] = [];
    for (let i = 0; i <= 100; i += 1) {
      utilArray.push(parseFloat(i.toFixed(2)));
    }
    return utilArray;
  }, []);

  const getBorrowRate = useCallback(
    (utilRate: number) => {
      return borrowRate(utilRate, kink, kinkRate, fullRate, zeroRate);
    },
    [fullRate, kink, kinkRate, zeroRate]
  );

  const [actualBorrowRate, actualLendingRate] = useMemo(() => {
    const borrowRateTemp = getBorrowRate(utilRate);
    const lendingRateTemp = lendingRate(
      utilRate,
      borrowRateTemp,
      reserveFactor
    );
    if (!borrowRateTemp || !lendingRateTemp) {
      return [0, 0];
    }
    return [borrowRateTemp * 100, lendingRateTemp * 100];
  }, [getBorrowRate, reserveFactor, utilRate]);

  useEffect(() => {
    if (!hoveredIndex) {
      setBorrowRate(actualBorrowRate);
      setLendingRate(actualLendingRate);
    }
  });
  const borrowRateArray = useMemo(() => {
    const borrowRateArray: number[] = [];
    utilArray.forEach((utilRate) => {
      borrowRateArray.push(
        parseFloat((getBorrowRate(utilRate / 100) * 100).toFixed(2))
      );
    });
    return borrowRateArray;
  }, [getBorrowRate, utilArray]);

  const lendingRateArray = useMemo(() => {
    const lendingRateArray: number[] = [];
    borrowRateArray.forEach((borrowRate, index) => {
      const utilRate = utilArray[index];
      lendingRateArray.push(lendingRate(utilRate, borrowRate, reserveFactor));
    });
    return lendingRateArray;
  }, [borrowRateArray, reserveFactor, utilArray]);

  const drawHoverLine = useCallback((chart: any, drawIndex: number) => {
    const ctx: CanvasRenderingContext2D = chart.chart.ctx;
    // Get breakeven datasaet because of stability over every point
    const datasetIndex = chart.chart.data.datasets.findIndex(
      (dataset: any) => dataset.label === "blue"
    );
    const meta = chart.chart.getDatasetMeta(datasetIndex);
    // draw line behind dot
    ctx.globalCompositeOperation = "destination-over";
    const topY = chart.chart.scales["y-axis-0"].top;

    // draw line
    const element = meta.data[drawIndex];
    const elementX = element._view.x;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(elementX, topY);
    ctx.lineTo(elementX, element._model.y);
    ctx.lineWidth = 1;
    ctx.strokeStyle = colors.primaryText;
    ctx.stroke();
    ctx.restore();
  }, []);

  const drawDefaultLine = useCallback((chart: any, drawIndex: number) => {
    const ctx: CanvasRenderingContext2D = chart.chart.ctx;
    // Get breakeven datasaet because of stability over every point
    const datasetIndex = chart.chart.data.datasets.findIndex(
      (dataset: any) => dataset.label === "blue"
    );
    const meta = chart.chart.getDatasetMeta(datasetIndex);
    // draw line behind dot
    ctx.globalCompositeOperation = "destination-over";
    const leftX = chart.chart.scales["x-axis-0"].left;
    const rightX = chart.chart.scales["x-axis-0"].right;
    const topY = chart.chart.scales["y-axis-0"].top;

    // draw line
    const element = meta.data[drawIndex];
    const elementX = element._view.x;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(elementX, topY);
    ctx.lineTo(elementX, element._model.y);
    ctx.lineWidth = 1;
    ctx.strokeStyle = colors.primaryText + "66";
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.restore();

    // Draw text
    ctx.fillStyle = colors.primaryText;
    const fontSize = 12;
    const fontStyle = "normal";
    const fontFamily = "Inter, sans-serif";
    ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const padding = 8;

    const text = "Current Utilization";
    const textLength = ctx.measureText(text).width;

    let xPosition = elementX;

    if (xPosition - textLength / 2 < leftX) {
      xPosition = leftX + padding + textLength / 2;
    }

    if (xPosition + textLength / 2 > rightX) {
      xPosition = rightX - padding - textLength / 2;
    }

    ctx.fillText(text, xPosition, topY - 20);
  }, []);

  const options = useMemo((): ChartOptions => {
    return {
      maintainAspectRatio: false,
      legend: { display: false },
      layout: { padding: { top: 50 } },
      scales: {
        yAxes: [
          {
            display: false,
            ticks: {
              max: 25,
            },
          },
        ],
        xAxes: [{ display: false }],
      },
      elements: {
        line: {
          tension: 1,
          borderJoinStyle: "round",
        },
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
          setUtilizationRate(utilArray[elements[0]._index]);
          setBorrowRate(borrowRateArray[elements[0]._index]);
          setLendingRate(lendingRateArray[elements[0]._index]);
          setIndex(elements[0]._index);
        } else {
          setUtilizationRate(utilRateRaw);
          setBorrowRate(actualBorrowRate);
          setLendingRate(actualLendingRate);
          setIndex(undefined);
        }
      },
    };
  }, [
    actualBorrowRate,
    actualLendingRate,
    borrowRateArray,
    lendingRateArray,
    setBorrowRate,
    setLendingRate,
    setUtilizationRate,
    utilArray,
    utilRateRaw,
  ]);

  const getData = useCallback((): ChartData => {
    return {
      labels: utilArray,
      datasets: [
        {
          label: "green",
          data: borrowRateArray,
          type: "line",
          pointRadius: 0,
          pointHoverRadius: 0,
          borderColor: `${colors.green}`,
          borderWidth: 2,
          lineTension: 0.4,
        },
        {
          label: "blue",
          data: lendingRateArray,
          type: "line",
          pointRadius: 0,
          pointHoverRadius: 0,
          borderColor: "#3E73C4",
          borderWidth: 2,
          lineTension: 0.4,
        },
        {
          label: "hoveredBorrowRatePoint",
          data: utilArray.map((_, index) => {
            if (index === hoveredIndex) {
              return borrowRateArray[index];
            } else {
              return null;
            }
          }),
          type: "line",
          pointRadius: 4,
          pointHoverRadius: 4,
          backgroundColor: `${colors.green}`,
        },
        {
          label: "hoveredLendingRatePoint",
          data: utilArray.map((_, index) => {
            if (index === hoveredIndex) {
              return lendingRateArray[index];
            } else {
              return null;
            }
          }),
          type: "line",
          pointRadius: 4,
          pointHoverRadius: 4,
          backgroundColor: "#3E73C4",
        },
        {
          label: "defaultPoint",
          data: utilArray.map((price) => {
            if (price === utilRate) {
              return lendingRateArray[price];
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
          lineTension: 0.4,
        },
        {
          label: "defaultBorrowPoint",
          data: utilArray.map((p) =>
            !hoveredIndex && p === utilRate
              ? borrowRateArray[utilArray.indexOf(p)]
              : null
          ),
          type: "line",
          pointRadius: 4,
          pointHoverRadius: 4,
          backgroundColor: colors.green,
        },
        {
          label: "defaultLendPoint",
          data: utilArray.map((p) =>
            !hoveredIndex && p === utilRate
              ? lendingRateArray[utilArray.indexOf(p)]
              : null
          ),
          type: "line",
          pointRadius: 4,
          pointHoverRadius: 4,
          backgroundColor: "#3E73C4",
        },
      ],
    };
  }, [borrowRateArray, hoveredIndex, lendingRateArray, utilArray, utilRate]);

  const chart = useMemo(() => {
    return (
      <ChartContainer>
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
                ctx.moveTo(leftX, topY);
                ctx.lineTo(rightX, topY);
                ctx.lineWidth = 1;
                ctx.strokeStyle = colors.border;
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(leftX, bottomY);
                ctx.lineTo(rightX, bottomY);
                ctx.stroke();

                ctx.restore();

                ctx.globalCompositeOperation = "destination-over";

                const hoveredPointIndex = chart.chart.data.datasets.findIndex(
                  (dataset: any) => dataset.label === "hoveredBorrowRatePoint"
                );
                const hoveredDataset =
                  chart.chart.data.datasets[hoveredPointIndex];
                const dataIndex = hoveredDataset?.data?.findIndex(
                  (data: any) => data !== null
                );

                if (dataIndex >= 0) {
                  drawHoverLine(chart, dataIndex);
                }
                // Draw the default line
                const defaultPointIndex = chart.chart.data.datasets.findIndex(
                  (dataset: any) => dataset.label === "defaultPoint"
                );
                const defaultPointDataset =
                  chart.chart.data.datasets[defaultPointIndex];
                const defaultDataIndex = defaultPointDataset?.data?.findIndex(
                  (data: any) => data !== null
                );

                drawDefaultLine(chart, defaultDataIndex);
              },
            },
          ]}
        />
      </ChartContainer>
    );
  }, [getData, options, drawHoverLine, drawDefaultLine]);

  return chart;
};

export default UtilizationCurve;
