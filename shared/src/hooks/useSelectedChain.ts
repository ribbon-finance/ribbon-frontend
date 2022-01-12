import { useGlobalState } from "../store/store";

export const useSelectedChain = () => {
  const [chain, setChain] = useGlobalState("chain");
  return [chain, setChain];
};
