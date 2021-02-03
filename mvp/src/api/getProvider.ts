import dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config();

export default function getProvider() {
  return new ethers.providers.WebSocketProvider(
    process.env.API_MAINNET_URI as string
  );
}
