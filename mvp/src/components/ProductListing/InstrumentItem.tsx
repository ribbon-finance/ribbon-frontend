import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Button, PrimaryText, SecondaryText } from "../../designSystem";
import { Instrument, Product } from "../../models";
import { calculateYield, convertToAPY } from "../../utils";

const InstrumentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff;
  border: 0.8px solid #b9b9b9;
  box-sizing: border-box;
  border-radius: 10px;
  padding: 27px 30px;
  margin: 0px 40px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 28px;
`;

const InstrumentTitle = styled(PrimaryText)`
  font-style: normal;
  font-weight: normal;
  font-size: 50px;
  line-height: 59px;
  text-align: center;
  color: #002b80;
`;

const InstrumentAPYSubtitle = styled(PrimaryText)`
  font-size: 22px;
  line-height: 25px;
`;

const DetailContainer = styled.div`
  align-self: flex-start;
  margin-bottom: 30px;
`;

const InstrumentDetailRow = styled.div`
  margin: 20px 0px;
`;

const InstrumentDetailText = styled(PrimaryText)`
  font-size: 16px;
  line-height: 19px;
  color: #000000;
`;

const InstrumentDetailProperty = styled(InstrumentDetailText)`
  font-weight: bold;
`;

const BuyProductButton = styled(Button)`
  justify-self: center;
  width: 142px;
  height: 36px;
  background: #2d9cdb;
  border-radius: 20px;
`;

const ButtonText = styled(SecondaryText)`
  font-size: 18px;
  line-height: 21px;
  text-align: center;
`;

type Props = {
  instrument: Instrument;
  product: Product;
};

const InstrumentItem: React.FC<Props> = ({ instrument, product }) => {
  // calculate with 1 dToken
  const yields = calculateYield(
    instrument.instrumentSpotPrice,
    instrument,
    product
  );
  const largestYield = yields.reduce((y1, y2) =>
    y1.percentage > y2.percentage ? y1 : y2
  );
  const apyRate = convertToAPY(
    largestYield.percentage,
    moment().valueOf(),
    instrument.expiryTimestamp
  ).toFixed(3);

  const details = [
    { property: "Strike", value: "$" + instrument.strikePrice },
    { property: "Yield", value: largestYield.percentage.toFixed(3) + "%" },
    {
      property: "Expiry",
      value: new Date(instrument.expiryTimestamp * 1000).toLocaleDateString()
    }
  ];

  return (
    <InstrumentContainer>
      <TitleContainer>
        <InstrumentTitle>{apyRate}%</InstrumentTitle>
        <InstrumentAPYSubtitle>APY</InstrumentAPYSubtitle>
      </TitleContainer>

      <DetailContainer>
        {details.map(({ property, value }) => (
          <InstrumentDetail
            key={property}
            property={property}
            value={value}
          ></InstrumentDetail>
        ))}
      </DetailContainer>

      <BuyProductButton>
        <Link
          style={{ textDecoration: "none" }}
          to={"/instrument/" + instrument.symbol}
        >
          <ButtonText>Buy Product</ButtonText>
        </Link>
      </BuyProductButton>
    </InstrumentContainer>
  );
};

type InstrumentDetailProps = {
  property: string;
  value: string;
};

const InstrumentDetail: React.FC<InstrumentDetailProps> = ({
  property,
  value
}) => {
  return (
    <InstrumentDetailRow>
      <InstrumentDetailProperty>{property}</InstrumentDetailProperty>:{" "}
      <InstrumentDetailText>{value}</InstrumentDetailText>
    </InstrumentDetailRow>
  );
};

export default InstrumentItem;
