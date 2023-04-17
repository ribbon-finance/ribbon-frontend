import Banner from "shared/lib/components/Banner/Banner";
import colors from "shared/lib/designSystem/colors";

const REarnBanner: React.FC = () => {
  return (
    <Banner
      color={colors.asset.USDC}
      message="Ribbon Earn USDC is now live"
      linkURI="/earn/R-EARN"
      linkText="Start Depositing"
    />
  );
};

export default REarnBanner;
