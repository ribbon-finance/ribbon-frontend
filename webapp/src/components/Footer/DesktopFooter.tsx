import React, { useCallback } from "react";
import styled from "styled-components";

import { URLS } from "shared/lib/constants/constants";
import { BaseLink, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import sizes from "shared/lib/designSystem/sizes";
import theme from "shared/lib/designSystem/theme";

const FooterContainer = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: nowrap;
  border-top: ${theme.border.width} ${theme.border.style} ${colors.border};

  @media (max-width: ${sizes.md}px) {
    display: none;
  }
`;

const LinksContainer = styled.div`
  display: flex;
  align-items: center;
`;

const LeftContainer = styled(LinksContainer)`
  flex-grow: 1;
`;

const LinkItem = styled.div`
  padding: 0px 24px;
  opacity: 0.48;

  &:hover {
    opacity: 1;
  }
`;

const DesktopFooter = () => {
  const renderLinkItem = useCallback(
    (title: string, to: string) => (
      <BaseLink to={to} target="_blank" rel="noreferrer noopener">
        <LinkItem>
          <Title fontSize={12} lineHeight={16}>
            {title}
          </Title>
        </LinkItem>
      </BaseLink>
    ),
    []
  );

  return (
    <FooterContainer>
      <LeftContainer>
        {renderLinkItem("FAQ", URLS.docsFaq)}
        {renderLinkItem("BLOG", URLS.medium)}
        {renderLinkItem("TERMS", URLS.ribbonFinanceTerms)}
        {renderLinkItem("POLICY", URLS.ribbonFinancePolicy)}
        {renderLinkItem("AUCTIONS", URLS.auction)}
      </LeftContainer>
      <LinksContainer>
        {renderLinkItem("DISCORD", URLS.discord)}
        {renderLinkItem("TWITTER", URLS.twitter)}
        {renderLinkItem("GITHUB", URLS.github)}
      </LinksContainer>
    </FooterContainer>
  );
};

export default DesktopFooter;
