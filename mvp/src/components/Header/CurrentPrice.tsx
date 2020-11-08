import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import images from "../../img/currencyIcons";
import { BaseText } from "../../designSystem";
import { useWeb3React } from "@web3-react/core";
import { DataProviderFactory } from "../../codegen";
import deployments from "../../constants/deployments.json";
import externalAddresses from "../../constants/externalAddresses.json";
import { etherToDecimals } from "../../utils/math";

const { ETH: ETHIcon } = images;

const ETHPriceContainer = styled.div`
  margin-left: 8px;
`;

const ETHPrice = styled(BaseText)`
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
`;

const CurrencyIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-left: 8px;
`;

const CurrentPrice = () => {
  const { library } = useWeb3React();
  const [price, setPrice] = useState(0);

  const fetchPrice = useCallback(async () => {
    const signer = library.getSigner();
    const dai = externalAddresses.kovan.assets.dai;
    const dataProvider = new DataProviderFactory(signer).attach(
      deployments.kovan.DataProvider
    );
    const ethPrice = etherToDecimals(await dataProvider.getPrice(dai));
    setPrice(ethPrice);
  }, [library]);

  useEffect(() => {
    if (library) {
      fetchPrice();
    }
  }, [library]);

  return (
    <>
      <CurrencyIcon src={ETHIcon} alt="ETH"></CurrencyIcon>
      <ETHPriceContainer>
        <ETHPrice>${price.toFixed(2)}</ETHPrice>
      </ETHPriceContainer>
    </>
  );
};

export default CurrentPrice;
