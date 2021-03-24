import React from "react";

import AccountStatus from "../Wallet/AccountStatus";
import Products from "./Products";

const Homepage = () => {
  return (
    <>
      <Products />
      <AccountStatus variant="mobile" />
    </>
  );
};

export default Homepage;
