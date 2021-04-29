import React from "react";
import styled from "styled-components";

import sizes from "shared/lib/designSystem/sizes";
import { SecondaryText } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import BadgerImg from "../../assets/img/badger.png";
import CurveImg from "../../assets/img/curve.png";
import Arrow from "../../assets/img/arrow.svg";

const Container = styled.div`
  // display: flex;
  // align-items: center;
  // padding: 16px 10px;
  // border: 1px solid ${colors.border};
  // border-radius: 100px;
`;

const LinkContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  padding: 16px 12px;
  border: 1px solid #2B2B2B;
  background-color: #252322;
  border-radius: 8px;
`;

const AssetLabel = styled.span`
`

const Image = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 16px;
`;
const ConvertImage = styled.img.attrs({ src: Arrow })`
  margin: 0 7px;
`

const SwapBTCDropdown: React.FC = () => {
  return (
    <Container>
      {/* <SecondaryText>Swap your BTC or renBTC for wBTC</SecondaryText> */}
      <LinkContainer>
        <Image src={BadgerImg} />
        <AssetLabel>BTC</AssetLabel>
        <ConvertImage />
        <AssetLabel>WBTC</AssetLabel>
      </LinkContainer>
    </Container>
  );
};

export default SwapBTCDropdown;
