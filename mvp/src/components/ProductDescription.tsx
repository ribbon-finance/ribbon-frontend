import { Input } from "antd";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { CATEGORIES } from "../constants/copy";
import { PrimaryMedium, PrimaryText } from "../designSystem";

const { Search } = Input;

const DescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 70px;
  margin-bottom: 200px;
`;

const TitleDiv = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const Title = styled(PrimaryMedium)`
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-style: normal;
  font-weight: 600;
`;

const Description = styled(PrimaryText)`
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
`;

const IconContainer = styled.div`
  text-align: center;
  margin-top: 64px;
  margin-bottom: 64px;
`;

const FormContainer = styled.div``;

const EmailForm = styled(Search)`
  width: 440px;
  height: 64px;
`;

const ProductDescription = () => {
  const { categoryID } = useParams<{ categoryID: string }>();
  const category = CATEGORIES[categoryID];
  const copy = category.description;
  const color = category.cardColor;
  const Icon = styled(category.icon)`
    font-size: 60px;
    color: ${color};
  `;

  return (
    <DescriptionContainer>
      <TitleDiv>
        <Title>Coming Soon</Title>
      </TitleDiv>
      <Description>{copy}</Description>
      <IconContainer>
        <Icon></Icon>
      </IconContainer>
      <FormContainer>
        <EmailForm
          placeholder="Enter your email"
          onSearch={() => {}}
          enterButton="Submit"
        />
      </FormContainer>
    </DescriptionContainer>
  );
};

export default ProductDescription;
