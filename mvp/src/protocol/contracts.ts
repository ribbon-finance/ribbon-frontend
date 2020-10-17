import { Web3JsProvider } from "ethereum-types";
import Web3 from "web3";
import web3 from "../utils/web3";
import addresses from "./addresses.json";
import { DojimaInstrumentContract } from "./codegen/dojima_instrument";

export const dojimaInstrument = new DojimaInstrumentContract(
  addresses.contracts.dojimaInstrument,
  web3.currentProvider as Web3JsProvider
);
