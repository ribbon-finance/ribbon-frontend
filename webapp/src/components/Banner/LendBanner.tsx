import { useMemo } from "react";
import Banner from "shared/lib/components/Banner/Banner";
import { URLS } from "shared/lib/constants/constants";
import colors from "shared/lib/designSystem/colors";
import { useHasLendPosition } from "./shared/lib/components/hooks/useHasLendPosition";
const LendBanner: React.FC = () => {
  const shouldShowBanner = useMemo(() => {
    return true;
  }, []);

  return shouldShowBanner ? (
    <Banner
      color={colors.green}
      message="Ribbon Lend is now live"
      linkURI={useHasLendPosition ? URLS.lendApp : URLS.lend}
      linkText="Start Lending"
      blink={true}
      linkOpensNewTab={true}
    />
  ) : null;
};

export default LendBanner;
