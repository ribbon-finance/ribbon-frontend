import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ExternalIcon } from "shared/lib/assets/icons/icons";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, ethers } from "ethers";
import moment from "moment";

import {
  BaseLink,
  PrimaryText,
  SecondaryText,
  Title,
} from "shared/lib/designSystem";
import { formatBigNumber, isPracticallyZero } from "shared/lib/utils/math";
import {
  VaultAddressMap,
  VaultMaxDeposit,
} from "shared/lib/constants/constants";
import { useVaultData } from "shared/lib/hooks/web3DataContext";
import { getVaultColor, isETHVault, isVaultFull } from "shared/lib/utils/vault";
import colors from "shared/lib/designSystem/colors";
import { getAssetDisplay } from "shared/lib/utils/asset";
import { ERC20Token } from "shared/lib/models/eth";
import theme from "shared/lib/designSystem/theme";
import ButtonArrow from "shared/lib/components/Common/ButtonArrow";
import useTokenAllowance from "shared/lib/hooks/useTokenAllowance";
import SwapBTCDropdown from "./common/SwapBTCDropdown";
import useVaultActivity from "shared/lib/hooks/useVaultActivity";
import { VaultActivityMeta, VaultShortPosition } from "shared/lib/models/vault";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import HelpInfo from "shared/lib/components/Common/HelpInfo";
import useVaultAccounts from "shared/lib/hooks/useVaultAccounts";

import { FormStepProps, VaultValidationErrors } from "./types";
import useVaultActionForm from "../../../hooks/useVaultActionForm";
import { ACTIONS } from "./Modal/types";
import { WhitelistIcon } from "../../../assets/icons/icons";
import { ActionButton } from "shared/lib/components/Common/buttons";
import { getVaultURI } from "../../../constants/constants";

const { parseUnits, formatUnits } = ethers.utils;

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
  variant
}) => {
  const color = "#fc0a54";
 
  const body = useMemo(() => {
      return (
        <div className="d-flex flex-column align-items-center p-4">
          <WhitelistLogoContainer color={color} className="mt-3">
            <WhitelistIcon color={color} height={64} />
          </WhitelistLogoContainer>

          <WhitelistTitle className="mt-3">CONNECT TO A WHITELISTED ADDRESS</WhitelistTitle>

          <WhitelistDescription className="mx-3 mt-2 text-center">
            The Ribbon Treasury product is currently in beta and access to the product is limited to pilot partners with whitelisted wallets
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
  }, [])

  return (
    <Container variant={variant}>
      <FormContainer>{body}</FormContainer>
    </Container>
  );
};

export default TreasuryActionsForm;
