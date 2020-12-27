import React from "react";
import styled from "styled-components";
import { Row, Col } from "antd";
import { Title, PrimaryText } from "../../designSystem";
import { Product } from "../../models";
import StraddleCard from "./StraddleCard";

const ProductContainer = styled.div`
  padding-bottom: 50px;
`;

const ProductTitleContainer = styled.div`
  padding-bottom: 10px;
`;

const ProductDescriptionContainer = styled.div`
  padding-bottom: 30px;
`;

type Props = {
  product: Product;
};

const productDescription = (name: string) => {
  var description;
  switch (name) {
    case "ETH Straddle":
      description = (
        <PrimaryText>
          Bet that ETH will be volatile over some period of time. <br></br>The
          further ETH moves from today’s price, the more money you stand to
          make.
        </PrimaryText>
      );
      break;
  }

  return description;
};

const ProductListing: React.FC<Props> = ({ product }) => {
  return (
    <ProductContainer>
      <ProductTitleContainer>
        <Title>{product.name}</Title>
      </ProductTitleContainer>

      <ProductDescriptionContainer>
        {productDescription(product.name)}
      </ProductDescriptionContainer>

      <Row justify="space-between">
        <Col span={6}>
          <StraddleCard straddle={product.instruments[0]}></StraddleCard>
        </Col>
        <Col span={6}>
          <StraddleCard straddle={product.instruments[0]}></StraddleCard>
        </Col>
        <Col span={6}>
          <StraddleCard straddle={product.instruments[0]}></StraddleCard>
        </Col>
      </Row>
    </ProductContainer>
  );
};

export default ProductListing;
