import React from "react";
import styled from "styled-components";
import { Row, Col } from 'antd';
import AccountStatus from "./AccountStatus";
import CurrentPrice from "./CurrentPrice";
import Logo from "./Logo";

const Content = styled.div`
  display: flex;
  justify-content: center;
`;

const Header = () => {
  return (
    <Row align="middle">
      <Col span={4} offset={6}>
        <Content><CurrentPrice></CurrentPrice></Content>
      </Col>
      <Col span={4}>
        <Content><Logo></Logo></Content>
      </Col>
      <Col span={4}>
        <Content><AccountStatus></AccountStatus></Content>
      </Col>
      <Col span={6}></Col>
    </Row>
  );
};

export default Header;
