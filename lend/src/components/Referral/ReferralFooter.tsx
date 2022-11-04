import styled from "styled-components";
import colors from "shared/lib/designSystem/colors";
import ExternalLinkIcon from "../Common/ExternalLinkIcon";
import { BaseLink } from "../../designSystem";

const Footer = styled.div`
  display: flex;
  font-size: 14px;
  color: ${colors.primaryText};
  svg {
    transition: all 0.2s ease-in-out;
  }
  > a {
    color: ${colors.primaryText};
    text-decoration: underline;
    &:hover {
      svg {
        transform: translate(2px, -2px);
      }
    }
  }
`;

const StyledExternalLinkIcon = styled(ExternalLinkIcon)`
  margin-left: 4px;
`;

export const ReferralFooter = () => {
  return (
    <>
      <Footer>
        <BaseLink
          to="https://ribbonfinance.medium.com/decentralizing-ribbon-governance-395950da7a6"
          target="_blank"
          rel="noreferrer noopener"
        >
          Learn more about the referral program
          <StyledExternalLinkIcon />
        </BaseLink>
      </Footer>
    </>
  );
};
