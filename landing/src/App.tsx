import Header from "./components/Header";
import Hero from "./components/Hero";
import styled from "styled-components";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const AppContainer = styled.div`
  width: 100%;
`;

function App() {
  return (
    <div>
      <Router>
        <Header />
        <Hero />
      </Router>
    </div>
  );
}

export default App;
