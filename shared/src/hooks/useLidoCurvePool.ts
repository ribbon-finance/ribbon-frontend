import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { CurveLidoPool, CurveLidoPool__factory } from "../codegen";
import { CurveLidoPoolAddress } from "../constants/constants";

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

  return lidoCurvePool;
};
export default useLidoCurvePool;
