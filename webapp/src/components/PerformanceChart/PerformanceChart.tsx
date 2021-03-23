import React, { useCallback } from "react";
import { Line } from "react-chartjs-2";
import moment from "moment";

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
  tooltips: {
    enabled: true,
    intersect: false,
    mode: "nearest",
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
            pointRadius: 0,
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
      <Line data={getData} options={options}></Line>
    </div>
  );
};
export default PerformanceChart;
