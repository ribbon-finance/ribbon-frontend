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

export const Title = styled.span`
  color: ${colors.primaryText};
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

export const PrimaryText = styled(BaseText)`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: ${colors.primaryText};
`;

export const SecondaryText = styled.span`
  font-family: "Inter", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: ${colors.text};
`;

export const BaseInputLabel = styled.div`
  color: ${colors.primaryText};
  opacity: 0.4;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 1.5px;
`;

export const BaseInputContianer = styled.div`
  width: 100%;
  height: 72px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 4px;
  margin-top: 8px;
  padding: 0 4px;
`;

export const BaseInput = styled.input`
  width: 80%;
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
