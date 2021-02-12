import React from "react";
import styled from "styled-components";
import { Col } from "antd";

const BannerContainer = styled.div`
  padding-top: 80px;
  padding-bottom: 60px;
  text-align: center;
`;

const Title = styled.p`
  font-weight: bold;
  font-size: 70px;
  margin-top: -20px;
  margin-bottom: 0px;
`;

const Subtitle = styled.p`
  font-size: 16px;
`;

const ArrowDown = () => {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="64" height="64" rx="32" fill="black" />
      <path
        d="M32 25V39"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M39 32L32 39L25 32"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

const Banner = () => {
  return (
    <BannerContainer>
      <Title>Invest Like A Pro. </Title>
      <Col span={18} offset={3}>
        <Subtitle>
          Combine options, futures, and fixed income to improve your portfolio's
          risk-return profile.
        </Subtitle>
      </Col>
      <ArrowDown />
    </BannerContainer>
  );
};

export default Banner;
