import React from "react";
import styled from "styled-components";
import { Title } from "../../designSystem";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useInstrumentAddresses } from "../../hooks/useProducts";
import usePositions from "../../hooks/usePositions";
import PositionsTable from "./PositionsTable";

const ProductTitleContainer = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
`;

const Portfolio = () => {
  const instrumentAddresses = useInstrumentAddresses();
  const { loading: loadingPositions, positions } = usePositions(
    instrumentAddresses
  );
  const sortedPositions = positions.sort((a, b) => {
    if (a.expiry > b.expiry) return -1;
    if (a.expiry < b.expiry) return 1;
    return 0;
  });

  const nowTimestamp = Math.floor(Date.now() / 1000);
  const activePositions = sortedPositions.filter(
    (p) => p.expiry > nowTimestamp && !p.exercised
  );
  const pastPositions = sortedPositions.filter(
    (p) => p.expiry <= nowTimestamp || p.exercised
  );

  return (
    <div>
      <a href="/">
        <ArrowLeftOutlined />
      </a>
      <ProductTitleContainer>
        <Title>Active Positions</Title>
      </ProductTitleContainer>
      <PositionsTable
        loading={loadingPositions}
        positions={activePositions}
        isPastPositions={false}
      />
      <ProductTitleContainer>
        <Title>Past Positions</Title>
      </ProductTitleContainer>
      <PositionsTable
        loading={loadingPositions}
        positions={pastPositions}
        isPastPositions
      />
    </div>
  );
};

export default Portfolio;
