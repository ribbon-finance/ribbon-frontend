import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";

import { useWeb3Context } from "shared/lib/hooks/web3Context";

type UseLBPPool = () => null;

const useLBPPool: UseLBPPool = () => {
  const { library, active } = useWeb3React();
  const { provider } = useWeb3Context();
  const [pool] = useState(null);

  useEffect(() => {
    // const vault = getLBPPool(library || provider, active);
    // setPool(vault);
  }, [active, library, provider]);

  return pool;
};
export default useLBPPool;
