import React from "react";
import styled from "styled-components";
import { PrimaryMedium, Title } from "../../designSystem";
import { ArrowLeftOutlined } from "@ant-design/icons";
import usePositions from "../../hooks/usePositions";
import PositionsTable from "./PositionsTable";
import { Link } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";

const ProductTitleContainer = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
`;

const ConnectToWallet = styled.div`
  margin-top: 20px;
  margin-left: 30px;
`;

const ConnectToWalletText = styled(PrimaryMedium)`
  font-size: 20px;
`;

const TableTitle = styled(Title)`
  font-weight: 500;
`;

const Portfolio = () => {
  const { active } = useWeb3React();

  const { loading: loadingPositions, positions } = usePositions();
  const sortedPositions = positions.sort((a, b) => {
    if (a.expiry > b.expiry) return -1;
    if (a.expiry < b.expiry) return 1;
    return 0;
  });

  const nowTimestamp = Math.floor(Date.now() / 1000);
  const activePositions = sortedPositions.filter(
    (p) => (p.expiry > nowTimestamp || p.canExercise) && !p.exercised
  );
  const pastPositions = sortedPositions.filter(
    (p) => p.expiry <= nowTimestamp || p.exercised
  );

  return (
    <div>
      <Link to="/">
        <ArrowLeftOutlined />
      </Link>
      {!active ? (
        <ConnectToWallet>
          <ConnectToWalletText>
            Please connect to Metamask to access your positions.
          </ConnectToWalletText>
        </ConnectToWallet>
      ) : (
        <>
          <ProductTitleContainer>
            <TableTitle>Active Positions</TableTitle>
          </ProductTitleContainer>
          <PositionsTable
            loading={loadingPositions}
            positions={activePositions}
            isPastPositions={false}
          />
          <ProductTitleContainer>
            <TableTitle>Past Positions</TableTitle>
          </ProductTitleContainer>
          <PositionsTable
            loading={loadingPositions}
            positions={pastPositions}
            isPastPositions
          />
        </>
      )}
    </div>
  );
};

export default Portfolio;
