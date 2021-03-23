import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import moment from "moment";
import { ChartOptions } from "chart.js";

const PerformanceChart: React.FC = () => {
  const dataset = [3, 5, 2, 3, 5, 4, 3, 1, 4, 5, 7, 8.5, 8, 7.5];
  const now = moment(new Date());
  const labels = dataset.map((_, index) =>
    now.add(index, "days").utc().toDate()
  );
  const [performance, setPerformance] = useState<number>(
    dataset[dataset.length - 1]
  );
  const [date, setDate] = useState<Date>(labels[labels.length - 1]);

  const chart = useMemo(
    () => (
      <Chart
        dataset={dataset}
        labels={labels}
        setPerformance={setPerformance}
        setDate={setDate}
      ></Chart>
    ),
    []
  );

  return <div>{chart}</div>;
};

const Chart: React.FC<{
  dataset: number[];
  labels: Date[];
  setPerformance: (performance: number) => void;
  setDate: (date: Date) => void;
  borderColor?: string;
  gradientStartColor?: string;
  gradientStopColor?: string;
}> = ({
  dataset,
  labels,
  setPerformance,
  setDate,
  borderColor = "#16CEB9",
  gradientStartColor = "rgba(121, 255, 203, 0.24)",
  gradientStopColor = "rgba(121, 255, 203, 0)",
}) => {
  const options = useMemo(
    () => ({
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
      hover: { animationDuration: 0, intersect: false },
      tooltips: {
        enabled: false,
        intersect: false,
        mode: "nearest",
        custom: (tooltipModel: any) => {},
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

          setPerformance(dataset[chartElem._index]);
          setDate(labels[chartElem._index]);
        }
      },
    }),
    [setPerformance, setDate]
  );

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

  return <Line data={getData} options={options as ChartOptions}></Line>;
};

export default PerformanceChart;
