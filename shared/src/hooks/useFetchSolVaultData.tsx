import { useState } from "react";
import {
  defaultV2VaultData,
  V2VaultData,
  V2VaultDataResponses,
} from "../models/vault";

const useFetchSolVaultData = (): V2VaultData => {
  const [data, setData] = useState<V2VaultData>(defaultV2VaultData);

  return data;
};

export default useFetchSolVaultData;
