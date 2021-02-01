import React from "react";
import styled from "styled-components";
import { Row, Col } from "antd";
import AccountStatus from "./AccountStatus";
import Logo from "./Logo";
import { PrimaryMedium } from "../../designSystem";

const HeaderContainer = styled.div``;

const Content = styled.div`
  display: flex;
  justify-content: center;
`;

const Navigation = styled.div`
  display: flex;
  justify-content: space-around;
`;

type NavLinkProps = {
  link: string;
  text: string;
};

const NavLink = ({ link, text }: NavLinkProps) => (
  <a href={link}>
    <PrimaryMedium>{text}</PrimaryMedium>
  </a>
);

const Header = () => {
  return (
    <HeaderContainer>
      <Row align="middle">
        <Col span={6}>
          <Content>
            <Logo></Logo>
          </Content>
        </Col>
        <Col span={5} offset={3}>
          <Navigation>
            <NavLink link="/" text="About" />
            <NavLink link="/" text="FAQ" />
            <NavLink link="/" text="Blog" />
          </Navigation>
        </Col>
        <Col span={8} offset={2}>
          <Content>
            <AccountStatus></AccountStatus>
          </Content>
        </Col>
      </Row>
    </HeaderContainer>
  );
};

export default Header;
