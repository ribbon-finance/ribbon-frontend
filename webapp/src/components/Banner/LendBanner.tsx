import { useMemo } from "react";
import Banner from "shared/lib/components/Banner/Banner";
import colors from "shared/lib/designSystem/colors";
import { useLendLink } from "shared/lib/hooks/useLendLink";
const LendBanner: React.FC = () => {
  const shouldShowBanner = useMemo(() => {
    return true;
  }, []);
  const lendLink = useLendLink();
  return shouldShowBanner ? (
    <Banner
      color={colors.green}
      message="Ribbon Lend is now live"
      linkURI={lendLink}
      linkText="Start Lending"
      blink={true}
      linkOpensNewTab={true}
    />
  ) : null;
};

export default LendBanner;
