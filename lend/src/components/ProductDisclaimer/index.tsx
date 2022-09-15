import colors from "shared/lib/designSystem/colors";
import { URLS } from "shared/lib/constants/constants";
import ExternalLinkIcon from "../Common/ExternalLinkIcon";
import styled from "styled-components";

const DisclaimerText = styled.div`
  font-size: 12px;
  color: ${colors.primaryText}52;
  text-align: center;
  margin: auto;

  > * {
    margin: auto 0;
  }

  svg {
    transition: all 0.2s ease-in-out;
    margin-left: 4px;
    opacity: 0.32;
  }

  > a {
    color: ${colors.primaryText}52;
    text-decoration: underline;

    &:hover {
      svg {
        transform: translate(2px, -2px);
      }
    }
  }
`;

export const ProductDisclaimer = () => {
  return (
    <DisclaimerText>
      Ribbon Lend is a product build by&nbsp;
      <a href={URLS.ribbonFinance} target="_blank" rel="noreferrer noopener">
        Ribbon Finance
        <ExternalLinkIcon />
      </a>
    </DisclaimerText>
  );
};
