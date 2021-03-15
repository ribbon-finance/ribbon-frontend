import styled from "styled-components";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Title, BaseText, Button } from "../../designSystem";
import ShapeA from "../../img/ShapeA.svg";

const ProductContainer = styled(Container)`
  padding-top: 20px;
  padding-bottom: 20px;
`;

const InfoContainer = styled.div`
  text-align: center;
  width: 200px;
  height: 32px;
  background-color: rgba(29, 34, 45, 0.6);
  border-radius: 4px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const InfoText = styled(BaseText)`
  font-size: 11px;
  line-height: 16px;
  text-align: center;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #ffffff;
`;

const ProductTitle = styled(Title)`
  font-size: 96px;
  line-height: 104px;
  text-align: center;
  text-transform: capitalize;
  color: #ffffff;
`;

const ProductSubtitle = styled(BaseText)`
  font-size: 16px;
  line-height: 24px;
  text-transform: capitalize;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
`;

const ProductCardContainer = styled.div`
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
  width: 100%;
`;

const ProductCard = styled.div`
  width: 200px;
  height: 100%;
  left: 100px;
  top: 144px;
  background: rgba(252, 10, 84, 0.24);
  border-radius: 8px;
`;

const ProductImage = styled.img`
  width: 150px;
`;

const ProductButton = styled(Button)`
  width: 200px;
  border: 1px solid #ffffff;
  border-radius: 8px;
  background-color: transparent;
`;

const ButtonText = styled(BaseText)`
  font-weight: 600;
  font-size: 16px;
  text-align: center;
  letter-spacing: 1.5px;
  text-transform: capitalize;
  color: #ffffff;
`;

const Product = () => {
  return (
    <ProductContainer>
      <Row className="d-flex justify-content-center">
        <InfoContainer className="d-flex justify-content-center align-items-center">
          <InfoText>Yield Series</InfoText>
        </InfoContainer>
      </Row>

      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ position: "relative", height: 320 }}
      >
        <Container>
          <Row className="d-flex justify-content-center align-items-center">
            <ProductTitle>Y-100E</ProductTitle>
          </Row>
          <Row className="d-flex justify-content-center align-items-center">
            <ProductSubtitle>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit ut{" "}
              <br></br>
              aliquam, purus sit amet luctus venenatis
            </ProductSubtitle>
          </Row>
        </Container>

        <ProductCardContainer className="d-flex justify-content-center">
          <ProductCard className="d-flex justify-content-center align-items-center">
            <ProductImage src={ShapeA} />
          </ProductCard>
        </ProductCardContainer>
      </Container>

      <Row className="d-flex justify-content-center">
        <InfoContainer className="d-flex justify-content-center align-items-center">
          <InfoText>30% APY</InfoText>
        </InfoContainer>
      </Row>

      <Row className="d-flex justify-content-center">
        <ProductButton>
          <ButtonText>View</ButtonText>
        </ProductButton>
      </Row>
    </ProductContainer>
  );
};

export default Product;
