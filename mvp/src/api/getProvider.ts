import dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config();

export default function getProvider() {
  return new ethers.providers.JsonRpcProvider(process.env.MAINNET_URI);
}
