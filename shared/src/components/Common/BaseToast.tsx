import React, { useCallback, useMemo, useState } from "react";
import BootstrapToast, {
  ToastProps as BootstrapToastProps,
} from "react-bootstrap/Toast";

import styled from "styled-components";
import { SuccessIcon, CloseIcon } from "../../assets/icons/icons";
import Logo from "../../assets/icons/logo";
import { SecondaryText, Title } from "../../designSystem";
import colors from "../../designSystem/colors";
import sizes from "../../designSystem/sizes";

const StyledToast = styled(BootstrapToast)`
  position: fixed;
  background: none;
  color: rgba(255, 255, 255, 0.64);
  z-index: 1000;

  @media (max-width: ${sizes.lg}px) {
    width: 90%;
    max-width: 90%;
    top: 70px;
    left: 5%;
    right: 5%;
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
    padding-left: 20px;
    padding-right: 25px;
  }
`;

interface StatusProps {
  type: "success" | "error" | "claim";
}

const IconCircle = styled.div<StatusProps>`
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

interface ToastProps extends BootstrapToastProps, StatusProps {
  title: string;
  subtitle: string;
}

const BaseToast: React.FC<ToastProps> = ({
  type,
  title,
  subtitle,
  ...props
}) => {
  const icon = useMemo(() => {
    switch (type) {
      case "success":
        return <SuccessIcon color={colors.green} />;
      case "error":
        return <CloseIcon color={colors.red} />;
      case "claim":
        return <Logo />;
    }
  }, [type]);

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
        <IconCircle type={type}>{icon}</IconCircle>
        <div style={{ flex: 1 }} className="d-flex flex-column">
          <Title>{title}</Title>
          <SecondaryText>{subtitle}</SecondaryText>
        </div>
        <CloseIcon
          containerStyle={{
            cursor: "pointer",
            marginRight: 16,
          }}
          onClick={onClose}
        />
      </Body>
    </StyledToast>
  );
};

export default BaseToast;
