import styled from "styled-components";
import Row from "react-bootstrap/Row";
import { Container } from "react-bootstrap";

import ProductCatalogue from "shared/lib/components/Product/ProductCatalogue";
import { VaultNameOptionMap } from "shared/lib/constants/constants";

import { Title } from "../../designSystem";

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
  return (
    <MainContainer fluid>
      <Row className="d-flex justify-content-center w-100 mx-0">
        <CarouselTitle>Our Products</CarouselTitle>
        <ProductCatalogue
          variant="landing"
          onVaultPress={(vault, version) =>
            window.open(
              `https://app.ribbon.finance/${
                version === "v1" ? "" : `${version}/`
              }theta-vault/${
                Object.keys(VaultNameOptionMap)[
                  Object.values(VaultNameOptionMap).indexOf(vault)
                ]
              }`
            )
          }
        />
      </Row>
    </MainContainer>
  );
};

export default ProductCarousel;
