import React, { useMemo } from "react";
import { Col, Row } from "react-bootstrap";
import colors from "shared/lib/designSystem/colors";
import styled from "styled-components";
import { components } from "../../designSystem/components";
import { PrimaryText, Title } from "../../designSystem";
import sizes from "../../designSystem/sizes";
import { getEtherscanURI, PoolDetailsMap } from "../../constants/constants";
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
import { ActionType } from "./types";

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

const DetailText = styled(Title)`
  font-size: 14px;
  line-height: 20px;
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

interface FooterDetail {
  title: string;
  description: string | JSX.Element;
}

export enum ActionModalEnum {
  PREVIEW,
  TRANSACTION_STEP,
}

interface FooterProps {
  pool: PoolOptions;
  page: ActionModalEnum;
  show: boolean;
  txhash: string | undefined;
  actionType: ActionType;
  migratePool: PoolOptions;
}

const Footer: React.FC<FooterProps> = ({
  show,
  pool,
  page,
  txhash,
  actionType,
  migratePool,
}) => {
  const poolDatas = usePoolsData();
  const poolName = PoolDetailsMap[pool].name;
  const migratePoolName = PoolDetailsMap[migratePool].name;
  const { aprs } = usePoolsApr();
  const { chainId } = useWeb3React();
  const apr = aprs[pool];
  const utilizationDecimals = getUtilizationDecimals();

  const utilizationRate = useMemo(() => {
    return poolDatas.data[pool].utilizationRate;
  }, [pool, poolDatas.data]);

  const migratePoolUtilizationRate = useMemo(() => {
    return poolDatas.data[migratePool].utilizationRate;
  }, [migratePool, poolDatas.data]);

  const footerColumns: FooterDetail[] = useMemo(() => {
    const footerDetails: FooterDetail[] = [];
    switch (actionType) {
      case "deposit":
      case "withdraw":
        footerDetails.push({
          title: "Pool",
          description: poolName,
        });
        footerDetails.push({
          title: "Deposit Asset",
          description: "USDC",
        });
        footerDetails.push({
          title: "Lending APR",
          description: `${currency(apr.toFixed(2), { symbol: "" }).format()}%`,
        });
        footerDetails.push({
          title: "Pool Utilization",
          description: (
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
          ),
        });
        break;
      case "migrate":
        footerDetails.push({
          title: "From",
          description: pool,
        });
        footerDetails.push({
          title: "To",
          description: migratePool,
        });
        footerDetails.push({
          title: "Deposit Asset",
          description: "USDC",
        });
        footerDetails.push({
          title: `${migratePoolName} Pool Utilization`,
          description: (
            <div className="d-flex">
              <UtilizationBar
                percent={parseFloat(
                  formatBigNumber(
                    migratePoolUtilizationRate,
                    utilizationDecimals
                  )
                )}
                width={40}
                color={colors.primaryText}
              />
              <DetailText>
                {formatBigNumber(
                  migratePoolUtilizationRate,
                  utilizationDecimals
                )}
                %
              </DetailText>
            </div>
          ),
        });
    }
    return footerDetails;
  }, [
    actionType,
    poolName,
    apr,
    utilizationRate,
    utilizationDecimals,
    pool,
    migratePool,
    migratePoolName,
    migratePoolUtilizationRate,
  ]);

  const mobileFooterColumns: FooterDetail[] = useMemo(() => {
    const footerDetails: FooterDetail[] = [];
    switch (actionType) {
      case "deposit":
      case "withdraw":
        footerDetails.push({
          title: "Pool",
          description: poolName,
        });
        footerDetails.push({
          title: "Lending APR",
          description: `${currency(apr.toFixed(2), { symbol: "" }).format()}%`,
        });
        break;
      case "migrate":
        footerDetails.push({
          title: "From",
          description: pool,
        });
        footerDetails.push({
          title: "To",
          description: migratePool,
        });
    }
    return footerDetails;
  }, [actionType, poolName, apr, pool, migratePool]);

  return (
    <>
      {page === ActionModalEnum.PREVIEW ? (
        <FooterRow>
          <DesktopOnly>
            {footerColumns.map((detail, index) => {
              return (
                <Col xs={3}>
                  <DetailContainer show={show} delay={0.1 * (index + 1)}>
                    <DetailTitle>{detail.title}</DetailTitle>
                    <DetailText>{detail.description}</DetailText>
                  </DetailContainer>
                </Col>
              );
            })}
          </DesktopOnly>
          <MobileOnly>
            {mobileFooterColumns.map((detail, index) => {
              return (
                <Col xs={6}>
                  <DetailContainer show={show} delay={0.1 * (index + 1)}>
                    <DetailTitle>{detail.title}</DetailTitle>
                    <DetailText>{detail.description}</DetailText>
                  </DetailContainer>
                </Col>
              );
            })}
          </MobileOnly>
        </FooterRow>
      ) : (
        <FooterRow>
          {chainId !== undefined && (
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
