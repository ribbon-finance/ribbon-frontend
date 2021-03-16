import React, { useState } from "react";
import styled from "styled-components";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Title, PrimaryText, Button, BaseText } from "../../designSystem";
import { Container } from "react-bootstrap";
import ShapeA from "../../img/ShapeA.svg";

const MainContainer = styled(Container)`
  padding-bottom: 80px;
`;

const ProductFeatureTitle = styled(Title)`
  font-size: 64px;
  line-height: 80px;
  text-align: center;
`;

const ProductFeatureRow = styled(Row)`
  height: 584px;
  background-image: url(${ShapeA});
  background-repeat: no-repeat;
  background-position: center;
`;

const ProductFeature = () => {
  return (
    <MainContainer>
      <ProductFeatureRow className="d-flex justify-content-center align-items-center">
        <ProductFeatureTitle>Lorem ipsum dolor sit</ProductFeatureTitle>
      </ProductFeatureRow>
    </MainContainer>
  );
};

export default ProductFeature;
