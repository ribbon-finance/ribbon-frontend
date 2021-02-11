import React from "react";
import styled from "styled-components";
import { Row, Col } from "antd";
import AccountStatus from "./AccountStatus";
import Logo from "./Logo";
import { PrimaryMedium } from "../../designSystem";
import { Link } from "react-router-dom";
import usePositions from "../../hooks/usePositions";
import { useWeb3React } from "@web3-react/core";

const HeaderContainer = styled.div``;

const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Navigation = styled.div`
  display: flex;
  justify-content: center;
`;

type NavLinkProps = {
  link: string;
  text: string;
};

const LinkText = styled(PrimaryMedium)`
  font-weight: 500;
`;

const Header = () => {
  const { loading: loadingPositions, numOfActivePositions } = usePositions();
  const { active } = useWeb3React();
  let positionsNav;
  if (active) {
    positionsNav = (
      <Link to="/portfolio">
        <LinkText>{`Positions${
          loadingPositions ? "" : ` (${numOfActivePositions})`
        }`}</LinkText>
      </Link>
    );
  } else {
    positionsNav = null;
  }

  return (
    <HeaderContainer>
      <Row justify="space-between" align="middle">
        <Col span={6}>
          <Content>
            <Logo></Logo>
          </Content>
        </Col>
        <Col span={5} offset={3}>
          <Navigation>
            <Link to="/faq" style={{ marginLeft: 30, marginRight: 30 }}>
              <LinkText>FAQ</LinkText>
            </Link>
            <a
              style={{ marginLeft: 30, marginRight: 30 }}
              href="https://medium.com/@ribbonfinance"
            >
              <LinkText>Blog</LinkText>
            </a>
          </Navigation>
        </Col>
        <Col span={8} offset={1}>
          <Content>
            {positionsNav}
            <AccountStatus></AccountStatus>
          </Content>
        </Col>
      </Row>
    </HeaderContainer>
  );
};

export default Header;
