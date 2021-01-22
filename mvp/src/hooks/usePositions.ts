import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import { IAggregatedOptionsInstrumentFactory } from "../codegen/IAggregatedOptionsInstrumentFactory";
import { InstrumentPosition } from "../models";

const usePositions = (instrumentAddress: string) => {
  const { library, account } = useWeb3React();
  const [positions, setPositions] = useState<InstrumentPosition[]>([]);

  const fetchPositions = useCallback(async () => {
    if (library && account) {
      const signer = library.getSigner();
      const instrument = IAggregatedOptionsInstrumentFactory.connect(
        instrumentAddress,
        signer
      );

      const positions = await instrument.getInstrumentPositions(account);
      setPositions(positions);
    }
  }, [library, account]);

  useEffect(() => {
    if (library && account) {
      fetchPositions();
    }
  }, [library, account]);

  return positions;
};

export default usePositions;
