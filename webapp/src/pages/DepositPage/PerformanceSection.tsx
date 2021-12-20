import React, { useCallback } from "react";
import styled from "styled-components";

import { ExternalIcon } from "shared/lib/assets/icons/icons";
import { productCopies } from "shared/lib/components/Product/productCopies";
import {
  getAssets,
  VaultOptions,
  VaultVersion,
  VaultFees,
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
import VaultStrategyExplainer from "../../components/Deposit/VaultStrategyExplainer";
import sizes from "shared/lib/designSystem/sizes";

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
  max-width: 50%;
  padding: 0 16px;

  @media (max-width: ${sizes.md}px) {
    max-width: unset;
  }
`;

const MarketYield = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
  background: ${colors.background.two};
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
  vault: {
    vaultOption: VaultOptions;
    vaultVersion: VaultVersion;
  };
  active: boolean;
}

const PerformanceSection: React.FC<PerformanceSectionProps> = ({
  vault,
  active,
}) => {
  const { vaultOption, vaultVersion } = vault;
  const asset = getAssets(vaultOption);
  const yieldInfos = useAssetsYield(asset);

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

  const renderWithdrawalsSection = useCallback(
    (_vaultOption: VaultOptions, _vaultVersion: VaultVersion) => {
      switch (_vaultVersion) {
        case "v1":
          const withdrawalFee = VaultFees[_vaultOption].v1?.withdrawalFee;
          return (
            <>
              {" "}
              The vault allocates 90% of the funds deposited towards its
              strategy and reserves 10% of the funds deposited for withdrawals.
              If in any given week the 10% withdrawal limit is reached,
              withdrawals from the vault will be disabled and depositors will
              have to wait until the following week in order to withdraw their
              funds.
              <br />
              <br />
              Withdrawing from the vault has a fixed withdrawal fee of{" "}
              {withdrawalFee}%. This is to encourage longer-term depositors.
            </>
          );
        case "v2":
          return (
            <>
              Once user funds have been used in the vault’s weekly strategy they
              cannot be withdrawn until the vault closes it’s position the
              following Friday at 10am UTC.
              <br />
              <br />
              Users can withdraw their funds instantly during the weekly
              timelock period where the vault closes it’s previous position and
              opens its new position.{" "}
            </>
          );
      }
    },
    []
  );

  return (
    <Container>
      {active && (
        <>
          <Paragraph className="d-flex flex-column">
            <ParagraphHeading>Vault Strategy</ParagraphHeading>
            <ParagraphText className="mb-4">
              {productCopies[vaultOption].strategy}
            </ParagraphText>
            <VaultStrategyExplainer vault={vault} />
          </Paragraph>

          <Paragraph>
            <ParagraphHeading>Weekly Strategy Snapshot</ParagraphHeading>
            <WeeklyStrategySnapshot vault={vault} />
          </Paragraph>
        </>
      )}

      <Paragraph>
        <VaultPerformanceChart vault={vault} />
      </Paragraph>

      {yieldInfos && yieldInfos.length && (
        <Paragraph>
          <ParagraphHeading>
            MARKET {getAssetDisplay(asset)} YIELDS (APY)
          </ParagraphHeading>
          {yieldInfos.map((info) => renderYieldInfo(info))}
        </Paragraph>
      )}

      {active && (
        <Paragraph>
          <ParagraphHeading>Withdrawals</ParagraphHeading>
          <ParagraphText>
            {renderWithdrawalsSection(vaultOption, vaultVersion)}
          </ParagraphText>
        </Paragraph>
      )}

      {vaultVersion === "v2" && (
        <Paragraph>
          <ParagraphHeading>FEE STRUCTURE</ParagraphHeading>
          <ParagraphText>
            The vault fee structure consists of a{" "}
            {VaultFees[vaultOption].v2?.managementFee}% annualised management
            fee and a {VaultFees[vaultOption].v2?.performanceFee}% performance
            fee.
            <br />
            <br />
            If the weekly strategy is profitable, the weekly performance fee is
            charged on the premiums earned and the weekly management fee is
            charged on the assets managed by the vault.
            <br />
            <br />
            If the weekly strategy is unprofitable, there are no fees charged.
          </ParagraphText>
        </Paragraph>
      )}

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
