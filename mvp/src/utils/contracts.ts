import web3 from "./web3";
import addresses from "../../../protocol/addresses.json";
import { DojimaInstrumentContract } from "../../../protocol/codegen/dojima_instrument";

export const dojimaInstrument = new DojimaInstrumentContract(
  addresses.contracts.dojimaInstrument,
  web3.currentProvider
);
