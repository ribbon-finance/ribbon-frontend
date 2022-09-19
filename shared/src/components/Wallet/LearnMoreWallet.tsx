import styled from "styled-components";
import { BaseLink, BaseText } from "../../designSystem";
import theme from "../../designSystem/theme";

const LearnMoreLink = styled(BaseLink)`
  width: fit-content;
  margin: auto;

  &:hover {
    opacity: ${theme.hover.opacity};
  }
`;

const LearnMoreText = styled(BaseText)`
  text-decoration: underline;
`;

const LearnMoreArrow = styled(BaseText)`
  text-decoration: none;
  margin-left: 5px;
`;

const LearnMoreWallet = () => (
  <LearnMoreLink
    to="https://ethereum.org/en/wallets/"
    target="_blank"
    rel="noopener noreferrer"
    className="w-100"
  >
    <LearnMoreText>Learn more about wallets</LearnMoreText>
    <LearnMoreArrow>&#8594;</LearnMoreArrow>
  </LearnMoreLink>
);

export default LearnMoreWallet;
