import { RibbonLendVault__factory } from "../codegen/factories/RibbonLendVault__factory";

export const getLendContract = (
  library: any,
  pool: string,
  useSigner: boolean = true
) => {
  const provider = useSigner ? library.getSigner() : library;

  return RibbonLendVault__factory.connect(pool, provider);
};
