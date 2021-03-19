import Header from "./components/Header";
import colors from "./designSystem/colors";
import NoiseBg from "./img/noise.png";

import { BrowserRouter as Router } from "react-router-dom";
import styled from "styled-components";

const MainContent = styled.div`
  background-image: url(${NoiseBg});
  background-color: ${colors.background};
  min-height: 100vh;
`

function App() {
  return (
    <Router>
      <MainContent>
        <Header />
      </MainContent>
    </Router>
  );
}

export default App;
