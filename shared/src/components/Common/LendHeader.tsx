import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { AppLogo } from "../../assets/icons/logo";
import colors from "../../designSystem/colors";
import { Title } from "../../designSystem/index";
import sizes from "../../designSystem/sizes";

const VerticalHeader = styled.div`
  display: flex;
  width: 64px;
  height: 100vh;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  border-right: 1px solid ${colors.border};
  padding: 56px 23px 44px 23px;
  z-index: 1000;
  background: black;
  @media (max-width: ${sizes.lg}px) {
    display: none;
  }
`;

const LogoContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 1000;
  top: 0;
  bottom: 0;
`;

const LogoContainer2 = styled.div`
  display: flex;
  border-radius: 48px;
`;

const StyledTitle = styled(Title)<{
  size?: number;
  marginLeft?: number;
  marginRight?: number;
  color?: string;
}>`
  text-align: center;
  color: ${(props) =>
    props.color === undefined ? `${colors.primaryText}` : `${props.color}`};
  margin-right: ${(props) =>
    props.marginRight === undefined ? `0px` : `${props.marginRight}px`};
  margin-left: ${(props) =>
    props.marginLeft === undefined ? `0px` : `${props.marginLeft}px`};
  font-size: ${(props) =>
    props.size === undefined ? `14px` : `${props.size}px`};
  line-height: 20px;
`;

const VerticalHeaderTextContainer = styled.div`
  -webkit-transform: rotate(-90deg);
  -moz-transform: rotate(-90deg);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: 50%;
`;

const Logo = () => {
  return (
    <>
      <LogoContainer2>
        <Link to="/">
          <AppLogo height="48px" width="48px" />
        </Link>
      </LogoContainer2>
    </>
  );
};

const LendHeader: React.FC = () => {
  return (
    <VerticalHeader>
      <LogoContainer>
        <Logo />
      </LogoContainer>
      <VerticalHeaderTextContainer>
        <StyledTitle>Community</StyledTitle>
      </VerticalHeaderTextContainer>
      <VerticalHeaderTextContainer>
        <StyledTitle>About</StyledTitle>
      </VerticalHeaderTextContainer>
    </VerticalHeader>
  );
};

export default LendHeader;
