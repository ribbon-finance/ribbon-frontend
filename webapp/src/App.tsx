import Header from "./components/Header";

import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        <Header />
        <div style={{height: '100px'}}></div>
      </div>
    </Router>
  );
}

export default App;
