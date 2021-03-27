import { ReactNode, useCallback, useRef } from "react";
import styled from "styled-components";
import colors from "../../designSystem/colors";

export const Button = styled.button`
  font-family: VCR;
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
  background: ${colors.primaryButton};
  color: #ffffff;

  &:hover {
    color: #ffffff;
  }
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
  link?: string;
  onClick?: () => void;
  children: ReactNode;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  onClick = () => {},
  link = "",
  className = "",
  children,
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
      onClick={handleClick}
      type="button"
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
  background: rgba(22, 206, 185, 0.08);
  color: #16ceb9;

  &:hover {
    color: #16ceb9;
  }
`;
