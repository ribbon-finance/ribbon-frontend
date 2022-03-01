import { NETWORKS } from "../constants/constants";
import { CHAINID, isDevelopment } from "../utils/env";
import { SAVAXDepositHelperFactory } from "../codegen/SAVAXDepositHelperFactory";
import addresses from "../constants/externalAddresses.json";

export const depositSAVAX = async (library: any, amount: string) => {
  const network =
    NETWORKS[isDevelopment() ? CHAINID.AVAX_FUJI : CHAINID.AVAX_MAINNET];
  const helperAddress = (addresses[network] as any).sAvaxDepositHelper;
  const sAvaxDepositHelper = SAVAXDepositHelperFactory.connect(
    helperAddress,
    library.getSigner()
  );
  const res = await sAvaxDepositHelper.deposit({ value: amount });
  return { hash: res.hash };
};
