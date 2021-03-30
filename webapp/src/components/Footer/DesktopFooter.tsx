import React, { useCallback } from "react";
import styled from "styled-components";

import { BaseLink, Title } from "../../designSystem";
import colors from "../../designSystem/colors";
import sizes from "../../designSystem/sizes";
import theme from "../../designSystem/theme";

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

const LinkItemText = styled(Title)`
  font-size: 14px;
  line-height: 20px;
`;

const DesktopFooter = () => {
  const renderLinkItem = useCallback(
    (title: string, to: string, external: boolean = false) => (
      <BaseLink
        to={to}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer noopener" : undefined}
      >
        <LinkItem>
          <LinkItemText>{title}</LinkItemText>
        </LinkItem>
      </BaseLink>
    ),
    []
  );

  return (
    <FooterContainer>
      <LeftContainer>
        {renderLinkItem("FAQS", "/faq")}
        {renderLinkItem("BLOG", "https://medium.com/@ribbonfinance", true)}
        {renderLinkItem("TERMS", "/terms")}
        {renderLinkItem("POLICY", "/policy")}
      </LeftContainer>
      <LinksContainer>
        {renderLinkItem("DISCORD", "http://tiny.cc/ribbon-discord", true)}
        {renderLinkItem("TWITTER", "https://twitter.com/ribbonfinance", true)}
        {renderLinkItem("GITHUB", "https://github.com/ribbon-finance", true)}
      </LinksContainer>
    </FooterContainer>
  );
};

export default DesktopFooter;
