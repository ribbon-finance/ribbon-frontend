import { useParams } from "react-router-dom";
import { CATEGORIES } from "../constants/copy";

const ProductDescription = () => {
  const { categoryID } = useParams<{ categoryID: string }>();
  const copy = CATEGORIES[categoryID].description;

  return <div>{copy}</div>;
};

export default ProductDescription;
