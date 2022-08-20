import React from "react";
import styled from "styled-components";
import { SecondaryText } from "shared/lib/designSystem";
import CounterpartyDetail from "./CounterpartyDetail";

const ParagraphText = styled(SecondaryText)`
  color: rgba(255, 255, 255, 0.64);
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
`;

const Container = styled.div`
  overflow-x: hidden;
`;

const CounterpartyList = [
  "R-EARN DIVERSIFIED",
  "ORTHOGONAL",
  "ALAMEDA RESEARCH",
  "CITADEL",
] as const;

export type Counterparty = typeof CounterpartyList[number];
const CounterpartyListSubset: Counterparty[] = ["R-EARN DIVERSIFIED"];

const Counterparties: React.FC = () => {
  // const { vaultAccounts } = useVaultAccounts("earn");
  // const userCounterpartyList = useMemo(() => {
  //   let userCounterpartyList: Counterparty[] = [];
  //   for (const earnVault of EarnVaultList) {
  //     const vaultAccount = vaultAccounts[earnVault];
  //     if (!vaultAccount) {
  //     } else {
  //       if (
  //         !isPracticallyZero(vaultAccount.totalBalance, 6) &&
  //         RibbonDiversifiedVaultList.includes(earnVault) &&
  //         !userCounterpartyList.includes("R-EARN DIVERSIFIED")
  //       ) {
  //         userCounterpartyList.push("R-EARN DIVERSIFIED");
  //       }
  //       if (
  //         !isPracticallyZero(vaultAccount.totalBalance, 6) &&
  //         RibbonDiversifiedVaultList.includes(earnVault) &&
  //         !userCounterpartyList.includes("CITADEL")
  //       ) {
  //         userCounterpartyList.push("CITADEL");
  //       }
  //     }
  //   }
  //   return userCounterpartyList;
  // }, [vaultAccounts]);
  return (
    <Container>
      <ParagraphText>
        The vault funds its weekly twin-win strategy with the yield earned from
        lending funds to a list of market makers vetted by Ribbon
      </ParagraphText>
      {CounterpartyListSubset.map((counterparty) => (
        <CounterpartyDetail counterparty={counterparty} />
      ))}
    </Container>
  );
};

export default Counterparties;
