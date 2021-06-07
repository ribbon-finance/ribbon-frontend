import React from "react";
import { useHistory } from "react-router";

import ProductCarousel from "shared/lib/components/Product/ProductCarousel";
import { VaultNameOptionMap } from "shared/lib/constants/constants";
import { Title } from "shared/lib/designSystem";
import sizes from "shared/lib/designSystem/sizes";
import styled from "styled-components";

const ProductTitle = styled(Title)`
  display: none;
  font-size: 24px;
  text-align: center;
  margin-top: 16px;

  @media (max-width: ${sizes.md}px) {
    display: block;
  }
`;

const Homepage = () => {
  const history = useHistory();
  return (
    <>
      <ProductTitle>PRODUCT</ProductTitle>
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
