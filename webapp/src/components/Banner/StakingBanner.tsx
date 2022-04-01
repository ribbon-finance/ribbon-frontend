import { useMemo } from "react";
import Banner from "shared/lib/components/Banner/Banner";
import colors from "shared/lib/designSystem/colors";
import useWeb3Wallet from "shared/lib/hooks/useWeb3Wallet";
import {
  useAllLiquidityGaugeV5PoolsData,
  useV2VaultsData,
} from "shared/lib/hooks/web3DataContext";

const StakingBanner: React.FC = () => {
  const { account } = useWeb3Wallet();
  const { data: v2Vaults, loading: v2VaultsLoading } = useV2VaultsData();
  const { data: gaugeData, loading: gaugeDataLoading } =
    useAllLiquidityGaugeV5PoolsData();

  // Only shows banner when user has rToken but have never staked
  const shouldShowBanner = useMemo(() => {
    if (
      !account ||
      !v2Vaults ||
      !gaugeData ||
      v2VaultsLoading ||
      gaugeDataLoading
    ) {
      return false;
    }

    // If already staked, dont show banner.
    const haveStaked = Object.values(gaugeData).some((gauge) =>
      gauge.currentStake.gt(0)
    );
    if (haveStaked) {
      return false;
    }

    // If not staked, and never deposited, dont show banner
    const haveDeposits = Object.values(v2Vaults).some((vault) =>
      vault.totalBalance.gt(0)
    );
    if (!haveDeposits) {
      return false;
    }

    return true;
  }, [account, v2Vaults, gaugeData, gaugeDataLoading, v2VaultsLoading]);

  return shouldShowBanner ? (
    <Banner
      color={colors.green}
      message="The liquidity mining program is live. Stake your rTokens to earn RBN rewards."
      linkURI="/staking"
      linkText="Start Staking"
    />
  ) : null;
};

export default StakingBanner;
