import * as React from "react";
import { dojimaInstrument } from "../protocol/contracts";

const HomePage: React.FC<{}> = ({}) => {
  const [collateralAsset, setCollateralAsset] = React.useState("");

  React.useEffect(() => {
    (async function () {
      const colAsset = await dojimaInstrument.collateralAsset().callAsync();
      setCollateralAsset(colAsset);
    })();
  }, []);

  return <div>{collateralAsset}</div>;
};

export default HomePage;
