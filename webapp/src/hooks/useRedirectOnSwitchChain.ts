import { useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router";
import { Chains } from "shared/lib/constants/constants";
import { useChain } from "shared/lib/hooks/chainContext";
import useWeb3Wallet from "shared/lib/hooks/useWeb3Wallet";

const useRedirectOnSwitchChain = (selectedChain: Chains) => {
  const isHomePage = useRouteMatch({ path: "/", exact: true });
  const history = useHistory();
  const [currentChain] = useChain();
  const { active } = useWeb3Wallet();

  useEffect(() => {
    // This effect triggers when a user is connected (has an active provider)
    // If the selected chain is different from the current active chain,
    // The user will be redirected back to the homepage
    // (This is useful when a connected chain is in a vault that is on a different chain)
    const switchChains = currentChain && currentChain !== selectedChain;
    if (!isHomePage && switchChains && active) {
      setTimeout(() => {
        history.push("/");
      }, 500);
    }
  }, [currentChain, selectedChain, history, isHomePage, active]);
};

export default useRedirectOnSwitchChain;
