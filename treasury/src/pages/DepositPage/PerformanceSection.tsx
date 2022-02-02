import React from "react";
import styled from "styled-components";

import { ExternalIcon } from "shared/lib/assets/icons/icons";
import {
  VaultOptions,
  VaultVersion,
  VaultFees,
} from "shared/lib/constants/constants";
import { PrimaryText, SecondaryText, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import StrategySnapshot, {
  EmptyStrategySnapshot,
} from "../../components/Deposit/StrategySnapshot";
import sizes from "shared/lib/designSystem/sizes";
import { treasuryCopy } from "../../components/Product/treasuryCopies";

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

interface PerformanceSectionProps {
  vault?: {
    vaultOption: VaultOptions;
    vaultVersion: VaultVersion;
  };
  active: boolean;
}

const PerformanceSection: React.FC<PerformanceSectionProps> = ({
  vault,
  active,
}) => {
  const renderWithdrawalsSection = (
    <>
      Once user funds have been used in the vault's strategy, they cannot be
      withdrawn until the vault closes its position in the following round.
      <br />
      <br />
      Users can withdraw their funds instantly during the timelock period where
      the vault closes its previous position and opens its new position.{" "}
    </>
  );

  if (!vault) {
    return (
      <Container>
        {active && (
          <>
            <Paragraph>
              <ParagraphHeading>Strategy Snapshot</ParagraphHeading>
              <EmptyStrategySnapshot />
            </Paragraph>
          </>
        )}

        {active && (
          <Paragraph>
            <ParagraphHeading>Withdrawals</ParagraphHeading>
            <ParagraphText>{renderWithdrawalsSection}</ParagraphText>
          </Paragraph>
        )}

        {
          <Paragraph>
            <ParagraphHeading>FEE STRUCTURE</ParagraphHeading>
            <ParagraphText>
              The vault fee structure consists of a 2% annualised management fee
              and a 10% performance fee.
              <br />
              <br />
              The performance fee is charged on the premiums earned in USDC and
              the management fee is charged on the assets managed by the vault.
            </ParagraphText>
          </Paragraph>
        }

        <Paragraph>
          <ParagraphHeading>Risk</ParagraphHeading>
          <ParagraphText>
            {treasuryCopy.vaultRisk}
            <br />
            <br />
            The Treasury Vault smart contracts have not been audited. Users are
            advised to exercise caution and only risk funds they can afford to
            lose.
          </ParagraphText>
        </Paragraph>
      </Container>
    );
  }

  const { vaultOption, vaultVersion } = vault;

  return (
    <Container>
      {active && (
        <>
          <Paragraph>
            <ParagraphHeading>Strategy Snapshot</ParagraphHeading>
            <StrategySnapshot vault={vault} />
          </Paragraph>
        </>
      )}

      {active && (
        <Paragraph>
          <ParagraphHeading>Withdrawals</ParagraphHeading>
          <ParagraphText>{renderWithdrawalsSection}</ParagraphText>
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
            The performance fee is charged on the premiums earned in USDC and
            the management fee is charged on the assets managed by the vault.
          </ParagraphText>
        </Paragraph>
      )}

      <Paragraph>
        <ParagraphHeading>Risk</ParagraphHeading>
        <ParagraphText>
          {treasuryCopy.vaultRisk}
          <br />
          <br />
          The Treasury Vault smart contracts have been{" "}
          <Link
            href="https://github.com/ribbon-finance/audit/blob/master/reports/PeckShield-Audit-Report-RibbonTreasuryVault.pdf"
            target="_blank"
            rel="noreferrer noopener"
          >
            audited by PeckShield
          </Link>{" "}
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
