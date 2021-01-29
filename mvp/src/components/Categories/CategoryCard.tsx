import React from "react";
import styled from "styled-components";
import { Row, Col, Card } from "antd";
import { LineChartOutlined } from "@ant-design/icons";

export const StyledCard = styled(Card)`
  border-radius: 10px;
  background-color: #f5f5f5;
  width: 22%;
`;

type Props = {
  text: string;
  icon: string;
};

function iconPicker(icon: string) {
  switch (icon) {
    case "lineChart":
      return <LineChartOutlined style={{ fontSize: 20, height: "100%" }} />;
  }
}

const CategoryCard: React.FC<Props> = ({ text, icon }) => {
  return (
    <StyledCard hoverable>
      <Row style={{ textAlign: "left" }} align="middle">
        <Col span={16}>
          <span>{text}</span>
        </Col>
        <Col span={8}>
          <LineChartOutlined style={{ fontSize: 20, height: "100%" }} />
        </Col>
      </Row>
    </StyledCard>
  );
};

export default CategoryCard;
