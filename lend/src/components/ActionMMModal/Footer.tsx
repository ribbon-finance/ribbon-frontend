import React from "react";
import { Col, Row } from "react-bootstrap";
import colors from "shared/lib/designSystem/colors";
import styled from "styled-components";
import { components } from "../../designSystem/components";
import { PrimaryText, Title } from "../../designSystem";
import sizes from "../../designSystem/sizes";
import { getEtherscanURI } from "../../constants/constants";
import { PoolOptions } from "shared/lib/constants/lendConstants";
import { formatBigNumber } from "shared/lib/utils/math";
import { getUtilizationDecimals } from "../../utils/asset";
import { usePoolsApr } from "../../hooks/usePoolsApr";
import { fadeIn } from "shared/lib/designSystem/keyframes";
import { css } from "styled-components";
import { BaseUnderlineLink } from "shared/lib/designSystem";
import { usePoolsData } from "../../hooks/web3DataContext";
import { useWeb3React } from "@web3-react/core";
import ExternalLinkIcon from "../Common/ExternalLinkIcon";
import UtilizationBar from "../Common/UtilizationBar";
import currency from "currency.js";
import { ActionModalEnum } from ".";
import { formatUnits } from "ethers/lib/utils";

const FooterRow = styled(Row)`
  min-height: ${components.footer}px;
  border-top: 1px solid ${colors.border};
  box-sizing: content-box;
`;

const DetailContainer = styled.div<{ show?: boolean; delay?: number }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
  ${({ show, delay }) => {
    return (
      show &&
      css`
        opacity: 0;

        &:disabled {
          opacity: 0;
        }

        animation: ${fadeIn} 1s ease-in-out forwards;
        animation-delay: ${delay || 0}s;
      `
    );
  }}
`;

const DesktopOnly = styled.div`
  display: flex;
  width: 100%;
  > * {
    padding: 0;

    &:not(:last-child) {
      border-right: 1px solid ${colors.border};
    }
  }
  @media (max-width: ${sizes.lg}px) {
    display: none;
  }
`;

const MobileOnly = styled.div`
  display: none;
  width: 100%;
  > * {
    padding: 0;

    &:not(:last-child) {
      border-right: 1px solid ${colors.border};
    }
  }
  @media (max-width: ${sizes.lg}px) {
    display: flex;
  }
`;

const DetailTitle = styled.div`
  font-size: 12px;
  color: ${colors.primaryText}52;
  text-align: center;
`;

const DetailText = styled(Title)<{ color?: string }>`
  font-size: 14px;
  line-height: 20px;
  color: ${(props) => props.color ?? ""};
`;

const StyledPrimaryText = styled(PrimaryText)`
  font-size: 14px;
  line-height: 20px;
  text-decoration: underline;
  margin-right: 4px;
`;

const UnderlineLink = styled(BaseUnderlineLink)`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
`;

interface FooterProps {
  pool: PoolOptions;
  page: ActionModalEnum;
  show: boolean;
  txhash?: string | undefined;
  borrowAmount: string;
  isBorrow: boolean;
}

const Footer: React.FC<FooterProps> = ({
  show,
  pool,
  page,
  txhash,
  borrowAmount,
  isBorrow,
}) => {
  const poolDatas = usePoolsData();
  const { aprs } = usePoolsApr();
  const { chainId } = useWeb3React();
  const apr = aprs[pool];
  const utilizationDecimals = getUtilizationDecimals();
  const utilizationRate = poolDatas.data[pool].utilizationRate;
  const poolSize = poolDatas.data[pool].poolSize;
  const borrowAmountNum = parseInt(borrowAmount);
  const absoluteBorrowAmount = Math.abs(parseInt(borrowAmount));

  return (
    <>
      {page === ActionModalEnum.PREVIEW ? (
        <FooterRow>
          <DesktopOnly>
            <Col xs={3}>
              <DetailContainer show={show} delay={0.1}>
                <DetailTitle>Current Utilization</DetailTitle>
                <div className="d-flex">
                  <UtilizationBar
                    percent={parseFloat(
                      formatBigNumber(utilizationRate, utilizationDecimals)
                    )}
                    width={40}
                    color={colors.primaryText}
                  />
                  <DetailText>
                    {formatBigNumber(utilizationRate, utilizationDecimals)}%
                  </DetailText>
                </div>
              </DetailContainer>
            </Col>
            <Col xs={3}>
              <DetailContainer show={show} delay={0.2}>
                <DetailTitle>Pool Size (USDC)</DetailTitle>
                <DetailText>
                  {currency(formatUnits(poolSize, 6), {
                    symbol: "",
                  }).format()}
                </DetailText>
              </DetailContainer>
            </Col>
            <Col xs={3}>
              <DetailContainer show={show} delay={0.3}>
                <DetailTitle>
                  {isBorrow ? "Borrow" : "Repay"} Amount
                </DetailTitle>
                <DetailText
                  color={
                    borrowAmountNum === 0
                      ? colors.primaryText
                      : borrowAmountNum > 0
                      ? colors.green
                      : colors.red
                  }
                >
                  {currency(
                    absoluteBorrowAmount
                      ? formatUnits(absoluteBorrowAmount, 6)
                      : "0.00",
                    {
                      symbol: "",
                    }
                  ).format()}
                </DetailText>
              </DetailContainer>
            </Col>
            <Col xs={3}>
              <DetailContainer show={show} delay={0.4}>
                <DetailTitle>Borrow APR</DetailTitle>
                <DetailText>
                  {currency(apr.toFixed(2), { symbol: "" }).format()}%
                </DetailText>
              </DetailContainer>
            </Col>
          </DesktopOnly>
          <MobileOnly>
            <Col xs={6}>
              <DetailContainer show={show} delay={0.1}>
                <DetailTitle>Current Utilization</DetailTitle>
                <div className="d-flex">
                  <UtilizationBar
                    percent={parseFloat(
                      formatBigNumber(utilizationRate, utilizationDecimals)
                    )}
                    width={40}
                    color={colors.primaryText}
                  />
                  <DetailText>
                    {formatBigNumber(utilizationRate, utilizationDecimals)}%
                  </DetailText>
                </div>
              </DetailContainer>
            </Col>
            <Col xs={6}>
              <DetailContainer show={show} delay={0.2}>
                <DetailTitle>Borrow APR</DetailTitle>
                <DetailText>
                  {currency(apr.toFixed(2), { symbol: "" }).format()}%
                </DetailText>
              </DetailContainer>
            </Col>
          </MobileOnly>
        </FooterRow>
      ) : (
        <FooterRow>
          {chainId && txhash && (
            <UnderlineLink
              to={`${getEtherscanURI(chainId)}/tx/${txhash}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              <StyledPrimaryText>View on Etherscan</StyledPrimaryText>
              <ExternalLinkIcon />
            </UnderlineLink>
          )}
        </FooterRow>
      )}
    </>
  );
};

export default Footer;
