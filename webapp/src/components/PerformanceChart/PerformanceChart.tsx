import React from "react";
import { Line } from "react-chartjs-2";

const data = {
  labels: ["1", "2", "3", "4", "5", "6"],
  datasets: [
    {
      data: [12, 19, 3, 5, 2, 3],
      type: "line",
      pointRadius: 0,
      tension: 0,
      fill: "start",
      borderColor: "#16CEB9",
      //   background:
      //     "linear-gradient(180deg, rgba(121, 255, 203, 0.24) 0%, rgba(121, 255, 203, 0) 100%)",
      //   backgroundColor: "rgba(121, 255, 203, 0.24)",
    },
  ],
};

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
  return (
    <div>
      <Line data={data} options={options}></Line>
    </div>
  );
};
export default PerformanceChart;
