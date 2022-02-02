import React, { useMemo } from "react";
import { ExternalIcon } from "shared/lib/assets/icons/icons";
import styled from "styled-components";

import { PrimaryText, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";

import { BaseInputContainer, SecondaryText } from "shared/lib/designSystem";
import { Button } from "shared/lib/components/Common/buttons";
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
  background: #fc0a5424;
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

type SVGProps = React.SVGAttributes<SVGElement>;

const RBNLogo: React.FC<SVGProps> = ({ ...props }) => (
  <svg
    viewBox="0 -55 480 480"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect
      y="-60"
      width="480"
      height="480"
      rx="240"
      fill="#FC0A54"
      fill-opacity="0.24"
    />
    <path
      d="M239.401 86.4L33.0012 301.8C33.0012 301.8 30.2809 296.982 27.7146 292.2C26.5577 290.044 25.4321 287.896 24.6012 286.2C23.4505 283.851 23.1372 283.636 22.2012 281.4C21.2309 279.6 19.8012 276 19.8012 276L19.2012 274.2L239.401 43.8L378.601 187.8L238.201 338.4L216.601 318L337.201 187.8L239.401 86.4Z"
      fill="#FC0A54"
    />
  </svg>
);

interface TreasuryActionsFormProps {
  variant: "desktop" | "mobile";
}

const TreasuryActionsForm: React.FC<TreasuryActionsFormProps> = ({
  variant,
}) => {
  const color = "#fc0a54";
  const { handleInputChange, handleSubmission, error, code } =
    useGlobalAccess();

  const body = useMemo(() => {
    return (
      <div className="d-flex flex-column align-items-center p-4">
        <WhitelistLogoContainer color={color} className="mt-3">
          <RBNLogo height={64} />
        </WhitelistLogoContainer>

        <WhitelistTitle className="mt-3">ACCESS CODE REQUIRED</WhitelistTitle>

        <BaseInputContainer className="mb-2" error={error !== ""}>
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
          disabled={code.length !== 6}
        >
          ENTER
        </EnterButton>
        {error !== "" && (
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
  }, [code, handleInputChange, handleSubmission, error]);

  return (
    <Container variant={variant}>
      <FormContainer>{body}</FormContainer>
    </Container>
  );
};

export default TreasuryActionsForm;
