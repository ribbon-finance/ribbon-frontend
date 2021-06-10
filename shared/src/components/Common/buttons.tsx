import React, { ReactNode, useCallback, useRef } from "react";
import styled from "styled-components";
import colors from "../../designSystem/colors";

export const Button = styled.button`
  font-family: VCR, sans-serif;
  width: 100%;
  border-radius: 4px;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  text-transform: uppercase;
  outline: none !important;

  &:active,
  &:focus {
    outline: none !important;
    box-shadow: none !important;
  }
`;

export const BaseActionButton = styled(Button)`
  ${(props) =>
    props.disabled
      ? `
      background: ${props.color ? props.color : colors.buttons.primary}29;
      color: ${colors.primaryText};

      &:hover {
        color: ${colors.primaryText};
      }`
      : `
      background: ${props.color ? props.color : colors.buttons.primary};
      color: ${colors.primaryText};

      &:hover {
        color: ${colors.primaryText};
      }`}
`;

const InternalButtonLink = styled.a`
  text-decoration: none;
  color: inherit;

  &:hover {
    text-decoration: none;
    color: inherit;
  }
`;

interface ActionButtonProps {
  className?: string;
  disabled?: boolean;
  link?: string;
  onClick?: () => void;
  color?: string;
  children: ReactNode;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  onClick = () => {},
  link = "",
  className = "",
  children,
  color,
  disabled = false,
}) => {
  const hasLink = link !== "";
  const linkRef = useRef<HTMLAnchorElement | null>(null);

  const openLink = useCallback(() => {
    if (linkRef !== null && linkRef.current !== null) {
      linkRef.current.click();
    }
  }, []);

  const handleClick = hasLink ? openLink : onClick;

  return (
    <BaseActionButton
      disabled={disabled}
      onClick={handleClick}
      type="button"
      color={color}
      className={`btn ${className}`}
    >
      {link !== "" ? (
        <InternalButtonLink
          ref={linkRef}
          href={link}
          target="_blank"
          rel="noreferrer noopener"
        >
          {children}
        </InternalButtonLink>
      ) : (
        children
      )}
    </BaseActionButton>
  );
};

export const ConnectWalletButton = styled(Button)`
  background: ${colors.buttons.secondaryBackground};
  color: ${colors.buttons.secondaryText};

  &:hover {
    color: ${colors.buttons.secondaryText};
  }
`;
