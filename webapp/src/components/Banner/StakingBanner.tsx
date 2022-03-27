import Banner from "shared/lib/components/Banner/Banner";
import colors from "shared/lib/designSystem/colors";

const StakingBanner: React.FC = () => {
  return (
    <Banner
      color={colors.green}
      message="The liquidity mining program is live. Stake your rTokens to earn RBN rewards."
      linkURI="/staking"
      linkText="Start Staking"
    />
  );
};

export default StakingBanner;
