import styled from "styled-components";
import { VIPLogo } from "shared/lib/assets/icons/logo";
import colors from "shared/lib/designSystem/colors";
import sizes from "shared/lib/designSystem/sizes";
import theme from "shared/lib/designSystem/theme";
import { ConnectWalletButton } from "shared/lib/components/Common/buttons";
import { AccessModal } from "../AccessModal/AccessModal";
import { BaseLink, Title } from "shared/lib/designSystem";
import { InfoModal } from "../InfoModal/InfoModal";
import { useEffect, useRef, useState } from "react";
import { FrameBar } from "../FrameBar/FrameBar";
import AccountStatus from "webapp/lib/components/Wallet/AccountStatus";
import { useStorage } from "../../hooks/useStorageContextProvider";
import { useRouteMatch } from "react-router-dom";
import ExternalLink from "shared/lib/assets/icons/externalLink";
import { URLS } from "shared/lib/constants/constants";
import MenuButton from "shared/lib/components/Common/MenuButton";
import MobileOverlayMenu from "shared/lib/components/Common/MobileOverlayMenu";
import { useGlobalState } from "shared/lib/store/store";
import {
  NavItem,
  MobileMenuContainer,
  HeaderContainer,
  LogoContainer,
  HeaderAbsoluteContainer,
  SecondaryMobileNavItem,
  LinksContainer,
} from "webapp/lib/components/Header/Header";

export interface NavItemProps {
  isSelected: boolean;
  isHighlighted: boolean;
}

export interface MobileMenuOpenProps {
  isMenuOpen: boolean;
}

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

export const InfoContainer = styled.div<{
  variant: "desktop" | "mobile";
}>`
  cursor: pointer;
  z-index: 100;
  align-items: center;
  height: 100%;
  padding: 12px 16px;
  background: ${colors.background.four};
  border-radius: 8px;
  text-align: center;
  ${(props) =>
    props.variant === "mobile" &&
    `
    margin: 16px;
    width: 100%;
    height: 48px;
  `};

  @media (max-width: ${sizes.md}px) {
    ${(props) => props.variant === "desktop" && "display: none"};
  }

  @media (min-width: ${sizes.md}px) {
    ${(props) => props.variant === "mobile" && "display: none"};
  }

  @media (min-width: ${sizes.lg}px) {
    ${(props) => props.variant === "desktop" && "margin-right: 40px"};
  }

  &:hover {
    opacity: 0.64;
  }
`;

export const NavLinkText = styled(Title)`
  letter-spacing: 1.5px;
  font-size: 12px;
  line-height: 20px;

  @media (max-width: ${sizes.xl}px) {
    font-size: 24px;
  }
`;

export const InfoText = styled(Title)`
  letter-spacing: 1.5px;
  font-size: 14px;
  line-height: 20px;
`;

const MobileOnly = styled.div<{ visible: boolean }>`
  display: none;

  @media (max-width: ${sizes.xl}px) {
    ${(props) => props.visible && `display: flex;`}
  }
`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInfoModalVisible, setInfoModal] = useState<boolean>(false);
  const trades = useRouteMatch({ path: "/trades", exact: false });
  const positions = useRouteMatch({ path: "/positions", exact: true });
  const [storage] = useStorage();
  const headerRef = useRef<HTMLDivElement>(null);
  const [, setComponentRefs] = useGlobalState("componentRefs");
  const onToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (headerRef.current) {
      setComponentRefs((prev) => ({
        ...prev,
        header: headerRef.current as HTMLDivElement,
      }));
    }
  }, [headerRef, setComponentRefs]);

  const renderLinkItem = (
    title: string,
    to: string,
    isSelected: boolean,
    primary: boolean = true,
    external: boolean = false,
    isHighlighted: boolean = false
  ) => {
    return (
      <BaseLink
        to={to}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer noopener" : undefined}
        onClick={() => {}}
      >
        {primary ? (
          <NavItem isSelected={isSelected} isHighlighted={isHighlighted}>
            <NavLinkText color={isHighlighted ? colors.green : undefined}>
              {title}
            </NavLinkText>
            {external && (
              <ExternalLink
                color={isHighlighted ? colors.green : undefined}
                style={{
                  marginLeft: 6,
                }}
              />
            )}
          </NavItem>
        ) : (
          <SecondaryMobileNavItem>
            <Title fontSize={18} color={`${colors.primaryText}7A`}>
              {title}
            </Title>
          </SecondaryMobileNavItem>
        )}
      </BaseLink>
    );
  };

  return (
    <>
      <AccessModal />
      <InfoModal
        isVisible={isInfoModalVisible}
        setShow={(set) => setInfoModal(set)}
      />
      <HeaderContainer
        className="d-flex align-items-center"
        isMenuOpen={isMenuOpen}
        ref={headerRef}
      >
        {/* LOGO */}
        <LogoContainer>
          <VIPLogo width={40} height={40} />
        </LogoContainer>
        {storage && (
          <HeaderAbsoluteContainer>
            <LinksContainer>
              {renderLinkItem("TRADE IDEAS", "/trades", Boolean(trades))}
            </LinksContainer>
            <LinksContainer>
              {renderLinkItem("POSITIONS", "/positions", Boolean(positions))}
            </LinksContainer>
            <LinksContainer>
              {renderLinkItem("DOV", URLS.ribbonApp, false, true, true)}
            </LinksContainer>
          </HeaderAbsoluteContainer>
        )}
        <LinksContainer>
          {storage ? (
            <AccountStatus variant="desktop" showAirdropButton={false} />
          ) : (
            <InfoContainer variant="desktop" onClick={() => setInfoModal(true)}>
              <InfoText>Info</InfoText>
            </InfoContainer>
          )}
        </LinksContainer>
        <MobileOnly visible={storage != null}>
          <MenuButton onToggle={onToggleMenu} isOpen={isMenuOpen} />
          <MobileOverlayMenu
            className="flex-column align-items-center justify-content-center"
            isMenuOpen={isMenuOpen}
            onClick={onToggleMenu}
            boundingDivProps={{
              style: {
                paddingTop: theme.header.height,
                marginRight: "auto",
              },
            }}
          >
            <MobileMenuContainer>
              {renderLinkItem(
                "TRADE IDEAS",
                "/trades",
                Boolean(useRouteMatch({ path: "/trades/", exact: true }))
              )}
              {renderLinkItem(
                "POSITIONS",
                "/positions",
                Boolean(useRouteMatch({ path: "/positions/", exact: true }))
              )}
              {renderLinkItem("DOVS", URLS.ribbonApp, false, true, true, false)}
              {renderLinkItem("DISCORD", URLS.discord, false, false, true)}
              {renderLinkItem("TWITTER", URLS.twitter, false, false, true)}
              {renderLinkItem("GITHUB", URLS.github, false, false, true)}
              {renderLinkItem("FAQ", URLS.docsFaq, false, false, true)}
              {renderLinkItem("BLOG", URLS.medium, false, false, true)}
              {renderLinkItem(
                "TERMS",
                URLS.ribbonFinanceTerms,
                false,
                false,
                true
              )}
              {renderLinkItem(
                "POLICY",
                URLS.ribbonFinancePolicy,
                false,
                false,
                true
              )}
            </MobileMenuContainer>
          </MobileOverlayMenu>
        </MobileOnly>
        {!storage && <FrameBar bottom={0} height={4} />}
      </HeaderContainer>
    </>
  );
};

export default Header;
