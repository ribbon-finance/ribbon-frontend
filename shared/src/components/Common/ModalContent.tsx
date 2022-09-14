import { useMemo } from "react";
import { Title } from "../../designSystem";
import colors from "../../designSystem/colors";
import { URLS } from "../../constants/constants";
import styled, { css } from "styled-components";
import ExternalLink from "../../assets/icons/externalLink";
import { Discord } from "../../assets/icons/discord";
import { Github } from "../../assets/icons/github";
const AboutContent = styled.div`
  color: ${colors.primaryText}A3;
  padding: 16px 24px;
`;

const CommunityContent = styled.div`
  > div:not(:last-child) {
    border-bottom: 1px solid ${colors.primaryText}1F;
  }
`;

const CommunityContentRow = styled.div.attrs({
  className: "d-flex align-items-center",
})`
  height: 80px;
  padding: 0 24px;
  font-size: 14px;

  ${(props) => {
    if (props.onClick) {
      return css`
        &:hover {
          cursor: pointer;

          > svg {
            transform: translate(2px, -2px);
          }
        }
      `;
    }
    return "";
  }}

  > img {
    width: 32px;
    height: 32px;
    margin-right: 20px;
  }

  > svg {
    transition: all 0.2s ease-in-out;
    margin-left: 8px;
    width: 20px;
    height: 20px;
  }
`;

const Footer = styled.div`
  font-size: 12px;
  color: ${colors.primaryText}52;
  flex: 1;
  text-align: center;

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

export type ModalContentMode = "about" | "community" | undefined;

interface ModalContentProps {
  modalContentMode: ModalContentMode;
}

export const ModalContent = ({ modalContentMode }: ModalContentProps) => {
  const modalContent = useMemo(() => {
    if (modalContentMode === "about") {
      return (
        <AboutContent>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam,
          purus sit amet luctus venenatis, lectus magna fringilla urna,
          porttitor rhoncus dolor purus non enim praesent elementum facilisis
          leo, vel fringilla est ullamcorper eget nulla facilisi etiam dignissim
          diam quis enim lobortis scelerisque fermentum dui faucibus in ornare
          quam viverra orci sagittis eu volutpat odio facilisis mauris sit amet
          massa vitae tortor condimentum lacinia
        </AboutContent>
      );
    }
    if (modalContentMode === "community") {
      return (
        <CommunityContent>
          <CommunityContentRow onClick={() => window.open(URLS.twitter)}>
            {/* <img src={twitter} alt="Twitter" /> */}
            <Title>Twitter</Title>
            <ExternalLink />
          </CommunityContentRow>
          <CommunityContentRow onClick={() => window.open(URLS.discord)}>
            {/* <Discord /> */}
            <Title>Discord</Title>
            <ExternalLink />
          </CommunityContentRow>
          <CommunityContentRow onClick={() => window.open(URLS.github)}>
            {/* <Github /> */}
            <Title>Github</Title>
            <ExternalLink />
          </CommunityContentRow>
          <CommunityContentRow
            style={{
              padding: 0,
            }}
          >
            <Footer>
              Ribbon Lend is a product build by&nbsp;
              <a
                href={URLS.ribbonFinance}
                target="_blank"
                rel="noreferrer noopener"
              >
                Ribbon Finance
                <ExternalLink />
              </a>
            </Footer>
          </CommunityContentRow>
        </CommunityContent>
      );
    }
    return null;
  }, [modalContentMode]);

  return modalContent;
};
