import React, { useCallback } from "react";
import styled from "styled-components";
import { ExternalIcon } from "shared/lib/assets/icons/icons";
import { productCopies } from "shared/lib/components/Product/productCopies";
import {
  getAssets,
  VaultOptions,
  VaultWithdrawalFee,
} from "shared/lib/constants/constants";

import { PrimaryText, SecondaryText, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import useAssetsYield from "shared/lib/hooks/useAssetsYield";
import VaultPerformanceChart from "./VaultPerformanceChart";
import { getAssetDisplay } from "shared/lib/utils/asset";
import { DefiScoreProtocol } from "shared/lib/models/defiScore";
import theme from "shared/lib/designSystem/theme";
import {
  AAVEIcon,
  CompoundIcon,
  DDEXIcon,
  DYDXIcon,
  OasisIcon,
} from "shared/lib/assets/icons/defiApp";
import WeeklyStrategySnapshot from "../../components/Deposit/WeeklyStrategySnapshot";

const Paragraph = styled.div`
  margin-bottom: 64px;
`;

const ParagraphHeading = styled(Title)`
  display: block;
  font-size: 18px;
  line-height: 24px;
  margin-bottom: 16px;
`;

const ParagraphText = styled(SecondaryText)`
  color: rgba(255, 255, 255, 0.64);
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
`;

const Link = styled.a`
  color: ${colors.primaryText};
  text-decoration: underline;

  &:hover {
    color: ${colors.primaryText}CC;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const MarketYield = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: ${theme.border.radius};
  padding: 12px 16px;

  &:first-child {
    margin-top: 0px;
  }
`;

const MarketTitle = styled(Title)`
  margin-left: 8px;
`;

const MarketYielAPR = styled(Title)`
  margin-left: auto;
`;

interface PerformanceSectionProps {
  vaultOption: VaultOptions;
}

const PerformanceSection: React.FC<PerformanceSectionProps> = ({
  vaultOption,
}) => {
  const asset = getAssets(vaultOption);
  const yieldInfos = useAssetsYield(asset);
  const withdrawalFee = VaultWithdrawalFee[vaultOption];

  const renderProtocolLogo = useCallback((protocol: DefiScoreProtocol) => {
    switch (protocol) {
      case "aave":
        return <AAVEIcon height="40px" width="40px" />;
      case "compound":
        return <CompoundIcon height="40px" width="40px" />;
      case "ddex":
        return <DDEXIcon height="40px" width="40px" />;
      case "dydx":
        return (
          <DYDXIcon
            height="40px"
            width="40px"
            style={{ borderRadius: "100px" }}
          />
        );
      case "mcd":
        return <OasisIcon height="40px" width="40px" />;
    }
  }, []);

  const renderYieldInfo = useCallback(
    ({ protocol, apr }: { protocol: DefiScoreProtocol; apr: number }) => {
      if (apr < 0.01) {
        return null;
      }

      return (
        <MarketYield key={protocol}>
          {renderProtocolLogo(protocol)}
          <MarketTitle>{protocol}</MarketTitle>
          <MarketYielAPR>{`${apr.toFixed(2)}%`}</MarketYielAPR>
        </MarketYield>
      );
    },
    [renderProtocolLogo]
  );

  return (
    <Container className="col-xl-7 col-md-6">
      <Paragraph>
        <ParagraphHeading>Vault Strategy</ParagraphHeading>
        <ParagraphText>{productCopies[vaultOption].strategy}</ParagraphText>
      </Paragraph>

      <Paragraph>
        <ParagraphHeading>Weekly Strategy Snapshot</ParagraphHeading>
        <WeeklyStrategySnapshot vaultOption={vaultOption} />
      </Paragraph>

      <Paragraph>
        <ParagraphHeading>Vault Performance</ParagraphHeading>
        <VaultPerformanceChart vaultOption={vaultOption} />
      </Paragraph>

      <Paragraph>
        <ParagraphHeading>
          MARKET {getAssetDisplay(asset)} YIELDS (APY)
        </ParagraphHeading>
        {yieldInfos.map((info) => renderYieldInfo(info))}
      </Paragraph>

      <Paragraph>
        <ParagraphHeading>Withdrawals</ParagraphHeading>
        <ParagraphText>
          The vault allocates 90% of the funds deposited towards its strategy
          and reserves 10% of the funds deposited for withdrawals. If in any
          given week the 10% withdrawal limit is reached, withdrawals from the
          vault will be disabled and depositors will have to wait until the
          following week in order to withdraw their funds.
          <br />
          <br />
          Withdrawing from the vault has a fixed withdrawal fee of{" "}
          {withdrawalFee}%. This is to encourage longer-term depositors.
        </ParagraphText>
      </Paragraph>

      <Paragraph>
        <ParagraphHeading>Risk</ParagraphHeading>
        <ParagraphText>
          {productCopies[vaultOption].vaultRisk}
          <br />
          <br />
          The Theta Vault smart contracts have been{" "}
          <Link
            href="https://github.com/peckshield/publications/blob/master/audit_reports/PeckShield-Audit-Report-Ribbon-v1.0.pdf"
            target="_blank"
            rel="noreferrer noopener"
          >
            audited by Peckshield
          </Link>
          ,{" "}
          <Link
            href="https://github.com/ribbon-finance/audit/blob/master/reports/Quantstamp%20Theta%20Vault.pdf"
            target="_blank"
            rel="noreferrer noopener"
          >
            Quantstamp
          </Link>{" "}
          and{" "}
          <Link
            href="https://github.com/ribbon-finance/audit/blob/master/reports/Chainsafe-Ribbon-Audit_April-2021.pdf"
            target="_blank"
            rel="noreferrer noopener"
          >
            ChainSafe
          </Link>
          . Despite that, users are advised to exercise caution and only risk
          funds they can afford to lose.
        </ParagraphText>

        <PrimaryText className="d-block mt-3">
          <Link
            href="https://ribbonfinance.medium.com/theta-vault-backtest-results-6e8c59adf38c"
            target="_blank"
            rel="noreferrer noopener"
            className="d-flex"
          >
            <span className="mr-2">Read More</span>
            <ExternalIcon color="white" />
          </Link>
        </PrimaryText>
      </Paragraph>
    </Container>
  );
};

export default PerformanceSection;
