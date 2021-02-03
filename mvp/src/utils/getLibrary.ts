import { Web3Provider, InfuraProvider } from "@ethersproject/providers";

export function getInfuraLibrary(provider: any): Web3Provider {
  // const infuraProvider = new InfuraProvider(
  //   1,
  //   "0bccea5795074895bdb92c62c5c3afba"
  // ) as any;
  // const library = new Web3Provider(infuraProvider, "any");
  // library.pollingInterval = 15000;
  // return library;

  const library = new Web3Provider(provider, "any");
  library.pollingInterval = 15000;
  return library;
}

export function getDefaultLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider, "any");
  library.pollingInterval = 15000;
  return library;
}
