import React from "react";
import { Title } from "../DesignSystem";
import { Product } from "../../models";

type Props = {
  product: Product;
};

const ProductListing: React.FC<Props> = ({ product }) => {
  return (
    <div>
      <Title></Title>
    </div>
  );
};

export default ProductListing;
