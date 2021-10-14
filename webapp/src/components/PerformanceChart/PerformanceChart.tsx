import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { Line } from "react-chartjs-2";
import { ChartOptions } from "chart.js";
import moment from "moment";

import { HoverInfo } from "./types";
import { SecondaryText } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";

const PerformanceChartContainer = styled.div`
  width: 100%;
`;

interface PerformanceChartProps {
  dataset: number[];
  labels: Date[];
  extras?: React.ReactNode;
  onChartHover: (hoverInfo: HoverInfo) => void;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  dataset,
  labels,
  extras,
  onChartHover,
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
      <Chart dataset={dataset} labels={labels} onHover={handleChartHover} />
    ),
    [dataset, labels, handleChartHover]
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
  onHover: (hoverInfo: HoverInfo) => void;
  borderColor?: string;
  gradientStartColor?: string;
  gradientStopColor?: string;
  pointBackgroundColor?: string;
}> = ({
  dataset,
  labels,
  onHover,
  borderColor = colors.green,
  gradientStartColor = `${colors.green}3D`,
  gradientStopColor = `${colors.green}00`,
  pointBackgroundColor = colors.green,
}) => {
  const options = useMemo((): ChartOptions => {
    return {
      maintainAspectRatio: false,
      title: { display: false },
      legend: { display: false },
      layout: { padding: { top: 20, bottom: 20 } },
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

          onHover({
            focused: true,
            xData: labels[chartIndex],
            yData: dataset[chartIndex],
            xPosition: x,
            index: chartIndex,
          });
        } else {
          onHover({ focused: false });
        }
      },
    };
  }, [dataset, labels, onHover]);

  const getData = useCallback(
    (canvas: any) => {
      const ctx = canvas.getContext("2d");
      let gradient = ctx.createLinearGradient(0, 0, 0, 250);
      gradient.addColorStop(0, gradientStartColor);
      gradient.addColorStop(1, gradientStopColor);

      return {
        labels,
        datasets: [
          {
            data: dataset,
            type: "line",
            pointRadius: 8,
            pointBorderWidth: 1,
            pointHoverRadius: 8,
            pointHoverBorderWidth: 1,
            pointHitRadius: 20,
            pointBackgroundColor: "rgba(0, 0, 0, 0)",
            pointBorderColor: "rgba(0, 0, 0, 0)",
            pointHoverBackgroundColor: pointBackgroundColor,
            pointHoverBorderColor: pointBackgroundColor,
            tension: 0,
            fill: "start",
            borderColor,
            backgroundColor: gradient,
          },
        ],
      };
    },
    [
      dataset,
      labels,
      borderColor,
      gradientStartColor,
      gradientStopColor,
      pointBackgroundColor,
    ]
  );

  return <Line type="line" data={getData} options={options}></Line>;
};

export default PerformanceChart;
