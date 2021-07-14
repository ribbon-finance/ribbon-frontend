import styled from "styled-components";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Logo from "./Logo";
import { Link } from "react-router-dom";
import { Button } from "../../designSystem";

const HeaderContainer = styled.div`
  padding-top: 15px;
  padding-bottom: 15px;
  background: #0b0d14;
`;

const LinkText = styled.span`
  font-family: VCR;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 24px;
  margin-left: 30px;
  margin-right: 30px;
  text-transform: uppercase;

  color: rgba(255, 255, 255, 0.48);
`;

const ButtonText = styled.span`
  font-family: VCR;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 24px;
  text-align: center;
  text-transform: capitalize;
  color: #16ceb9;
`;

const AppButton = styled(Button)`
  padding-top: 12px;
  padding-left: 15px;
  padding-right: 15px;
  padding-bottom: 12px;
  border-radius: 8px;
  background: rgba(22, 206, 185, 0.08);
  border: none;
`;

const Header = () => {
  return (
    <HeaderContainer className="container-fluid">
      <Row className="d-flex align-items-center">
        <Col md={{ span: 1, offset: 1 }}>
          <Logo></Logo>
        </Col>
        <Col md={8} className="d-flex justify-content-center">
          <Link to="/company">
            <LinkText>About</LinkText>
          </Link>
          <a href="https://medium.com/@ribbonfinance">
            <LinkText>Blog</LinkText>
          </a>
          <a href="https://medium.com/@ribbonfinance">
            <LinkText>Community</LinkText>
          </a>
        </Col>
        <Col md={2} className="d-flex justify-content-center">
          <a href="https://medium.com/@ribbonfinance">
            <AppButton>
              <ButtonText>OPEN APP</ButtonText>
            </AppButton>
          </a>
        </Col>
      </Row>
    </HeaderContainer>
  );
};

export default Header;
