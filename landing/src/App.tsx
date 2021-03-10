import Header from "./components/Header";
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
      </Router>
    </div>
  );
}

export default App;
