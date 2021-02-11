import { GithubOutlined, TwitterOutlined } from "@ant-design/icons";
import { Col, Layout, Row } from "antd";
import React from "react";
import { useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { SecondaryText } from "../designSystem";
import EmailCaptureForm from "./EmailCaptureForm";
import RibbonLogo from "../img/RibbonLogo.svg";

const { Footer: AntFooter } = Layout;

const EmailCaptureContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 64px 0;
  background-color: #000000;
`;

const EmailCaptureTitle = styled(SecondaryText)`
  margin-bottom: 16px;
  font-family: "Inter", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 22px;
  line-height: 28px;
`;

const EmailCaptureSubtitle = styled(SecondaryText)`
  font-family: "Inter", sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  margin-bottom: 24px;
  color: rgba(255, 255, 255, 0.8);
`;

const EmailCaptureIcon = styled.img`
  height: 60px;
  width: 60px;
  margin-bottom: 24px;
  color: #f9457a;
`;

const FooterLinks = styled(Row)`
  background-color: #000000;
  padding: 40px 15%;
`;

const NavAnchor = styled.a`
  color: rgba(255, 255, 255, 0.9);
  font-family: "Inter", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  margin: 0 20px;

  &:hover {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const FooterLeft = styled(Col)`
  display: flex;
  align-items: center;
`;

const FooterRight = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const iconStyles = {
  color: "white",
  fontSize: 30,
  marginLeft: 12,
  marginRight: 12,
};

const Footer = () => {
  return (
    <AntFooter
      style={{
        backgroundColor: "inherit",
        marginTop: 60,
        paddingBottom: 0,
      }}
    >
      <EmailCaptureContainer>
        <EmailCaptureIcon
          src={RibbonLogo}
          alt="Ribbon Finance"
        ></EmailCaptureIcon>

        <EmailCaptureTitle>Stay up to date with Ribbon</EmailCaptureTitle>
        <EmailCaptureSubtitle>
          Subscribe to updates with your email address
        </EmailCaptureSubtitle>

        <EmailCaptureForm theme="dark"></EmailCaptureForm>
      </EmailCaptureContainer>
      <FooterLinks>
        <FooterLeft span="12">
          <NavAnchor href="/faq">FAQs</NavAnchor>
          <NavAnchor href="/company">Company</NavAnchor>
          <NavAnchor href="https://medium.com/@ribbonfinance">Blog</NavAnchor>
        </FooterLeft>
        <FooterRight span="12">
          <a href="https://twitter.com/RibbonFinance">
            <TwitterOutlined style={iconStyles} />
          </a>
          <a href="https://discord.gg/85gcVafPyN">
            <i style={iconStyles} className="fab fa-discord"></i>
          </a>
          <a href="https://github.com/ribbon-finance">
            <GithubOutlined style={iconStyles} />
          </a>
        </FooterRight>
      </FooterLinks>
    </AntFooter>
  );
};
export default Footer;
