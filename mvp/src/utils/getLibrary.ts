import { Web3Provider, JsonRpcProvider } from "@ethersproject/providers";

export function getMetamaskLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 15000;
  return library;
}

export function getInfuraLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 15000;
  return library;
}
