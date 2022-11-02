import React, { useCallback, useState } from "react";
import BootstrapToast, {
  ToastProps as BootstrapToastProps,
} from "react-bootstrap/Toast";

import styled from "styled-components";
import { CloseIcon } from "shared/lib/assets/icons/icons";
import { PoolOptions } from "../../constants/constants";
import { SecondaryText, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import sizes from "../../designSystem/sizes";
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
  height: 80px;

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
  padding: 0;
  background: ${colors.background.two};
  display: flex;
  justify-content: center;
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
  }
`;

const CloseIconBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  border-left: 1px solid ${colors.border};
`;

interface ToastProps extends BootstrapToastProps, StatusProps {
  title: string;
  subtitle: string;
  icon?: JSX.Element;
  extra?: {
    poolOption: PoolOptions;
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
        <div
          style={{ flex: 1, paddingLeft: 16 }}
          className="d-flex flex-column justify-content-center"
        >
          <Title
            color={type === "error" ? colors.red : colors.green}
            fontSize={14}
            lineHeight={20}
          >
            {title}
          </Title>
          <SecondaryText fontSize={12} lineHeight={16} className="mt-1">
            {subtitle}
          </SecondaryText>
        </div>
        <CloseIconBox>
          <CloseIcon
            containerStyle={{
              cursor: "pointer",
            }}
            onClick={onClose}
          />
        </CloseIconBox>
      </Body>
    </StyledToast>
  );
};

export default BaseToast;
