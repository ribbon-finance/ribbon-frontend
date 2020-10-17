import { Web3JsV2Provider } from "ethereum-types";
import Web3 from "web3";
import addresses from "./addresses.json";
import { DojimaInstrumentContract } from "./codegen/dojima_instrument";

const infuraURL = "https://kovan.infura.io/v3/fbe1acc69f4e47fb83ef075cf795cf54";
const provider = new Web3.providers.HttpProvider(infuraURL);

export const dojimaInstrument = new DojimaInstrumentContract(
  addresses.contracts.dojimaInstrument,
  provider as Web3JsV2Provider
);
