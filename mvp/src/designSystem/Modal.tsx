import { Button, Row, Statistic } from "antd";
import React, { ReactNode } from "react";
import styled from "styled-components";

export const StatisticRow = styled(Row)`
  margin-bottom: 20px;
`;

export const ModalButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
  border-radius: 8px;
  width: 100%;
  font-size: 24px;
  font-family: "Montserrat";
`;

type StyledStatisticProps = {
  title: string;
  value: string;
  suffix?: ReactNode;
  hideValue?: boolean;
};

export const StyledStatistic: React.FC<StyledStatisticProps> = ({
  title,
  value,
  hideValue = false,
  suffix,
}) => {
  return (
    <Statistic
      className={hideValue ? "ant-statistic-hide-value" : ""}
      valueStyle={{ fontSize: 15, fontWeight: "bold", paddingBottom: "15px" }}
      title={title}
      value={value}
      suffix={suffix}
    />
  );
};
