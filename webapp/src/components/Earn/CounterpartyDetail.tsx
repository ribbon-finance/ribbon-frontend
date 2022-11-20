import React, { useCallback, useState } from "react";
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
import { BoostIcon, ExternalIcon } from "shared/lib/assets/icons/icons";
import { Counterparty } from "./Counterparties";
import { formatUnits } from "ethers/lib/utils";
import { useAirtableEarnData } from "shared/lib/hooks/useAirtableEarnData";
import { useV2VaultData } from "shared/lib/hooks/web3DataContext";
import { VaultOptions } from "shared/lib/constants/constants";

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
  flex-direction: row;
  width: 100%;
`;

const Detail = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
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
  const { borrowRate, loading } = useAirtableEarnData(vaultOption);
  const onToggleMenu = useCallback(() => {
    setIsMenuOpen((open) => !open);
  }, []);

  const handleButtonClick = useCallback(async () => {
    onToggleMenu();
  }, [onToggleMenu]);

  const {
    loading: vaultLoading,
    data: { totalBalance },
  } = useV2VaultData(vaultOption);

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
    }
  }, []);

  const renderDescription = useCallback((s: Counterparty) => {
    switch (s) {
      case "R-EARN DIVERSIFIED":
        return (
          <>
            R-Earn diversified is a basket of leading accredited crypto market
            makers whose credit assessment passed strict requirements set by{" "}
            <BaseLink
              color="white"
              target="_blank"
              rel="noreferrer noopener"
              to="https://credora.io/"
            >
              <PrimaryText lineHeight={20} fontSize={14}>
                Credora
              </PrimaryText>
            </BaseLink>
            , the leading real-time credit underwriter in crypto. 50% of the
            capital assigned to this pool is lent to{" "}
            <BaseLink
              color="white"
              target="_blank"
              rel="noreferrer noopener"
              to="https://www.wintermute.com/"
            >
              <PrimaryText lineHeight={20} fontSize={14}>
                Wintermute
              </PrimaryText>
            </BaseLink>{" "}
            and 50% is lent to{" "}
            <BaseLink
              color="white"
              target="_blank"
              rel="noreferrer noopener"
              to="https://folkvang.io/"
            >
              <PrimaryText lineHeight={20} fontSize={14}>
                Folkvang
              </PrimaryText>
            </BaseLink>
            .
          </>
        );
    }
  }, []);

  const renderPrincipleOutstanding = useCallback(
    (s: Counterparty) => {
      switch (s) {
        case "R-EARN DIVERSIFIED":
          return (
            <>
              {vaultLoading
                ? "---"
                : (parseFloat(formatUnits(totalBalance, "6")) * 0.9956).toFixed(
                    2
                  )}
            </>
          );
      }
    },
    [totalBalance, vaultLoading]
  );

  const renderBorrowRate = useCallback(
    (s: Counterparty) => {
      if (loading) {
        return <>---</>;
      }
      switch (s) {
        case "R-EARN DIVERSIFIED":
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
            <StyledTitle>{counterparty}</StyledTitle>
            <FundingSourceData>
              {renderBorrowRate(counterparty)} Borrow Rate (APR)
            </FundingSourceData>
          </CounterpartyContent>
          <ButtonArrow isOpen={isMenuOpen} color="white"></ButtonArrow>
        </OpenCounterpartyButton>
      </CounterpartyContainer>
      <div>
        <EarnFloatingMenu isOpen={isMenuOpen}>
          <ParagraphText>{renderDescription(counterparty)}</ParagraphText>
          <Details>
            <Detail>
              <FundingSourceData color={colors.tertiaryText} fontSize={12}>
                Principal Outstanding
              </FundingSourceData>
              <Title>{renderPrincipleOutstanding(counterparty)}</Title>
              <FundingSourceData
                color={colors.tertiaryText}
                fontSize={12}
                marginTop={16}
              >
                Market Maker
              </FundingSourceData>
              <Title>{"Wintermute"}</Title>
              <Title>{"Folkvang"}</Title>
            </Detail>
            <Detail>
              <FundingSourceData color={colors.tertiaryText} fontSize={12}>
                Borrow Rate (APR)
              </FundingSourceData>
              <Title>{renderBorrowRate(counterparty)}</Title>
              <FundingSourceData
                color={colors.tertiaryText}
                fontSize={12}
                marginTop={16}
              >
                <div className="d-flex flex-row">
                  Credit Rating
                  <div className="ml-1">
                    <BaseLink
                      color="white"
                      target="_blank"
                      rel="noreferrer noopener"
                      to="https://credora.gitbook.io/credit-methodology/SbLmTxogePkrzsF4z9IK/credit-evaluation/credit-score"
                    >
                      <ExternalIcon
                        width={16}
                        containerStyle={{ display: "flex" }}
                        color="white"
                      />
                    </BaseLink>
                  </div>
                </div>
              </FundingSourceData>
              {/* <Title>{renderCreditRating(counterparty)}</Title> */}
              <Title>A</Title>
              <Title>AA</Title>
            </Detail>
          </Details>
        </EarnFloatingMenu>
      </div>
    </>
  );
};

export default CounterpartyDetail;
