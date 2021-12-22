import React, { useMemo } from "react";
import styled from "styled-components";
import { Col, Row } from "react-bootstrap";
import moment from "moment";

import theme from "shared/lib/designSystem/theme";

import { SecondaryText, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";

const VaultPerformanceChartContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  padding: 30px 0;
  background: ${colors.background.two};
  border-radius: ${theme.border.radius} ${theme.border.radius} 0px 0px;
`;

const VaultPerformanceChartSecondaryContainer = styled.div`
  background: ${colors.background.two};

  &:last-child {
    border-radius: 0px 0px ${theme.border.radius} ${theme.border.radius};
  }
`;

const DataCol = styled(Col)`
  border-top: ${theme.border.width} ${theme.border.style} ${colors.border};

  && {
    padding: 16px;
  }

  &:nth-child(even) {
    border-left: ${theme.border.width} ${theme.border.style} ${colors.border};
  }
`;

const DataLabel = styled(SecondaryText)`
  font-size: 12px;
  line-height: 16px;
  margin-bottom: 4px;
`;

const DataNumber = styled(Title)<{ variant?: "green" | "red" }>`
  font-size: 16px;
  line-height: 24px;
  ${(props) => {
    switch (props.variant) {
      case "green":
        return `color: ${colors.green};`;
      case "red":
        return `color: ${colors.red};`;
      default:
        return ``;
    }
  }}
`;
const EmptyStrategySnapshot: React.FC = () => {

  const latestYield = useMemo(() => {
    return "---";
  }, []);

  const strikeAPRText = useMemo(() => {
    return "---";
  }, []);

  const toExpiryText = useMemo(() => {
    return "---";
  }, []);
  
  const strikeChart = useMemo(() => {
    return <Title>No strike chosen</Title>;
  }, []);

  return (
    <>
      <VaultPerformanceChartContainer>
        {strikeChart}
      </VaultPerformanceChartContainer>
      <VaultPerformanceChartSecondaryContainer>
        <Row noGutters>
          <DataCol xs="6">
            <DataLabel className="d-block">
              Current Price
            </DataLabel>
            <DataNumber
              variant={undefined}
            >
              {"---"}
            </DataNumber>
          </DataCol>
          <DataCol xs="6">
            <DataLabel className="d-block">
              Selected Strike Price
            </DataLabel>
            <DataNumber>{strikeAPRText}</DataNumber>
          </DataCol>
          <DataCol xs="6">
            <DataLabel className="d-block">Latest Yield Earned</DataLabel>
            <DataNumber
              variant={undefined}
            >
              {latestYield}
            </DataNumber>
          </DataCol>
          <DataCol xs="6">
            <DataLabel className="d-block">Time to Expiry</DataLabel>
            <DataNumber>{toExpiryText}</DataNumber>
          </DataCol>
        </Row>
      </VaultPerformanceChartSecondaryContainer>
    </>
  );
};

export default EmptyStrategySnapshot;
