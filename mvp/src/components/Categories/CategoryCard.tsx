import React from "react";
import styled from "styled-components";
import { Row, Col, Card } from "antd";
import { BaseText } from "../../designSystem";
import { CATEGORIES } from "../../constants/copy";
import { useHistory, useRouteMatch } from "react-router-dom";

const StyledCard = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background-color: #f5f5f5;
  width: 22%;
  -moz-transition: all 0.2s ease-in;
  -o-transition: all 0.2s ease-in;
  -webkit-transition: all 0.2s ease-in;
  transition: all 0.2s ease-in;
`;
const SplitRow = styled(Row)`
  display: flex;
  justify-content: space-around;

  @media (max-width: 500px) {
    padding-left: 5px;
    padding-right: 5px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;
const StyledCol = styled(Col)`
  display: flex;
  align-items: center;
`;
const AlignLeftCol = styled(StyledCol)`
  text-align: left;
  justify-content: flex-start;

  @media (max-width: 500px) {
    width: 100%;
    text-align: right;
    justify-content: center;
    margin-bottom: 6px;
  }
`;
const AlignRightCol = styled(StyledCol)`
  justify-content: flex-end;

  @media (max-width: 500px) {
    justify-content: center;
  }
`;

const CardText = styled(BaseText)`
  text-align: center;
  font-weight: bold;
  font-size: 12px;
  @media (max-width: 500px) {
    font-size: 11px;
  }
`;

const StyledCardParams = {
  width: "100%",
  paddingTop: "12px",
  paddingBottom: "12px",
};

type Props = {
  categoryID: string;
};

const CategoryCard: React.FC<Props> = ({ categoryID }) => {
  const matchHomePage = useRouteMatch({
    path: "/",
    exact: true,
  });

  const matchProductPage = useRouteMatch({
    path: `/product/${categoryID}`,
    exact: true,
  });

  const history = useHistory();

  const handleClick = () => {
    if (categoryID === "volatility") {
      history.push("/");
    } else {
      history.push(`/product/${categoryID}`);
    }
  };

  const categoryCopy = CATEGORIES[categoryID];

  const ActiveCard = styled(StyledCard)`
    background-color: ${categoryCopy.cardColor};
    color: ${categoryCopy.cardTextColor || "#ffffff"};
  `;

  const InactiveCard = styled(StyledCard)`
    &:hover {
      background-color: ${categoryCopy.cardColor};
      color: ${categoryCopy.cardTextColor || "#ffffff"};
    }
  `;

  const matchCard =
    (matchHomePage && categoryID === "volatility") || matchProductPage;

  const CardComponent = matchCard ? ActiveCard : InactiveCard;

  const Icon = styled(categoryCopy.icon)`
    font-size: 20px;
    height: 100%;
  `;

  return (
    <CardComponent onClick={handleClick} bodyStyle={StyledCardParams} hoverable>
      <SplitRow align="middle">
        <AlignLeftCol span={16}>
          <CardText>{categoryCopy.cardTitle}</CardText>
        </AlignLeftCol>
        <AlignRightCol span={8}>
          <Icon></Icon>
        </AlignRightCol>
      </SplitRow>
    </CardComponent>
  );
};

export default CategoryCard;
