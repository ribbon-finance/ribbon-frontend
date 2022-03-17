import TemporaryStakingBanner from "shared/lib/components/Banner/TemporaryStakingBanner";

const StakingBanner: React.FC = () => {
  return (
    <TemporaryStakingBanner
      containerStyle={{ position: "relative" }}
      descriptionText="The liquidity mining program is now live. Stake your rTokens"
      link={{
        link: "/staking",
        text: "here",
        external: false,
      }}
    />
  );
};

export default StakingBanner;
