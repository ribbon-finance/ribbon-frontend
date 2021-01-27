import axios from "axios";

const API_URL = "https://gas.api.0x.org/source/median?output=eth_gas_station";

type APIResponse = {
  fast: number;
  average: number;
};

export async function getFastGasPrice() {
  const response = await axios.get(API_URL);
  const data: APIResponse = response.data;
  const gasPrice = Math.ceil(data.fast * 10 ** 8);
  return gasPrice;
}
