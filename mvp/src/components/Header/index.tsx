import React from "react";
import styled from "styled-components";
import { Row, Col } from "antd";
import AccountStatus from "./AccountStatus";
import Logo from "./Logo";
import { PrimaryMedium } from "../../designSystem";
import { Link } from "react-router-dom";
import usePositions from "../../hooks/usePositions";
import { useWeb3React } from "@web3-react/core";
import { isMobile } from "react-device-detect";

const HeaderContainer = styled.div`
  margin-top: 20px;
  padding: 0 5%;
`;

const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Navigation = styled.div`
  display: flex;
  justify-content: center;
`;

const LinkText = styled(PrimaryMedium)`
  font-weight: 500;
`;

const Header = () => {
  const { loading: loadingPositions, numOfActivePositions } = usePositions();
  const { active } = useWeb3React();
  let positionsNav;
  if (active && !isMobile) {
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
        <Col md={{ span: 11, offset: 1 }} xxl={{ span: 5, offset: 1 }}>
          <Content style={{ justifyContent: "flex-start" }}>
            <Logo></Logo>
          </Content>
        </Col>
        <Col md={{ span: 0 }} xxl={{ span: 5, offset: 3 }}>
          {isMobile ? null : (
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
          )}
        </Col>
        <Col md={{ span: 12 }} xxl={{ span: 8 }}>
          <Content style={{ justifyContent: "flex-end" }}>
            {positionsNav}
            <AccountStatus></AccountStatus>
          </Content>
        </Col>
        <Col md={{ span: 0 }} xxl={{ span: 1 }}></Col>
      </Row>
    </HeaderContainer>
  );
};

export default Header;
