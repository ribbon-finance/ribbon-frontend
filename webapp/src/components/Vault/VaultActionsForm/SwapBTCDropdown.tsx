import React from "react";
import styled from "styled-components";

import colors from "shared/lib/designSystem/colors";
import { BaseLink, Title } from "shared/lib/designSystem";
import { ExternalIcon } from "shared/lib/assets/icons/icons";
import theme from "shared/lib/designSystem/theme";

import BadgerImg from "../../../assets/img/badger.png";
import CurveImg from "../../../assets/img/curve.png";
import Arrow from "../../../assets/img/arrow.svg";

const Container = styled.div<{ open: boolean }>`
  background: ${colors.background};
  overflow: hidden;
  transition: all 0.2s ease-out;
  display: flex;
  flex-direction: column;
  max-height: ${(props) => (props.open ? "212px" : "0px")};
`;

const DefiLink = styled(BaseLink)`
  margin: 16px 16px 0px 16px;

  &:first-child {
    margin-top: 24px;
  }

  &:last-child {
    margin-bottom: 24px;
  }
`;

const DefiCard = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  padding: 16px 12px;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: ${theme.border.radius};
  background-color: #252322;
`;

const AssetText = styled(Title)`
  font-size: 16px;
`;

const OrText = styled.span`
  color: ${colors.primaryText}A3;
`;

const Image = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 16px;
`;

const ConvertImage = styled.img.attrs({ src: Arrow })`
  margin: 0 7px;
`;

const StyledExternalIcon = styled(ExternalIcon)`
  span {
    margin-left: auto;
  }
`;

interface SwapBTCDropdownProps {
  open: boolean;
}

const SwapBTCDropdown: React.FC<SwapBTCDropdownProps> = ({ open }) => {
  return (
    <Container open={open}>
      <DefiLink
        to="https://app.badger.finance/bridge"
        target="_blank"
        rel="noreferrer noopener"
      >
        <DefiCard>
          <Image src={BadgerImg} />
          <AssetText>BTC</AssetText>
          <ConvertImage />
          <AssetText>WBTC</AssetText>
          <StyledExternalIcon containerStyle={{ marginLeft: "auto" }} />
        </DefiCard>
      </DefiLink>
      <DefiLink
        to="https://curve.fi/ren/native"
        target="_blank"
        rel="noreferrer noopener"
      >
        <DefiCard>
          <Image src={CurveImg} />
          <AssetText>
            BTC <OrText>OR</OrText> RENBTC
          </AssetText>
          <ConvertImage />
          <AssetText>WBTC</AssetText>
          <StyledExternalIcon containerStyle={{ marginLeft: "auto" }} />
        </DefiCard>
      </DefiLink>
    </Container>
  );
};

export default SwapBTCDropdown;
