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
