import { Link } from "react-router-dom";
import Ribbon from "../../assets/img/RibbonLogo.svg";

const Logo = () => {
  return (
    <>
      <Link to="/">
        <img
          src={Ribbon}
          alt="Ribbon Finance"
          style={{ height: 48, width: 48 }}
        />
      </Link>
    </>
  );
};

export default Logo;
