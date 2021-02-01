import React from "react";
import styled from "styled-components";
import { Row, Col } from "antd";
import CategoryCard from "./CategoryCard";

const CategoryContainer = styled.div`
  padding-bottom: 20px;
  text-align: center;
`;

const PreTitle = styled.p`
  color: #858585;
  font-family: "IBM Plex Mono", monospace;
  padding-top: 20px;
  font-size: 12px;
`;

const Title = styled.p`
  font-weight: bold;
  font-size: 16px;
`;

const Categories = () => {
  return (
    <CategoryContainer>
      <div>
        <Title>Explore Ribbon</Title>
      </div>
      <Row justify="space-around">
        <CategoryCard categoryID="volatility" />
        <CategoryCard categoryID="enhanced-yields" />
        <CategoryCard categoryID="principal-protection" />
        <CategoryCard categoryID="accumulation" />
      </Row>
    </CategoryContainer>
  );
};

export default Categories;
