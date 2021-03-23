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

export const PrimaryText = styled(BaseText)`
  font-family: VCR;
  font-weight: 500;
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
