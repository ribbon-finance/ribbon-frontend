import Logo from "./Logo";
import colors from "../../designSystem/colors";

import styled from "styled-components";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import { BaseText } from "../../designSystem";

const HeaderContainer = styled.div`
	border-bottom: 1px solid ${colors.border};
`;

const LinkText = styled(BaseText)`
	font-family: VCR;
  font-weight: 500;
  font-size: 16px;
  color: white;
`;

const VerticalSeparator = styled.div`
	border-left: 1px solid ${colors.border};
`

const NavItem = styled.div`
	padding: 28px;
	opacity: 0.48;
`;

const WalletContainer = styled(VerticalSeparator)`
  display: flex;
  justify-content: center;
  align-items: center;
	padding: 28px;
`

const Indicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: white;
  margin-right: 8px;
  overflow: hidden;
`;

const Header = () => {
  const renderLinkItem = (title: string, to: string, isSelected: boolean) => {
    const itemStyle = {
      opacity: isSelected ? 1 : 0.48
    }
    return (
      <Link to={to}>
        <NavItem style={itemStyle}>
          <LinkText>{title}</LinkText>
        </NavItem>
      </Link>
    )
  }

  // TODO: - Change color if wallet is connected
  const walletConnected = true
  const indicatorColor = walletConnected ? colors.green : 'red'

  return (
    <HeaderContainer className="container-fluid">
      <Row className="d-flex align-items-center justify-content-between">

        {/* LOGO */}
        <div style={{ paddingLeft: '40px' }}>
          <Logo></Logo>
        </div>

        {/* LINKS */}
        <Col md={8} className="d-flex justify-content-center">
          <VerticalSeparator />
          {renderLinkItem('PRODUCTS', '/', true)}
          <VerticalSeparator />
          {renderLinkItem('POSITIONS', '/', false)}
          <VerticalSeparator />
          {renderLinkItem('ABOUT', '/', false)}
          <VerticalSeparator />
        </Col>

        {/* WALLET */}
        <WalletContainer>
          <Indicator style={{ backgroundColor: indicatorColor }} />
          <LinkText>0x573B...	C65F</LinkText>
        </WalletContainer>
      </Row>
    </HeaderContainer>
  );
};

export default Header;
