import React from "react";
import colors from "shared/lib/designSystem/colors";
import styled from "styled-components";
import { BaseIndicator, BaseLink, PrimaryText } from "shared/lib/designSystem";
import { ExternalIcon } from "shared/lib/assets/icons/icons";
import sizes from "shared/lib/designSystem/sizes";

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

const RightContainer = styled.div.attrs({
  className: "d-flex align-items-center",
})`
  @media (max-width: ${sizes.md}px) {
    flex-direction: column;
    padding-left: 16px;
    width: 80vw;
  }
`;

const Link = styled(BaseLink).attrs({
  className: "d-flex align-items-center",
})`
  text-align: center;
`;

const LinkText = styled(PrimaryText)`
  font-weight: bold;
  text-decoration: underline;
  text-align: center;
`;

const Icon = styled(ExternalIcon)`
  margin-top: 4px;
  width: 21px;
  height: 21px;
`;

// Temporary banner to point user to staking page
// Once voting/delegation is activated, we won't need this component anymore,
// and can be removed
const TemporaryStakingBanner: React.FC = () => {
  const color = colors.green;
  return (
    <BannerContainer color={color}>
      <>
        <BaseIndicator size={8} color={color} className="mr-2" />
        <RightContainer>
          <PrimaryText
            fontSize={14}
            lineHeight={20}
            color={color}
            className="mr-1"
            style={{ textAlign: "center" }}
          >
            The liquidity mining program is now live. Stake your rTokens at
          </PrimaryText>
          <Link to="https://app.ribbon.finance/staking" target="_blank">
            <LinkText fontSize={14} lineHeight={20} color={color}>
              app.ribbon.finance
            </LinkText>
            <Icon color={color} />
          </Link>
        </RightContainer>
      </>
    </BannerContainer>
  );
};
export default TemporaryStakingBanner;
