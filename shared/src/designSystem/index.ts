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
