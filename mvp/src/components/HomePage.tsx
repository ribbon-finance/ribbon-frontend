import React from "react";
import { useParams, useRouteMatch } from "react-router-dom";
import Banner from "./Banner";
import Categories from "./Categories";
import ProductDescription from "./ProductDescription";
import ProductListing from "./ProductListing";

const HomePage = () => {
  const matchHome = useRouteMatch({
    path: "/",
    exact: true,
  });

  return (
    <>
      <Banner></Banner>
      <Categories />
      {matchHome !== null ? <ProductListing /> : <ProductDescription />}
    </>
  );
};

export default HomePage;
