import React from "react";
import styled from "styled-components";
import { BaseText } from "../../designSystem";
import { useETHPriceInUSD } from "../../hooks/useEthPrice";

const ETHPriceContainer = styled.span`
  border: 1px solid rgba(0, 0, 0, 0.16);
  box-sizing: border-box;
  border-radius: 100px;
  padding: 8px 16px;
`;

const AssetPriceContainer = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const MainText = styled(BaseText)`
  font-style: normal;
  font-size: 12px;
  color: #5c5c5c;
`;

const BoldText = styled(MainText)`
  font-weight: bold;
  color: black;
`;

const AssetPrice = () => {
  // assumes ETH price won't be zero :)
  const ethPrice = useETHPriceInUSD();
  return (
    <AssetPriceContainer>
      <ETHPriceContainer>
        <MainText>ETH Price: </MainText>
        <BoldText>
          {ethPrice > 0 ? `$${ethPrice.toFixed(2)}` : "Loading..."}
        </BoldText>
      </ETHPriceContainer>
    </AssetPriceContainer>
  );
};

export default AssetPrice;
