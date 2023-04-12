import React from "react";
import styled from "styled-components";
import { SecondaryText } from "shared/lib/designSystem";
import CounterpartyDetail from "./CounterpartyDetail";
import { VaultOptions } from "shared/lib/constants/constants";
import colors from "shared/lib/designSystem/colors";

const ParagraphText = styled(SecondaryText)`
  color: rgba(255, 255, 255, 0.64);
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
`;

const Container = styled.div`
  overflow-x: hidden;
`;

export const Link = styled.a`
  color: ${colors.primaryText};
  text-decoration: underline;

  &:hover {
    color: ${colors.primaryText}CC;
  }
`;

const CounterpartyList = ["Backed"] as const;

export type Counterparty = typeof CounterpartyList[number];
const CounterpartyListSubset: Counterparty[] = ["Backed"];

interface CounterpartiesProps {
  vaultOption: VaultOptions;
}

// Calls user_checkpoint and shows a transaction loading screen
const Counterparties: React.FC<CounterpartiesProps> = ({ vaultOption }) => {
  return (
    <Container>
      <ParagraphText>
        The vault funds its weekly twin-win strategy with the yield earned from
        purchasing Backed IB01 $ Treasury Bond 0-1yr tokens. bIB01 is a tracker
        certificate issued as an ERC-20 token which tracks the price of the
        iShares $ Treasury Bond 0-1yr UCITS ETF (the underlying).{" "}
        <Link
          href="https://uploads-ssl.webflow.com/622f4d1701727dc75198439a/640f24743a879f53d86468fe_bIB01%20Factsheet.pdf"
          target="_blank"
          rel="noreferrer noopener"
          className="d-inline-flex align-items-center"
        >
          <span className="mr-2">Read More</span>
        </Link>
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
