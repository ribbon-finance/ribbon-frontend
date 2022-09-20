import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import colors from "shared/lib/designSystem/colors";
import styled from "styled-components";
import { components } from "../../designSystem/components";
import { truncateAddress } from "shared/lib/utils/address";
import { Button, Title } from "../../designSystem";
import sizes from "../../designSystem/sizes";
import Indicator from "shared/lib/components/Indicator/Indicator";
import { Balance } from "../Balance";
import { Pools, Positions } from "../Pools";
import useWeb3Wallet from "shared/lib/hooks/useWeb3Wallet";
import LendModal, { ModalContentEnum } from "../Common/LendModal";
import {
  VaultList,
  VaultOptions,
  vaultOptionToName,
} from "../../constants/constants";
import { formatBigNumber, isPracticallyZero } from "../../utils/math";
import { useVaultsData } from "../../hooks/web3DataContext";
import { getAssetDecimals, getUtilizationDecimals } from "../../utils/asset";
import { CloseIcon } from "shared/lib/assets/icons/icons";
import { usePoolsAPR } from "../../hooks/usePoolsAPR";

const borderStyle = `1px solid ${colors.primaryText}1F`;

export const FixedContainer = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  background: black;
  z-index: 10000;
  width: 100%;
  height: 100%;
`;

const HeroContainer = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;

  @media (max-width: ${sizes.lg}px) {
    width: 100%;
  }

  > .row {
    margin-left: 0 !important;
    width: 100%;
  }
`;

export const HeaderRow = styled(Row)`
  height: ${components.header}px;
  border-bottom: 1px solid ${colors.border};
  z-index: 1;
  margin-left: 0px;

  > * {
    padding: 0;

    &:not(:last-child) {
      border-right: 1px solid ${colors.border};
    }
  }
`;

export const FooterRow = styled(Row)`
  height: ${components.footer}px;
  border-top: 1px solid ${colors.border};
  box-sizing: content-box;

  > * {
    padding: 0;

    &:not(:last-child) {
      border-right: 1px solid ${colors.border};
    }
  }
`;

export const HeaderContainer = styled.div`
  display: flex;
  margin: auto;
  width: 100%;
  height: 100%;
  justify-content: center;
  border-radius: 0;
  height: ${components.header}px;
  border-bottom: 1px solid ${colors.border};
  z-index: 1;
  color: ${colors.primaryText};

  > * {
    margin: auto 0;

    &:not(:last-child) {
      margin-right: 8px;
    }
  }
`;

export const HeaderText = styled(Title)`
  font-size: 16px;
  line-height: 20px;
`;

export const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
`;

export const Content = styled(Row)`
  height: calc(100% - ${components.header}px - ${components.footer}px);

  @media (max-width: ${sizes.lg}px) {
    height: 100%;
  }

  > *:not(:last-child) {
    border-right: 1px solid ${colors.border};
  }
`;

const CloseButton = styled.button`
  position: absolute;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  width: ${components.header}px;
  height: ${components.header}px;
  border-left: ${borderStyle};
`;

interface DepositModalProps {
  show?: boolean;
  onHide: () => void;
  pool: VaultOptions;
}

const DepositModal: React.FC<DepositModalProps> = ({ show, onHide, pool }) => {
  return show ? (
    <FixedContainer>
      <HeroContainer>
        <Header>
          <CloseButton onClick={() => onHide()}>
            <CloseIcon />
          </CloseButton>
        </Header>
        <Content>
          <Col xs={12}>
            <Balance />
          </Col>
        </Content>
        <Footer pool={pool} />
      </HeroContainer>
    </FixedContainer>
  ) : (
    <></>
  );
};

const Header: React.FC = ({ children }) => {
  return (
    <HeaderContainer>
      <HeaderText>Deposit USDC</HeaderText>
      {children}
    </HeaderContainer>
  );
};

const DetailTitle = styled.div`
  font-size: 12px;
  color: ${colors.primaryText}52;
  text-align: center;
`;

export const DetailText = styled(Title)`
  font-size: 14px;
  line-height: 20px;
`;

interface FooterProps {
  pool: VaultOptions;
}

const Footer: React.FC<FooterProps> = ({ pool }) => {
  const vaultDatas = useVaultsData();
  const usdcDecimals = getAssetDecimals("USDC");
  const poolName = vaultOptionToName[pool];
  const { aprs } = usePoolsAPR();
  const apr = aprs[pool];
  const utilizationDecimals = getUtilizationDecimals();
  const utilizationRate = vaultDatas.data[pool].utilizationRate;
  return (
    <FooterRow>
      <Col xs={3}>
        <DetailContainer>
          <DetailTitle>Pool</DetailTitle>
          <DetailText>{poolName}</DetailText>
        </DetailContainer>
      </Col>
      <Col xs={3}>
        <DetailContainer>
          <DetailTitle>Deposit Asset</DetailTitle>
          <DetailText>USDC</DetailText>
        </DetailContainer>
      </Col>
      <Col xs={3}>
        <DetailContainer>
          <DetailTitle>Lending APR</DetailTitle>
          <DetailText>{apr.toFixed(2)}%</DetailText>
        </DetailContainer>
      </Col>
      <Col xs={3}>
        <DetailContainer>
          <DetailTitle>Pool Utilization</DetailTitle>
          <DetailText>
            {formatBigNumber(utilizationRate, utilizationDecimals)}%
          </DetailText>
        </DetailContainer>
      </Col>
    </FooterRow>
  );
};

export default DepositModal;
