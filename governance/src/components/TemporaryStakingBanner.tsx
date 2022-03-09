import Banner from "shared/lib/components/Banner/Banner";
import colors from "shared/lib/designSystem/colors";

// Temporary banner to point user to staking page
// Once voting/delegation is activated, we won't need this component anymore,
// and can be removed
const TemporaryStakingBanner: React.FC = () => {
  return (
    <Banner
      color={colors.red}
      message="The liquidity mining program is now live. Stake your rTokens at"
      linkURI="https://app.ribbon.finance/staking"
      linkText="app.ribbon.finance"
    />
  );
};

export default TemporaryStakingBanner;
