import React from "react";
import styled from "styled-components";
import { Row, Col } from "antd";
import AccountStatus from "./AccountStatus";
import CurrentPrice from "./CurrentPrice";
import Logo from "./Logo";

const HeaderContainer = styled.div`
  padding-top: 30px;
  padding-bottom: 30px;
`;

const Content = styled.div`
  display: flex;
  justify-content: center;
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Row align="middle">
        <Col span={6} offset={3}>
          <Content>
            <CurrentPrice></CurrentPrice>
          </Content>
        </Col>
        <Col span={6}>
          <Content>
            <Logo></Logo>
          </Content>
        </Col>
        <Col span={6}>
          <Content>
            <AccountStatus></AccountStatus>
          </Content>
        </Col>
        <Col span={3}></Col>
      </Row>
    </HeaderContainer>
  );
};

export default Header;
