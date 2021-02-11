import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Skeleton, Row, Col } from "antd";
import { BaseText } from "../../designSystem";
import StraddleCard from "./StraddleCard";
import AssetPrice from "./AssetPrice";
import images from "../../img/currencyIcons";
import { useDefaultProduct } from "../../hooks/useProducts";

const ProductContainer = styled.div`
  padding-top: 30px;
  padding-bottom: 50px;
`;

const ProductTitleContainer = styled.div`
  text-align: center;
  padding-bottom: 10px;
`;

const ProductDescriptionContainer = styled.div`
  text-align: center;
  padding-bottom: 20px;
`;

const IconContainer = styled.div`
  padding-bottom: 10px;
`;

const CurrencyIcon = styled.img`
  width: 30px;
  height: 30px;
`;

const ProductTitle = styled(BaseText)`
  font-size: 16px;
  font-weight: 600;
`;

const ProductSubtitle = styled(BaseText)`
  font-size: 16px;
  color: #5c5c5c;
`;

const CardRow = styled(Row)`
  display: flex;
  justify-content: space-between;
  align-items: top;

  @media (min-width: 1800px) {
    justify-content: center;
  }
`;

const CardCol = styled(Col)`
  @media (min-width: 1600px) and (max-width: 1800px) {
    display: block;
    flex: 0 0 30%;
    max-width: 30%;
  }
  @media (min-width: 1800px) {
    margin-left: 40px;
    margin-right: 40px;
  }
`;

const { ETH: ETHIcon } = images;

const ProductDescription: React.FC<{ productName: string }> = ({
  productName,
}) => {
  let description = null;
  switch (productName) {
    case "ETH Strangle":
      description = (
        <ProductSubtitle>
          Bet that ETH will be volatile over some period of time - the more ETH
          <br />
          moves from today’s price, the more money you make.
        </ProductSubtitle>
      );
      break;
  }

  return description;
};

const ProductListing: React.FC = () => {
  const product = useDefaultProduct();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, []);

  const normalCardSpan = 21 / Math.floor(product.instruments.length);

  return (
    <ProductContainer>
      <ProductTitleContainer>
        <IconContainer>
          <CurrencyIcon src={ETHIcon} alt="ETH"></CurrencyIcon>
        </IconContainer>
        <ProductTitle>{product.name}</ProductTitle>
      </ProductTitleContainer>

      <ProductDescriptionContainer>
        <ProductDescription productName={product.name}></ProductDescription>
      </ProductDescriptionContainer>

      <AssetPrice />

      {loading ? (
        <Skeleton></Skeleton>
      ) : (
        <CardRow>
          {product.instruments.map((instrument) => (
            <CardCol
              key={instrument.address}
              md={{ span: normalCardSpan }}
              lg={{ span: normalCardSpan }}
              xl={{ span: normalCardSpan }}
              xxl={{ span: normalCardSpan - 2 }}
            >
              <StraddleCard straddle={instrument}></StraddleCard>
            </CardCol>
          ))}
        </CardRow>
      )}
    </ProductContainer>
  );
};

export default ProductListing;
