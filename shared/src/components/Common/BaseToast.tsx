import React, { useCallback, useMemo, useState } from "react";
import BootstrapToast, {
  ToastProps as BootstrapToastProps,
} from "react-bootstrap/Toast";

import styled from "styled-components";
import { SuccessIcon, CloseIcon } from "../../assets/icons/icons";
import Logo from "../../assets/icons/logo";
import {
  getDisplayAssets,
  VaultList,
  VaultOptions,
} from "../../constants/constants";
import { SecondaryText, Title } from "../../designSystem";
import colors from "../../designSystem/colors";
import sizes from "../../designSystem/sizes";
import theme from "../../designSystem/theme";
import { getAssetLogo } from "../../utils/asset";
import { getVaultColor } from "../../utils/vault";

interface StatusProps {
  type: "success" | "error" | "claim" | "reminder";
}

const StyledToast = styled(BootstrapToast)<StatusProps>`
  position: fixed;
  background: none;
  color: rgba(255, 255, 255, 0.64);
  z-index: 1000;
  top: 70px;
  border: none;
  box-shadow: none;

  @media (max-width: ${sizes.lg - 1}px) {
    width: 90%;
    max-width: 90%;
    left: 5%;
    right: 5%;
  }

  @media (min-width: ${sizes.lg}px) {
    right: 30px;
    width: 343px;
  }
`;

const Body = styled(BootstrapToast.Body)<{ clickable?: boolean }>`
  height: 100%;
  background: ${colors.background.two};
  border-radius: 8px;
  display: flex;
  padding: 16px;

  ${({ clickable }) => {
    if (clickable) {
      return `
        cursor: pointer;
        &:hover {
          background: ${colors.background.three};
        }
      `;
    }
    return "";
  }}}

  @media (max-width: ${sizes.lg}px) {
    width: 100%;
    padding-left: 20px;
    padding-right: 25px;
  }
`;

const IconCircle = styled.div<StatusProps & { color?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 100px;
  margin-right: 10px;

  ${(props) => {
    switch (props.type) {
      case "error":
        return `background-color: ${colors.red}29;`;
      case "reminder":
        return `
          background-color: ${props.color!}29;
          border: 1.5px ${theme.border.style} ${props.color}A3;
        `;
      default:
        return `background-color: ${colors.green}29;`;
    }
  }}
`;

interface ToastProps extends BootstrapToastProps, StatusProps {
  title: string;
  subtitle: string;
  icon?: JSX.Element;
  extra?: {
    vaultOption: VaultOptions;
  };
  onClick?: () => void;
}

const BaseToast: React.FC<ToastProps> = ({
  type,
  title,
  subtitle,
  icon: _icon,
  extra,
  onClick,
  ...props
}) => {
  const icon = useMemo(() => {
    if (_icon) {
      return _icon;
    }

    switch (type) {
      case "success":
        return <SuccessIcon color={colors.green} />;
      case "error":
        return <CloseIcon color={colors.red} />;
      case "claim":
        return <Logo />;
      case "reminder":
        const vaultOption = extra?.vaultOption || VaultList[0];
        const asset = getDisplayAssets(vaultOption);
        const AssetLogo = getAssetLogo(asset);

        switch (asset) {
          case "WETH":
            return <AssetLogo height={24} width={24} />;
          default:
            return <AssetLogo height="100%" />;
        }
    }
  }, [extra, _icon, type]);

  // When the caller doesnt specify the `show` variable
  // it means that the caller doesnt want to control the state of the Toast
  // so we need to manage the `show` state internally
  const [controlledShow, setControlledShow] = useState(true);
  const { show, onClose: propsOnClose } = props;

  const onClose = useCallback(() => {
    propsOnClose && propsOnClose();
    !show && setControlledShow(false);
  }, [propsOnClose, show]);

  return (
    <StyledToast
      show={Boolean(props.show) || controlledShow}
      type={type}
      onClose={onClose}
      {...props}
    >
      <Body clickable={Boolean(onClick)} onClick={onClick}>
        <IconCircle
          type={type}
          color={
            type === "reminder"
              ? getVaultColor(extra?.vaultOption || VaultList[0])
              : undefined
          }
        >
          {icon}
        </IconCircle>
        <div style={{ flex: 1 }} className="d-flex flex-column h-100">
          <Title fontSize={14} lineHeight={20}>
            {title}
          </Title>
          <SecondaryText fontSize={12} lineHeight={16} className="mt-1">
            {subtitle}
          </SecondaryText>
        </div>
        <div className="d-flex align-items-center ml-2">
          <CloseIcon
            containerStyle={{
              cursor: "pointer",
            }}
            onClick={onClose}
          />
        </div>
      </Body>
    </StyledToast>
  );
};

export default BaseToast;
