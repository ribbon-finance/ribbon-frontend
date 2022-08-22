import React, { useCallback, useContext, useMemo, useState } from "react";
import styled from "styled-components";
import {
  BaseButton,
  SecondaryText,
  Title,
  BaseLink,
  PrimaryText,
} from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import EarnFloatingMenu from "./FloatingMenu";
import ButtonArrow from "shared/lib/components/Common/ButtonArrow";
import {
  OrthogonalLogo,
  AlamedaResearchLogo,
  CitadelLogo,
} from "shared/lib/assets/icons/logo";
import { BoostIcon } from "shared/lib/assets/icons/icons";
import { Counterparty } from "./Counterparties";
import { SubgraphDataContext } from "shared/lib/hooks/subgraphDataContext";
import { formatUnits } from "ethers/lib/utils";
const BoostLogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  border-radius: 50%;
  position: relative;
`;

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
  margin-left: 16px;
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
  const { vaultSubgraphData } = useContext(SubgraphDataContext);
  const onToggleMenu = useCallback(() => {
    setIsMenuOpen((open) => !open);
  }, []);

  const principalOutstanding = useMemo(() => {
    if (!vaultSubgraphData.vaults.earn.rEARN) {
      return 0;
    }
    return vaultSubgraphData.vaults.earn.rEARN.principalOutstanding;
  }, [vaultSubgraphData.vaults.earn.rEARN]);
  const handleButtonClick = useCallback(async () => {
    onToggleMenu();
  }, [onToggleMenu]);

  const renderLogo = useCallback((s: Counterparty) => {
    switch (s) {
      case "R-EARN DIVERSIFIED":
        return (
          <BoostLogoContainer>
            <BoostIcon
              color={colors.primaryText}
              backgroundColor={colors.red}
            />
          </BoostLogoContainer>
        );
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
            R-Earn diversified is a pool of leading accredited crypto market
            makers whose credit assessment passed strict requirements set by
            Credora. Their teams have experience in deploying a wide array of
            strategies and strict risk management. 50% of the capital assigned
            to this pool is lent to{" "}
            <BaseLink
              color="white"
              target="_blank"
              rel="noreferrer noopener"
              to="https://genesistrading.com"
            >
              <PrimaryText lineHeight={20} fontSize={14}>
                Genesis
              </PrimaryText>
            </BaseLink>{" "}
            and 50% is lent to{" "}
            <BaseLink
              color="white"
              target="_blank"
              rel="noreferrer noopener"
              to="https://www.wintermute.com/"
            >
              <PrimaryText lineHeight={20} fontSize={14}>
                Wintermute
              </PrimaryText>
            </BaseLink>
            .
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
            ultrices ac tortor in convallis. Cras sed euismod enim. Vestibulum
            semper viverra dolor, ut dignissim quam suscipit convallis. Vivamus
            non pretium felis. Nam a tellus nisl. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Duis tincidunt gravida finibus. Nullam
            neque tellus, dignissim ut mi pellentesque, facilisis aliquet
            lectus. Nunc convallis elit ac nulla blandit, eu ultrices ipsum
            accumsan.
          </>
        );
      case "CITADEL":
        return (
          <>
            {" "}
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
            ultrices ac tortor in convallis. Cras sed euismod enim. Vestibulum
            semper viverra dolor, ut dignissim quam suscipit convallis. Vivamus
            non pretium felis. Nam a tellus nisl. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Duis tincidunt gravida finibus. Nullam
            neque tellus, dignissim ut mi pellentesque, facilisis aliquet
            lectus. Nunc convallis elit ac nulla blandit, eu ultrices ipsum
            accumsan.
          </>
        );
    }
  }, []);

  const renderPrincipleOutstanding = useCallback(
    (s: Counterparty) => {
      switch (s) {
        case "R-EARN DIVERSIFIED":
          return principalOutstanding ? (
            <>
              ${parseFloat(formatUnits(principalOutstanding, "6")).toFixed(2)}
            </>
          ) : (
            <>---</>
          );
        case "ORTHOGONAL":
          return <>$15.00M</>;
        case "ALAMEDA RESEARCH":
          return <>$15.00M</>;
        case "CITADEL":
          return <>$15.00M</>;
      }
    },
    [principalOutstanding]
  );

  const renderBorrowRate = useCallback((s: Counterparty) => {
    switch (s) {
      case "R-EARN DIVERSIFIED":
        return <>7.00%</>;
      case "ORTHOGONAL":
        return <>7.00%</>;
      case "ALAMEDA RESEARCH":
        return <>7.00%</>;
      case "CITADEL":
        return <>7.00%</>;
    }
  }, []);

  const renderCreditRating = useCallback((s: Counterparty) => {
    switch (s) {
      case "R-EARN DIVERSIFIED":
        return <>---</>;
      case "ORTHOGONAL":
        return <>---</>;
      case "ALAMEDA RESEARCH":
        return <>---</>;
      case "CITADEL":
        return <>---</>;
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
                Credit Rating
              </WalletContentText>
              <Title>{renderCreditRating(counterparty)}</Title>
            </Part>
            <Part>
              <WalletContentText color={colors.tertiaryText} fontSize={12}>
                Borrow Rate (APY)
              </WalletContentText>
              <Title>{renderBorrowRate(counterparty)}</Title>
            </Part>
          </Details>
        </EarnFloatingMenu>
      </div>
    </>
  );
};

export default CounterpartyDetail;
