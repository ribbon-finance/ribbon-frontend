import { useWeb3React } from "@web3-react/core";
import React from "react";
import { useHistory } from "react-router";
import Banner from "shared/lib/components/Banner/Banner";

import ProductCatalogue from "shared/lib/components/Product/ProductCatalogue";
import { CHAINID } from "shared/lib/utils/env";
import { Title } from "shared/lib/designSystem";
import sizes from "shared/lib/designSystem/sizes";
import styled from "styled-components";
import { ANNOUNCEMENT, getVaultURI } from "../../constants/constants";
import { switchChains } from "shared/lib/utils/chainSwitching";

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
  const { library, chainId } = useWeb3React();
  return (
    <>
      <ProductTitle>PRODUCT</ProductTitle>
      {ANNOUNCEMENT && chainId && chainId !== CHAINID.AVAX_MAINNET && (
        <Banner
          color={ANNOUNCEMENT.color}
          message={ANNOUNCEMENT.message}
          linkText={ANNOUNCEMENT.linkText}
          linkURI={ANNOUNCEMENT.linkURI}
          onClick={() => {
            (async () => {
              if (library) {
                await switchChains(library, CHAINID.AVAX_MAINNET);
              }
            })();
          }}
        ></Banner>
      )}
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
