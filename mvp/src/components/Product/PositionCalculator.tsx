import React from "react";
import styled from "styled-components";
import { Button, Row, Col, Input } from "antd";
import { useParams } from "react-router-dom";
import {
  DollarCircleOutlined,
  ArrowLeftOutlined,
  LineChartOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Title, PrimaryText, StyledCard } from "../../designSystem";
import { products } from "../../mockData";
import { computeStraddleValue, computeBreakeven } from "../../utils/straddle";
import { useEthPrice } from "../../hooks/marketPrice";

export const PositionCalculator = () => {
  return (
    <StyledCard style={{ width: "100%" }}>
      <Row>Position Calculator</Row>
      <Row>
        <Col span={12}>Position Size</Col>
        <Col span={12}>1 contract</Col>
      </Row>
      <Row>
        <Col span={12}>Target Price</Col>
        <Col span={12}>$700 per ETH</Col>
      </Row>
      <Row>Estimated Profit</Row>
      <Row>$100.00 (+50%)</Row>
    </StyledCard>
  );
};
