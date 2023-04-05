import Banner from "shared/lib/components/Banner/Banner";
import colors from "shared/lib/designSystem/colors";

const BNBBanner: React.FC = () => {
  return (
    <Banner
      color={colors.asset.WBNB}
      message="BNB Covered Call Vault is now live"
      linkURI="/v2/theta-vault/T-BNB-C"
      linkText="Start Depositing"
    />
  );
};

export default BNBBanner;
