import React from "react";
import colors from "../../designSystem/colors";
import styled from "styled-components";
import { BaseIndicator, BaseLink, PrimaryText } from "../../designSystem";
import { ExternalIcon } from "../../assets/icons/icons";
import sizes from "../../designSystem/sizes";

const BannerContainer = styled.div<{ color: string }>`
  position: absolute;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background: ${(props) => `${props.color}29`};
  padding: 12px 0px;
`;

const Indicator = styled(BaseIndicator)`
  @media (max-width: ${sizes.md}px) {
    display: none;
  }
`;

const RightContainer = styled.div.attrs({
  className: "d-flex align-items-center",
})`
  @media (max-width: ${sizes.md}px) {
    flex-direction: column;
    padding-left: 16px;
    width: 80vw;
  }
`;

const Link = styled(BaseLink)`
  text-align: center;
`;

const LinkText = styled(PrimaryText)`
  font-weight: bold;
  text-decoration: underline;
  text-align: center;
`;

const Icon = styled(ExternalIcon)`
  width: 21px;
  height: 21px;
`;

interface TemporaryStakingBannerProps {
  containerStyle?: React.CSSProperties;
  descriptionText: string;
  link: {
    text: string;
    link: string;
    external?: boolean;
  };
}

// Temporary banner to point user to staking page
// Once voting/delegation is activated, we won't need this component anymore,
// and can be removed
const TemporaryStakingBanner: React.FC<TemporaryStakingBannerProps> = ({
  containerStyle,
  descriptionText,
  link,
}) => {
  const color = colors.green;
  return (
    <BannerContainer color={color} style={containerStyle}>
      <>
        <Indicator size={8} color={color} className="mr-2" />
        <RightContainer>
          <PrimaryText
            fontSize={14}
            lineHeight={20}
            color={color}
            className="mr-1"
            style={{ textAlign: "center" }}
          >
            {descriptionText}{" "}
            <Link to={link.link} target={link.external ? "_blank" : undefined}>
              <LinkText fontSize={14} lineHeight={20} color={color}>
                {link.text}
                {link.external && (
                  <Icon
                    containerStyle={{
                      display: "inherit",
                    }}
                    color={color}
                  />
                )}
              </LinkText>
            </Link>
          </PrimaryText>
        </RightContainer>
      </>
    </BannerContainer>
  );
};
export default TemporaryStakingBanner;
