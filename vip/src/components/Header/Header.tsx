import styled from "styled-components";
import { VIPLogo } from "shared/lib/assets/icons/logo";
import colors from "shared/lib/designSystem/colors";
import sizes from "shared/lib/designSystem/sizes";
import theme from "shared/lib/designSystem/theme";
import { ConnectWalletButton } from "shared/lib/components/Common/buttons";
import AccountStatus from "webapp/lib/components/Wallet/AccountStatus";
import { AccessModal } from "../AccessModal/AccessModal";
import { useWebappGlobalState } from "../../store/store";
import { Title } from "shared/lib/designSystem";
import { InfoModal } from "../InfoModal/InfoModal";
import { useState } from "react";
import { FrameBar } from "../FrameBar/FrameBar";

const HeaderContainer = styled.div<{ isMenuOpen?: boolean }>`
  height: ${theme.header.height}px;
  position: sticky;
  top: 0;
  border-bottom: 1px solid ${colors.border};

  @media (max-width: ${sizes.lg}px) {
    padding: 16px 24px;
    border-bottom: none;
  }

  z-index: ${(props) => (props.isMenuOpen ? 50 : 10)};

  // The backdrop for the menu does not show up if we enable the backdrop-filter
  // for the header nav. To get around that, just set 'none'
  ${(props) => {
    if (props.isMenuOpen) {
      return null;
    }

    return `
      backdrop-filter: blur(40px);
      /**
       * Firefox desktop come with default flag to have backdrop-filter disabled
       * Firefox Android also currently has bug where backdrop-filter is not being applied
       * More info: https://bugzilla.mozilla.org/show_bug.cgi?id=1178765
       **/
      @-moz-document url-prefix() {
        background-color: rgba(0, 0, 0, 0.9);
      }
    `;
  }}

  &:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    background: rgba(255, 255, 255, 0.01);
  }
`;

const LogoContainer = styled.div`
  padding-left: 40px;
  margin-right: auto;
  z-index: 1000;

  @media (max-width: ${sizes.lg}px) {
    padding-left: 0;
  }
`;

export const OpenTreasuryButton = styled(ConnectWalletButton)<{
  variant: "desktop" | "mobile";
}>`
  font-size: 14px;
  width: fit-content;
  border: none;
  padding: 12px 16px;
  line-height: 20px;
  border-radius: 8px;
  cursor: pointer;
  z-index: 100;
  height: fit-content;
  ${(props) =>
    props.variant === "mobile" &&
    `
    margin: 16px;
    width: 100%;
  `};

  @media (min-width: ${sizes.lg}px) {
    ${(props) => props.variant === "desktop" && "margin-right: 40px"};
  }

  @media (min-width: ${sizes.md}px) {
    ${(props) => props.variant === "mobile" && "display: none"};
  }

  @media (max-width: ${sizes.md}px) {
    ${(props) => props.variant === "desktop" && "display: none"};
  }

  &:hover {
    opacity: 0.64;
  }
`;

const HeaderAbsoluteContainer = styled.div`
  position: absolute;
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  left: 0;
`;

const LinksContainer = styled.div`
  display: flex;
`;

const NavItem = styled.div<{
  variant: "desktop" | "mobile";
}>`
  font-size: 14px;
  width: fit-content;
  border: none;
  padding: 12px 16px;
  line-height: 20px;
  border-radius: 8px;
  cursor: pointer;
  z-index: 100;
  height: fit-content;

  display: flex;
  align-items: center;
  height: 100%;
  padding: 12px 16px;
  background: #26262b;
  border-radius: 8px;
  ${(props) =>
    props.variant === "mobile" &&
    `
    margin: 16px;
    width: 100%;
  `};

  @media (min-width: ${sizes.lg}px) {
    ${(props) => props.variant === "desktop" && "margin-right: 40px"};
  }

  &:hover {
    opacity: 0.64;
  }
`;

const NavLinkText = styled(Title)`
  letter-spacing: 1.5px;
  font-size: 14px;
  line-height: 20px;
  cursor: pointer;
  opacity: 0.48;

  &:hover {
    opacity: 1;
  }
`;

const Header = () => {
  const [, setAccessModal] = useWebappGlobalState("isAccessModalVisible");
  const [isInfoModalVisible, setInfoModal] = useState<boolean>(false);
  const hasAccess = localStorage.getItem("auth");

  return (
    <>
      <AccessModal />
      <InfoModal
        isVisible={isInfoModalVisible}
        setShow={(set) => setInfoModal(set)}
      />
      <HeaderContainer className="d-flex align-items-center">
        {/* LOGO */}
        <LogoContainer>
          <VIPLogo width={40} height={40} />
        </LogoContainer>
        <LinksContainer>
          <NavItem variant="desktop" onClick={() => setInfoModal(true)}>
            <NavLinkText>Info</NavLinkText>
          </NavItem>
        </LinksContainer>
        {!hasAccess && <FrameBar bottom={0} height={4} />}
      </HeaderContainer>
    </>
  );
};

export default Header;
