import { StrikeSelection__factory } from "../codegen/factories/StrikeSelection__factory";

export const getStrikeSelectionContract = (
  library: any,
  address: string,
  useSigner: boolean = true
) => {
  const provider = useSigner ? library.getSigner() : library;
  return StrikeSelection__factory.connect(address, provider);
};

export default getStrikeSelectionContract;
