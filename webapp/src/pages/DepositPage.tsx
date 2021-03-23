import React from "react";
import styled from "styled-components";
import { SecondaryText, Title } from "../designSystem";
import colors from "../designSystem/colors";

const PageContainer = styled.div``;

const HeroContainer = styled.div``;

const BodyContainer = styled.div``;

const PerfContainer = styled.div``;

const ActionsContainer = styled.div``;

const HeroText = styled(Title)`
  font-size: 80px;
  line-height: 80px;
`;

const AttributePill = styled.div`
  background: ${colors.pillBackground};
  color: ${colors.primaryText};
  border-radius: 4px;
  padding: 16px;
  font-family: VCR;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 16px;

  text-align: center;
  letter-spacing: 1.5px;
  text-transform: uppercase;
`;

const DepositPage = () => {
  return (
    <PageContainer className="container px-lg-1">
      <HeroSection></HeroSection>
    </PageContainer>
  );
};

const HeroSection = () => {
  return (
    <div className="row mx-lg-n1">
      <div className="col-xl-6">
        <div className="d-flex flex-row my-3">
          <AttributePill className="mr-2 text-uppercase">
            Theta Vault
          </AttributePill>
          <AttributePill className="ml-2 text-uppercase">ETH</AttributePill>
        </div>

        <div className="mb-5">
          <HeroText>T-100-E</HeroText>
        </div>

        <div className="d-flex flex-row justify-content-between">
          <SecondaryText>Total Deposits</SecondaryText>
          <Title>215 ETH</Title>
        </div>
      </div>
    </div>
  );
};

export default DepositPage;
