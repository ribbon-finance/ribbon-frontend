import { useGlobalState } from "../store/store";
import { PendingTransaction } from "../store/types";

const usePendingTransactions: () => [
  PendingTransaction[],
  (u: React.SetStateAction<PendingTransaction[]>) => void
] = () => {
  const [pendingTransactions, setPendingTransactions] = useGlobalState(
    "pendingTransactions"
  );
  return [pendingTransactions, setPendingTransactions];
};

export default usePendingTransactions;
