import Banner from "shared/lib/components/Banner/Banner";
import { Chains } from "shared/lib/constants/constants";
import colors from "shared/lib/designSystem/colors";
import { useChain } from "shared/lib/hooks/chainContext";
import useConnectWalletModal from "shared/lib/hooks/useConnectWalletModal";

const BNBBanner: React.FC = () => {
  const [chain] = useChain();
  const isBnbChain = chain === Chains.Binance || chain === Chains.NotSelected;
  const [, setShowConnectModal] = useConnectWalletModal();
  return (
    <Banner
      color={colors.asset.WBNB}
      message="BNB Covered Call Vault is now live"
      onClick={() => (isBnbChain ? {} : setShowConnectModal(true))}
      linkURI={isBnbChain ? "/v2/theta-vault/T-BNB-C" : "/"}
      linkText="Start Depositing"
    />
  );
};

export default BNBBanner;
