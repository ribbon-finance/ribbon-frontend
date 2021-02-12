import styled from "styled-components";
import { SecondaryText } from "../designSystem";
import Ribbon from "../img/RibbonLogo.svg";

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: black;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url(./mobile.jpg);
  color: white;
  display: flex;
  align-items: center;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  z-index: 2;
  padding: 0 32px;
`;

const FilterContainer = styled.div`
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  backdrop-filter: grayscale(0.5);
`;

const Logo = styled.img`
  height: 96px;
  width: 96px;
`;

const Title = styled(SecondaryText)`
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  font-size: 30px;
  line-height: 37px;
  margin-top: 24px;
  margin-bottom: 16px;
`;

const Subtitle = styled(SecondaryText)`
  font-family: "Inter", sans-serif;
  font-size: 16px;
  line-height: 24px;
  color: rgba(255, 255, 255, 0.64);
`;

const UseDesktopNotice = () => {
  return (
    <BackgroundContainer>
      <ContentContainer>
        <Logo src={Ribbon} alt="Ribbon Finance"></Logo>
        <Title>We don't support mobile yet</Title>
        <Subtitle>Please switch to desktop.</Subtitle>
      </ContentContainer>

      <FilterContainer></FilterContainer>
    </BackgroundContainer>
  );
};
export default UseDesktopNotice;
