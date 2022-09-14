import styled from "styled-components";
import sizes from "shared/lib/designSystem/sizes";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import { URLS } from "shared/lib/constants/constants";
import { useCallback, useRef, useState } from "react";
import { BaseButton } from "shared/lib/designSystem";
import useOutsideAlerter from "shared/lib/hooks/useOutsideAlerter";
import DesktopFloatingMenu from "shared/lib/components/Menu/DesktopFloatingMenu";
import { MenuItem } from "shared/lib/components/Menu/MenuItem";
import { useHistory } from "react-router-dom";

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
      <DesktopFloatingMenu
        isOpen={isMenuOpen}
        containerStyle={{
          right: 40,
        }}
      >
        <MenuItem title="FAQ" onClick={openFAQ} />
        <MenuItem title="DISCORD" onClick={() => openLink(URLS.discord)} />
        <MenuItem title="TWITTER" onClick={() => openLink(URLS.twitter)} />
        <MenuItem title="GITHUB" onClick={() => openLink(URLS.github)} />
        <MenuItem title="BLOG" onClick={() => openLink(URLS.medium)} />
        <MenuItem
          title="TERMS"
          onClick={() => openLink(URLS.ribbonFinanceTerms)}
        />
        <MenuItem
          title="POLICY"
          onClick={() => openLink(URLS.ribbonFinancePolicy)}
        />
      </DesktopFloatingMenu>
    </Container>
  );
};

export default DesktopSubmenu;
