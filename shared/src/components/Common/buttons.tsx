import React, { ReactNode, useCallback, useRef } from "react";
import styled from "styled-components";
import colors from "../../designSystem/colors";
import theme from "../../designSystem/theme";

export const Button = styled.button`
  font-family: VCR, sans-serif;
  width: 100%;
  border-radius: 4px;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  text-transform: uppercase;
  outline: none;

  &:active,
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

export const BaseActionButton = styled(Button)<{
  error?: boolean;
  color?: string;
}>`
  ${(props) => {
    if (props.error) {
      return `
        background: ${colors.red}14;
        color: ${colors.red};
        
        && {
          opacity: 1;
        }

        &:hover {
          background: ${colors.red}14;
          color: ${colors.red};
        }
      `;
    }

    return props.color
      ? `
        background: ${props.color}14;
        color: ${props.color};
        box-shadow: 8px 16px 64px ${props.color}14;

        &:hover {
          background: ${props.color}${props.disabled ? 14 : 29};
          color: ${props.color};
        }
      `
      : `
        background: ${colors.buttons.primary}${props.disabled ? 29 : ""};
        color: ${colors.primaryText};

        &:hover {
          color: ${colors.primaryText};
        }
      `;
  }}
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
  error?: boolean;
  children: ReactNode;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  onClick = () => {},
  link = "",
  className = "",
  children,
  color,
  error,
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
      error={error}
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
