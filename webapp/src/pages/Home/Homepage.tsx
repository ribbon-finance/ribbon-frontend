import React from "react";
import { useHistory } from "react-router";

import ProductCarousel from "shared/lib/components/Product/ProductCarousel";
import { VaultNameOptionMap } from "shared/lib/constants/constants";

const Homepage = () => {
  const history = useHistory();
  return (
    <>
      <ProductCarousel
        dynamicMargin={true}
        onVaultPress={(vault) =>
          history.push(
            `/theta-vault/${
              Object.keys(VaultNameOptionMap)[
                Object.values(VaultNameOptionMap).indexOf(vault)
              ]
            }`
          )
        }
      />
    </>
  );
};

export default Homepage;
