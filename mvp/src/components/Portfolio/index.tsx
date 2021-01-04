import React from "react";
import styled from "styled-components";
import { Title } from "../../designSystem";
import BannerColorful from "../../img/BannerColorful.png";
import { ArrowLeftOutlined } from "@ant-design/icons";
import ActivePositions from "./ActivePositions";
import PastPositions from "./PastPositions";

const ProductTitleContainer = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
`;

const Portfolio = () => {
  return (
    <div>
      <a href="/">
        <ArrowLeftOutlined />
      </a>
      <ProductTitleContainer>
        <Title>Active Positions</Title>
      </ProductTitleContainer>
      <ActivePositions />
      <ProductTitleContainer>
        <Title>Past Positions</Title>
      </ProductTitleContainer>
      <PastPositions />
    </div>
  );
};

export default Portfolio;
