import React from "react";
import { Line } from "react-chartjs-2";

const options = {
  legend: {
    display: false
  },
  scales: {
    yAxes: [
      {
        scaleLabel: {
          display: true,
          labelString: "Return in USD"
        },
        ticks: {
          beginAtZero: true
        }
      }
    ],
    xAxes: [
      {
        scaleLabel: {
          display: true,
          labelString: "Settlement Price"
        }
      }
    ]
  }
};

type Props = {
  minPrice: number;
  maxPrice: number;
  strikePrice: number;
  stepSize: number;
  payoffAlgo: (inputPrice: number) => number;
};

const PayoffChart: React.FC<Props> = ({
  minPrice,
  maxPrice,
  strikePrice,
  stepSize,
  payoffAlgo
}) => {
  let labelNumbers = [];
  let curPrice = minPrice;

  while (curPrice <= maxPrice) {
    labelNumbers.push(curPrice);
    curPrice += stepSize;
  }
  const nearestStep = strikePrice - (strikePrice % stepSize);
  labelNumbers.splice(labelNumbers.indexOf(nearestStep) + 1, 0, strikePrice);

  const data = labelNumbers.map((price) => {
    const payoff = payoffAlgo(price);
    return payoff === -Infinity ? 0 : payoff;
  });

  const labels = labelNumbers.map((label) => label.toString());

  const chartData = {
    labels,
    datasets: [
      {
        lineTension: 0,
        label: "Return",
        data,
        fill: false,
        backgroundColor: "#689BFF",
        borderColor: "#689BFF"
      }
    ]
  };

  return (
    <div>
      <Line data={chartData} options={options}></Line>
    </div>
  );
};

export default PayoffChart;
