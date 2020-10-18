import { useContext, useEffect, useState } from "react";
import addresses from "../abis/addresses.json";
import DojimaInstrumentABI from "../abis/DojimaInstrument.json";
import { Web3Context } from "../components/Web3Wrapper";

export const getContracts = (web3) => {
  return {
    dojimaInstrument: new web3.eth.Contract(
      DojimaInstrumentABI,
      addresses.contracts.dojimaInstrument
    ),
  };
};

export const useContracts = () => {
  const { web3 } = useContext(Web3Context);
  const [contracts, setContracts] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (web3 !== null) {
      setContracts(getContracts(web3));
      setLoaded(true);
    }
  }, [web3]);

  return { contracts, loaded };
};
