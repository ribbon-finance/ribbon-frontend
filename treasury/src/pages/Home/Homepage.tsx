import React from "react";
import { useHistory } from "react-router";

import ProductCatalogue from "shared/lib/components/Product/ProductCatalogue";
import { Title } from "shared/lib/designSystem";
import sizes from "shared/lib/designSystem/sizes";
import styled from "styled-components";
import { getVaultURI } from "../../constants/constants";

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
      <ProductCatalogue
        variant="webapp"
        onVaultPress={(vault, version) =>
          history.push(getVaultURI(vault, version))
        }
      />
    </>
  );
};

export default Homepage;
