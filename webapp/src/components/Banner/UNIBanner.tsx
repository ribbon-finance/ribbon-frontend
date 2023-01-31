import Banner from "shared/lib/components/Banner/Banner";
import colors from "shared/lib/designSystem/colors";

const UNIBanner: React.FC = () => {
  return (
    <Banner
      color={colors.asset.UNI}
      message="UNI Covered Call Vault is now live"
      linkURI="/v2/theta-vault/T-UNI-C"
      linkText="Start Depositing"
    />
  );
};

export default UNIBanner;
