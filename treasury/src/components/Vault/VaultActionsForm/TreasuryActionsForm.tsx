import React, { useCallback, useMemo, useState } from "react";
import { ExternalIcon } from "shared/lib/assets/icons/icons";
import styled from "styled-components";

import { PrimaryText, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";

import { AccessIcon } from "../../../assets/icons/icons";
import {
  BaseInput,
  BaseInputContainer,
  SecondaryText,
} from "shared/lib/designSystem";
import { ConnectWalletButton } from "shared/lib/components/Common/buttons";
import { Button } from "shared/lib/components/Common/buttons";
import { ethers } from "ethers";
import { hashCode, TreasuryVaultOptions } from "../../../constants/constants";
import useGlobalAccess from "../../../hooks/useGlobalAccess";

export const CodeInput = styled.input<{
  inputWidth?: string;
  fontSize?: number;
  lineHeight?: number;
}>`
  width: ${(props) => props.inputWidth || "80%"};
  height: 100%;
  font-size: ${(props) => props.fontSize || 40}px;
  line-height: ${(props) => props.lineHeight || 64}px;
  color: #fc0a5480;
  border: none;
  background: none;
  font-family: VCR, sans-serif;
  text-align: center;
  text-transform: uppercase;

  &:focus::placeholder {
    color: transparent;
  }

  &:focus {
    color: #fc0a5480;
    background: none;
    border: none;
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
`;

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

export const EnterButton = styled(Button)`
  background: #fc0a5420;
  color: #fc0a54;

  &:hover {
    color: #fc0a54;
  }
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
  margin: 10px 0px 30px 0px;
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
  const { handleInputChange, handleSubmission, error, code, globalAccess } =
    useGlobalAccess();

  const body = useMemo(() => {
    console.log(globalAccess);
    return (
      <div className="d-flex flex-column align-items-center p-4">
        <WhitelistLogoContainer color={color} className="mt-3">
          <AccessIcon color={color} height={64} />
        </WhitelistLogoContainer>

        <WhitelistTitle className="mt-3">ACCESS CODE REQUIRED</WhitelistTitle>

        <BaseInputContainer className="mb-2" error={error != ""}>
          <CodeInput
            type="text"
            className="form-control"
            aria-label="ETH"
            placeholder="-"
            value={code}
            onChange={handleInputChange}
            inputWidth={"100%"}
            maxLength={6}
          />
        </BaseInputContainer>
        <EnterButton
          onClick={handleSubmission}
          type="button"
          color={color}
          className="btn mt-2 py-3 mb-2"
          disabled={code.length != 6}
        >
          ENTER
        </EnterButton>
        {error != "" && (
          <SecondaryText color={colors.red}>{error}</SecondaryText>
        )}

        <WhitelistDescription className="mx-3 mt-4 text-center">
          The Ribbon Treasury product is currently in beta and access to the
          product is limited to pilot partners.
        </WhitelistDescription>

        <PrimaryText className="d-block mt-3 mb-3">
          <Link
            href="https://ribbonfinance.medium.com/ribbon-treasury-ee311f7ce7d8"
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
  }, [code, handleInputChange, error, globalAccess]);

  return (
    <Container variant={variant}>
      <FormContainer>{body}</FormContainer>
    </Container>
  );
};

export default TreasuryActionsForm;
