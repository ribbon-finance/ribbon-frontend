import axios from "axios";
import { useCallback, useEffect, useState } from "react";

const API_URL = "https://gas.api.0x.org/source/median?output=eth_gas_station";

type APIResponse = {
  fast: number;
  average: number;
};

const useGasPrice = () => {
  const [gasPrice, setGasPrice] = useState(0);

  const fetchGasPrice = useCallback(async () => {
    const response = await axios.get(API_URL);
    const data: APIResponse = response.data;
    const gasPrice = Math.floor(data.average * 10 ** 8);
    setGasPrice(gasPrice);
  }, []);

  useEffect(() => {
    fetchGasPrice();
  });
  return gasPrice;
};
export default useGasPrice;
