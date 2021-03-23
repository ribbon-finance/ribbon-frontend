import React from "react";
import styled from "styled-components";

const PageContainer = styled.div`
  color: white;
`;

const HeroContainer = styled.div``;

const BodyContainer = styled.div``;

const PerfContainer = styled.div``;

const ActionsContainer = styled.div``;

const DepositPage = () => {
  return (
    <PageContainer className="container px-lg-1">
      <div className="row mx-lg-n1">
        <div>Theta Vault</div>
        <div>ETH</div>
      </div>
    </PageContainer>
  );
};

export default DepositPage;
