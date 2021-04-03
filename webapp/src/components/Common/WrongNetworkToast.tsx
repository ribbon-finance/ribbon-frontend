import React from "react";
import { getDefaultNetworkName } from "../../utils/env";
import { capitalize } from "../../utils/text";
import Toast from "./Toast";

const WrongNetworkToast = () => {
  const networkName = capitalize(getDefaultNetworkName());

  return (
    <Toast
      type="error"
      title="wrong network"
      subtitle={`Please switch to ${networkName}`}
    ></Toast>
  );
};
export default WrongNetworkToast;
