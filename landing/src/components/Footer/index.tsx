import React, { FC } from "react";
import { Col, Row } from "react-bootstrap";
import styled from "styled-components";

import { BaseLink, Title } from "../../designSystem";
import colors from "shared/lib/designSystem/colors";
import sizes from "../../designSystem/sizes";

const FooterContainer = styled(Row)`
  width: 100%;
  padding: 80px 0;
  justify-content: center;
  margin-bottom: 20px;

  > * {
    @media (max-width: ${sizes.md}px) {
      margin-bottom: 40px;
    }
  }
`;

const LinkContainer = styled(BaseLink)`
  display: flex;
  margin: auto;
  margin-top: 40px;
  width: fit-content;
`;

const LinkItem = styled.div`
  width: fit-content;
  opacity: 0.48;
  text-align: center;

  &:hover {
    opacity: 1;
  }
`;

const LinkItemText = styled(Title)`
  font-size: 12px;
  line-height: 20px;
  white-space: nowrap;
`;

const FooterTitle = styled.div`
  font-size: 14px;
  font-family: VCR;
  text-transform: uppercase;
  text-align: center;
  color: ${colors.primaryText};
`;

interface Link {
  title: string;
  to: string;
  external?: boolean;
  download?: boolean;
}

const links = {
  about: [
    {
      title: "FAQS",
      to: "/faq",
    },
    {
      title: "BLOG",
      to: "https://medium.com/@ribbonfinance",
      external: true,
    },
    {
      title: "DOCS",
      to: "https://docs.ribbon.finance",
    },
    {
      title: "TERMS",
      to: "/terms",
    },
    {
      title: "POLICY",
      to: "/policy",
    },
  ] as Array<Link>,
  community: [
    {
      title: "GITHUB",
      to: "https://github.com/ribbon-finance",
      external: true,
    },
    {
      title: "DISCORD",
      to: "http://discord.ribbon.finance",
      external: true,
    },
    {
      title: "TWITTER",
      to: "https://twitter.com/ribbonfinance",
      external: true,
    },
    {
      title: "GOVERNANCE PORTAL",
      to: "https://vote.ribbon.finance",
      external: true,
    },
    {
      title: "SNAPSHOT",
      to: "https://snapshot.org/#/rbn.eth",
      external: true,
    },
    {
      title: "MEDIA KIT",
      to: "/ribbon_media_kit.zip",
      external: true,
      download: true,
    },
  ] as Array<Link>,
  data: [
    {
      title: "TOKEN TERMINAL",
      to: "https://www.tokenterminal.com/terminal/projects/ribbon-finance",
      external: true,
    },
    {
      title: "DEFI LLAMA",
      to: "https://defillama.com/protocol/ribbon-finance",
      external: true,
    },
  ] as Array<Link>,
};

const LinkList: FC<{ links: Array<Link> }> = ({ links }) => (
  <>
    {links.map((link, i) => {
      return (
        <LinkContainer
          key={i}
          to={link.to}
          target={link.external ? "_blank" : undefined}
          rel={link.external ? "noreferrer noopener" : undefined}
          download={link.download}
        >
          <LinkItem>
            <LinkItemText>{link.title}</LinkItemText>
          </LinkItem>
        </LinkContainer>
      );
    })}
  </>
);

const Footer = () => {
  return (
    <>
      <FooterContainer fluid noGutters>
        <Col xs={12} md={3}>
          <FooterTitle>About</FooterTitle>
          <LinkList links={links.about} />
        </Col>
        <Col xs={12} md={3}>
          <FooterTitle>Community</FooterTitle>
          <LinkList links={links.community} />
        </Col>
        <Col xs={12} md={3}>
          <FooterTitle>Data</FooterTitle>
          <LinkList links={links.data} />
        </Col>
      </FooterContainer>
    </>
  );
};

export default Footer;
