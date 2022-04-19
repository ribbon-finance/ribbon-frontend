import React from "react";
import styled from "styled-components";
import { BaseIndicator, BaseLink, PrimaryText } from "../../designSystem";
import sizes from "../../designSystem/sizes";
import theme from "../../designSystem/theme";

const BannerContainer = styled.div<{ color: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background: ${(props) => `${props.color}29`};
  padding: 12px 8px;
`;

const BannerButton = styled.div<{ color: string }>`
  padding: 10px 16px;
  border: ${theme.border.width} ${theme.border.style} ${(props) => props.color};
  border-radius: 100px;
  text-align: center;

  @media (max-width: ${sizes.md}px) {
    padding: 8px 16px;
  }
`;

const Message = styled(PrimaryText)`
  margin-right: 16px;
  @media (max-width: ${sizes.md}px) {
    flex: 1;
    margin-left: 16px;
  }
`;

interface BannerProps {
  color: string;
  message: string;
  linkURI?: string;
  linkText?: string;
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
        <Message fontSize={14} lineHeight={20} color={color}>
          {message}
        </Message>
        {linkURI && linkText && (
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
        )}
      </>
    </BannerContainer>
  );
};
export default Banner;
