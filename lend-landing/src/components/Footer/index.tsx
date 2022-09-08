import React from "react";
import styled from "styled-components";
import colors from "shared/lib/designSystem/colors";
import { SecondaryText, Title } from "shared/lib/designSystem/index";

const FooterContainer = styled.div`
  display: flex;
  width: 100%;
  height: 64px;
  align-items: center;
  z-index: 999;
  border-top: 1px solid ${colors.border};
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
  text-align: center;
  height: 16px;
  padding-left: 30px;
  padding-right: 30px;
  border-right: 1px solid ${colors.border};
  margin: auto;
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterTextContainer>
        <StyledSecondaryText color={colors.tertiaryText}>
          Total Value Locked:
        </StyledSecondaryText>
        <StyledTitle marginLeft={8} size={14}>
          $112,458,199.02
        </StyledTitle>
      </FooterTextContainer>
      <FooterTextContainer>
        <StyledSecondaryText color={colors.tertiaryText}>
          Total Loans Originated:
        </StyledSecondaryText>
        <StyledTitle marginLeft={8} size={14}>
          $112,458,199.02
        </StyledTitle>
      </FooterTextContainer>
      <FooterTextContainer>
        <StyledSecondaryText color={colors.tertiaryText}>
          Total Interest Accrued:
        </StyledSecondaryText>
        <StyledTitle marginLeft={8} size={14}>
          $112,458,199.02
        </StyledTitle>
      </FooterTextContainer>
    </FooterContainer>
  );
};

export default Footer;
