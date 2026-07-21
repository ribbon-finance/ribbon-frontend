import { BigNumber } from "@ethersproject/bignumber";
import { formatUnits } from "@ethersproject/units";
import { useContext } from "react";

import { Web3DataContext } from "./web3DataContext";

const useLidoAPY = () => {
  const contextData = useContext(Web3DataContext);
  const preTotalPooledEther = parseFloat(
    formatUnits(contextData.lidoOracle.data.preTotalPooledEther, 18)
  );
  const postTotalPooledEther = parseFloat(
    formatUnits(contextData.lidoOracle.data.postTotalPooledEther, 18)
  );
  const secondsInYear = 60 * 60 * 24 * 365;

  if (
    contextData.lidoOracle.loading ||
    contextData.lidoOracle.data.preTotalPooledEther.eq(BigNumber.from(0))
  ) {
    return 0;
  }

  return (
    ((postTotalPooledEther - preTotalPooledEther) * secondsInYear) /
    (preTotalPooledEther * contextData.lidoOracle.data.timeElapsed)
  );
};

export default useLidoAPY;
