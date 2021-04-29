import { useGlobalState } from "shared/lib/store/store";
import { PendingTransaction } from "shared/lib/store/types";

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
