import React from "react";
import styled from "styled-components";
import Header from "./Header";
import ProductListing from "./ProductListing";
import { products } from "../mockData";

const AppContainer = styled.div`
  padding: 23px 30px;
`;

const MainContent = styled.div``;

function App() {
  return (
    <AppContainer className="App">
      <Header />
      <MainContent>
        <ProductListing product={products[0]}></ProductListing>
      </MainContent>
    </AppContainer>
  );
}

export default App;
