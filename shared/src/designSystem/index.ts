import styled from "styled-components";
import { Modal as BootstrapModal } from "react-bootstrap";

import Link from "../components/Common/Link";
import colors from "./colors";
import theme from "./theme";

export const BaseText = styled.span`
  color: ${colors.text};
  font-family: "Inter", sans-serif;
  font-size: 16px;
  color: white;
`;

export const BaseLink = styled(Link)`
  &:hover {
    text-decoration: none;
  }
`;

export const BaseUnderlineLink = styled(BaseLink)`
  text-decoration: underline;
  color: ${colors.text};

  &:hover {
    text-decoration: none;
    color: ${colors.text};
  }
`;

export const BaseButton = styled.div`
  display: flex;
  border-radius: ${theme.border.radius};
  padding: 12px 16px;
`;

export const BaseModal = styled(BootstrapModal)`
  backdrop-filter: blur(40px);
  /**
   * Firefox desktop come with default flag to have backdrop-filter disabled
   * Firefox Android also currently has bug where backdrop-filter is not being applied
   * More info: https://bugzilla.mozilla.org/show_bug.cgi?id=1178765
   **/
  @-moz-document url-prefix() {
    background-color: rgba(0, 0, 0, 0.9);
  }

  .modal-content {
    background-color: ${colors.background};
    border: ${theme.border.width} ${theme.border.style} ${colors.border};
    border-radius: ${theme.border.radius};

    button.close {
      color: white;
      opacity: 1;

      &:hover {
        opacity: ${theme.hover.opacity};
      }
    }
  }
`;

export const BaseModalHeader = styled(BootstrapModal.Header)`
  border-bottom: unset;
`;

export const BaseModalFooter = styled(BootstrapModal.Footer)`
  border-top: unset;
`;

export const BaseModalContentColumn = styled.div<{
  marginTop?: number | "auto";
}>`
  display: flex;
  justify-content: center;
  z-index: 1;
  margin-top: ${(props) =>
    props.marginTop === "auto"
      ? props.marginTop
      : `${props.marginTop === undefined ? 24 : props.marginTop}px`};
`;

export const Title = styled.span<{ color?: string }>`
  color: ${(props) => (props.color ? props.color : colors.primaryText)};
  font-family: VCR, sans-serif;
  font-style: normal;
  font-weight: normal;
  text-transform: uppercase;
`;

export const Subtitle = styled.span`
  color: ${colors.primaryText};
  font-family: VCR, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
`;

export const PrimaryText = styled(BaseText)<{ color?: string }>`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: ${(props) => (props.color ? props.color : colors.primaryText)};
`;

export const SecondaryText = styled.span<{ color?: string }>`
  font-family: "Inter", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: ${(props) => (props.color ? props.color : colors.text)};
`;

export const BaseInputLabel = styled.div`
  font-family: VCR, sans-serif;
  color: ${colors.text};
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 1.5px;
`;

export const BaseInputContainer = styled.div<{ error?: boolean }>`
  width: 100%;
  height: 72px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 4px;
  margin-top: 8px;
  padding: 0 4px;
  border: ${theme.border.width} ${theme.border.style}
    ${(props) => (props.error ? colors.red : `transparent`)};
  transition: border 0.25s;
`;

export const BaseInput = styled.input<{ inputWidth?: string }>`
  width: ${(props) => props.inputWidth || "80%"};
  height: 100%;
  font-size: 40px;
  line-height: 64px;
  color: ${colors.primaryText};
  border: none;
  background: none;
  font-family: VCR, sans-serif;

  &:focus {
    color: ${colors.primaryText};
    background: none;
    border: none;
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
    border: rgba(255, 255, 255, 0);
  }
`;

export const BaseInputButton = styled.div`
  position: absolute;
  top: 50%;
  transform: translate(-16px, -50%);
  right: 0;
  background: rgba(255, 255, 255, 0.08);
  color: ${colors.primaryText};
  border-radius: 4px;
  padding: 8px;
  height: 32px;
  font-size: 11px;
  line-height: 16px;
  text-align: center;
  letter-spacing: 1.5px;
  cursor: pointer;
  font-family: VCR, sans-serif;
`;

export const BaseIndicator = styled.div<{ size: number; color: string }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: ${(props) => props.size / 2}px;
  background: ${(props) => props.color};
`;
