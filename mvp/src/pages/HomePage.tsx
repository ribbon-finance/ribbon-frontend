import * as React from "react";
import { dojimaInstrument } from "../utils/contracts";

const HomePage: React.FC<{}> = ({}) => {
  const [collateralAsset, setCollateralAsset] = React.useState("");

  React.useEffect(() => {
    setCollateralAsset(dojimaInstrument.collateralAsset());
  }, []);

  return <div>{collateralAsset}</div>;
};

export default HomePage;
