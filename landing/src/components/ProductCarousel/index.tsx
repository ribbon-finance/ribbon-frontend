import styled from "styled-components";
import Row from "react-bootstrap/Row";
import { Container } from "react-bootstrap";
import { Title } from "../../designSystem";
import Product from "shared/lib/components/Product/ProductCarousel";

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
          onVaultPress={() => window.open("https://app.ribbon.finance")}
        />
      </Row>
    </ProductCarouselContainer>
  );
};

export default ProductCarousel;
