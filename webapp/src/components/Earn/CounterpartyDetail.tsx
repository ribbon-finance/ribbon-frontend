import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { BaseButton, SecondaryText, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import EarnFloatingMenu from "./FloatingMenu";
import ButtonArrow from "shared/lib/components/Common/ButtonArrow";
import { Counterparty, Link } from "./Counterparties";
import { VaultOptions } from "shared/lib/constants/constants";
import { BackedLogo } from "shared/lib/assets/icons/backedLogo";
import { useAirtableEarnData } from "shared/lib/hooks/useAirtableEarnData";
const BoostLogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  border-radius: 50%;
  position: relative;
`;

const CounterpartyContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  width: 100%;
  margin-left: 16px;
  &:hover {
    opacity: ${theme.hover.opacity};
  }
`;

const FundingSourceData = styled(SecondaryText)<{
  marginTop?: number;
}>`
  color: ${colors.tertiaryText};
  margin-top: ${(props) => (props.marginTop ? `${props.marginTop}px` : `0px`)};
  font-size: 12px;
  line-height: 24px;
`;

const StyledTitle = styled(Title)`
  text-align: left;
`;
const OpenCounterpartyButton = styled(BaseButton)`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 64px;
  z-index: 2;

  background: ${colors.background.three};
  border-radius: 8px;

  &:hover {
    opacity: ${theme.hover.opacity};
  }
`;

const CounterpartyContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: ${colors.background.four};
  border-radius: 8px;
  margin-top: 16px;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Detail = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 16px;
`;

interface VaultStrategyExplainerProps {
  counterparty: Counterparty;
  vaultOption: VaultOptions;
}

const CounterpartyDetail: React.FC<VaultStrategyExplainerProps> = ({
  counterparty,
  vaultOption,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const onToggleMenu = useCallback(() => {
    setIsMenuOpen((open) => !open);
  }, []);
  const { borrowRate, loading } = useAirtableEarnData(vaultOption);
  const handleButtonClick = useCallback(async () => {
    onToggleMenu();
  }, [onToggleMenu]);

  const renderLogo = useCallback((s: Counterparty) => {
    switch (s) {
      case "Backed":
        return (
          <BoostLogoContainer>
            <BackedLogo />
          </BoostLogoContainer>
        );
    }
  }, []);

  const renderName = useCallback((s: Counterparty) => {
    switch (s) {
      case "Backed":
        return "Backed IB01";
    }
  }, []);

  const renderBorrowRate = useCallback(
    (s: Counterparty) => {
      if (loading) {
        return <>---</>;
      }
      switch (s) {
        case "Backed":
          return <>{(borrowRate * 100).toFixed(2)}%</>;
      }
    },
    [borrowRate, loading]
  );

  return (
    <>
      <CounterpartyContainer>
        <OpenCounterpartyButton role="button" onClick={handleButtonClick}>
          {renderLogo(counterparty)}
          <CounterpartyContent>
            <StyledTitle>{renderName(counterparty)}</StyledTitle>
            <FundingSourceData>
              {renderBorrowRate(counterparty)} Borrow Rate (APR)
            </FundingSourceData>
          </CounterpartyContent>
          <ButtonArrow isOpen={isMenuOpen} color="white"></ButtonArrow>
        </OpenCounterpartyButton>
      </CounterpartyContainer>
      <div className="mt-2">
        <EarnFloatingMenu isOpen={isMenuOpen}>
          <Details>
            <StyledTitle fontSize={16}>Product</StyledTitle>
            <Detail>
              <FundingSourceData color={colors.tertiaryText} fontSize={12}>
                Tokenizer
              </FundingSourceData>
              <Title>Backed Finance AG</Title>
              <FundingSourceData
                color={colors.tertiaryText}
                fontSize={12}
                marginTop={16}
              >
                Issuer
              </FundingSourceData>
              <Title>Backed Assets GmbH</Title>
              <FundingSourceData
                color={colors.tertiaryText}
                fontSize={12}
                marginTop={16}
              >
                Broker
              </FundingSourceData>
              <Title>Maerki Baumann & Co. AG</Title>
              <Title>InCore Bank AG</Title>
              <FundingSourceData
                color={colors.tertiaryText}
                fontSize={12}
                marginTop={16}
              >
                Custody
              </FundingSourceData>
              <Title>Maerki Baumann & Co. AG</Title>
              <Title>InCore Bank AG</Title>
              <FundingSourceData
                color={colors.tertiaryText}
                fontSize={12}
                marginTop={16}
              >
                Security Agent
              </FundingSourceData>
              <Title>Security Agent Services Ltd.</Title>
            </Detail>
          </Details>
          <Details className="mt-5">
            <StyledTitle fontSize={16}>Underlying</StyledTitle>
            <Detail>
              <FundingSourceData color={colors.tertiaryText} fontSize={12}>
                Issuer
              </FundingSourceData>
              <Title>iShares</Title>
              <FundingSourceData
                color={colors.tertiaryText}
                fontSize={12}
                marginTop={16}
              >
                Name
              </FundingSourceData>
              <Title>iShares $ Treasury Bond 0-1yr UCITS ETF</Title>
              <FundingSourceData
                color={colors.tertiaryText}
                fontSize={12}
                marginTop={16}
              >
                ISIN
              </FundingSourceData>
              <Title>IE00BGSF1X88</Title>
              <FundingSourceData
                color={colors.tertiaryText}
                fontSize={12}
                marginTop={16}
              >
                Ticker
              </FundingSourceData>
              <Title>IB01</Title>
              <Link
                href="https://www.blackrock.com/americas-offshore/en/products/307243/ishares-treasury-bond-0-1yr-ucits-etf"
                target="_blank"
                rel="noreferrer noopener"
                className="d-inline-flex mt-3 align-items-center"
              >
                <span className="mr-2">Read More</span>
              </Link>
            </Detail>
          </Details>
        </EarnFloatingMenu>
      </div>
    </>
  );
};

export default CounterpartyDetail;
