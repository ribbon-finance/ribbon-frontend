import React from "react";
import styled from "styled-components";
import { Row } from "antd";
import { BaseText, StyledCard } from "../../designSystem";
import { computeStraddleValue } from "../../utils/straddle";
import { useETHPriceInUSD } from "../../hooks/useEthPrice";
import { BasicStraddle } from "../../models";
import { useStraddleTrade } from "../../hooks/useStraddleTrade";
import { ethers } from "ethers";
import currencyIcons from "../../img/currencyIcons";
import protocolIcons from "../../img/protocolIcons";
import { venueKeyToName } from "../../utils/positions";
import { toUSD, toETH, ethToUSD } from "../../utils/math";

const DescriptionTitle = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 10px;
  font-style: normal;
  font-weight: 500;
  line-height: 12px;
  letter-spacing: 1.5px;
  text-align: left;
  text-transform: uppercase;
  color: #999999;
`;

const DescriptionData = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0px;
  text-align: left;
`;

const DescriptionContainer = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
`;

const ETHIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 8px;
`;

const PriceContainer = styled.div`
  display: flex;
`;

const ProtocolIcon = styled.img`
  width: 50px;
  height: 50px;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background: #ffffff;
  box-shadow: 1px 2px 24px rgba(0, 0, 0, 0.08);
  margin-right: 20px;
`;

const PlusBlockContainer = styled.div`
  width: 320px;
  margin-left: 5%;
`;

const PlusContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 25px;
  background: #ffffff;
  box-shadow: 1px 2px 24px rgba(0, 0, 0, 0.08);
  margin-right: 20px;
`;

const OptionBlockContainer = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 10px;
  border-radius: 8px;
  background: #fafafa;
  width: 320px;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const OptionTitle = styled.p`
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 0px;
`;

const OptionSubTitle = styled.p`
  font-size: 12px;
  color: #828282;
  margin-bottom: 0px;
`;

type Props = {
  straddle: BasicStraddle;
  amount: number;
  callVenue: string;
  putVenue: string;
};

const UnderlyingOptionBlock = (
  putVenue: string,
  callVenue: string,
  putStrikePrice: string,
  callStrikePrice: string,
  putPremium: ethers.BigNumber,
  callPremium: ethers.BigNumber,
  ethPrice: number
) => (
  <>
    <OptionBlockContainer>
      <Row align="middle">
        <IconContainer>
          <ProtocolIcon
            src={protocolIcons[putVenue]}
            alt={venueKeyToName(putVenue)}
          />
        </IconContainer>
        <div>
          <OptionTitle>{putStrikePrice} Put</OptionTitle>
          <OptionSubTitle>
            {ethToUSD(putPremium, ethPrice)} ({toETH(putPremium)} ETH)
          </OptionSubTitle>
          <OptionSubTitle>{venueKeyToName(putVenue)}</OptionSubTitle>
        </div>
      </Row>
    </OptionBlockContainer>

    <PlusBlockContainer>
      <PlusContainer>+</PlusContainer>
    </PlusBlockContainer>

    <OptionBlockContainer>
      <Row align="middle">
        <IconContainer>
          <ProtocolIcon
            src={protocolIcons[callVenue]}
            alt={venueKeyToName(callVenue)}
          />
        </IconContainer>
        <div>
          <OptionTitle>{callStrikePrice} Call</OptionTitle>
          <OptionSubTitle>
            {ethToUSD(callPremium, ethPrice)} ({toETH(callPremium)} ETH)
          </OptionSubTitle>
          <OptionSubTitle>{venueKeyToName(callVenue)}</OptionSubTitle>
        </div>
      </Row>
    </OptionBlockContainer>
  </>
);

const ProductInfo: React.FC<Props> = ({
  straddle,
  amount,
  callVenue,
  putVenue,
}) => {
  const ethPrice = useETHPriceInUSD();
  const {
    loading: loadingTrade,
    error: loadTradeError,
    totalPremium,
    callPremium,
    putPremium,
    callStrikePrice,
    putStrikePrice,
  } = useStraddleTrade(
    straddle.address,
    ethPrice,
    ethers.utils.parseEther(amount.toString())
  );

  const [straddleUSD, straddleETH] = computeStraddleValue(
    totalPremium,
    ethPrice
  );

  const timestamp = new Date(
    straddle.expiryTimestamp * 1000
  ).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let costStr;
  let optionsStr;
  optionsStr = "-";
  if (loadingTrade && amount > 0) {
    costStr = "Computing cost... Reload the page if this takes too long.";
  } else if (loadingTrade) {
    costStr = "$0.00 (0.00 ETH)";
  } else if (loadTradeError) {
    costStr = "Error loading cost. Try again.";
  } else {
    costStr = `~$${straddleUSD} (${straddleETH} ETH)`;
    optionsStr = UnderlyingOptionBlock(
      putVenue,
      callVenue,
      `$${toUSD(putStrikePrice)}`,
      `$${toUSD(callStrikePrice)}`,
      putPremium,
      callPremium,
      ethPrice
    );
  }

  return (
    <>
      <DescriptionContainer>
        <DescriptionTitle>Expiry</DescriptionTitle>
        <DescriptionData>{timestamp}</DescriptionData>
      </DescriptionContainer>

      <DescriptionContainer>
        <DescriptionTitle>Total Cost</DescriptionTitle>
        <DescriptionData>{costStr}</DescriptionData>
      </DescriptionContainer>

      <DescriptionContainer>
        <DescriptionTitle>Current ETH Price</DescriptionTitle>
        <PriceContainer>
          <ETHIcon src={currencyIcons.ETH} alt="ETH" />
          <DescriptionData>${ethPrice}</DescriptionData>
        </PriceContainer>
      </DescriptionContainer>

      <DescriptionContainer>
        <DescriptionTitle>Underlying Options</DescriptionTitle>
        <DescriptionData>{optionsStr}</DescriptionData>
      </DescriptionContainer>
    </>
  );
};

export default ProductInfo;
