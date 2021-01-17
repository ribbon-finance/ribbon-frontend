import { IProtocolAdapter } from "../codegen/IProtocolAdapter";
import { IProtocolAdapterFactory } from "../codegen/IProtocolAdapterFactory";
import { IRibbonFactoryFactory } from "../codegen/IRibbonFactoryFactory";
import deployments from "../constants/deployments.json";
import getProvider from "./getProvider";

export async function getAdapters() {
  const provider = getProvider();

  const factory = IRibbonFactoryFactory.connect(
    deployments.mainnet.RibbonFactory,
    provider
  );
  return await factory.getAdapters();
}

export async function getAdapter(name: string) {
  const provider = getProvider();

  const factory = IRibbonFactoryFactory.connect(
    deployments.mainnet.RibbonFactory,
    provider
  );
  const adapterAddress = await factory.getAdapter(name);
  return IProtocolAdapterFactory.connect(adapterAddress, provider);
}
