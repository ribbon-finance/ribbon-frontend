import React from "react";
import styled from "styled-components";
import { BaseIndicator, BaseLink, PrimaryText } from "../../designSystem";
import theme from "../../designSystem/theme";

const BannerContainer = styled.div<{ color: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background: ${(props) => `${props.color}29`};
  padding: 12px 0px;
`;

const BannerButton = styled.div<{ color: string }>`
  padding: 10px 16px;
  border: ${theme.border.width} ${theme.border.style} ${(props) => props.color};
  border-radius: 100px;
`;

interface BannerProps {
  color: string;
  message: string;
  linkURI: string;
  linkText: string;
  onClick?: () => void;
  linkOpensNewTab?: Boolean;
}

const Banner: React.FC<BannerProps> = ({
  color,
  message,
  linkURI,
  linkText,
  onClick = () => {},
  linkOpensNewTab = false,
}) => {
  return (
    <BannerContainer color={color}>
      <>
        <BaseIndicator size={8} color={color} className="mr-2" />
        <PrimaryText
          fontSize={14}
          lineHeight={20}
          color={color}
          className="mr-3"
        >
          {message}
        </PrimaryText>
        <BaseLink
          onClick={onClick}
          to={linkURI}
          {...(linkOpensNewTab ? { target: "_blank" } : {})}
        >
          <BannerButton color={color} role="button">
            <PrimaryText fontSize={14} lineHeight={20} color={color}>
              {linkText}
            </PrimaryText>
          </BannerButton>
        </BaseLink>
      </>
    </BannerContainer>
  );
};
export default Banner;
