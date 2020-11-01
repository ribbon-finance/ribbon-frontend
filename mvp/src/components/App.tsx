import React from "react";
import images from "../img/currencyIcons";
import ethereumAccountImage from "../img/ethAccount.svg";

const { ETH } = images;

const Header = () => {
  return (
    <header>
      <img src={ETH} alt="ETH" />
      <div>$399.20</div>
      <div>0.5083 ETH</div>
      <div>0x573B...c65F</div>
      <img src={ethereumAccountImage} alt="Account" />
    </header>
  );
};

function App() {
  return (
    <div className="App">
      <Header />
    </div>
  );
}

export default App;
