import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import { CurveLidoPool, CurveLidoPool__factory } from "../codegen";
import { CurveLidoPoolAddress } from "../constants/constants";
import { BigNumberish } from "ethers";

export const getLidoCurvePool = (library: any) => {
  if (library) {
    const provider = library.getSigner();
    return CurveLidoPool__factory.connect(CurveLidoPoolAddress, provider);
  }

  return undefined;
};

const useLidoCurvePool = () => {
  const { library, active } = useWeb3React();
  const [lidoCurvePool, setLidoCurvePool] = useState<CurveLidoPool>();

  useEffect(() => {
    const pool = getLidoCurvePool(library);
    setLidoCurvePool(pool);
  }, [active, library]);

  const getEncodedExchangeData = useCallback(
    (
      i: BigNumberish,
      j: BigNumberish,
      dx: BigNumberish,
      min_dy: BigNumberish
    ) => {
      return CurveLidoPool__factory.createInterface().encodeFunctionData(
        "exchange",
        [i, j, dx, min_dy]
      );
    },
    []
  );

  return {
    contract: lidoCurvePool,
    getEncodedExchangeData
  };
};
export default useLidoCurvePool;
