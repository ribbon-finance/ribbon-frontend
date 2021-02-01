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
        <CategoryCard text="Volatility" color={"#2300F9"} icon="lineChart" />
        <CategoryCard
          text="Enhanced Yields"
          color={"#E91251"}
          icon="lineChart"
        />
        <CategoryCard
          text="Principal Protection"
          color={"#B1C9B6"}
          icon="lineChart"
        />
        <CategoryCard text="Accumulation" color={"#5AB1DA"} icon="lineChart" />
      </Row>
    </CategoryContainer>
  );
};

export default Categories;
