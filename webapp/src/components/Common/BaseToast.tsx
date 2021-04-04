import React, { useCallback, useState } from "react";
import BootstrapToast from "react-bootstrap/Toast";
import { ToastProps as BootstrapToastProps } from "react-bootstrap/Toast";
import styled from "styled-components";
import { SecondaryText, Title } from "../../designSystem";
import colors from "../../designSystem/colors";
import sizes from "../../designSystem/sizes";

const StyledToast = styled(BootstrapToast)`
  position: fixed;
  background: none;
  color: rgba(255, 255, 255, 0.64);
  z-index: 1000;

  @media (max-width: ${sizes.lg}px) {
    top: 70px;
    left: 16px;
    right: 16px;
    width: 100%;
    height: 80px;
  }

  @media (min-width: ${sizes.lg}px) {
    top: 70px;
    right: 30px;
    width: 343px;
    height: 80px;
  }
`;

const Body = styled(BootstrapToast.Body)`
  height: 100%;
  background: #08090e;
  border: 1px solid #2b2b2b;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;

  @media (max-width: ${sizes.lg}px) {
    width: 100%;
  }
`;

interface IconProps {
  type: "success" | "error";
}

const IconCircle = styled.div<IconProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 100px;
  margin-right: 10px;

  background-color: ${(props) =>
    props.type === "error"
      ? "rgba(255, 56, 92, 0.16)"
      : "rgba(22, 206, 185, 0.16)"};
`;

const Icon = styled.i<IconProps>`
  font-size: 17px;

  color: ${(props) => (props.type === "error" ? colors.red : colors.green)};
`;

const CloseIcon = styled.i`
  cursor: pointer;
  font-size: 17px;
  color: white;
  margin-right: 16px;
`;

interface ToastProps extends BootstrapToastProps, IconProps {
  title: string;
  subtitle: string;
}

const BaseToast: React.FC<ToastProps> = ({
  type,
  title,
  subtitle,
  ...props
}) => {
  const iconClassName = type === "success" ? "fas fa-check" : "fas fa-times";

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
      onClose={onClose}
      {...props}
    >
      <Body>
        <IconCircle type={type}>
          <Icon type={type} className={iconClassName}></Icon>
        </IconCircle>
        <div style={{ flex: 1 }} className="d-flex flex-column">
          <Title>{title}</Title>
          <SecondaryText>{subtitle}</SecondaryText>
        </div>
        <CloseIcon onClick={onClose} className="fas fa-times"></CloseIcon>
      </Body>
    </StyledToast>
  );
};

export default BaseToast;
