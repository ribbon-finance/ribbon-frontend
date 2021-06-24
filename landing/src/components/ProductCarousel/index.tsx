import styled from "styled-components";
import Row from "react-bootstrap/Row";
import { Container } from "react-bootstrap";

import ProductCatalogue from "shared/lib/components/Product/ProductCatalogue";
import { VaultNameOptionMap } from "shared/lib/constants/constants";

import { Title } from "../../designSystem";

const ProductCarouselContainer = styled(Container)`
  padding-top: 160px;
  padding-bottom: 80px;
`;

const CarouselTitle = styled(Title)`
  font-size: 24px;
  line-height: 32px;
  margin-bottom: 64px;
`;

const ProductCarousel = () => {
  return (
    <ProductCarouselContainer fluid>
      <Row className="d-flex justify-content-center">
        <CarouselTitle>Our Products</CarouselTitle>
        <ProductCatalogue
          variant="landing"
          onVaultPress={(vault) =>
            window.open(
              `https://app.ribbon.finance/theta-vault/${
                Object.keys(VaultNameOptionMap)[
                  Object.values(VaultNameOptionMap).indexOf(vault)
                ]
              }`
            )
          }
        />
      </Row>
    </ProductCarouselContainer>
  );
};

export default ProductCarousel;
