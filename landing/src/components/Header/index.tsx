import styled from "styled-components";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Logo from "./Logo";
import { Link } from "react-router-dom";
import { BaseText, Button } from "../../designSystem";

const HeaderContainer = styled.div`
  padding-top: 15px;
  padding-bottom: 15px;
  background: #0b0d14;
`;

const LinkText = styled(BaseText)`
  font-weight: 500;
  font-size: 16px;
  margin-left: 30px;
  margin-right: 30px;
  color: white;
`;

const ButtonText = styled(BaseText)`
  font-weight: 600;
  font-size: 14px;
  color: white;
`;

const AppButton = styled(Button)`
  padding-top: 8px;
  padding-left: 15px;
  padding-right: 15px;
  padding-bottom: 8px;
  border: 2px solid #ffffff;
  border-radius: 8px;
  background: transparent;
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
            <LinkText>Company</LinkText>
          </Link>
          <Link to="/faq">
            <LinkText>FAQ</LinkText>
          </Link>
          <a href="https://medium.com/@ribbonfinance">
            <LinkText>Blog</LinkText>
          </a>
        </Col>
        <Col md={2} className="d-flex justify-content-center">
          <a href="https://medium.com/@ribbonfinance">
            <AppButton>
              <ButtonText>Use App</ButtonText>
            </AppButton>
          </a>
        </Col>
      </Row>
    </HeaderContainer>
  );
};

export default Header;
