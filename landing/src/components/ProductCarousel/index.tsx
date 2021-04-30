import styled from "styled-components";
import Row from "react-bootstrap/Row";
import { Container } from "react-bootstrap";

import Product from "shared/lib/components/Product/ProductCarousel";
import { VaultNameOptionMap } from "shared/lib/constants/constants";

import { Title } from "../../designSystem";

const ProductCarouselContainer = styled(Container)`
  padding-top: 160px;
  padding-bottom: 80px;
`;

const CarouselTitle = styled(Title)`
  font-size: 24px;
  line-height: 32px;
`;

const ProductCarousel = () => {
  return (
    <ProductCarouselContainer>
      <Row className="d-flex justify-content-center">
        <CarouselTitle>Our Products</CarouselTitle>
        <Product
          dynamicMargin={false}
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
