import { Link } from "react-router-dom";
import styled from "styled-components";
import Ribbon from "../../img/RibbonLogo.svg";

const Logo = () => {
  return (
    <>
      <Link to="/">
        <img
          src={Ribbon}
          alt="Ribbon Finance"
          style={{ height: 48, width: 48 }}
        ></img>
      </Link>
    </>
  );
};

export default Logo;
