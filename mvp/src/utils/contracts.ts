import web3 from "./web3";
import { AbiItem } from "web3-utils";
import addresses from "../../../protocol/addresses.json";
import dojimaInstrument from "../../../protocol/DojimaInstrument.json";

const instrumentAddress = addresses.contracts.dojimaInstrument;

const contracts = {
  instrument: new web3.eth.Contract(
    dojimaInstrument.abi as AbiItem,
    instrumentAddress
  ),
};
export default contracts;
