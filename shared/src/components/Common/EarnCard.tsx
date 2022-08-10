import React from "react";
import styled, { keyframes } from "styled-components";
import colors from "../../designSystem/colors";

import {
  EarnCardMiddleCircle,
  EarnCardOuterCircle,
  Grid,
} from "../../assets/icons/icons";
import { getAssetLogo } from "../../utils/asset";

const ProductAssetLogoContainer = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  width: 56px;
  margin-top: calc(-56px / 2);
  background-color: ${colors.background.one};
  border-radius: 50%;
  position: relative;
  box-shadow: 0px 0px 0px 2px ${colors.background.two};

  &:before {
    display: block;
    position: absolute;
    height: 100%;
    width: 100%;
    content: " ";
    background: ${(props) => props.color}29;
    border-radius: 50%;
  }
`;

const StyledProductAssetLogoContainer = styled(ProductAssetLogoContainer)`
  margin-top: 0;
  z-index: 1000;
  position: absolute;
  height: 80px;
  width: 80px;
`;

const Marker = styled.div<{
  width: number;
  color: string;
  marginLeft?: number;
}>`
  width: ${(props) => props.width}px;
  height: 2px;
  background: ${(props) => props.color};
  border-radius: 1000px;
  margin-left: ${(props) =>
    props.marginLeft ? `${props.marginLeft}px` : `0px`};
`;

const rotateClockwise = keyframes`
  from{
      transform: rotate(0deg);
  }
  to{
      transform: rotate(360deg);
  }
`;

const rotateAnticlockwise = keyframes`
  from{
      transform: rotate(360deg);
  }
  to{
      transform: rotate(0deg);
  }
`;

const StyledEarnOuterCircle = styled(EarnCardOuterCircle)`
  animation: ${rotateClockwise} 10s linear infinite;
  position: absolute;
`;

const StyledEarnMiddleCircle = styled(EarnCardMiddleCircle)`
  animation: ${rotateAnticlockwise} 10s linear infinite;
  overflow: show;
  display: flex;
  position: absolute;
  align-items: center;
  justify-content: center;
`;

const CirclesContainer = styled.div`
  position: absolute;
  display: flex;
  height: 240px;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
`;

const OuterContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 240px;
`;

const EarnAbsoluteTopContainer = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
`;

const EarnAbsoluteBottomContainer = styled.div`
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 16px;
`;

const LeftMarkerContainer = styled.div`
  display: flex;
  gap: 4px;
`;

const RightMarkerContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  gap: 4px;
`;

const StyledGrid = styled(Grid)<{ height: number }>`
  position: absolute;
  height: ${(props) => props.height}px;
  height: 100%;
  width: 100%;
`;

interface AssetCircleContainerProps {
  color: string;
  height: number;
}

const EarnCard: React.FC<AssetCircleContainerProps> = ({ color, height }) => {
  const Logo = getAssetLogo("USDC");

  let logo = <Logo height={"100%"} />;

  return (
    <>
      <StyledGrid height={height} />
      <EarnAbsoluteTopContainer>
        <LeftMarkerContainer>
          <Marker width={16} color={color} />
          <Marker width={6} color={color} />
          <Marker width={2} color={color} />
        </LeftMarkerContainer>
        <RightMarkerContainer>
          <Marker width={16} color={color} />
          <Marker width={2} color={color} />
        </RightMarkerContainer>
      </EarnAbsoluteTopContainer>
      <EarnAbsoluteBottomContainer>
        <LeftMarkerContainer>
          <Marker width={16} color={color} />
          <Marker width={2} color={color} />
          <Marker width={2} color={color} />
        </LeftMarkerContainer>
        <RightMarkerContainer>
          <Marker width={2} color={color} />
          <Marker width={16} color={color} />
          <Marker width={4} color={color} />
        </RightMarkerContainer>
      </EarnAbsoluteBottomContainer>
      <OuterContainer>
        <CirclesContainer>
          <StyledProductAssetLogoContainer color={color}>
            {logo}
          </StyledProductAssetLogoContainer>
          <StyledEarnOuterCircle />
          <StyledEarnMiddleCircle />
        </CirclesContainer>
      </OuterContainer>
    </>
  );
};

export default EarnCard;
