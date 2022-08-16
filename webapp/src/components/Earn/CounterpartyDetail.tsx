import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { BaseButton, SecondaryText, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import EarnFloatingMenu from "./FloatingMenu";
import ButtonArrow from "shared/lib/components/Common/ButtonArrow";
import Logo, {
  OrthogonalLogo,
  AlamedaResearchLogo,
  CitadelLogo,
} from "shared/lib/assets/icons/logo";
import { Counterparty } from "./Counterparties";

const ParagraphText = styled(SecondaryText)`
  color: rgba(255, 255, 255, 0.64);
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  margin-top: 8px;
  margin-bottom: 16px;
`;

const WalletContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  width: 100%;
  margin-left: 8px;
  &:hover {
    opacity: ${theme.hover.opacity};
  }
`;

const WalletContentText = styled(SecondaryText)<{
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
const WalletButton = styled(BaseButton)`
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

const WalletContainer = styled.div`
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
  flex-direction: row;
  width: 100%;
`;

const Part = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin-top: 16px;
`;

interface VaultStrategyExplainerProps {
  counterparty: Counterparty;
}

const CounterpartyDetail: React.FC<VaultStrategyExplainerProps> = ({
  counterparty,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const onToggleMenu = useCallback(() => {
    setIsMenuOpen((open) => !open);
  }, []);

  const handleButtonClick = useCallback(async () => {
    onToggleMenu();
  }, [onToggleMenu]);

  const renderLogo = useCallback((s: Counterparty) => {
    switch (s) {
      case "R-EARN DIVERSIFIED":
        return <Logo height="40px" width="40px" />;
      case "ORTHOGONAL":
        return <OrthogonalLogo />;
      case "ALAMEDA RESEARCH":
        return <AlamedaResearchLogo />;
      case "CITADEL":
        return <CitadelLogo />;
    }
  }, []);

  const renderAPY = useCallback((s: Counterparty) => {
    switch (s) {
      case "R-EARN DIVERSIFIED":
        return <>7.00</>;
      case "ORTHOGONAL":
        return <>7.01</>;
      case "ALAMEDA RESEARCH":
        return <>7.02</>;
      case "CITADEL":
        return <>7.03</>;
    }
  }, []);

  const renderDescription = useCallback((s: Counterparty) => {
    switch (s) {
      case "R-EARN DIVERSIFIED":
        return (
          <>
            Orthogonal Trading is a multi-strategy cryptocurrency trading firm
            focused solely on the digital asset markets. The team bring
            experience in portfolio and risk management, auditing, quantitative
            trading, and blockchain system development from Goldman Sachs,
            Morgan Stanley, B2C2 and more.
          </>
        );
      case "ORTHOGONAL":
        return (
          <>
            {" "}
            Orthogonal Trading is a multi-strategy cryptocurrency trading firm
            focused solely on the digital asset markets. The team bring
            experience in portfolio and risk management, auditing, quantitative
            trading, and blockchain system development from Goldman Sachs,
            Morgan Stanley, B2C2 and more.
          </>
        );
      case "ALAMEDA RESEARCH":
        return (
          <>
            {" "}
            Orthogonal Trading is a multi-strategy cryptocurrency trading firm
            focused solely on the digital asset markets. The team bring
            experience in portfolio and risk management, auditing, quantitative
            trading, and blockchain system development from Goldman Sachs,
            Morgan Stanley, B2C2 and more.
          </>
        );
      case "CITADEL":
        return (
          <>
            {" "}
            Orthogonal Trading is a multi-strategy cryptocurrency trading firm
            focused solely on the digital asset markets. The team bring
            experience in portfolio and risk management, auditing, quantitative
            trading, and blockchain system development from Goldman Sachs,
            Morgan Stanley, B2C2 and more.
          </>
        );
    }
  }, []);

  const renderPrincipleOutstanding = useCallback((s: Counterparty) => {
    switch (s) {
      case "R-EARN DIVERSIFIED":
        return <>$15.00M</>;
      case "ORTHOGONAL":
        return <>$15.00M</>;
      case "ALAMEDA RESEARCH":
        return <>$15.00M</>;
      case "CITADEL":
        return <>$15.00M</>;
    }
  }, []);

  const renderTotalBorrowed = useCallback((s: Counterparty) => {
    switch (s) {
      case "R-EARN DIVERSIFIED":
        return <>$15.00M</>;
      case "ORTHOGONAL":
        return <>$15.00M</>;
      case "ALAMEDA RESEARCH":
        return <>$15.00M</>;
      case "CITADEL":
        return <>$15.00M</>;
    }
  }, []);

  const renderBorrowRate = useCallback((s: Counterparty) => {
    switch (s) {
      case "R-EARN DIVERSIFIED":
        return <>$15.00M</>;
      case "ORTHOGONAL":
        return <>$15.00M</>;
      case "ALAMEDA RESEARCH":
        return <>$15.00M</>;
      case "CITADEL":
        return <>$15.00M</>;
    }
  }, []);

  const renderCreditRating = useCallback((s: Counterparty) => {
    switch (s) {
      case "R-EARN DIVERSIFIED":
        return <>100</>;
      case "ORTHOGONAL":
        return <>100</>;
      case "ALAMEDA RESEARCH":
        return <>100</>;
      case "CITADEL":
        return <>100</>;
    }
  }, []);
  return (
    <>
      <WalletContainer>
        <WalletButton role="button" onClick={handleButtonClick}>
          {renderLogo(counterparty)}
          <WalletContent>
            <StyledTitle>{counterparty}</StyledTitle>
            <WalletContentText>
              {renderAPY(counterparty)}% Borrow Rate (APY)
            </WalletContentText>
          </WalletContent>
          <ButtonArrow isOpen={isMenuOpen} color="white"></ButtonArrow>
        </WalletButton>
      </WalletContainer>
      <div>
        <EarnFloatingMenu isOpen={isMenuOpen}>
          <ParagraphText>{renderDescription(counterparty)}</ParagraphText>
          <Details>
            <Part>
              <WalletContentText color={colors.tertiaryText} fontSize={12}>
                Principal Outstanding
              </WalletContentText>
              <Title>{renderPrincipleOutstanding(counterparty)}</Title>
              <WalletContentText
                color={colors.tertiaryText}
                fontSize={12}
                marginTop={16}
              >
                Total Borrowed
              </WalletContentText>
              <Title>{renderTotalBorrowed(counterparty)}</Title>
            </Part>
            <Part>
              <WalletContentText color={colors.tertiaryText} fontSize={12}>
                Borrow Rate (APY)
              </WalletContentText>
              <Title>{renderBorrowRate(counterparty)}</Title>
              <WalletContentText
                color={colors.tertiaryText}
                fontSize={12}
                marginTop={16}
              >
                Credit Rating
              </WalletContentText>
              <Title>{renderCreditRating(counterparty)}</Title>
            </Part>
          </Details>
        </EarnFloatingMenu>
      </div>
    </>
  );
};

export default CounterpartyDetail;
