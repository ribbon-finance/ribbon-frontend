import React, { useRef } from "react";
import styled from "styled-components";

import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import {
  BaseLink,
  SecondaryText,
  Subtitle,
  Title,
} from "shared/lib/designSystem";
import useTreasuryAccount from "shared/lib/hooks/useTreasuryAccount";
import { formatAmount } from "shared/lib/utils/math";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";
import OverviewBarchart from "./OverviewBarchart";
import { getAssetColor, getAssetDisplay } from "shared/lib/utils/asset";
import useElementSize from "shared/lib/hooks/useElementSize";
import {
  getEtherscanURI,
  RibbonTreasuryAddress,
} from "shared/lib/constants/constants";
import { CHAINID, isDevelopment } from "shared/lib/utils/env";
import { ExternalIcon } from "shared/lib/assets/icons/icons";
import useScreenSize from "shared/lib/hooks/useScreenSize";
import sizes from "shared/lib/designSystem/sizes";

const SectionLabel = styled.div`
  display: flex;
  padding: 16px;
  background: ${colors.red}1F;
  border-radius: ${theme.border.radiusSmall};
`;

const TreasuryBreakdown = () => {
  const { width } = useScreenSize();
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: containerWidth } = useElementSize(containerRef);
  const { accounts, total, loading: treasuryLoading } = useTreasuryAccount();
  const loadingText = useTextAnimation(treasuryLoading);

  const chainId = isDevelopment() ? CHAINID.ETH_KOVAN : CHAINID.ETH_MAINNET;

  return (
    <div
      ref={containerRef}
      className="d-flex flex-column w-100 align-items-center"
    >
      <SectionLabel>
        <Subtitle
          color={colors.red}
          fontSize={11}
          lineHeight={12}
          letterSpacing={1}
        >
          Ribbon Treasury
        </Subtitle>
      </SectionLabel>
      <Title
        fontSize={width >= sizes.lg ? 80 : 64}
        lineHeight={width >= sizes.lg ? 96 : 72}
        letterSpacing={1}
        className="mt-3"
      >
        {treasuryLoading ? loadingText : `$${formatAmount(total)}`}
      </Title>

      {/* Barchart */}
      {!treasuryLoading && (
        <>
          <div className="d-flex flex-row mt-4 w-100 justify-content-center">
            <OverviewBarchart
              items={accounts.slice(0, 3).map((account) => ({
                name: getAssetDisplay(account.asset),
                value: account.value,
                formattedValue: `$${formatAmount(account.value)}`,
                color: getAssetColor(account.asset),
              }))}
              maxBarWidth={containerWidth * 0.4}
              maxValue={accounts[0]?.value || 0}
            />
          </div>
        </>
      )}

      <BaseLink
        to={`${getEtherscanURI(chainId)}/address/${
          RibbonTreasuryAddress[chainId]
        }`}
        target="_blank"
        rel="noreferrer noopener"
        className="d-flex align-items-center mt-5"
      >
        <SecondaryText fontSize={12} lineHeight={16} fontWeight={400}>
          View Address
        </SecondaryText>
        <ExternalIcon
          width={16}
          height={16}
          className="ml-2"
          color={colors.text}
        />
      </BaseLink>
    </div>
  );
};

export default TreasuryBreakdown;
