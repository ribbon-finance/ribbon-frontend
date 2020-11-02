import React, { useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import styled from "styled-components";

const defaultLabelOptions = {
  display: true,
  fontStyle: "bold",
  fontFamily: "Roboto",
  fontColor: "#000000"
};

const options = {
  legend: {
    display: false
  },
  scales: {
    yAxes: [
      {
        scaleLabel: {
          ...defaultLabelOptions,
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
          ...defaultLabelOptions,
          labelString: "Settlement Price"
        }
      }
    ]
  }
};

const Layout = styled.div`
  display: flex;
  flex: 45%;
  justify-content: flex-start;
  padding-top: 40px; ;
`;

const ChartContainer = styled.div`
  width: 30vw;
  height: 20vh;
`;

type Props = {
  minPrice: number;
  maxPrice: number;
  strikePrice: number;
  stepSize: number;
  renderDelay?: number;
  payoffAlgo: (inputPrice: number) => number;
};

const PayoffChart: React.FC<Props> = ({
  minPrice,
  maxPrice,
  strikePrice,
  stepSize,
  payoffAlgo,
  renderDelay = 300 //ms
}) => {
  const [labels, setLabels] = useState<string[]>([]);
  const [data, setData] = useState<number[]>([]);

  const [memoizedLabels, memoizedData] = useMemo(() => {
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
    return [labels, data];
  }, [minPrice, maxPrice, strikePrice, stepSize, payoffAlgo]);

  // add a delay for every re-render
  useEffect(() => {
    setTimeout(() => {
      setLabels(memoizedLabels);
      setData(memoizedData);
    }, renderDelay);
  }, [memoizedLabels, memoizedData, renderDelay, payoffAlgo]);

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
    <Layout>
      <ChartContainer>
        <Line data={chartData} options={options}></Line>
      </ChartContainer>
    </Layout>
  );
};

export default PayoffChart;
