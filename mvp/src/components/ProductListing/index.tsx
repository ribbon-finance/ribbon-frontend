import React from "react";
import styled from "styled-components";
import { Row, Col } from "antd";
import { Title, PrimaryText } from "../../designSystem";
import StraddleCard from "./StraddleCard";
import { useDefaultProduct } from "../../hooks/useProducts";

const ProductContainer = styled.div`
  padding-bottom: 50px;
`;

const ProductTitleContainer = styled.div`
  padding-bottom: 10px;
`;

const ProductDescriptionContainer = styled.div`
  padding-bottom: 30px;
`;

const ProductDescription: React.FC<{ productName: string }> = ({
  productName,
}) => {
  let description = null;
  switch (productName) {
    case "ETH Straddle":
      description = (
        <PrimaryText>
          Bet that ETH will be increasingly volatile over some period of time.{" "}
          <br></br>The greater ETH moves from today’s price in either direction,
          the more money you will make.<br></br>The further out the expiry is,
          the greater the ETH price will need to move to breakeven.
        </PrimaryText>
      );
      break;
  }

  return description;
};

const ProductListing: React.FC = () => {
  const product = useDefaultProduct();

  return (
    <ProductContainer>
      <ProductTitleContainer>
        <Title>
          {product.name} {product.emoji}
        </Title>
      </ProductTitleContainer>

      <ProductDescriptionContainer>
        <ProductDescription productName={product.name}></ProductDescription>
      </ProductDescriptionContainer>

      <Row justify="space-between">
        {product.instruments.map((instrument) => (
          <Col
            key={instrument.address}
            span={18 / Math.floor(product.instruments.length)}
          >
            <StraddleCard straddle={instrument}></StraddleCard>
          </Col>
        ))}
      </Row>
    </ProductContainer>
  );
};

export default ProductListing;
