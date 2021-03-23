import React, { useCallback } from "react";
import { Line } from "react-chartjs-2";

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
};

const PerformanceChart = () => {
  const getData = useCallback((canvas: any) => {
    const ctx = canvas.getContext("2d");
    let gradient = ctx.createLinearGradient(0, 0, 0, 250);
    gradient.addColorStop(0, "rgba(121, 255, 203, 0.24)");
    gradient.addColorStop(1, "rgba(121, 255, 203, 0)");

    const dataset = [3, 5, 2, 3, 5, 4, 3, 1, 4, 5, 7, 8.5, 8, 7.5];

    return {
      labels: dataset.map((_, index) => (index + 1).toString()),
      datasets: [
        {
          data: dataset,
          type: "line",
          pointRadius: 0,
          tension: 0,
          fill: "start",
          borderColor: "#16CEB9",
          backgroundColor: gradient,
        },
      ],
    };
  }, []);

  return (
    <div>
      <Line data={getData} options={options}></Line>
    </div>
  );
};
export default PerformanceChart;
