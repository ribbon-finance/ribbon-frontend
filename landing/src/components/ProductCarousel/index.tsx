import styled from "styled-components";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Title, BaseText, Button } from "../../designSystem";
import Product from "./Product";

const ProductCarouselContainer = styled(Container)`
  padding-top: 80px;
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
        <Product />
      </Row>
    </ProductCarouselContainer>
  );
};

export default ProductCarousel;
