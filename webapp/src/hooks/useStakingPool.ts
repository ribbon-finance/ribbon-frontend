import { useState } from "react";

import { VaultOptions } from "shared/lib/constants/constants";

// TODO:
const initialData = {
  currentStake: 26,
  poolSize: 5000,
  expectedYield: 24.1,
  claimableRbn: 0,
};

const useStakingPool = (option: VaultOptions) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  return { data, loading };
};

export default useStakingPool;
