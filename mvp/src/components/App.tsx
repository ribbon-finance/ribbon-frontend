import React from "react";
import styled from "styled-components";
import Header from "./Header";

const AppContainer = styled.div`
  padding: 23px 30px;
`;

function App() {
  return (
    <AppContainer className="App">
      <Header />
    </AppContainer>
  );
}

export default App;
