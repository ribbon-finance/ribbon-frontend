import React from "react";
import HelpInfo from "shared/lib/components/Common/HelpInfo";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import colors from "shared/lib/designSystem/colors";
import styled from "styled-components";
import { getAssetLogo } from "../../utils/asset";

const OuterContainer = styled.div<{ marginRight?: number }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-right: ${(props) => props.marginRight ?? 48}px;
`;

const InnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AssetContainer = styled.div<{ marginLeft?: number; zIndex: number }>`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  height: 26px;
  width: 26px;
  border-radius: 100px;
  border: 2px solid black;
  margin-left: ${(props) => props.marginLeft ?? `0`}px;
  z-index: ${(props) => props.zIndex};
  &:before {
    position: absolute;
    content: " ";
    width: 100%;
    height: 100%;
    background: ${(props) => `${props.color}`};
    border-radius: 100px;
  }
`;

const PlusSevenCircle = styled.div`
  height: 26px;
  width: 26px;
  display: flex;
  border: 2px solid black;
  align-items: center;
  justify-content: center;
  border-radius: 100px;
  margin-left: -4px;
  background: ${colors.background.two};
  z-index: 4;
`;

const StyledSpan = styled.span`
  color: ${colors.primaryText};
`;

interface AssetArrayProps {
  marginRight?: number;
}

const AssetArray: React.FC<AssetArrayProps> = ({ marginRight }) => {
  const USDCLogo = getAssetLogo("USDC");
  const USDTLogo = getAssetLogo("USDT");
  const DAILogo = getAssetLogo("DAI");
  return (
    <OuterContainer marginRight={marginRight}>
      <TooltipExplanation
        explanation={
          <span>
            Deposit assets include <StyledSpan>USDC</StyledSpan>,{" "}
            <StyledSpan>DAI</StyledSpan>, <StyledSpan>USDT</StyledSpan>,{" "}
            <StyledSpan>sUSD</StyledSpan>, <StyledSpan>gUSD</StyledSpan>,{" "}
            <StyledSpan>FRAX</StyledSpan>, <StyledSpan>MIM</StyledSpan>,{" "}
            <StyledSpan>lUSD</StyledSpan>, <StyledSpan>bUSD</StyledSpan> and{" "}
            <StyledSpan>alUSD</StyledSpan>
          </span>
        }
        renderContent={({ ref, ...triggerHandler }) => (
          <HelpInfo containerRef={ref} {...triggerHandler}>
            <InnerContainer>
              <AssetContainer zIndex={1}>
                <USDTLogo height={26} width={26} />
              </AssetContainer>
              <AssetContainer zIndex={2} marginLeft={-4}>
                <DAILogo height={26} width={26} />
              </AssetContainer>
              <AssetContainer zIndex={3} marginLeft={-4}>
                <USDCLogo height={26} width={26} />
              </AssetContainer>
              <PlusSevenCircle>
                <div style={{ fontSize: 11 }}>+7</div>
              </PlusSevenCircle>
            </InnerContainer>
          </HelpInfo>
        )}
      />
    </OuterContainer>
  );
};

export default AssetArray;
