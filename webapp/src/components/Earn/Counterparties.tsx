import React from "react";
import styled from "styled-components";
import { SecondaryText } from "shared/lib/designSystem";
import CounterpartyDetail from "./CounterpartyDetail";
import { VaultOptions } from "shared/lib/constants/constants";

const ParagraphText = styled(SecondaryText)`
  color: rgba(255, 255, 255, 0.64);
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
`;

const Container = styled.div`
  overflow-x: hidden;
`;

const CounterpartyList = ["R-EARN DIVERSIFIED"] as const;

export type Counterparty = typeof CounterpartyList[number];
const CounterpartyListSubset: Counterparty[] = ["R-EARN DIVERSIFIED"];

interface CounterpartiesProps {
  vaultOption: VaultOptions;
}

// Calls user_checkpoint and shows a transaction loading screen
const Counterparties: React.FC<CounterpartiesProps> = ({ vaultOption }) => {
  return (
    <Container>
      <ParagraphText>
        The vault funds its weekly twin-win strategy with the yield earned from
        lending funds to a list of market makers vetted by Ribbon
      </ParagraphText>
      {CounterpartyListSubset.map((counterparty) => (
        <CounterpartyDetail
          counterparty={counterparty}
          vaultOption={vaultOption}
        />
      ))}
    </Container>
  );
};

export default Counterparties;
