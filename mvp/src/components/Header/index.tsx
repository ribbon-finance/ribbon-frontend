import React from "react";
import styled from "styled-components";
import { Row, Col } from "antd";
import AccountStatus from "./AccountStatus";
import CurrentPrice from "./CurrentPrice";
import Logo from "./Logo";

const HeaderContainer = styled.div``;

const Content = styled.div`
  display: flex;
  justify-content: center;
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Row align="middle">
        <Col
          md={{ span: 8 }}
          lg={{ span: 8 }}
          xl={{ span: 8 }}
          xxl={{ span: 6, offset: 3 }}
        >
          <Content>
            <CurrentPrice></CurrentPrice>
          </Content>
        </Col>
        <Col
          md={{ span: 8 }}
          lg={{ span: 8 }}
          xl={{ span: 8 }}
          xxl={{ span: 6 }}
        >
          <Content>
            <Logo></Logo>
          </Content>
        </Col>
        <Col
          md={{ span: 8 }}
          lg={{ span: 8 }}
          xl={{ span: 8 }}
          xxl={{ span: 6 }}
        >
          <Content>
            <AccountStatus></AccountStatus>
          </Content>
        </Col>
      </Row>
    </HeaderContainer>
  );
};

export default Header;
