import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { Line } from "react-chartjs-2";
import { ChartOptions } from "chart.js";
import moment from "moment";

import colors from "../../designSystem/colors";
import { SecondaryText } from "../../designSystem";

export type HoverInfo =
  | {
      focused: true;
      xData: Date;
      yData: number;
      xPosition: number;
      index: number;
    }
  | { focused: false };

const PerformanceChartContainer = styled.div`
  width: 100%;
`;

interface PerformanceChartProps {
  dataset: number[];
  labels: Date[];
  extras?: React.ReactNode;
  onChartHover: (hoverInfo: HoverInfo) => void;
  themeColor?: string;
  lineDecayAfterPointIndex?: number;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  dataset,
  labels,
  extras,
  onChartHover,
  themeColor = colors.green,
  lineDecayAfterPointIndex,
}) => {
  const [date, setDate] = useState<Date | null>(null);
  const [datePosition, setDatePosition] = useState(0);
  const [index, setIndex] = useState(0);

  const dateStr = moment(date || new Date()).format("ddd, MMMM Do");

  const handleChartHover = useCallback(
    (hoverInfo: HoverInfo) => {
      if (hoverInfo.focused) {
        setDate(hoverInfo.xData);
        setDatePosition(hoverInfo.xPosition);
        setIndex(hoverInfo.index);
      } else {
        setDate(null);
        setDatePosition(0);
        setIndex(0);
      }

      onChartHover && onChartHover(hoverInfo);
    },
    [onChartHover]
  );

  const chart = useMemo(
    () => (
      <Chart
        dataset={dataset}
        labels={labels}
        lineDecayAfterPointIndex={lineDecayAfterPointIndex}
        onHover={handleChartHover}
        borderColor={themeColor}
        gradientStartColor={`${themeColor}3D`}
        gradientStopColor={`${themeColor}00`}
        pointBackgroundColor={themeColor}
      />
    ),
    [dataset, labels, handleChartHover, themeColor, lineDecayAfterPointIndex]
  );

  let dateTooltipPosition = datePosition - 15;
  if (index === 0) {
    dateTooltipPosition = datePosition;
  } else if (index + 1 > dataset.length - dataset.length * 0.15) {
    dateTooltipPosition =
      datePosition -
      110 * (1 - (dataset.length - (index + 1)) / (dataset.length * 0.15));
  }

  return (
    <PerformanceChartContainer className="position-relative">
      {extras}
      <div
        style={{
          position: "relative",
          height: "224px",
          width: "100%",
        }}
      >
        {chart}
      </div>
      {date !== null ? (
        <SecondaryText
          fontSize={12}
          lineHeight={16}
          className="position-absolute"
          style={{
            whiteSpace: "nowrap",
            left: dateTooltipPosition,
          }}
        >
          {dateStr}
        </SecondaryText>
      ) : undefined}
    </PerformanceChartContainer>
  );
};

export const Chart: React.FC<{
  dataset: number[];
  labels: Date[];
  onHover?: (hoverInfo: HoverInfo) => void;
  borderColor?: string;
  decayedPointBorderColor?: string;
  decayedBorderColor?: string;
  gradientStartColor?: string;
  gradientStopColor?: string;
  pointBackgroundColor?: string;

  // If provided, set the dot (circle) to the data on that index
  // and decrease the transparency of the line AFTER that specific point
  lineDecayAfterPointIndex?: number;

  // When set, show the number of grid lines
  // when unset, hides gridlines and labels
  maxGridLines?: number;

  padding?: { top: number; bottom: number };
  hoverable?: boolean;
}> = ({
  dataset,
  labels,
  onHover,
  borderColor = colors.green,
  decayedPointBorderColor = `${colors.green}1F`,
  decayedBorderColor = `${colors.green}3D`,

  gradientStartColor = `${colors.green}3D`,
  gradientStopColor = `${colors.green}00`,
  pointBackgroundColor = colors.green,
  lineDecayAfterPointIndex,
  maxGridLines,
  padding = { top: 20, bottom: 20 },
  hoverable = true,
}) => {
  const options = useMemo((): ChartOptions => {
    return {
      maintainAspectRatio: false,
      title: { display: false },
      legend: { display: false },
      layout: { padding },
      scales: {
        yAxes: [{ display: false }],
        xAxes: [
          {
            display: !!maxGridLines,
            gridLines: {
              drawBorder: false,
              borderDash: [4, 4],
              zeroLineBorderDash: [4, 4],
              color: "#FFFFFF29",
              zeroLineColor: "#FFFFFF29",
            },
            ticks: {
              callback: (
                value: number | string,
                index: number,
                values: number[] | string[]
              ) => {
                return moment(values[index])
                  .format("DD MMM YYYY")
                  .toUpperCase();
              },
              maxRotation: 0,
              maxTicksLimit: maxGridLines,
            },
          },
        ],
      },
      animation: { duration: 0 },
      hover: { animationDuration: 0, intersect: false },
      tooltips: {
        enabled: false,
        intersect: false,
        mode: "nearest",
      },
      onHover: (_: any, elements: any) => {
        if (elements && elements.length && hoverable) {
          const chartElem = elements[0];
          const chart = chartElem._chart;
          const ctx = chart.ctx;
          const chartIndex = chartElem._index;

          // draw line behind dot
          ctx.globalCompositeOperation = "destination-over";
          const x = chartElem._view.x;
          const topY = chart.scales["y-axis-0"].top;
          const bottomY = chart.scales["y-axis-0"].bottom;

          ctx.save();
          ctx.beginPath();
          ctx.setLineDash([5, 5]);
          ctx.moveTo(x, topY);
          ctx.lineTo(x, bottomY);
          ctx.lineWidth = 1;
          ctx.strokeStyle = "#ffffff";
          ctx.stroke();
          ctx.restore();

          // now we have to revert to the dot drawing above everything
          ctx.globalCompositeOperation = "source-over";

          if (onHover) {
            onHover({
              focused: true,
              xData: labels[chartIndex],
              yData: dataset[chartIndex],
              xPosition: x,
              index: chartIndex,
            });
          }
        } else {
          if (onHover) {
            onHover({ focused: false });
          }
        }
      },
    };
  }, [dataset, labels, hoverable, padding, onHover, maxGridLines]);

  const getData = useCallback(
    (canvas: any) => {
      const ctx = canvas.getContext("2d");
      let gradient = ctx.createLinearGradient(0, 0, 0, 250);
      gradient.addColorStop(0, gradientStartColor);
      gradient.addColorStop(1, gradientStopColor);

      const lineShouldDecay = lineDecayAfterPointIndex !== undefined;
      // Point color is all transparent, EXCEPT on lineDecayAfterPointIndex
      const pointBgColors = dataset.map((_, i) => {
        return i === lineDecayAfterPointIndex
          ? pointBackgroundColor
          : "rgba(0, 0, 0, 0)";
      });
      const pointBorderColors = dataset.map((_, i) => {
        return i === lineDecayAfterPointIndex
          ? decayedPointBorderColor
          : "rgba(0, 0, 0, 0)";
      });
      const sharedDatasetOptions = {
        type: "line",
        pointRadius: 6,
        pointHoverRadius: 6,
        pointBorderWidth: lineShouldDecay ? 8 : 1,
        pointHoverBorderWidth: lineShouldDecay ? 8 : 1,
        pointHitRadius: 20,
        pointBackgroundColor: pointBgColors,
        pointHoverBackgroundColor: lineShouldDecay
          ? pointBgColors
          : pointBackgroundColor,
        pointBorderColor: lineShouldDecay
          ? pointBorderColors
          : "rgba(0, 0, 0, 0)",
        pointHoverBorderColor: lineShouldDecay
          ? pointBorderColors
          : "rgba(0, 0, 0, 0)",
        tension: 0,
        fill: "start",
        backgroundColor: gradient,
        weight: 1,
        borderWidth: 2,
      };

      if (lineShouldDecay) {
        const datasetBeforeDecay = dataset.slice(
          0,
          lineDecayAfterPointIndex! + 1
        );
        // Dataset after decay should match the same length of the entire dataset
        // but with the empty datapoints being `null`
        let datasetAfterDecay: (number | null)[] = dataset.slice(
          lineDecayAfterPointIndex!,
          dataset.length
        );
        datasetAfterDecay = [
          ...Array.from({
            length: dataset.length - datasetAfterDecay.length,
          }).map(() => null),
          ...datasetAfterDecay,
        ];
        return {
          labels,
          datasets: [
            {
              ...sharedDatasetOptions,
              label: "dataset after decay",
              data: datasetAfterDecay,
              borderColor: decayedBorderColor,
            },
            {
              ...sharedDatasetOptions,
              label: "dataset before decay",
              data: datasetBeforeDecay,
              borderColor,
            },
          ],
        };
      }
      return {
        labels,
        datasets: [
          {
            ...sharedDatasetOptions,
            data: dataset,
            borderColor,
          },
        ],
      };
    },
    [
      dataset,
      labels,
      borderColor,
      decayedBorderColor,
      decayedPointBorderColor,
      gradientStartColor,
      gradientStopColor,
      pointBackgroundColor,
      lineDecayAfterPointIndex,
    ]
  );

  return <Line type="line" data={getData} options={options}></Line>;
};

export default PerformanceChart;
