import { useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router";
import usePrevious from "./usePrevious";

const useRedirectOnSwitchChain = (chainId: number | undefined) => {
  const isHomePage = useRouteMatch({ path: "/", exact: true });
  const history = useHistory();
  const prevChainId = usePrevious<number | undefined>(chainId);

  useEffect(() => {
    // If we have already connected our wallet, but we switch chains
    // We want to redirect users to home page
    const switchChains = prevChainId && prevChainId !== chainId;
    if (!isHomePage && switchChains) {
      setTimeout(() => {
        history.push("/");
      }, 500);
    }
  }, [prevChainId, chainId, history, isHomePage]);
};

export default useRedirectOnSwitchChain;
