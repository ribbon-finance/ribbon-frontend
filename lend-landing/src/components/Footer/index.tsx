import React from "react";
import styled from "styled-components";
import colors from "shared/lib/designSystem/colors";
import { URLS } from "shared/lib/constants/constants";
import { SecondaryText, Title } from "shared/lib/designSystem/index";
import Marquee from "react-fast-marquee/dist";
import sizes from "../../designSystem/sizes";
import theme from "../../designSystem/theme";
const FooterContainer = styled.div`
  display: flex;
  width: 100%;
  height: 64px;
  min-height: 64px;
  align-items: center;
  z-index: 1001;
  background: black;
  border-top: 1px solid ${colors.border};
`;

const ButtonText = styled.span`
  font-family: VCR;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 24px;
  text-align: center;
  text-transform: capitalize;
  color: ${colors.green};
`;

const ButtonContainer = styled.div`
  display: none;
  @media (max-width: ${sizes.lg}px) {
    display: flex;
    margin-left: auto;
    padding-left: 40px;
    padding-right: 40px;
    height: 64px;
    min-height: 64px;
    width: 100%;
    justify-content: center;
    align-items: center;
    border-top: 1px solid ${colors.border};
    z-index: 10000;
  }
`;

const OpenAppButton = styled.div`
  display: flex;
  width: 100vw;
  height: 64px;
  justify-content: center;
  align-items: center;
  text-align: center;
  &:hover {
    cursor: pointer;
    opacity: ${theme.hover.opacity};
  }
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

const StyledSecondaryText = styled(SecondaryText)<{ color?: string }>`
  color: ${(props) =>
    props.color === undefined ? `${colors.primaryText}` : `${props.color}`};
  font-size: 12px;
`;

const FooterTextContainer = styled.div`
  display: flex;
  align-items: center;
  align-self: center;
  justify-content: center;
  width: calc(100% / 3);
  min-width: 350px;
  text-align: center;
  height: 16px;
  border-right: 1px solid ${colors.tertiaryText};
  margin: auto;
  overflow: hidden;
`;

interface Stat {
  title: string | JSX.Element;
  value: string | JSX.Element;
}

const Footer: React.FC = () => {
  const footerStats: Stat[] = [
    {
      title: "Total Value Locked",
      value: "$112,458,199.02",
    },
    {
      title: "Total Loans Originated",
      value: "$112,458,199.02",
    },
    {
      title: "Total Interest Accrued",
      value: "$112,458,199.02",
    },
    {
      title: "Total Insurance Accrued",
      value: "$112,458,199.02",
    },
  ];
  return (
    <>
      <FooterContainer>
        <Marquee gradient={false} speed={100} delay={0} pauseOnHover>
          {footerStats.map((stat) => (
            <FooterTextContainer>
              <StyledSecondaryText color={colors.tertiaryText}>
                {stat.title}:
              </StyledSecondaryText>
              <StyledTitle marginLeft={8} size={14}>
                {stat.value}
              </StyledTitle>
            </FooterTextContainer>
          ))}
        </Marquee>
      </FooterContainer>
      <ButtonContainer>
        <a href={URLS.lendApp}>
          <OpenAppButton>
            <ButtonText>OPEN APP</ButtonText>
          </OpenAppButton>
        </a>
      </ButtonContainer>
    </>
  );
};

export default Footer;
