import React from "react";
import styled from "styled-components";

import BadgerImg from "../../assets/img/badger.png";
import CurveImg from "../../assets/img/curve.png";
import Arrow from "../../assets/img/arrow.svg";
import colors from "shared/lib/designSystem/colors";
import { BaseLink, Title } from "shared/lib/designSystem";
import { ExternalIcon } from "shared/lib/assets/icons/icons";

const Container = styled.div<{ open: boolean }>`
  overflow: hidden;
  transition: all 0.5s ease-out;
  display: flex;
  flex-direction: column;

  ${(props) =>
    props.open
      ? `
            padding: 24px 16px;
            max-height: 212px;
        `
      : `
            padding: 0px;
            max-height: 0px;
        `}
`;

const DefiLink = styled(BaseLink)`
  margin-top: 16px;

  &:first-child {
    margin-top: 0px;
  }
`;

const DefiCard = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  padding: 16px 12px;
  border: 1px solid #2b2b2b;
  background-color: #252322;
  border-radius: 8px;
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
