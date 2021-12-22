import React, { useCallback } from "react";
import styled from "styled-components";

import { ExternalIcon } from "shared/lib/assets/icons/icons";
import { treasuryCopies } from "../../components/Product/productCopies";
import {
  VaultOptions,
  VaultVersion,
  VaultFees,
} from "../../constants/constants";
import { PrimaryText, SecondaryText, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import EmptyStrategySnapshot from "../../components/Deposit/EmptyStrategySnapshot";
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

  const renderWithdrawalsSection = useCallback(
    (_vaultOption: VaultOptions, _vaultVersion: VaultVersion) => {
      return (
        <>
          Once user funds have been used in the vault's strategy, they
          cannot be withdrawn until the vault closes its position in the following round.
          <br />
          <br />
          Users can withdraw their funds instantly during the
          timelock period where the vault closes its previous position and
          opens its new position.{" "}
        </>
      );
    },
    []
  );

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
            The performance fee is
            charged on the premiums earned in USDC and the management fee is
            charged on the assets managed by the vault.
          </ParagraphText>
        </Paragraph>
      )}

      <Paragraph>
        <ParagraphHeading>Risk</ParagraphHeading>
        <ParagraphText>
          {treasuryCopies["Treasury"].vaultRisk}
          <br />
          <br />
          The Treasury Vault smart contracts have not been audited. Users are advised to exercise caution and only risk
          funds they can afford to lose.
        </ParagraphText>
      </Paragraph>
    </Container>
  );
};

export default PerformanceSection;
