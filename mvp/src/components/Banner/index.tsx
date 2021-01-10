import React from "react";
import styled from "styled-components";
import BannerColorful from "../../img/BannerColorful.png";
import { Row, Button } from "antd";

const BannerContainer = styled.div`
  height: 250px;
  width: 100%;
  background: url("${BannerColorful}") no-repeat;
  background-size: 100%;
`;

const Title = styled.p`
  color: white;
  font-weight: bold;
  padding-top: 30px;
  text-align: center;
  font-size: 28px;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  color: white;
  font-weight: bold;
  text-align: center;
  font-size: 18px;
`;

const StyledButton = styled(Button)`
  padding-left: 40px;
  padding-right: 40px;
`;

const Banner = () => {
  return (
    <BannerContainer>
      <Title>Ribbon is a protocol for on-chain structured products. </Title>
      <Subtitle>
        The first product lets you bet on ETH volatility.<br></br>
        <a
          href="https://twitter.com/juliankoh"
          style={{ color: "white", textDecoration: "underline" }}
        >
          New products dropping soon
        </a>
      </Subtitle>
      <Row justify="center">
        <StyledButton type="primary" danger shape="round">
          <b>Learn how it works</b>
        </StyledButton>
      </Row>
    </BannerContainer>
  );
};

export default Banner;
