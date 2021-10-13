import React, { useCallback } from "react";
import styled from "styled-components";

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
          <Title fontSize={14} lineHeight={20}>
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
        {renderLinkItem("FAQ", "https://ribbon.finance/faq")}
        {renderLinkItem("BLOG", "https://medium.com/@ribbonfinance")}
        {renderLinkItem("TERMS", "https://ribbon.finance/terms")}
        {renderLinkItem("POLICY", "https://ribbon.finance/policy")}
      </LeftContainer>
      <LinksContainer>
        {renderLinkItem("DISCORD", "http://discord.ribbon.finance")}
        {renderLinkItem("TWITTER", "https://twitter.com/ribbonfinance")}
        {renderLinkItem("GITHUB", "https://github.com/ribbon-finance")}
      </LinksContainer>
    </FooterContainer>
  );
};

export default DesktopFooter;
