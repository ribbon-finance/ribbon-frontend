import styled from "styled-components";
import sizes from "shared/lib/designSystem/sizes";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import { useCallback, useRef, useState } from "react";
import { BaseButton } from "shared/lib/designSystem";
import useOutsideAlerter from "shared/lib/hooks/useOutsideAlerter";
import { MenuItem } from "./MenuItem";
import { useHistory } from "react-router-dom";

interface MenuContainerProps {
  isMenuOpen: boolean;
}

const Container = styled.div`
  z-index: 1000;
  padding-right: 40px;

  @media (max-width: ${sizes.lg}px) {
    display: none;
  }
`;

const MenuButton = styled(BaseButton).attrs({
  className: "d-flex align-items-center justify-content-center",
})`
  width: 48px;
  height: 48px;
  background-color: ${colors.background.three};
  border-radius: 8px;
  padding: 0;
  padding-bottom: 12px;
  color: ${colors.primaryText};
  font-weight: bold;
  font-size: 24px;

  &:hover {
    opacity: ${theme.hover.opacity};
  }
`;

const MenuContainer = styled.div<MenuContainerProps>`
  ${(props) =>
    props.isMenuOpen
      ? `
          position: absolute;
          right: 40px;
          top: 80px;
          width: 160px;
          background-color: ${colors.background.two};
          border-radius: ${theme.border.radius};
        `
      : `
          display: none;
        `}
`;

const DesktopSubmenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const history = useHistory();

  const desktopSubmenuRef = useRef(null);
  useOutsideAlerter(desktopSubmenuRef, () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  });

  const openFAQ = useCallback(() => {
    setIsMenuOpen(false);
    history.push("/faqs");
  }, [history]);

  const openLink = useCallback((link) => {
    setIsMenuOpen(false);
    window.open(link);
  }, []);

  return (
    <Container ref={desktopSubmenuRef}>
      <MenuButton role="button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        ...
      </MenuButton>
      <MenuContainer isMenuOpen={isMenuOpen}>
        <MenuItem title="FAQ" onClick={openFAQ} />
        <MenuItem
          title="DISCORD"
          onClick={() => openLink("http://discord.ribbon.finance")}
        />
        <MenuItem
          title="TWITTER"
          onClick={() => openLink("https://twitter.com/ribbonfinance")}
        />
        <MenuItem
          title="GITHUB"
          onClick={() => openLink("https://github.com/ribbon-finance")}
        />
        <MenuItem
          title="BLOG"
          onClick={() => openLink("https://medium.com/@ribbonfinance")}
        />
        <MenuItem
          title="TERMS"
          onClick={() => openLink("https://ribbon.finance/terms")}
        />
        <MenuItem
          title="POLICY"
          onClick={() => openLink("https://ribbon.finance/policy")}
        />
      </MenuContainer>
    </Container>
  );
};

export default DesktopSubmenu;
