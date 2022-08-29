import styled from "styled-components";
import Row from "react-bootstrap/Row";
import { Container } from "react-bootstrap";

import ProductCatalogue from "shared/lib/components/Product/ProductCatalogue";
import {
  VaultNameOptionMap,
  VaultOptions,
  VaultVersion,
} from "shared/lib/constants/constants";

import { Title } from "../../designSystem";
import { useCallback } from "react";

const MainContainer = styled(Container)`
  padding-top: 80px;
  padding-bottom: 80px;
`;

const CarouselTitle = styled(Title)`
  font-size: 24px;
  line-height: 32px;
  margin-bottom: 64px;
`;

const ProductCarousel = () => {
  const getVaultUrl = useCallback(
    (vault: VaultOptions, version: VaultVersion) => {
      const base = "https://app.ribbon.finance";
      const vaultName =
        Object.keys(VaultNameOptionMap)[
          Object.values(VaultNameOptionMap).indexOf(vault)
        ];
      switch (version) {
        case "v1":
        case "v2":
          return `${base}/${
            version === "v1" ? "" : version
          }/theta-vault/${vaultName}`;
        case "earn":
          return `${base}/${vaultName}`;
        default:
          break;
      }
    },
    []
  );

  return (
    <MainContainer fluid>
      <Row className="d-flex justify-content-center w-100 mx-0">
        <CarouselTitle>Our Products</CarouselTitle>
        <ProductCatalogue
          variant="landing"
          onVaultPress={(vault, version) =>
            window.open(getVaultUrl(vault, version))
          }
        />
      </Row>
    </MainContainer>
  );
};

export default ProductCarousel;
