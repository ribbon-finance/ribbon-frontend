import React, { useCallback, useEffect } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js";
import moment from "moment";
import { ChartOptions } from "chart.js";

const options = {
  title: { display: false },
  legend: { display: false },
  scales: {
    yAxes: [
      {
        display: false,
      },
    ],
    xAxes: [{ display: false }],
  },
  hover: { animationDuration: 0, intersect: false },
  tooltips: {
    enabled: true,
    intersect: false,
    mode: "nearest",
  },
  onHover: (_: any, elements: any) => {
    if (elements && elements.length) {
      const chartElem = elements[0];
      const chart = chartElem._chart;
      const ctx = chart.ctx;
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
    }
  },
};

const PerformanceChart: React.FC<{
  borderColor?: string;
  gradientStartColor?: string;
  gradientStopColor?: string;
}> = ({
  borderColor = "#16CEB9",
  gradientStartColor = "rgba(121, 255, 203, 0.24)",
  gradientStopColor = "rgba(121, 255, 203, 0)",
}) => {
  const getData = useCallback(
    (canvas: any) => {
      const ctx = canvas.getContext("2d");
      let gradient = ctx.createLinearGradient(0, 0, 0, 250);
      gradient.addColorStop(0, gradientStartColor);
      gradient.addColorStop(1, gradientStopColor);

      const dataset = [3, 5, 2, 3, 5, 4, 3, 1, 4, 5, 7, 8.5, 8, 7.5];
      const now = moment(new Date());

      return {
        labels: dataset.map((_, index) =>
          now.add(index, "days").utc().toDate()
        ),
        datasets: [
          {
            data: dataset,
            type: "line",
            pointRadius: 8,
            pointBorderWidth: 1,
            pointHoverRadius: 8,
            pointHoverBorderWidth: 1,
            pointHitRadius: 20,
            pointBackgroundColor: "rgba(121, 255, 203, 0)",
            pointBorderColor: "rgba(121, 255, 203, 0)",
            pointHoverBackgroundColor: "rgba(121, 255, 203, 1)",
            pointHoverBorderColor: "rgba(121, 255, 203, 1)",
            tension: 0,
            fill: "start",
            borderColor,
            backgroundColor: gradient,
          },
        ],
      };
    },
    [borderColor, gradientStartColor, gradientStopColor]
  );

  return (
    <div>
      <Line data={getData} options={options as ChartOptions}></Line>
    </div>
  );
};
export default PerformanceChart;
