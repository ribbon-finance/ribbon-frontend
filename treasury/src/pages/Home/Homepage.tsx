import React, { SVGProps } from "react";
import styled, { keyframes } from "styled-components";

import Logo from "shared/lib/assets/icons/logo";
import { Title } from "shared/lib/designSystem";
import sizes from "shared/lib/designSystem/sizes";
import theme from "shared/lib/designSystem/theme";
import useScreenSize from "shared/lib/hooks/useScreenSize";
import TreasuryActionForm from "../../components/Vault/VaultActionsForm/TreasuryActionsForm";
import usePullUp from "webapp/lib/hooks/usePullUp";
import { useHistory } from "react-router-dom";
import { VaultName, VaultNameOptionMap } from "shared/lib/constants/constants";

const FloatingContainer = styled.div<{ height: number }>`
  width: 100%;
  height: calc(
    ${(props) => (props.height ? `${props.height}px` : `100vh`)} -
      ${theme.header.height + theme.footer.desktop.height * 2}px
  );
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  @media (max-width: ${sizes.md}px) {
    flex-direction: column;
  }
`;

const ActionsFormContainer = styled.div`
  display: flex;
  margin-bottom: 50px;
  margin-top: -30px;
  max-width: 460px;
`;

const NotFound = () => {
  const { height } = useScreenSize();

  usePullUp();
  const history = useHistory();

  const auth = localStorage.getItem("auth");

  if (auth) {
    const vault = JSON.parse(auth).pop();
    if (vault) {
      let vaultName;
      Object.keys(VaultNameOptionMap).filter((name) => {
        if (VaultNameOptionMap[name as VaultName] == vault) {
          vaultName = name;
        }
      });
      history.push("/treasury/" + vaultName);
    }
  }
  return (
    <FloatingContainer height={height}>
      <ActionsFormContainer className="flex-column p-3">
        <TreasuryActionForm variant="desktop" />
      </ActionsFormContainer>
    </FloatingContainer>
  );
};

export default NotFound;
