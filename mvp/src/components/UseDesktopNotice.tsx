import styled from "styled-components";
import { Row, Col } from "antd";
import Ribbon from "../img/RibbonLogo.svg";

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  background-image: url(https://i.pinimg.com/originals/90/3b/af/903baf04a5ea6a85105d2fc6e336304d.jpg);
  background-repeat: no-repeat;
  background-position: center center;
`;

const UseDesktopNotice = () => {
  return (
    <Container>
      <Row align="middle" justify="center" style={{ height: "100%" }}>
        <img
          src={Ribbon}
          alt="Ribbon Finance"
          style={{ height: 60, width: 60 }}
        ></img>
      </Row>
    </Container>
  );
};
export default UseDesktopNotice;
