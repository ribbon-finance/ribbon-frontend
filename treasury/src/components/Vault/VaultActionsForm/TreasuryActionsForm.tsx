import React, { useMemo } from "react";
import { ExternalIcon } from "shared/lib/assets/icons/icons";
import styled from "styled-components";

import { PrimaryText, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";

import { WhitelistIcon } from "shared/lib/assets/icons/icons";

const Container = styled.div<{ variant: "desktop" | "mobile" }>`
  display: flex;
  flex-direction: column;
  ${(props) =>
    props.variant === "mobile" &&
    `
    height: 100%;
    align-items: center;
    justify-content:center;
  `}
`;

const FormContainer = styled.div`
  font-family: VCR, sans-serif;
  color: #f3f3f3;
  width: 100%;
  box-sizing: border-box;
  border-radius: ${theme.border.radius};
  background: ${colors.background.two};
  z-index: 1;
`;

const Link = styled.a`
  color: ${colors.primaryText};
  text-decoration: underline;

  &:hover {
    color: ${colors.primaryText}CC;
  }
`;

const WhitelistLogoContainer = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 100px;
  background: ${(props) => props.color}14;
`;

const WhitelistTitle = styled(Title)`
  font-size: 22px;
  line-height: 28px;
  letter-spacing: 1px;
  text-align: center;
  margin: 10px 0;
`;

const WhitelistDescription = styled(PrimaryText)`
  font-size: 16px;
  line-height: 24px;
  color: ${colors.text};
`;

interface TreasuryActionsFormProps {
  variant: "desktop" | "mobile";
}

const TreasuryActionsForm: React.FC<TreasuryActionsFormProps> = ({
  variant,
}) => {
  const color = "#fc0a54";

  const body = useMemo(() => {
    return (
      <div className="d-flex flex-column align-items-center p-4">
        <WhitelistLogoContainer color={color} className="mt-3">
          <WhitelistIcon color={color} height={64} />
        </WhitelistLogoContainer>

        <WhitelistTitle className="mt-3">
          CONNECT TO A WHITELISTED ADDRESS
        </WhitelistTitle>

        <WhitelistDescription className="mx-3 mt-2 text-center">
          The Ribbon Treasury product is currently in beta and access to the
          product is limited to pilot partners with whitelisted wallets
        </WhitelistDescription>

        <PrimaryText className="d-block mt-3 mb-3">
          <Link
            href="https://ribbonfinance.medium.com/theta-vault-backtest-results-6e8c59adf38c"
            target="_blank"
            rel="noreferrer noopener"
            className="d-flex"
          >
            <span className="mr-2">Learn More</span>
            <ExternalIcon color="white" />
          </Link>
        </PrimaryText>
      </div>
    );
  }, []);

  return (
    <Container variant={variant}>
      <FormContainer>{body}</FormContainer>
    </Container>
  );
};

export default TreasuryActionsForm;
