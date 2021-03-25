import React from "react";

import AccountStatus from "../../components/Wallet/AccountStatus";
import ProductSection from "../../components/Product/ProductSection";

const Homepage = () => {
  return (
    <>
      <ProductSection />
      <AccountStatus variant="mobile" />
    </>
  );
};

export default Homepage;
