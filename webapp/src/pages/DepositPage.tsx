import React from "react";
import styled from "styled-components";
import { SecondaryText, Title } from "../designSystem";
import colors from "../designSystem/colors";

const PageContainer = styled.div`
  background: linear-gradient(
    96.84deg,
    rgba(252, 10, 84, 0.16) 1.04%,
    rgba(252, 10, 84, 0.0256) 98.99%
  );
`;

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

const BackgroundBar = styled.div`
  height: 16px;
  width: 100%;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
`;

const ForegroundBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 16px;
  background: #ffffff;
  border-radius: 4px;
  width: 100%;
`;

const DepositStat = styled(Title)`
  font-size: 14px;
  line-height: 20px;
`;

const DepositPage = () => {
  return (
    <PageContainer className="py-6">
      <div className="container px-lg-1">
        <HeroSection></HeroSection>
      </div>
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

        <DepositCapBar totalDeposit={215} limit={500}></DepositCapBar>
      </div>
    </div>
  );
};

const DepositCapBar: React.FC<{ totalDeposit: number; limit: number }> = ({
  totalDeposit,
  limit,
}) => {
  let percent = totalDeposit / limit;
  if (percent < 0) {
    percent = 0;
  } else if (percent > 1) {
    percent = 1;
  }
  percent *= 100;

  return (
    <div>
      <div className="d-flex flex-row justify-content-between">
        <SecondaryText>Total Deposits</SecondaryText>
        <DepositStat>{totalDeposit} ETH</DepositStat>
      </div>

      <div className="d-flex flex-row position-relative my-3">
        <BackgroundBar></BackgroundBar>
        <ForegroundBar style={{ width: `${percent}%` }}></ForegroundBar>
      </div>

      <div className="d-flex flex-row justify-content-between">
        <SecondaryText>Limit</SecondaryText>
        <DepositStat>{limit} ETH</DepositStat>
      </div>
    </div>
  );
};

export default DepositPage;
