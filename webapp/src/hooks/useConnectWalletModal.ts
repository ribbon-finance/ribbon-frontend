import { useGlobalState } from "shared/lib/store/store";

const useConnectWalletModal: () => [
  boolean,
  (u: React.SetStateAction<boolean>) => void
] = () => {
  const [showConnectWallet, setShowConnectWallet] = useGlobalState(
    "showConnectWallet"
  );
  return [showConnectWallet, setShowConnectWallet];
};

export default useConnectWalletModal;
