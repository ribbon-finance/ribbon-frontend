import React from "react";
import { Col, Row } from "react-bootstrap";
import styled from "styled-components";

import {
  BaseLink,
  PrimaryText,
  SecondaryText,
  Title,
} from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import {
  getEtherscanURI,
  RibbonTokenAddress,
  RibbonTokenBalancerPoolAddress,
} from "shared/lib/constants/constants";
import { ExternalIcon } from "shared/lib/assets/icons/icons";
import { formatBigNumber } from "shared/lib/utils/math";
import { LBPPoolInitialBalance } from "../../constants/constants";

const InfoTitle = styled(Title)`
  font-size: 18px;
  line-height: 20px;
`;

const InfoText = styled(PrimaryText)`
  color: ${colors.text};
  font-weight: 400;
`;

const InfoTable = styled.div`
  display: flex;
  flex-wrap: wrap;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: ${theme.border.radiusSmall};
  background: ${colors.primaryText}03;
  margin: 40px 0px;
`;

const InfoTableCell = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  padding: 16px;

  &:not(:nth-child(-n + 2)) {
    border-top: ${theme.border.width} ${theme.border.style} ${colors.border};
  }

  &:nth-child(2n + 1) {
    border-right: ${theme.border.width} ${theme.border.style} ${colors.border};
  }
`;

const LabelText = styled(SecondaryText)`
  font-size: 12px;
  line-height: 16px;
  font-weight: normal;
  margin-bottom: 4px;
`;

const InfoTableCellData = styled(Title)`
  letter-spacing: 1px;
`;

const TokenAddress = styled(Title)`
  color: ${colors.primaryText};
`;

const TokenSaleInfo = () => {
  return (
    <Row>
      <Col md={6} className="d-flex flex-column">
        {/* Text wall */}
        <InfoTitle>RBN TOKEN SALE</InfoTitle>
        <InfoText className="mt-3">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam,
          purus sit amet luctus venenatis, lectus magna fringilla urna,
          porttitor rhoncus dolor purus non enim praesent elementum facilisis
          leo, vel fringilla est ullamcorper eget nulla facilisi etiam dignissim
          diam quis enim lobortis scelerisque fermentum dui faucibus in ornare
          quam viverra orci sagittis eu volutpat odio facilisis mauris sit amet
          massa vitae tortor condimentum lacinia quis vel eros donec ac odio
          tempor orci dapibus ultrices in iaculis nunc sed augue lacus
        </InfoText>

        {/* Table */}
        <InfoTable>
          <InfoTableCell>
            <LabelText>$RBN Start Balance</LabelText>
            <InfoTableCellData>
              {formatBigNumber(LBPPoolInitialBalance.ribbon, 4, 18)}
            </InfoTableCellData>
          </InfoTableCell>
          <InfoTableCell>
            <LabelText>USDC Start Balance</LabelText>
            <InfoTableCellData>
              {formatBigNumber(LBPPoolInitialBalance.usdc, 2, 6)}
            </InfoTableCellData>
          </InfoTableCell>
          <InfoTableCell>
            <LabelText>$RBN Start Weight</LabelText>
            <InfoTableCellData>95%</InfoTableCellData>
          </InfoTableCell>
          <InfoTableCell>
            <LabelText>USDC Start Weight</LabelText>
            <InfoTableCellData>5%</InfoTableCellData>
          </InfoTableCell>
          <InfoTableCell>
            <LabelText>$RBN End Weight</LabelText>
            <InfoTableCellData>50%</InfoTableCellData>
          </InfoTableCell>
          <InfoTableCell>
            <LabelText>USDC End Weight</LabelText>
            <InfoTableCellData>50%</InfoTableCellData>
          </InfoTableCell>
        </InfoTable>

        {/* Balancer Pool Address */}
        <LabelText>Balancer Pool</LabelText>
        <BaseLink
          to={`${getEtherscanURI()}/address/${RibbonTokenBalancerPoolAddress}`}
          target="_blank"
          rel="noreferrer noopener"
          className="d-flex flex-wrap"
        >
          <TokenAddress>{RibbonTokenBalancerPoolAddress}</TokenAddress>
          <ExternalIcon className="ml-2" color={colors.primaryText} />
        </BaseLink>

        {/* Token Address */}
        <LabelText className="mt-3">RBN Token Address</LabelText>
        <BaseLink
          to={`${getEtherscanURI()}/address/${RibbonTokenAddress}`}
          target="_blank"
          rel="noreferrer noopener"
          className="d-flex flex-wrap"
        >
          <TokenAddress>{RibbonTokenAddress}</TokenAddress>
          <ExternalIcon className="ml-2" color={colors.primaryText} />
        </BaseLink>
      </Col>
    </Row>
  );
};

export default TokenSaleInfo;
