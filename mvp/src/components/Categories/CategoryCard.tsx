import React from "react";
import styled from "styled-components";
import { Row, Col, Card } from "antd";
import { LineChartOutlined } from "@ant-design/icons";

export const StyledCard = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background-color: #f5f5f5;
  width: 22%;
`;
const SplitRow = styled(Row)`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;
const StyledCol = styled(Col)`
  display: flex;
  align-items: center;
`;
const AlignLeftCol = styled(StyledCol)`
  text-align: left;
  justify-content: flex-start;
`;
const AlignRightCol = styled(StyledCol)`
  justify-content: flex-end;
`;
const CardLineChart = styled(LineChartOutlined)`
  font-size: 20px;
  height: 100%;
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
    <StyledCard bodyStyle={{ width: "100%" }} hoverable>
      <SplitRow align="middle">
        <AlignLeftCol span={16}>
          <span>{text}</span>
        </AlignLeftCol>
        <AlignRightCol span={8}>
          <CardLineChart />
        </AlignRightCol>
      </SplitRow>
    </StyledCard>
  );
};

export default CategoryCard;
